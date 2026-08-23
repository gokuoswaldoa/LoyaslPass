import codecs
import re

with codecs.open("src/app/actions/scanner.ts", "r", "utf-8") as f:
    text = f.read()

# Replace addStampToClient
old_func = """export async function addStampToClient(customerId: string) {
  const roleInfo = await getUserRoleInfo();
  if (!roleInfo.success || !roleInfo.businessId) {
    return { success: false, error: roleInfo.error || "No autenticado o sin permisos" };
  }
  const businessId = roleInfo.businessId;
  const staffId = roleInfo.staffId || null;

  try {
    // COOLDOWN LOGIC: Check last stamp time
    const lastStamps = await db.select()
      .from(stampsLog)
      .where(and(eq(stampsLog.customerId, customerId), eq(stampsLog.businessId, businessId)))
      .orderBy(desc(stampsLog.stampedAt))
      .limit(1);
    
    if (lastStamps.length > 0 && lastStamps[0].stampedAt) {
      const now = new Date();
      const lastStampTime = new Date(lastStamps[0].stampedAt);
      const diffMs = now.getTime() - lastStampTime.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      if (diffHours < 4) {
        return { success: false, error: "Este cliente recibió un sello hace menos de 4 horas. Vuelve a intentar más tarde." };
      }
    }

    await db.insert(stampsLog).values({
      customerId,
      businessId: businessId,
      staffId: staffId,
    });

    // Sincronización con Google Wallet
    try {
      const { syncCustomerWalletPass } = await import("@/lib/syncGoogleWallet");
      await syncCustomerWalletPass(customerId);
    } catch (gwError) {
      console.error("Error syncing stamp with Google Wallet:", gwError);
      // We do not fail the transaction if GW sync fails
    }

    return { success: true };
  } catch (error) {
    console.error("Error adding stamp:", error);
    return { success: false, error: "Error al agregar el sello" };
  }
}"""

new_func = """export async function addStampToClient(customerId: string) {
  const roleInfo = await getUserRoleInfo();
  if (!roleInfo.success || !roleInfo.businessId) {
    return { success: false, error: roleInfo.error || "No autenticado o sin permisos" };
  }
  const businessId = roleInfo.businessId;
  const staffId = roleInfo.staffId || null;

  try {
    // Fetch customer to check referral status
    const custArray = await db.select().from(customers).where(eq(customers.id, customerId));
    if (custArray.length === 0) return { success: false, error: "Cliente no encontrado" };
    const customer = custArray[0];

    // COOLDOWN LOGIC: Check last stamp time
    const allStamps = await db.select()
      .from(stampsLog)
      .where(and(eq(stampsLog.customerId, customerId), eq(stampsLog.businessId, businessId)))
      .orderBy(desc(stampsLog.stampedAt));
      
    const stampsCount = allStamps.length;
    const lastStamps = allStamps.slice(0, 1);
    
    if (lastStamps.length > 0 && lastStamps[0].stampedAt) {
      const now = new Date();
      const lastStampTime = new Date(lastStamps[0].stampedAt);
      const diffMs = now.getTime() - lastStampTime.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      if (diffHours < 4) {
        return { success: false, error: "Este cliente recibió un sello hace menos de 4 horas. Vuelve a intentar más tarde." };
      }
    }

    // Insert the normal stamp
    await db.insert(stampsLog).values({
      customerId,
      businessId: businessId,
      staffId: staffId,
    });

    // REFERRAL LOGIC
    let isFirstVisitBonus = false;
    if (stampsCount === 0 && customer.referredBy && !customer.hasRedeemedWelcomeBonus) {
        // Welcome bonus for the invitee (gets 2 stamps total on first visit, so we add 1 extra here)
        await db.insert(stampsLog).values({
            customerId,
            businessId,
            staffId,
            isReferralBonus: true,
        });
        
        await db.update(customers)
            .set({ hasRedeemedWelcomeBonus: true })
            .where(eq(customers.id, customerId));
        isFirstVisitBonus = true;

        // Reward the inviter!
        await db.insert(stampsLog).values({
            customerId: customer.referredBy,
            businessId,
            staffId: null, // System generated
            isReferralBonus: true,
        });

        // Trigger push notification to inviter if possible
        try {
           const { syncCustomerWalletPass } = await import("@/lib/syncGoogleWallet");
           await syncCustomerWalletPass(customer.referredBy);
           // Notificará automáticamente por Apple/Google Wallet
        } catch (e) {
           console.log("Could not sync inviter wallet", e);
        }
    }

    // Sincronización con Google Wallet (for the invitee)
    try {
      const { syncCustomerWalletPass } = await import("@/lib/syncGoogleWallet");
      await syncCustomerWalletPass(customerId);
    } catch (gwError) {
      console.error("Error syncing stamp with Google Wallet:", gwError);
    }

    return { success: true, isFirstVisitBonus };
  } catch (error) {
    console.error("Error adding stamp:", error);
    return { success: false, error: "Error al agregar el sello" };
  }
}"""

text = text.replace(old_func, new_func)

with codecs.open("src/app/actions/scanner.ts", "w", "utf-8") as f:
    f.write(text)
