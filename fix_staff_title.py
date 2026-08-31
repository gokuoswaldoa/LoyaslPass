import codecs

with codecs.open("src/app/staff/join/page.tsx", "r", "utf-8") as f:
    text = f.read()

text = text.replace('"Instala tu Portal"', '"Guarda tu acceso"')

with codecs.open("src/app/staff/join/page.tsx", "w", "utf-8") as f:
    f.write(text)

print("Updated staff title")
