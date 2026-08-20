"use server";

import { db } from "@/db";
import { businesses, customers, passesConfig, stampsLog } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { GoogleAuth } from "google-auth-library";
import webpush from "web-push";

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
    const config = configArray[0];
    const totalStampsRequired = config?.totalStampsRequired || 8;

    const allCustomers = await db.select().from(customers).where(eq(customers.businessId, business.id));
    const allStamps = await db.select().from(stampsLog).where(eq(stampsLog.businessId, business.id));

    const targetCustomers = allCustomers.filter(c => {
      if (!c.walletPassId && !c.webPushSub) return false;

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

    const clientEmail = process.env.GOOGLE_WALLET_CLIENT_EMAIL;
    let privateKey = process.env.GOOGLE_WALLET_PRIVATE_KEY;
    const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID;

    if (!issuerId || !clientEmail || !privateKey) {
      return { success: false, error: "Credenciales de Google Wallet no configuradas en el servidor" };
    }

    if (privateKey.includes('\\n')) {
      privateKey = privateKey.replace(/\\n/g, '\n');
    }

    const authClient = new GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey
      },
      scopes: ['https://www.googleapis.com/auth/wallet_object.issuer']
    });

    const client = await authClient.getClient();

    let enviosGoogleWallet = 0;
    let enviosWebPush = 0;

    if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
      webpush.setVapidDetails(
        'mailto:soporte@loyalpass.com',
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
      );
    }
    
    let pushErrors: string[] = [];

    const notifPromises = targetCustomers.map(async (c) => {
      // 1. --- WEB PUSH (PWA) ---
      if (c.webPushSub) {
        try {
          if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
             throw new Error("Las VAPID keys no están configuradas en Vercel");
          }

          const sub = JSON.parse(c.webPushSub);
          const logoUrl = config?.logoUrl || '/logo/cafe-happy-logo.png';
          
          await webpush.sendNotification(sub, JSON.stringify({
            title: business.name,
            body: messageText,
            icon: logoUrl,
            data: {
              url: `/${business.id}/pass/${c.walletPassId || ''}`
            }
          }));
          enviosWebPush++;
        } catch (err: any) {
          console.error(`Error enviando Web Push a ${c.id}:`, err);
          pushErrors.push(err?.body || err?.message || "Error desconocido");
        }
      }

      // 2. --- GOOGLE WALLET PUSH ---
      if (c.walletPassId) {
        const objectId = `${issuerId}.${c.walletPassId}`;
        const payload = {
          message: {
            header: "Mensaje de " + business.name,
            body: messageText,
            id: crypto.randomUUID(),
            messageType: "TEXT_AND_NOTIFY"
          }
        };

        try {
          // Limpiar historial
          await client.request({
            url: `https://walletobjects.googleapis.com/walletobjects/v1/loyaltyObject/${objectId}`,
            method: 'PATCH',
            data: { messages: [] }
          });

          // Disparar Push oficial
          await client.request({
            url: `https://walletobjects.googleapis.com/walletobjects/v1/loyaltyObject/${objectId}/addMessage`,
            method: 'POST',
            data: payload
          });
          enviosGoogleWallet++;
        } catch (err: any) {
          console.error(`Error enviando Google Push a ${c.walletPassId}:`, err?.response?.data || err);
        }
      }
    });

    await Promise.allSettled(notifPromises);

    if (enviosWebPush === 0 && enviosGoogleWallet === 0 && pushErrors.length > 0) {
      return { 
        success: false, 
        error: `Fallaron los envíos. Detalles: ${pushErrors[0]}` 
      };
    }

    return { 
      success: true, 
      sent: enviosWebPush + enviosGoogleWallet,
      total: targetCustomers.length,
      message: `Enviados: ${enviosWebPush} Web Push y ${enviosGoogleWallet} G-Wallet.`
    };
  } catch (error) {
    console.error("Error en sendPushNotification:", error);
    return { success: false, error: "Error interno del servidor" };
  }
}
