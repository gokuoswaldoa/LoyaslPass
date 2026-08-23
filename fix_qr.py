import codecs
import re

with codecs.open("src/app/dashboard/staff/page.tsx", "r", "utf-8") as f:
    text = f.read()

# I will replace the QR Dialog
old_dialog = r"""      <Dialog open=\{!!showQRFor\} onOpenChange=\{.*?\}>(.*?)</DialogContent>\s*</Dialog>"""

new_dialog = """      <Dialog open={!!showQRFor} onOpenChange={() => setShowQRFor(null)}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 overflow-hidden p-0 border-0">
          <div className="bg-emerald-500 p-6 text-white text-center rounded-t-lg relative">
            <h2 className="text-2xl font-black mb-1">Acceso para {showQRFor?.name}</h2>
            <p className="text-emerald-100 text-sm font-medium">Sigue estas instrucciones con tu empleado.</p>
          </div>
          
          <div className="p-6 space-y-6">
            
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 flex items-center justify-center font-black flex-shrink-0">1</div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">Escanear el código</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Pídele a tu empleado que abra su cámara y escanee este código. Esto abrirá la página en su celular.</p>
                <div className="bg-white p-3 rounded-xl inline-block border shadow-sm mx-auto">
                  {showQRFor && (
                    <QRCode 
                      value={getQRUrl("")} 
                      size={140}
                      level="H"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 flex items-center justify-center font-black flex-shrink-0">2</div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">Instalar la App</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Pídele que presione <strong>Compartir</strong> y luego <strong>Agregar a inicio</strong> para instalar el escáner en su pantalla y ocultar el navegador.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 flex items-center justify-center font-black flex-shrink-0">3</div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">Ingresar el PIN</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Díctale el siguiente código de acceso para que inicie sesión en su nueva App.</p>
                {showQRFor && (
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center border border-slate-200 dark:border-slate-700">
                    <p className="text-3xl font-black tracking-[0.2em] text-slate-900 dark:text-white">{showQRFor.token}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 p-3 rounded-lg flex items-center gap-3">
              <div className="bg-emerald-500 text-white rounded-full p-1"><CheckCircle2 size={16} /></div>
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">¡Listo! Tu empleado ya puede otorgar sellos.</p>
            </div>

          </div>
          
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end">
            <Button onClick={() => setShowQRFor(null)} className="w-full sm:w-auto">
              Entendido, cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>"""

text = re.sub(old_dialog, new_dialog, text, flags=re.DOTALL)

# Update getQRUrl
text = text.replace('return `${window.location.origin}/staff/join?token=${token}`;', 'return `${window.location.origin}/staff/join`;')

with codecs.open("src/app/dashboard/staff/page.tsx", "w", "utf-8") as f:
    f.write(text)
