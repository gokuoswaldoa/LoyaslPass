import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    text = f.read()

old_image_tag = """            <Image 
              src="/imagenes-pasos/paso2.png" 
              alt="Vista de la tarjeta en el celular" 
              width={600} 
              height={800} 
              className="w-full max-w-md lg:max-w-xl object-contain mb-8 z-10 relative drop-shadow-2xl"
            />"""

new_image_tag = """            <Image 
              src="/material/pantalla-cliente.jpg" 
              alt="Vista de la tarjeta en el celular" 
              width={600} 
              height={800} 
              className="w-full max-w-md lg:max-w-xl object-cover rounded-[2rem] mb-8 z-10 relative shadow-2xl"
            />"""

text = text.replace(old_image_tag, new_image_tag)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(text)

print("Updated image src")
