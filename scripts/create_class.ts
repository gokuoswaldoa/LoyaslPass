import { db } from '../src/db';
import { businesses, passesConfig } from '../src/db/schema';
import { eq } from 'drizzle-orm';
import { JWT } from 'google-auth-library';
import fetch from 'node-fetch';

async function main() {
  const businessId = "d7dd1516-e56c-4977-80da-3bc34a413d78"; 

  const businessArray = await db.select().from(businesses).where(eq(businesses.id, businessId));
  const business = businessArray[0];

  const configArray = await db.select().from(passesConfig).where(eq(passesConfig.businessId, businessId));
  const config = configArray[0];

  const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID;
  const clientEmail = process.env.GOOGLE_WALLET_CLIENT_EMAIL;
  let privateKey = process.env.GOOGLE_WALLET_PRIVATE_KEY;

  if (privateKey && privateKey.includes('\\n')) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  // Create JWT Auth Client
  const client = new JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/wallet_object.issuer'],
  });

  const accessTokenResponse = await client.getAccessToken();
  const token = accessTokenResponse.token;

  // Let's create a NEW class with a unique ID
  const classId = `${issuerId}.${business.id.replace(/-/g, '')}prod`;

  let validLogoUrl = config?.logoUrl || "https://loyasl-pass.vercel.app/logo/icono.png";
  if (validLogoUrl.startsWith('/')) {
    validLogoUrl = `https://loyasl-pass.vercel.app${validLogoUrl}`;
  }

  const payload = {
    id: classId,
    issuerName: business.name,
    programName: `Programa de Lealtad ${business.name}`,
    programLogo: {
      sourceUri: { uri: validLogoUrl }
    },
    hexBackgroundColor: "#10B981",
    reviewStatus: "underReview" 
  };

  console.log("Creating class:", classId);

  const res = await fetch(`https://walletobjects.googleapis.com/walletobjects/v1/loyaltyClass`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  console.log("Response:", data);
}

main().catch(console.error);
