import { Metadata } from 'next';
import { getClientWalletData } from "@/app/actions/clientFlow";

export async function generateMetadata(
  { params }: { params: { businessId: string; walletPassId: string } }
): Promise<Metadata> {
  const { businessId, walletPassId } = await params;
  const res = await getClientWalletData(businessId, walletPassId);
  
  let title = "Tarjeta de Lealtad";
  let logoUrl = "/logo/cafe-happy-logo.png"; // fallback

  if (res.success && res.business && res.config) {
    title = `Tarjeta de ${res.business.name}`;
    if (res.config.logoUrl) {
      logoUrl = res.config.logoUrl;
    }
  }

  return {
    title,
    icons: {
      icon: logoUrl,
      apple: logoUrl, // Very important for iOS Add to Home Screen!
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
