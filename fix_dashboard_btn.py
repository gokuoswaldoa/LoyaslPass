import codecs

with codecs.open("src/app/dashboard/page.tsx", "r", "utf-8") as f:
    text = f.read()

old_p = """            <p className="text-slate-600 dark:text-slate-400 mt-2 font-medium text-lg">
              Aquí está el pulso de tu negocio el día de hoy.
            </p>"""

new_p = """            <p className="text-slate-600 dark:text-slate-400 mt-2 font-medium text-lg">
              Aquí está el pulso de tu negocio el día de hoy.
            </p>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent("openTutorial", { detail: { title: "Instala tu Dashboard", subtitle: "Agrega tu panel a la pantalla de inicio para administrar todo rápidamente como una app.", blocking: false, storageKey: "dashboardTutorialSeen" } }))}
              className="text-blue-600 dark:text-blue-400 text-sm font-bold underline mt-2 hover:opacity-80 transition-opacity"
            >
              ¿No sabes cómo instalar la app? Ver tutorial
            </button>"""

if old_p in text:
    text = text.replace(old_p, new_p)
else:
    # Try with different encoding of characters
    old_p_alt = """            <p className="text-slate-600 dark:text-slate-400 mt-2 font-medium text-lg">
              Aqu\xc3\xad est\xc3\xa1 el pulso de tu negocio el d\xc3\xada de hoy.
            </p>"""
    text = text.replace(old_p_alt, new_p)

with codecs.open("src/app/dashboard/page.tsx", "w", "utf-8") as f:
    f.write(text)

print("Injected button")
