import codecs

with codecs.open("src/app/dashboard/page.tsx", "r", "utf-8") as f:
    text = f.read()

old_heading = """          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Hola, {session?.user?.name?.split(' ')[0] || "Dueño"}
            </h1>
            <p className="text-slate-500 font-medium mt-1">Aquí está el resumen de tu negocio.</p>
          </div>"""

new_heading = """          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Hola, {session?.user?.name?.split(' ')[0] || "Dueño"}
            </h1>
            <p className="text-slate-500 font-medium mt-1">Aquí está el resumen de tu negocio.</p>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent("openTutorial", { detail: { title: "Instala tu Dashboard", subtitle: "Agrega tu panel a la pantalla de inicio para administrar todo rápidamente como una app.", blocking: false, storageKey: "dashboardTutorialSeen" } }))}
              className="text-emerald-600 text-sm font-bold underline mt-2 hover:text-emerald-700 transition-colors"
            >
              ¿No sabes cómo instalar la app? Ver tutorial
            </button>
          </div>"""

# Ensure we deal with any UTF-8 quirks by matching logically
if "Hola, {session?.user?.name" in text:
    import re
    # We'll use regex to inject the button just after the p tag
    pattern = r'(<p className="text-slate-500 font-medium mt-1">.*?</p>)'
    replacement = r'\1\n            <button onClick={() => window.dispatchEvent(new CustomEvent("openTutorial", { detail: { title: "Instala tu Dashboard", subtitle: "Agrega tu panel a la pantalla de inicio para administrar todo rápidamente como una app.", blocking: false, storageKey: "dashboardTutorialSeen" } }))} className="text-blue-600 dark:text-blue-400 text-sm font-bold underline mt-2 hover:opacity-80 transition-opacity">¿No sabes cómo instalar la app? Ver tutorial</button>'
    text = re.sub(pattern, replacement, text)

with codecs.open("src/app/dashboard/page.tsx", "w", "utf-8") as f:
    f.write(text)

print("Updated dashboard page")
