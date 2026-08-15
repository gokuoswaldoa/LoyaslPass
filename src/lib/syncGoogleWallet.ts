import { db } from "@/db";
import { customers, stampsLog, passesConfig } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getGoogleWalletClient } from "@/lib/googleWalletClient";

export async function syncCustomerWalletPass(customerId: string) {
  try {
    const customerArray = await db.select().from(customers).where(eq(customers.id, customerId));
    const customer = customerArray[0];
    if (!customer || !customer.walletPassId) return;

    const configArray = await db.select().from(passesConfig).where(eq(passesConfig.businessId, customer.businessId!));
    const config = configArray[0];

    const stamps = await db.select().from(stampsLog).where(eq(stampsLog.customerId, customerId));
    const stampsCount = stamps.length;
    const totalRequired = config ? config.totalStampsRequired : 8;

    const client = getGoogleWalletClient();
    const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID;

    if (issuerId) {
      const objectId = `${issuerId}.${customer.walletPassId}`;
      const iconType = encodeURIComponent(config?.businessType || 'otro');
      
      // Siempre generar una URL única con t=Date.now() para forzar a Google Wallet a refescar la imagen cacheada
      const dynamicImageUrl = `https://loyasl-pass.vercel.app/api/wallet-image?total=${totalRequired}&current=${stampsCount}&iconType=${iconType}&t=${Date.now()}`;

      await client.request({
        url: `https://walletobjects.googleapis.com/walletobjects/v1/loyaltyObject/${objectId}`,
        method: "PATCH",
        data: {
          loyaltyPoints: {
            label: "Sellos",
            balance: { 
              string: `${stampsCount} / ${totalRequired}` 
            }
          },
          heroImage: {
            sourceUri: { 
              uri: dynamicImageUrl 
            },
            contentDescription: { 
              defaultValue: { language: "es", value: "Sellos de Lealtad" } 
            }
          }
        }
      });
    }
  } catch (error) {
    console.error("Error syncing Google Wallet:", error);
  }
}
