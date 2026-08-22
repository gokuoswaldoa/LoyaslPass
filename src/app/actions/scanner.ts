"use server";

import { db } from "@/db";
import { customers, stampsLog, businesses, businessStaff, passesConfig } from "@/db/schema";
import { eq, and, desc, sql, ilike, or } from "drizzle-orm";
import { auth } from "@/auth";

import { getUserRoleInfo } from "@/app/actions/settings";

export async function verifyClientQR(qrData: string) {
  const roleInfo = await getUserRoleInfo();
  if (!roleInfo.success || !roleInfo.businessId) {
    return { success: false, error: roleInfo.error || "No autenticado o sin permisos" };
  }
  const businessId = roleInfo.businessId;

  // qrData will be the wallet_pass_id or customer ID
  // Let's assume it's wallet_pass_id for now
  try {
    const customerArray = await db
      .select()
      .from(customers)
      .where(and(eq(customers.walletPassId, qrData), eq(customers.businessId, businessId)));

    const customer = customerArray[0];

    if (!customer) {
      return { success: false, error: "Cliente no encontrado o no pertenece a este negocio" };
    }

    // Return customer data to the frontend
    // Need to count current stamps. Let's do a simple count for now.
    const stamps = await db
      .select()
      .from(stampsLog)
      .where(eq(stampsLog.customerId, customer.id));

    return { 
      success: true, 
      customer: {
        id: customer.id,
        name: customer.name,
        phone: customer.phoneNumber,
        stampsCount: stamps.length,
      } 
    };

  } catch (error) {
    console.error("Error verifying QR:", error);
    return { success: false, error: "Error procesando el código QR" };
  }
}

export async function addStampToClient(customerId: string) {
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
}

export async function getFrequentCustomers() {
  const roleInfo = await getUserRoleInfo();
  if (!roleInfo.success || !roleInfo.businessId) {
    return { success: false, error: roleInfo.error || "Sin permisos" };
  }
  const businessId = roleInfo.businessId;

  try {
    const clients = await db.select().from(customers).where(eq(customers.businessId, businessId));
    const stamps = await db.select().from(stampsLog).where(eq(stampsLog.businessId, businessId));

    const withStamps = clients.map(c => {
      return {
        id: c.id,
        name: c.name,
        phone: c.phoneNumber,
        stampsCount: stamps.filter(s => s.customerId === c.id).length
      };
    });

    // Sort by stamps descending, take top 5
    withStamps.sort((a, b) => b.stampsCount - a.stampsCount);
    
    return { success: true, customers: withStamps.slice(0, 5) };
  } catch (error) {
    console.error("Error fetching frequent:", error);
    return { success: false, error: "Error de servidor" };
  }
}

export async function searchCustomers(query: string) {
  const roleInfo = await getUserRoleInfo();
  if (!roleInfo.success || !roleInfo.businessId) {
    return { success: false, error: roleInfo.error || "Sin permisos" };
  }
  const businessId = roleInfo.businessId;

  if (!query || query.trim().length < 2) return { success: true, customers: [] };

  try {
    const term = `%${query.trim()}%`;
    const result = await db.select().from(customers).where(
      and(
        eq(customers.businessId, businessId),
        or(
          ilike(customers.name, term),
          ilike(customers.phoneNumber, term)
        )
      )
    );

    const stamps = await db.select().from(stampsLog).where(eq(stampsLog.businessId, businessId));
    const finalData = result.map(c => ({
      id: c.id,
      name: c.name,
      phone: c.phoneNumber,
      stampsCount: stamps.filter(s => s.customerId === c.id).length
    }));

    return { success: true, customers: finalData };
  } catch (error) {
    console.error("Error searching:", error);
    return { success: false, error: "Error de servidor" };
  }
}
