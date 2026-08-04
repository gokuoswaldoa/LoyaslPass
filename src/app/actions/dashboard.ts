"use server";

import { db } from "@/db";
import { businesses, customers, stampsLog, passesConfig } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { auth } from "@/auth";

export async function getDashboardStats(timeRange: "hoy" | "semana" | "mes" = "hoy") {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "No autenticado" };
  }

  try {
    const businessArray = await db.select().from(businesses).where(eq(businesses.userId, session.user.id));
    const business = businessArray[0];

    if (!business) {
      return { success: false, error: "Negocio no encontrado" };
    }

    // Get total customers
    const customersArray = await db
      .select()
      .from(customers)
      .where(eq(customers.businessId, business.id));
    const totalCustomers = customersArray.length;

    // Get total stamps issued today (Mock simple counting for now)
    const allStamps = await db
      .select()
      .from(stampsLog)
      .where(eq(stampsLog.businessId, business.id));
    
    // Calculate Date Threshold
    const now = new Date();
    const thresholdDate = new Date();
    
    if (timeRange === "hoy") {
      thresholdDate.setHours(0, 0, 0, 0);
    } else if (timeRange === "semana") {
      thresholdDate.setDate(now.getDate() - 7);
      thresholdDate.setHours(0, 0, 0, 0);
    } else if (timeRange === "mes") {
      thresholdDate.setMonth(now.getMonth() - 1);
      thresholdDate.setHours(0, 0, 0, 0);
    }

    const stampsInRange = allStamps.filter(s => {
      const stampDate = s.stampedAt ? new Date(s.stampedAt) : new Date(0);
      return stampDate >= thresholdDate;
    }).length;

    return {
      success: true,
      businessId: business.id,
      stats: {
        totalCustomers,
        stampsToday: stampsInRange,
        totalStamps: allStamps.length,
      }
    };

  } catch (error) {
    console.error("Error fetching stats:", error);
    return { success: false, error: "Error al obtener estadísticas" };
  }
}

export async function getCustomers() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "No autenticado" };
  }

  try {
    const businessArray = await db.select().from(businesses).where(eq(businesses.userId, session.user.id));
    const business = businessArray[0];
    if (!business) return { success: false, error: "Negocio no encontrado" };

    const configArray = await db.select().from(passesConfig).where(eq(passesConfig.businessId, business.id));
    const config = configArray[0];
    const totalStampsRequired = config ? config.totalStampsRequired : 8;

    const customersList = await db
      .select()
      .from(customers)
      .where(eq(customers.businessId, business.id));

    // For each customer, count their stamps
    const stamps = await db
      .select()
      .from(stampsLog)
      .where(eq(stampsLog.businessId, business.id));

    const customersWithStats = customersList.map(c => {
      const customerStamps = stamps.filter(s => s.customerId === c.id);
      return {
        id: c.id,
        name: c.name,
        phone: c.phoneNumber,
        stamps: customerStamps.length,
        status: customerStamps.length >= totalStampsRequired ? 'VIP' : (customerStamps.length > 0 ? 'Activo' : 'Nuevo'),
        walletPassId: c.walletPassId,
        totalStampsRequired: totalStampsRequired,
      };
    });

    return { success: true, customers: customersWithStats };
  } catch (error) {
    console.error("Error fetching customers:", error);
    return { success: false, error: "Error al obtener clientes" };
  }
}
