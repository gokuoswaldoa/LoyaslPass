"use server";

import { db } from "@/db";
import { customers } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function saveWebPushSubscription(walletPassId: string, subscription: any) {
  try {
    await db
      .update(customers)
      .set({ webPushSub: JSON.stringify(subscription) })
      .where(eq(customers.walletPassId, walletPassId));

    return { success: true };
  } catch (error) {
    console.error("Error saving web push subscription:", error);
    return { success: false, error: "Error al guardar la suscripción" };
  }
}
