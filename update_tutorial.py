import codecs

with codecs.open("src/components/InstallTutorialModal.tsx", "r", "utf-8") as f:
    text = f.read()

old_ios_1 = """              <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl h-40 flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700">
                {/* PLACEHOLDER CAPTURA IOS 1 */}
                <span className="text-slate-400 text-sm font-bold">Captura iOS 1</span>
              </div>"""

new_ios_1 = """              <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-700 relative h-48">
                <Image src="/tutorial/ios-step1.png" alt="Paso 1 iOS" fill className="object-contain" />
              </div>"""

old_ios_2 = """              <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl h-40 flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700">
                {/* PLACEHOLDER CAPTURA IOS 2 */}
                <span className="text-slate-400 text-sm font-bold">Captura iOS 2</span>
              </div>"""

new_ios_2 = """              <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-700 relative h-48">
                <Image src="/tutorial/ios-step2.webp" alt="Paso 2 iOS" fill className="object-cover" />
              </div>"""

# Modify the instruction slightly since the screenshots are from Brave which uses "three dots" then "share" then "add to home screen".
# Or keep Safari. Let's make it generic: "Toca el ícono de Compartir (o el menú del navegador) en la barra inferior."
old_instruction_1 = "<p>Toca el ícono de <strong>Compartir</strong> en la barra inferior de Safari.</p>"
new_instruction_1 = "<p>Toca el ícono de <strong>Compartir</strong> (o menú) en la barra inferior.</p>"

text = text.replace(old_ios_1, new_ios_1)
text = text.replace(old_ios_2, new_ios_2)
text = text.replace(old_instruction_1, new_instruction_1)

with codecs.open("src/components/InstallTutorialModal.tsx", "w", "utf-8") as f:
    f.write(text)

print("Updated tutorial modal")
