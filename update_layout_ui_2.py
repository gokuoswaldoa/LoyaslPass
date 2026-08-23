import codecs

with codecs.open("src/app/dashboard/layout.tsx", "r", "utf-8") as f:
    text = f.read()

old_ui = """                        <div className="flex flex-col items-center py-8">
                          <CheckCircle2 className="w-20 h-20 text-emerald-500 mb-4 animate-bounce" />
                          <h2 className="text-2xl font-black text-slate-900 dark:text-white">¡Sello Agregado!</h2>
                          <p className="text-slate-500 mt-2">El cliente ha sido notificado.</p>
                        </div>"""

new_ui = """                        <div className="flex flex-col items-center py-8">
                          <CheckCircle2 className="w-20 h-20 text-emerald-500 mb-4 animate-bounce" />
                          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                             {firstVisitBonus ? "¡2 Sellos Agregados!" : "¡Sello Agregado!"}
                          </h2>
                          <p className="text-slate-500 mt-2 text-center">
                             {firstVisitBonus 
                                ? "Bono de referido aplicado. Tu amigo ha sido notificado." 
                                : "El cliente ha sido notificado."}
                          </p>
                        </div>"""

# Sometimes spaces are slightly different, so I'll just use regex or a shorter string.
import re
text = re.sub(r'<h2 className="text-2xl font-black text-slate-900 dark:text-white">¡Sello Agregado!</h2>\s*<p className="text-slate-500 mt-2">El cliente ha sido notificado.</p>', 
r"""<h2 className="text-2xl font-black text-slate-900 dark:text-white">
                             {firstVisitBonus ? "¡2 Sellos Agregados!" : "¡Sello Agregado!"}
                          </h2>
                          <p className="text-slate-500 mt-2 text-center">
                             {firstVisitBonus 
                                ? "Bono de referido aplicado. Tu amigo ha sido notificado." 
                                : "El cliente ha sido notificado."}
                          </p>""", text)

with codecs.open("src/app/dashboard/layout.tsx", "w", "utf-8") as f:
    f.write(text)
