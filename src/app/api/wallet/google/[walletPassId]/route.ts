import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(
  req: NextRequest,
  { params }: { params: { walletPassId: string } }
) {
  try {
    const { walletPassId } = params;

    const { db } = await import("@/db");
    const { customers, businesses, passesConfig, stampsLog } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");

    const customerArray = await db.select().from(customers).where(eq(customers.walletPassId, walletPassId));
    const customer = customerArray[0];
    if (!customer) {
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
    }

    const businessArray = await db.select().from(businesses).where(eq(businesses.id, customer.businessId));
    const business = businessArray[0];

    const configArray = await db.select().from(passesConfig).where(eq(passesConfig.businessId, customer.businessId));
    const config = configArray[0];

    const stampsArray = await db.select().from(stampsLog).where(eq(stampsLog.customerId, customer.id));
    const stampsCount = stampsArray.length;

    // Google Wallet Config
    const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID;
    const clientEmail = process.env.GOOGLE_WALLET_CLIENT_EMAIL;
    let privateKey = process.env.GOOGLE_WALLET_PRIVATE_KEY;

    if (!issuerId || !clientEmail || !privateKey) {
      console.error("Missing Google Wallet credentials in ENV");
      return NextResponse.json({ error: "Configuración incompleta del servidor" }, { status: 500 });
    }

    // Fix private key newlines if they are escaped in ENV
    if (privateKey.includes('\\n')) {
      privateKey = privateKey.replace(/\\n/g, '\n');
    }

    const classId = `${issuerId}.${business.id.replace(/-/g, '')}`;
    const objectId = `${issuerId}.${walletPassId}`;

    // Payload de Google Wallet
    const payload = {
      iss: clientEmail,
      aud: "google",
      typ: "savetowallet",
      iat: Math.floor(Date.now() / 1000),
      origins: [],
      payload: {
        loyaltyClasses: [{
          id: classId,
          issuerName: business.name,
          programName: `Programa de Lealtad ${business.name}`,
          programLogo: {
            sourceUri: { uri: config.logoUrl || "https://loyasl-pass.vercel.app/logo/icono.png" }
          },
          reviewStatus: "UNDER_REVIEW", // Cambiar a UNDER_REVIEW para permitir pruebas
          hexBackgroundColor: "#10B981" // Color de la tarjeta
        }],
        loyaltyObjects: [{
          id: objectId,
          classId: classId,
          state: "ACTIVE",
          accountId: customer.id,
          accountName: customer.name,
          loyaltyPoints: {
            label: "Sellos",
            balance: { int: stampsCount }
          },
          barcode: {
            type: "QR_CODE",
            value: customer.walletPassId,
            alternateText: customer.walletPassId
          }
        }]
      }
    };

    // Firmar el JWT
    const token = jwt.sign(payload, privateKey, { algorithm: "RS256" });
    const saveUrl = `https://pay.google.com/gp/v/save/${token}`;

    // Redirigir directamente al link de guardar
    return NextResponse.redirect(saveUrl);

  } catch (error) {
    console.error("Error generating Google Wallet pass:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
