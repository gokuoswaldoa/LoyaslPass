import codecs

with codecs.open("src/components/InstallTutorialModal.tsx", "r", "utf-8") as f:
    text = f.read()

# 1. Add variant to config
old_config = """  const [config, setConfig] = useState({
    title: "Guarda tu Tarjeta",
    subtitle: "Agrega esta tarjeta a la pantalla de inicio de tu celular para no perderla nunca y abrirla rpido.",
    blocking: false,
    storageKey: "tutorialSeen"
  });"""

new_config = """  const [config, setConfig] = useState({
    title: "Guarda tu Tarjeta",
    subtitle: "Agrega esta tarjeta a la pantalla de inicio de tu celular para no perderla nunca y abrirla rpido.",
    blocking: false,
    storageKey: "tutorialSeen",
    variant: "client"
  });"""
text = text.replace(old_config, new_config)

# 2. Update Image tags
old_img1 = 'src="/tutorial/ios-step1.png"'
new_img1 = 'src={config.variant === "client" ? "/tutorial/ios-step1.png" : "/tutorial/dashboard-ios-step1.webp"}'
text = text.replace(old_img1, new_img1)

old_img2 = 'src="/tutorial/ios-step2-share.webp"'
new_img2 = 'src={config.variant === "client" ? "/tutorial/ios-step2-share.webp" : "/tutorial/dashboard-ios-step2.webp"}'
text = text.replace(old_img2, new_img2)

old_img3 = 'src="/tutorial/ios-step3-more.webp"'
new_img3 = 'src={config.variant === "client" ? "/tutorial/ios-step3-more.webp" : "/tutorial/dashboard-ios-step3.webp"}'
text = text.replace(old_img3, new_img3)

old_img4 = 'src="/tutorial/ios-step4.webp"'
new_img4 = 'src={config.variant === "client" ? "/tutorial/ios-step4.webp" : "/tutorial/dashboard-ios-step4.webp"}'
text = text.replace(old_img4, new_img4)

with codecs.open("src/components/InstallTutorialModal.tsx", "w", "utf-8") as f:
    f.write(text)

print("Updated image paths in modal")
