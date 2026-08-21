"use server";

import { db } from "@/db";
import { businesses, systemNotifications } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { users } from "@/db/schema";
import { revalidatePath } from "next/cache";

async function verifySuperAdmin() {
  const session = await auth();
  if (!session?.user?.id) return false;

  const userArray = await db.select().from(users).where(eq(users.id, session.user.id));
  const dbUser = userArray[0];

  const isSuperAdminEmail = session.user.email === process.env.SUPER_ADMIN_EMAIL;
  const hasSuperAdminRole = dbUser?.role === "superadmin";

  return isSuperAdminEmail || hasSuperAdminRole;
}

export async function extendTrial(businessId: string, daysToAdd: number = 15) {
  if (!(await verifySuperAdmin())) return { success: false, error: "No autorizado" };

  try {
    const bArray = await db.select().from(businesses).where(eq(businesses.id, businessId));
    if (bArray.length === 0) return { success: false, error: "Negocio no encontrado" };
    
    const b = bArray[0];
    const currentEnd = b.trialEndsAt ? new Date(b.trialEndsAt) : new Date();
    // If expired, start adding from today
    const baseDate = currentEnd < new Date() ? new Date() : currentEnd;
    baseDate.setDate(baseDate.getDate() + daysToAdd);

    await db.update(businesses).set({
      status: "trial",
      trialEndsAt: baseDate
    }).where(eq(businesses.id, businessId));

    // Send notification
    await db.insert(systemNotifications).values({
      businessId,
      title: "Prueba Extendida",
      message: `Tu periodo de prueba ha sido extendido por ${daysToAdd} días más. ¡Aprovecha al máximo LoyalPass!`,
    });

    revalidatePath("/superadmin/businesses");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Error interno" };
  }
}

export async function activateSubscription(businessId: string) {
  if (!(await verifySuperAdmin())) return { success: false, error: "No autorizado" };

  try {
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + 32); // 30 days + 2 days grace

    await db.update(businesses).set({
      status: "active",
      subscriptionEndsAt: baseDate
    }).where(eq(businesses.id, businessId));

    // Send notification
    await db.insert(systemNotifications).values({
      businessId,
      title: "Pago Recibido",
      message: "Tu mensualidad ha sido activada correctamente. Tienes 32 días de acceso premium.",
    });

    revalidatePath("/superadmin/businesses");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Error interno" };
  }
}

export async function suspendAccount(businessId: string) {
  if (!(await verifySuperAdmin())) return { success: false, error: "No autorizado" };

  try {
    await db.update(businesses).set({
      status: "suspended",
    }).where(eq(businesses.id, businessId));

    revalidatePath("/superadmin/businesses");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Error interno" };
  }
}
