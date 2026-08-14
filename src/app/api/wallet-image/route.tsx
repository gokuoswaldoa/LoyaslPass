import { ImageResponse } from 'next/og';
import React from 'react';
import { ICONS } from './icons';

export const runtime = 'edge';

// Ícono de regalo en JSX puro (Satori lo soporta bien sin Fragmentos)
const giftIconPath = (
  <g>
    <polyline points="20 12 20 22 4 22 4 12" />
    <rect width="20" height="5" x="2" y="7" />
    <line x1="12" x2="12" y1="22" y2="7" />
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
  </g>
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const totalStr = searchParams.get('total') || '10';
    const currentStr = searchParams.get('current') || '0';
    const color = searchParams.get('color') || '#10B981';
    const bg = searchParams.get('bg') || '#ffffff';
    let iconType = searchParams.get('iconType') || 'otro';

    let total = parseInt(totalStr, 10);
    let current = parseInt(currentStr, 10);

    if (total < 4) total = 4;
    if (total > 12) total = 12;
    if (current > total) current = total;
    if (current < 0) current = 0;

    iconType = iconType.toLowerCase();
    
    // Obtener la imagen Base64 generada, o un fallback
    const businessIconB64 = ICONS[iconType] || ICONS['otro'];

    let circleSize = 120;
    let gapSize = 24;
    
    if (total > 10) {
      circleSize = 64;
      gapSize = 12;
    } else if (total > 8) {
      circleSize = 72;
      gapSize = 16;
    } else if (total > 6) {
      circleSize = 90;
      gapSize = 20;
    }
    
    const stamps = Array.from({ length: total }, (_, i) => i);

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            backgroundColor: bg,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: gapSize + 'px',
              padding: '40px',
              maxWidth: '960px',
            }}
          >
            {stamps.map((index) => {
              const isFilled = index < current;
              const isLast = index === total - 1;
              
              const backgroundColor = isFilled ? color + '1A' : 'transparent'; // Ligero fondo si está lleno
              const borderColor = isFilled ? color : color + '4D'; 
              const iconColor = isFilled ? color : color + '80'; // Solo para el regalo
              
              return (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: circleSize + 'px',
                    height: circleSize + 'px',
                    borderRadius: '50%',
                    backgroundColor: backgroundColor,
                    border: '6px solid ' + borderColor,
                  }}
                >
                  {isLast ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={circleSize * 0.5}
                      height={circleSize * 0.5}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={iconColor}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {giftIconPath}
                    </svg>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={businessIconB64} 
                      width={circleSize * 0.6}
                      height={circleSize * 0.6}
                      style={{ opacity: isFilled ? 1 : 0.3 }}
                      alt="Stamp"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ),
      {
        width: 1032,
        height: 336,
      }
    );
  } catch (e: any) {
    console.error(e);
    return new Response('Failed to generate image', {
      status: 500,
    });
  }
}
