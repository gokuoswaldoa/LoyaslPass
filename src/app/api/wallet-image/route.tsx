import { ImageResponse } from 'next/og';
import React from 'react';
import { ICONS } from './icons';
import { BACKGROUNDS } from './backgrounds';

// Remover runtime='edge' para evitar el límite de 1MB de Vercel (Satori y Base64 pesan bastante)
// export const runtime = 'edge';



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
    const backgroundImg = BACKGROUNDS[iconType] || BACKGROUNDS['otro'];

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
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Fondo Fotorealista Base64 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={backgroundImg}
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            alt="Background"
          />

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
              zIndex: 10,
            }}
          >
            {stamps.map((index) => {
              const isFilled = index < current;
              const isLast = index === total - 1;
              const isPasteles = iconType === 'panaderia y postres';
              
              const backgroundColor = isFilled 
                ? (isPasteles ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.15)') 
                : (isPasteles ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)'); 
                
              const borderStyle = isFilled 
                ? (isPasteles ? `2px solid rgba(0, 0, 0, 0.8)` : `2px solid rgba(255, 255, 255, 0.9)`) 
                : (isPasteles ? `2px dashed rgba(0, 0, 0, 0.3)` : `2px dashed rgba(255, 255, 255, 0.3)`); 
              
              const currentB64 = isLast 
                ? (isPasteles ? ICONS['regalo_black'] : ICONS['regalo']) 
                : businessIconB64;
                
              let iconSize = isLast ? circleSize * 0.75 : circleSize * 0.55;
              
              if ((iconType === 'fitness' || iconType === 'mascotas') && !isLast) {
                iconSize *= 1.25;
              }
              
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
                    border: borderStyle,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={currentB64} 
                    width={iconSize}
                    height={iconSize}
                    style={{ opacity: isFilled ? 1 : 0.4 }}
                    alt="Stamp"
                  />
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
  } catch (e: unknown) {
    console.error(e);
    return new Response('Failed to generate image', {
      status: 500,
    });
  }
}
