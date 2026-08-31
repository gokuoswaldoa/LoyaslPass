import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    text = f.read()

old_landing = """            <div className="flex flex-row items-center justify-center gap-4 md:gap-6 z-10 relative">
              <Image src="/material/add-to-apple-wallet-logo.png" alt="Add to Apple Wallet" width={160} height={50} className="h-10 md:h-12 w-auto cursor-pointer hover:scale-105 transition-transform" />
              <Image src="/material/Add_to_Google_Wallet_badge.svg.webp" alt="Add to Google Wallet" width={160} height={50} className="h-10 md:h-12 w-auto cursor-pointer hover:scale-105 transition-transform" />
            </div>"""

new_landing = """            <div className="flex flex-row items-center justify-center gap-4 md:gap-6 z-10 relative">
              {/* TODO: Integración real con Apple Wallet. Pendiente hasta tener cuenta de desarrollador iOS.
              <Image src="/material/add-to-apple-wallet-logo.png" alt="Add to Apple Wallet" width={160} height={50} className="h-10 md:h-12 w-auto cursor-pointer hover:scale-105 transition-transform" />
              */}
              <Image src="/material/Add_to_Google_Wallet_badge.svg.webp" alt="Add to Google Wallet" width={160} height={50} className="h-10 md:h-12 w-auto cursor-pointer hover:scale-105 transition-transform" />
            </div>"""

text = text.replace(old_landing, new_landing)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(text)

print("Hid Apple Wallet button on landing")
