"use server";

import { db } from "@/db";
import { businesses, customers, passesConfig, stampsLog } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { GoogleAuth } from "google-auth-library";

// 1. Guardar y activar Geolocalización
export async function updateBusinessLocation(latitude: string, longitude: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "No autenticado" };
  }

  try {
    const businessArray = await db.select().from(businesses).where(eq(businesses.userId, session.user.id));
    const business = businessArray[0];
    if (!business) return { success: false, error: "Negocio no encontrado" };

    const configArray = await db.select().from(passesConfig).where(eq(passesConfig.businessId, business.id));
    
    if (configArray.length > 0) {
      await db.update(passesConfig)
        .set({ latitude, longitude })
        .where(eq(passesConfig.businessId, business.id));
    } else {
      await db.insert(passesConfig).values({
        businessId: business.id,
        latitude,
        longitude
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error al actualizar ubicación:", error);
    return { success: false, error: "Error de servidor" };
  }
}

// 2. Enviar Notificación Push (Google Wallet)
export async function sendPushNotification(messageText: string, target: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "No autenticado" };
  }

  try {
    const businessArray = await db.select().from(businesses).where(eq(businesses.userId, session.user.id));
    const business = businessArray[0];
    if (!business) return { success: false, error: "Negocio no encontrado" };

    const configArray = await db.select().from(passesConfig).where(eq(passesConfig.businessId, business.id));
    const totalStampsRequired = configArray[0]?.totalStampsRequired || 8;

    const allCustomers = await db.select().from(customers).where(eq(customers.businessId, business.id));
    const allStamps = await db.select().from(stampsLog).where(eq(stampsLog.businessId, business.id));

    const targetCustomers = allCustomers.filter(c => {
      if (!c.walletPassId) return false;

      const customerStamps = allStamps.filter(s => s.customerId === c.id);
      
      let status = "Nuevo";
      if (customerStamps.length > 0) {
        if (customerStamps.length >= totalStampsRequired) {
          status = "VIP";
        } else {
          let lastStampDate = new Date(0);
          customerStamps.forEach(s => {
            if (s.stampedAt) {
              const d = new Date(s.stampedAt);
              if (d > lastStampDate) lastStampDate = d;
            }
          });
          
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          
          status = (lastStampDate < thirtyDaysAgo) ? "Riesgo" : "Activo";
        }
      }

      if (target === "riesgo" && status !== "Riesgo") return false;
      if (target === "vip" && status !== "VIP") return false;
      if (target === "cumple") {
        if (!c.birthdate) return false;
        const birthMonth = new Date(c.birthdate + "T00:00:00").getMonth();
        const currentMonth = new Date().getMonth();
        if (birthMonth !== currentMonth) return false;
      }

      return true;
    });

    if (targetCustomers.length === 0) {
      return { success: false, error: "No hay clientes en esta audiencia con tarjeta de Google Wallet" };
    }

    const credentialsRaw = process.env.GOOGLE_WALLET_CREDENTIALS;
    let authClient;
    
    if (credentialsRaw) {
      const credentials = JSON.parse(credentialsRaw);
      authClient = new GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/wallet_object.issuer']
      });
    } else {
      return { success: false, error: "Credenciales de Google Wallet no configuradas en el servidor" };
    }

    const client = await authClient.getClient();
    const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID;

    if (!issuerId) {
      return { success: false, error: "Issuer ID no configurado" };
    }

    let enviosExitosos = 0;
    
    const notifPromises = targetCustomers.map(async (c) => {
      const objectId = `${issuerId}.${c.walletPassId}`;
      
      const payload = {
        messages: [{
          header: "¡Nueva Alerta!",
          body: messageText
        }]
      };

      try {
        await client.request({
          url: `https://walletobjects.googleapis.com/walletobjects/v1/loyaltyObject/${objectId}`,
          method: 'PATCH',
          data: payload
        });
        enviosExitosos++;
      } catch (err) {
        console.error(`Error enviando push a ${c.walletPassId}:`, err);
      }
    });

    await Promise.allSettled(notifPromises);

    return { 
      success: true, 
      sent: enviosExitosos, 
      total: targetCustomers.length 
    };

  } catch (error) {
    console.error("Error en sendPushNotification:", error);
    return { success: false, error: "Error interno del servidor" };
  }
}
