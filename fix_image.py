import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    text = f.read()

old_image = 'src="/material/pantalla%20cliente.png"'
new_image = 'src="/imagenes-pasos/paso2.png"'

text = text.replace(old_image, new_image)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(text)

print("Fixed image")
