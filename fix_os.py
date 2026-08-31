import codecs

with codecs.open("src/components/InstallTutorialModal.tsx", "r", "utf-8") as f:
    text = f.read()

text = text.replace('useState<"ios" | "android" | "other">("other");', 'useState<"ios" | "android" | "other">("ios");')

with codecs.open("src/components/InstallTutorialModal.tsx", "w", "utf-8") as f:
    f.write(text)

print("Fixed default OS")
