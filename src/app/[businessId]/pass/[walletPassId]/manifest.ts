import { MetadataRoute } from 'next'
import { getClientWalletData } from "@/app/actions/clientFlow";

export default async function manifest(
  { params }: { params: { businessId: string; walletPassId: string } }
): Promise<MetadataRoute.Manifest> {
  const { businessId, walletPassId } = await params;
  
  const res = await getClientWalletData(businessId, walletPassId);
  
  let businessName = "Tarjeta de Lealtad";
  let logoUrl = "/logo/cafe-happy-logo.png"; // fallback

  if (res.success && res.business && res.config) {
    businessName = res.business.name;
    if (res.config.logoUrl) {
      logoUrl = res.config.logoUrl;
    }
  }

  return {
    name: businessName,
    short_name: businessName,
    description: `Tu tarjeta de lealtad para ${businessName}`,
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#10B981',
    icons: [
      {
        src: logoUrl,
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: logoUrl,
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
