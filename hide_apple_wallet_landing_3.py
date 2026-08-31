import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    text = f.read()

start_idx = text.find('<Image src="/material/add-to-apple-wallet-logo.png"')
if start_idx != -1:
    end_idx = text.find('/>', start_idx) + 2
    old_str = text[start_idx:end_idx]
    new_str = "{/* TODO: Integración real con Apple Wallet. Pendiente hasta tener cuenta de desarrollador iOS.\n              " + old_str + "\n              */}"
    text = text[:start_idx] + new_str + text[end_idx:]
    with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
        f.write(text)
    print("Replaced!")
else:
    print("Not found")

