import { auth } from 'google-auth-library';
import fetch from 'node-fetch';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID;
  const clientEmail = process.env.GOOGLE_WALLET_CLIENT_EMAIL;
  let privateKey = process.env.GOOGLE_WALLET_PRIVATE_KEY;

  if (!privateKey) throw new Error("No private key");

  if (privateKey.includes('\\n')) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  const client = new auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/wallet_object.issuer'],
  });

  const accessTokenResponse = await client.getAccessToken();
  const token = accessTokenResponse.token;

  const classId = `${issuerId}.testclassv2345`;

  const payload = {
    id: classId,
    issuerName: "Test Business",
    programName: `Programa de Lealtad Test`,
    programLogo: {
      sourceUri: { uri: "https://loyasl-pass.vercel.app/logo/icono.png" }
    },
    hexBackgroundColor: "#10B981",
    reviewStatus: "UNDER_REVIEW" 
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
  console.log("Status:", res.status);
  console.log("Response:", JSON.stringify(data, null, 2));
}

main().catch(console.error);
