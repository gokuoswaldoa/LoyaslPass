import codecs

with codecs.open("src/app/[businessId]/pass/[walletPassId]/page.tsx", "r", "utf-8") as f:
    text = f.read()

# We need to hide the Apple Wallet button which currently triggers "openTutorial"
# But we also have a "Ver tutorial de instalación" link that still works.
# Let's find the button block and comment it out or add hidden class.

old_button = """          <button 
            onClick={() => window.dispatchEvent(new Event("openTutorial"))}
            className="hover:scale-105 transition-transform drop-shadow-xl"
          >
            <Image 
              src="/material/add-to-apple-wallet-logo.png" 
              alt="Agregar a Apple Wallet" 
              width={200} 
              height={60} 
              className="h-14 w-auto" 
            />
          </button>"""

new_button = """          {/* TODO: Integración real con Apple Wallet. Pendiente hasta tener cuenta de desarrollador iOS.
          <button 
            onClick={() => window.dispatchEvent(new Event("openTutorial"))}
            className="hover:scale-105 transition-transform drop-shadow-xl"
          >
            <Image 
              src="/material/add-to-apple-wallet-logo.png" 
              alt="Agregar a Apple Wallet" 
              width={200} 
              height={60} 
              className="h-14 w-auto" 
            />
          </button>
          */}"""

text = text.replace(old_button, new_button)

with codecs.open("src/app/[businessId]/pass/[walletPassId]/page.tsx", "w", "utf-8") as f:
    f.write(text)

print("Hid Apple Wallet button")
