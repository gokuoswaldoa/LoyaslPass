import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    text = f.read()

marker = 'alt="Vista de la tarjeta en el celular"'

idx = text.find(marker)
if idx != -1:
    # find src="" before this
    start = text.rfind('src="', 0, idx)
    end = text.find('"', start + 5)
    
    if start != -1 and end != -1:
        text = text[:start+5] + '/material/pantalla-cliente.jpg' + text[end:]
        
        # also update className to have rounded corners
        class_start = text.find('className="', idx)
        class_end = text.find('"', class_start + 11)
        if class_start != -1 and class_end != -1:
            old_class = text[class_start+11:class_end]
            new_class = "w-full max-w-md lg:max-w-xl object-cover rounded-[3rem] mb-8 z-10 relative shadow-2xl"
            text = text[:class_start+11] + new_class + text[class_end:]
            
        with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
            f.write(text)
        print("Success")
    else:
        print("Could not find src")
else:
    print("Could not find marker")
