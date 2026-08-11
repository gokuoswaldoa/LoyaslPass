import { JWT } from "google-auth-library";

export const getGoogleWalletClient = () => {
  const clientEmail = process.env.GOOGLE_WALLET_CLIENT_EMAIL;
  let privateKey = process.env.GOOGLE_WALLET_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    throw new Error("Missing Google Wallet credentials");
  }

  // Corregir saltos de línea si vienen escapados de Vercel
  if (privateKey.includes('\\n')) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  const credentials = {
    client_email: clientEmail,
    private_key: privateKey,
  };

  const auth = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ["https://www.googleapis.com/auth/wallet_object.issuer"],
  });

  return auth;
};
