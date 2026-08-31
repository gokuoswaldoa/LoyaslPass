import codecs
import re

with codecs.open("src/app/dashboard/page.tsx", "r", "utf-8") as f:
    text = f.read()

pattern = r'(<p className="text-slate-600 dark:text-slate-400 mt-2 font-medium text-lg">.*?<\/p>)'
new_button = r'\1\n            <button onClick={() => window.dispatchEvent(new CustomEvent("openTutorial", { detail: { title: "Instala tu Dashboard", subtitle: "Agrega tu panel a la pantalla de inicio para administrar todo rápidamente como una app.", blocking: false, storageKey: "dashboardTutorialSeen" } }))} className="text-emerald-600 dark:text-emerald-400 text-sm font-bold underline mt-2 hover:opacity-80 transition-opacity">¿No sabes cómo instalar la app? Ver tutorial</button>'

text = re.sub(pattern, new_button, text, flags=re.DOTALL)

with codecs.open("src/app/dashboard/page.tsx", "w", "utf-8") as f:
    f.write(text)

print("Injected button with regex")
