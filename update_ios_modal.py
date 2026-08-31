import codecs

with codecs.open("src/components/InstallTutorialModal.tsx", "r", "utf-8") as f:
    text = f.read()

start_marker = '{os === "ios" ? ('
end_marker = ') : ('

start_idx = text.find(start_marker)
end_idx = text.find(end_marker, start_idx)

new_ios_content = """{os === "ios" ? (
            <div className="space-y-6">
              
              {/* Paso 1 */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">1</div>
                  <p>Presiona los <strong>3 puntos</strong> en tu navegador.</p>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800">
                  <Image src="/tutorial/ios-step1.png" alt="Paso 1 iOS" width={400} height={300} className="w-full h-auto object-cover" />
                </div>
              </div>

              {/* Paso 2 */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">2</div>
                  <p>Presiona el botón de <strong>Compartir (Share)</strong>.</p>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800">
                  <Image src="/tutorial/ios-step2-share.webp" alt="Paso 2 iOS" width={400} height={300} className="w-full h-auto object-cover" />
                </div>
              </div>

              {/* Paso 3 */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">3</div>
                  <p>Presiona el botón de <strong>Más opciones (View More)</strong>.</p>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800">
                  <Image src="/tutorial/ios-step3-more.webp" alt="Paso 3 iOS" width={400} height={300} className="w-full h-auto object-cover" />
                </div>
              </div>

              {/* Paso 4 */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">4</div>
                  <p>Selecciona <strong>Agregar a Inicio (Add to Home Screen)</strong>.</p>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800">
                  <Image src="/tutorial/ios-step4.webp" alt="Paso 4 iOS" width={400} height={300} className="w-full h-auto object-cover" />
                </div>
              </div>

            </div>
          """

text = text[:start_idx] + new_ios_content + text[end_idx:]

with codecs.open("src/components/InstallTutorialModal.tsx", "w", "utf-8") as f:
    f.write(text)

print("Updated iOS tutorial successfully")
