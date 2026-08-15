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

    if (data.businessName) {
      await db.update(businesses)
        .set({ name: data.businessName })
        .where(eq(businesses.id, business.id));
    }

    // Google Wallet Sync
    try {
      const { getGoogleWalletClient } = await import("@/lib/googleWalletClient");
      const client = getGoogleWalletClient();
      const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID;
      
      if (issuerId) {
        const classId = `${issuerId}.${business.id.replace(/-/g, '')}v2`;
        
        const THEMES_HEX: Record<string, string> = {
          "emerald": "#10B981",
          "midnight": "#1E293B",
          "purple": "#8B5CF6",
          "sunset": "#F97316",
          "ocean": "#3B82F6"
        };
        const themeKey = data.styleTheme?.replace("gradient-", "") || "emerald";
        const cardColor = THEMES_HEX[themeKey] || "#10B981";

        const isBase64Logo = data.logoUrl && data.logoUrl.startsWith('data:');
        let validLogoUrl = (!data.logoUrl) 
          ? "https://loyasl-pass.vercel.app/logo/icono.png" 
          : isBase64Logo 
            ? `https://loyasl-pass.vercel.app/api/logo/${business.id}`
            : data.logoUrl;

        if (validLogoUrl.startsWith('/')) {
          validLogoUrl = `https://loyasl-pass.vercel.app${validLogoUrl}`;
        }

        const businessName = data.businessName || business.name;

        await client.request({
          url: `https://walletobjects.googleapis.com/walletobjects/v1/loyaltyClass/${classId}`,
          method: "PATCH",
          data: {
            issuerName: businessName,
            programName: `Programa de Lealtad ${businessName}`,
            programLogo: {
              sourceUri: { uri: validLogoUrl }
            },
            hexBackgroundColor: cardColor
          }
        });
      }
    } catch (gwError) {
      console.error("Error updating Google Wallet class:", gwError);
      // We don't block the save if Google Wallet fails
    }

    const { revalidatePath } = await import("next/cache");
    revalidatePath("/", "layout"); // Revalida todo el sitio para limpiar la caché de las vistas públicas y del dashboard

    return { success: true };
  } catch (error) {
    console.error("Error saving pass config:", error);
    return { success: false, error: "Error de servidor" };
  }
}
