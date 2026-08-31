import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    text = f.read()

# Fix the badge
old_badge = """            {/* GLOBAL BADGE */}
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold text-sm md:text-base border border-emerald-100 dark:border-emerald-800/50 shadow-sm">
              <Zap className="w-5 h-5" />
              <span>Todos nuestros planes incluyen: <strong className="font-extrabold text-emerald-800 dark:text-emerald-300">Tarjetas digitales y Notificaciones push ilimitadas</strong> sin costo extra.</span>
            </div>"""

new_badge = """            {/* GLOBAL BADGE */}
            <div className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-medium text-sm md:text-base border border-emerald-100 dark:border-emerald-800/50 shadow-sm text-center">
              <span>Todos nuestros planes incluyen: <strong className="font-extrabold text-emerald-800 dark:text-emerald-300">Tarjetas digitales y Notificaciones push ilimitadas</strong> sin costo extra.</span>
            </div>"""

text = text.replace(old_badge, new_badge)

# Fix the button
old_button = """              <Link href="/dashboard" className="mt-auto block w-full py-4 text-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                Contactar Ventas
              </Link>"""

new_button = """              <Link href="/onboarding" className="mt-auto block w-full py-4 text-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                Crear cuenta
              </Link>"""

text = text.replace(old_button, new_button)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(text)

print("Fixed pricing")
