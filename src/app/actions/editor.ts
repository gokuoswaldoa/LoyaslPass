"use server";

import { db } from "@/db";
import { businesses, passesConfig } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";

export async function getPassConfig() {
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

    let configArray = await db.select().from(passesConfig).where(eq(passesConfig.businessId, business.id));
    let config = configArray[0];

    // If config doesn't exist, create default
    if (!config) {
      const inserted = await db.insert(passesConfig).values({
        businessId: business.id,
        businessType: "default",
        styleTheme: "gradient-emerald",
        colorBackground: "from-emerald-500 to-emerald-900",
        colorText: "#FFFFFF",
        totalStampsRequired: 8,
        rewardText: "¡Premio Gratis!",
      }).returning();
      config = inserted[0];
    }

    return { success: true, config, businessName: business.name };
  } catch (error) {
    console.error("Error fetching pass config:", error);
    return { success: false, error: "Error de servidor" };
  }
}

export async function savePassConfig(data: any) {
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

    await db.update(passesConfig)
      .set({
        styleTheme: data.styleTheme,
        colorBackground: data.colorBackground,
        colorText: data.colorText,
        totalStampsRequired: data.totalStampsRequired,
        rewardText: data.rewardText,
        logoUrl: data.logoUrl,
      })
      .where(eq(passesConfig.businessId, business.id));

    return { success: true };
  } catch (error) {
    console.error("Error saving pass config:", error);
    return { success: false, error: "Error de servidor" };
  }
}
