import codecs

with codecs.open("src/app/[businessId]/pass/[walletPassId]/page.tsx", "r", "utf-8") as f:
    text = f.read()

old_apple_btn = """          <button 
            onClick={() => alert("📱 En iPhone:\\n\\nToca el ícono de 'Compartir' en la barra inferior (el cuadrito con la flecha hacia arriba) y selecciona 'Agregar a Inicio'. \\n\\nEsto guardará tu tarjeta permanentemente junto a tus apps.")}
            className="hover:scale-105 transition-transform drop-shadow-xl"
          >"""

new_apple_btn = """          <button 
            onClick={() => window.dispatchEvent(new Event("openTutorial"))}
            className="hover:scale-105 transition-transform drop-shadow-xl"
          >"""

text = text.replace(old_apple_btn, new_apple_btn)

# Add a small text link
old_buttons_end = """              className="h-14 w-auto" 
            />
          </button>
        </div>"""

new_buttons_end = """              className="h-14 w-auto" 
            />
          </button>
          
          <button 
            onClick={() => window.dispatchEvent(new Event("openTutorial"))}
            className="text-white/70 text-sm font-bold underline mt-2 hover:text-white transition-colors"
          >
            Ver tutorial de instalación
          </button>
        </div>"""

text = text.replace(old_buttons_end, new_buttons_end)

with codecs.open("src/app/[businessId]/pass/[walletPassId]/page.tsx", "w", "utf-8") as f:
    f.write(text)

print("Updated ClientPassPage")
