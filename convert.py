import os
import base64
import json
import re

folder = r'C:\Users\oswal\Downloads\iconos\iconos svg'
files = os.listdir(folder)
icons = {}

for f in files:
    if f.endswith('.svg'):
        path = os.path.join(folder, f)
        with open(path, 'r', encoding='utf-8') as svg_file:
            svg_text = svg_file.read()
            
            if 'viewBox' not in svg_text:
                match_w = re.search(r'width="([\d\.]+)px"', svg_text)
                match_h = re.search(r'height="([\d\.]+)px"', svg_text)
                if match_w and match_h:
                    w = match_w.group(1)
                    h = match_h.group(1)
                    svg_text = svg_text.replace('<svg ', f'<svg viewBox="0 0 {w} {h}" ', 1)
            
            # Convert ALL colors to pure white to contrast with dark backgrounds
            svg_text = re.sub(r'#[0-9a-fA-F]{3,6}', '#FFFFFF', svg_text)
            svg_text = svg_text.replace('fill="black"', 'fill="#FFFFFF"')
            svg_text = svg_text.replace('stroke="black"', 'stroke="#FFFFFF"')
            
            # El icono de regalo no tiene atributo fill, por defecto es negro.
            # Inyectamos fill="#FFFFFF" en la etiqueta svg principal para que hereden el blanco
            if '<svg' in svg_text and 'fill=' not in svg_text[:svg_text.find('>')]:
                svg_text = svg_text.replace('<svg ', '<svg fill="#FFFFFF" ', 1)
            
            b64 = base64.b64encode(svg_text.encode('utf-8')).decode('utf-8')
            name = f.replace('.svg', '').lower().strip()
            if name == 'otro negocio': name = 'otro'
            
            icons[name] = 'data:image/svg+xml;base64,' + b64

ts_content = f'export const ICONS: Record<string, string> = {json.dumps(icons, indent=2)};\n'

with open(r'c:\Users\oswal\OneDrive\Escritorio\LoyalPass\src\app\api\wallet-image\icons.ts', 'w', encoding='utf-8') as out:
    out.write(ts_content)
print('Done!')
