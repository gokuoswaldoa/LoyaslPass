"use server";

import { db } from "@/db";
import { customers, stampsLog, businesses, businessStaff, passesConfig } from "@/db/schema";
import { eq, and, desc, sql, ilike, or } from "drizzle-orm";
import { auth } from "@/auth";

async function getAuthorizedBusinessId(userId: string, email: string | null | undefined) {
  // 1. Check if owner
  const businessArray = await db.select().from(businesses).where(eq(businesses.userId, userId));
  const business = businessArray[0];
  if (business) return business.id;

  // 2. Check if staff
  if (email) {
    const staffArray = await db.select().from(businessStaff).where(eq(businessStaff.email, email));
    const staff = staffArray[0];
    if (staff) return staff.businessId;
  }

  return null;
}

export async function verifyClientQR(qrData: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "No autenticado" };
  }

  const businessId = await getAuthorizedBusinessId(session.user.id, session.user.email);
  if (!businessId) {
    return { success: false, error: "Negocio no encontrado o sin permisos" };
  }

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
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "No autenticado" };
  }

  const businessId = await getAuthorizedBusinessId(session.user.id, session.user.email);
  if (!businessId) {
    return { success: false, error: "Negocio no encontrado o sin permisos" };
  }

  try {
    await db.insert(stampsLog).values({
      customerId,
      businessId: businessId,
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
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "No autenticado" };

  const businessId = await getAuthorizedBusinessId(session.user.id, session.user.email);
  if (!businessId) return { success: false, error: "Sin permisos" };

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
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "No autenticado" };

  const businessId = await getAuthorizedBusinessId(session.user.id, session.user.email);
  if (!businessId) return { success: false, error: "Sin permisos" };

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
