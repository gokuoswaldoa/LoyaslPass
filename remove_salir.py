import codecs
import re

with codecs.open("src/app/dashboard/layout.tsx", "r", "utf-8") as f:
    text = f.read()

pattern = r'\s*<button\s*onClick=\{handleLogout\}\s*className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"\s*>\s*<LogOut size=\{20\} /> Salir\s*</button>'

if re.search(pattern, text):
    text = re.sub(pattern, "", text)
    with codecs.open("src/app/dashboard/layout.tsx", "w", "utf-8") as f:
        f.write(text)
    print("Boton Salir eliminado.")
else:
    print("No se encontro el boton.")
