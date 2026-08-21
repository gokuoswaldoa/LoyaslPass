"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { businesses, passesConfig } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export async function processOnboardingData() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "No autorizado" };
  }

  const cookieStore = await cookies();
  const onboardingCookie = cookieStore.get("loyalpass_onboarding");

  if (!onboardingCookie?.value) {
    return { success: false, message: "No hay datos de onboarding pendientes" };
  }

  try {
    const data = JSON.parse(onboardingCookie.value);

    // Calcular fecha de fin de prueba (15 días)
    const trialDate = new Date();
    trialDate.setDate(trialDate.getDate() + 15);

    // 1. Crear el negocio enlazado al usuario
    const [business] = await db.insert(businesses).values({
      userId: session.user.id,
      name: data.businessName,
      email: session.user.email || "", // Fallback to user email
      trialEndsAt: trialDate,
    }).returning();

    // 2. Crear la configuración del pase (LoyalPass)
    await db.insert(passesConfig).values({
      businessId: business.id,
      businessType: data.businessType,
      styleTheme: data.styleTheme,
      totalStampsRequired: data.stampsCount,
      rewardText: data.reward,
    });

    // 3. Limpiar la cookie para que no vuelva a insertarse
    cookieStore.delete("loyalpass_onboarding");

    return { success: true, businessId: business.id };
  } catch (error) {
    console.error("Error al guardar onboarding:", error);
    return { error: "Fallo al guardar configuración en base de datos" };
  }
}
