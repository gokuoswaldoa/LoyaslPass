import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    text = f.read()

start_marker = '      {/* 4. PRECIOS */}'
end_marker = '      {/* 4.5. SECCION SOPORTE */}'

if start_marker in text and end_marker in text:
    before = text.split(start_marker)[0]
    after = text.split(end_marker)[1]
    
    new_pricing = """      {/* 4. PRECIOS */}
      <section id="precios" className="py-24 bg-white dark:bg-black relative">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">Planes simples y transparentes</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">Pruébalo gratis por 14 días. Escala tu negocio con el plan que mejor se adapte a ti.</p>
            
            {/* GLOBAL BADGE */}
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold text-sm md:text-base border border-emerald-100 dark:border-emerald-800/50 shadow-sm">
              <Zap className="w-5 h-5" />
              <span>Todos nuestros planes incluyen: <strong className="font-extrabold text-emerald-800 dark:text-emerald-300">Tarjetas digitales y Notificaciones push ilimitadas</strong> sin costo extra.</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto py-8">

            {/* PLAN BÁSICO */}
            <div className="flex flex-col bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Básico</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 h-10">Para arrancar tu primer programa de fidelidad.</p>

              <div className="mb-2">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">$399</span>
                <span className="text-slate-500">/mes</span>
              </div>
              <div className="text-sm text-slate-500 font-medium mb-8">o $13.30 al día</div>

              <div className="h-px bg-slate-200 dark:bg-white/10 mb-8 shrink-0" />

              <ul className="space-y-4 mb-8 flex-grow">
                {[
                  "1 sucursal y 1 programa de lealtad con tus colores",
                  "Manejo de roles (Administrador y Empleados)",
                  "Panel de análisis de audiencia (descubre quién volvió, cuándo y cuánto compró)",
                  "1 Zona de notificación automática (radio de 100m)",
                  "Soporte directo"
                ].map((feat, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium">{feat}</span>
                  </li>
                ))}
              </ul>

              <Link href="/onboarding" className="mt-auto block w-full py-4 text-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                Crear cuenta
              </Link>
            </div>

            {/* PLAN PRO */}
            <div className="flex flex-col bg-slate-900 dark:bg-slate-800 rounded-[2rem] p-8 border-2 border-emerald-500 shadow-2xl relative md:scale-[1.03] z-10">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Recomendado
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
              <p className="text-slate-400 text-sm mb-6 h-10">Para negocios en crecimiento y sucursales.</p>

              <div className="mb-2">
                <span className="text-4xl font-extrabold text-white">$799</span>
                <span className="text-slate-400">/mes</span>
              </div>
              <div className="text-sm text-emerald-400 font-medium mb-8">o $26.63 al día</div>

              <div className="h-px bg-white/10 mb-8 shrink-0" />

              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start gap-3 text-emerald-300 font-bold pb-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-sm">Todo lo del plan Básico, más:</span>
                </li>
                {[
                  "Hasta 3 sucursales y 3 programas de lealtad",
                  "Zonas de notificación independientes para cada local",
                  "Campañas de cumpleaños automáticas"
                ].map((feat, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium">{feat}</span>
                  </li>
                ))}
              </ul>

              <Link href="/onboarding" className="mt-auto block w-full py-4 text-center rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20">
                Crear cuenta
              </Link>
            </div>

            {/* PLAN PREMIUM */}
            <div className="flex flex-col bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Premium</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 h-10">Sin límites. Para empresas y franquicias.</p>

              <div className="mb-2">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">$1,630</span>
                <span className="text-slate-500">/mes</span>
              </div>
              <div className="text-sm text-slate-500 font-medium mb-8">o $54.33 al día</div>

              <div className="h-px bg-slate-200 dark:bg-white/10 mb-8 shrink-0" />

              <div className="flex-grow flex flex-col">
                <ul className="space-y-4 mb-6">
                  <li className="flex items-start gap-3 text-slate-900 dark:text-white font-bold pb-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm">Todo lo del plan Pro, más:</span>
                  </li>
                  {[
                    "Sucursales y programas de lealtad ilimitados",
                    "Zonas de notificación ilimitadas",
                    "Estrategias automáticas con IA (sugerencias de notificaciones)",
                    "Onboarding y configuración personalizada 1 a 1"
                  ].map((feat, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-sm font-medium">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link href="/dashboard" className="mt-auto block w-full py-4 text-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                Contactar Ventas
              </Link>
            </div>

          </div>
        </div>
      </section>

"""
    
    with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
        f.write(before + new_pricing + end_marker + after)
    print("Updated successfully")
else:
    print("Could not find markers")
