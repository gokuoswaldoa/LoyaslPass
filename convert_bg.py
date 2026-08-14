import os
import base64
from PIL import Image
from io import BytesIO

in_dir = r"C:\Users\oswal\Downloads\fondos"
out_file = r"src\app\api\wallet-image\backgrounds.ts"

# Map filename (without extension) to the exact iconType keys
KEY_MAPPING = {
    'bar': 'bar',
    'barberia': 'barberia',
    'cafeteria': 'cafeteria',
    'fitness': 'fitness',
    'mascotas': 'mascotas',
    'otros': 'otro',
    'pasteles 2': 'panaderia y postres',
    'restaurante': 'restaurante',
    'tienda': 'tienda y boutique'
}

backgrounds = {}

for filename in os.listdir(in_dir):
    if filename.lower().endswith('.webp'):
        name = filename.rsplit('.', 1)[0].lower()
        
        # skip if not in our mapping
        if name not in KEY_MAPPING:
            continue
            
        key = KEY_MAPPING[name]
        
        filepath = os.path.join(in_dir, filename)
        
        # Open webp, convert to RGB (JPEG)
        try:
            with Image.open(filepath) as img:
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                
                # Satori container is 1032x336. Let's resize it if it's too big to save space
                if img.width > 1200:
                    ratio = 1200.0 / img.width
                    new_height = int(img.height * ratio)
                    img = img.resize((1200, new_height), Image.Resampling.LANCZOS)

                buffer = BytesIO()
                # Save as JPEG
                img.save(buffer, format="JPEG", quality=80)
                b64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
                
                backgrounds[key] = f"data:image/jpeg;base64,{b64}"
                print(f"Processed {filename} -> {key} (Size: {len(b64)//1024} KB)")
        except Exception as e:
            print(f"Error processing {filename}: {e}")

# Write to backgrounds.ts
with open(out_file, 'w', encoding='utf-8') as f:
    f.write("export const BACKGROUNDS: Record<string, string> = {\n")
    for key, b64 in backgrounds.items():
        f.write(f"  '{key}': '{b64}',\n")
    f.write("};\n")

print("Generated backgrounds.ts successfully!")
