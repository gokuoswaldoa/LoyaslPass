import codecs

with codecs.open("src/app/dashboard/staff/page.tsx", "r", "utf-8") as f:
    text = f.read()

# 1. Prevent auto-scroll on the instruction modal
old_dialog = '        <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 max-h-[90vh] overflow-y-auto p-0 border-0">'
new_dialog = '        <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 max-h-[90vh] overflow-y-auto p-0 border-0" onOpenAutoFocus={(e) => e.preventDefault()}>'
text = text.replace(old_dialog, new_dialog)

# 2. Change "Ver QR" button text to "Vincular" or something similar
text = text.replace('<QrCode size={16} className="mr-2" /> Ver QR', '<QrCode size={16} className="mr-2" /> Ver Instrucciones')

# 3. Change "Regenerar QR" to "Regenerar Código"
text = text.replace('<RefreshCw size={20} /> Regenerar QR', '<RefreshCw size={20} /> Regenerar Código')
text = text.replace('¿Deseas generar un nuevo acceso?', '¿Deseas generar un nuevo código de acceso?')

with codecs.open("src/app/dashboard/staff/page.tsx", "w", "utf-8") as f:
    f.write(text)
