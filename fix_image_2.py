import codecs
import re

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    text = f.read()

# Make it more robust with regex
old_pattern = r'<Image\s+src="/imagenes-pasos/paso2\.png"\s+alt="Vista de la tarjeta en el celular"\s+width={600}\s+height={800}\s+className="w-full max-w-md lg:max-w-xl object-contain mb-8 z-10 relative drop-shadow-2xl"\s*/>'
new_replacement = """<Image 
              src="/material/pantalla-cliente.jpg" 
              alt="Vista de la tarjeta en el celular" 
              width={600} 
              height={800} 
              className="w-full max-w-md lg:max-w-xl object-cover rounded-[3rem] mb-8 z-10 relative shadow-2xl"
            />"""

text = re.sub(old_pattern, new_replacement, text)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(text)

print("Fixed image with regex")
