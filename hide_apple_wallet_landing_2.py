import codecs
import re

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    text = f.read()

pattern = r'<Image src="/material/add-to-apple-wallet-logo.png" alt="Add to Apple Wallet" width={160} height={50} className="h-10 md:h-12 w-auto cursor-pointer hover:scale-105 transition-transform" />'
new_str = r'{/* TODO: Integración real con Apple Wallet. Pendiente hasta tener cuenta de desarrollador iOS.\n              <Image src="/material/add-to-apple-wallet-logo.png" alt="Add to Apple Wallet" width={160} height={50} className="h-10 md:h-12 w-auto cursor-pointer hover:scale-105 transition-transform" />\n              */}'

text = re.sub(pattern, new_str, text)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(text)

print("Hid Apple Wallet button on landing")
