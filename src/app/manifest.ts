import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'LoyalPass - Tu Tarjeta de Lealtad',
    short_name: 'LoyalPass',
    description: 'Guarda tus tarjetas de lealtad y recibe promociones',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#10B981',
    icons: [
      {
        src: '/logo/cafe-happy-logo.png', // Fallback icon
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo/cafe-happy-logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
