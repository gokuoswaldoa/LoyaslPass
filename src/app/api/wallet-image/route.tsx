import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Diccionario de íconos (Extraídos de Lucide para máxima compatibilidad con Satori)
const ICONS: Record<string, string> = {
  cafeteria: '<path d="M17 8h1a4 4 0 1 1 0 8h-1" /><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" /><line x1="6" x2="6" y1="2" y2="4" /><line x1="10" x2="10" y1="2" y2="4" /><line x1="14" x2="14" y1="2" y2="4" />',
  restaurante: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />',
  postres: '<path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" /><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" /><path d="M2 21h20" /><path d="M7 8v3" /><path d="M12 8v3" /><path d="M17 8v3" /><path d="M7 4h.01" /><path d="M12 4h.01" /><path d="M17 4h.01" />',
  barberia: '<circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><line x1="20" x2="8.12" y1="4" y2="15.88" /><line x1="14.47" x2="20" y1="14.48" y2="20" /><line x1="8.12" x2="12" y1="8.12" y2="12" />',
  bar: '<path d="M8 22h8" /><path d="M12 15v7" /><path d="M12 15a7.9 7.9 0 0 1-8-8 8.5 8.5 0 0 1 16 0 7.9 7.9 0 0 1-8 8Z" /><path d="M4 7h16" />',
  spa: '<path d="M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V12m0 0a4.5 4.5 0 1 0 4.5 4.5M12 12a4.5 4.5 0 1 1-4.5 4.5M12 12v4.5" />',
  tienda: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><line x1="3" x2="21" y1="6" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />',
  fitness: '<path d="m6.5 6.5 11 11" /><path d="m21 21-1-1" /><path d="m3 3-1-1" /><path d="m18 22 4-4" /><path d="m2 6 4-4" /><path d="m3 10 7-7" /><path d="m14 21 7-7" />',
  mascotas: '<path d="M11 11.424V12a1 1 0 0 0 1 1h0a1 1 0 0 0 1-1v-.576" /><path d="M14 6c0 1.5-1 3-2 3s-2-1.5-2-3 1-3 2-3 2 1.5 2 3Z" /><path d="M19.5 8.5c0 1.5-1 3-2 3s-2-1.5-2-3 1-3 2-3 2 1.5 2 3Z" /><path d="M8.5 8.5c0 1.5-1 3-2 3s-2-1.5-2-3 1-3 2-3 2 1.5 2 3Z" /><path d="M12.96 17c.54-.53.96-1.2.96-2 0-1.5-1-3-2-3s-2 1.5-2 3c0 .8.42 1.47.96 2" /><path d="M4 14.5c0-1.5 1-3 2-3s2 1.5 2 3-1 3-2 3-2-1.5-2-3Z" /><path d="M20 14.5c0-1.5-1-3-2-3s-2 1.5-2 3 1 3 2 3 2-1.5 2-3Z" /><path d="M12 21c-2.5 0-4.5-1-4.5-2.5S9.5 16 12 16s4.5 1 4.5 2.5S14.5 21 12 21Z" />',
  otro: '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />',
  regalo: '<polyline points="20 12 20 22 4 22 4 12" /><rect width="20" height="5" x="2" y="7" /><line x1="12" x2="12" y1="22" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />'
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const totalStr = searchParams.get('total') || '10';
    const currentStr = searchParams.get('current') || '0';
    const color = searchParams.get('color') || '#10B981'; // Emerald 500 default
    const bg = searchParams.get('bg') || '#ffffff';
    let iconType = searchParams.get('iconType') || 'otro';

    let total = parseInt(totalStr, 10);
    let current = parseInt(currentStr, 10);

    // Límites solicitados por el usuario
    if (total < 4) total = 4;
    if (total > 12) total = 12;
    if (current > total) current = total;
    if (current < 0) current = 0;

    // Normalizar a minúsculas
    iconType = iconType.toLowerCase();
    
    // Fallback a "otro" si el giro no se encuentra en el diccionario
    const businessIconPath = ICONS[iconType] || ICONS['otro'];
    const giftIconPath = ICONS['regalo'];

    // Determinar tamaño de círculos según el total
    // Dimensiones de la imagen: 1032x336
    // Para 12 sellos, necesitamos dividirlos bien.
    // Satori a veces tiene problemas con flex-wrap, por lo que es más seguro tener 
    // todo en una fila si caben, o dos filas explícitas. 
    // Como Google Wallet es muy ancho (1032), podemos meter hasta 12 en una fila si los achicamos.
    // 1032 / 12 = 86px. Con gaps, un tamaño de 64px o 72px cabría perfectamente en una sola fila.
    // Pero si son menos sellos (ej. 4), se verían muy pequeños con 72px.
    
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
    
    // Crear el arreglo de círculos
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
            
            // El último es el regalo
            const svgPath = isLast ? giftIconPath : businessIconPath;
            
            // Colores
            const backgroundColor = isFilled ? color : 'transparent';
            const borderColor = isFilled ? color : color + '4D'; // 30% opacidad
            const iconColor = isFilled ? bg : color + '80'; // 50% opacidad
            
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
                  dangerouslySetInnerHTML={{ __html: svgPath }}
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
  } catch (e: any) {
    console.error(e);
    return new Response('Failed to generate image', {
      status: 500,
    });
  }
}
