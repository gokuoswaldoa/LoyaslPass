import codecs
import re

with codecs.open("src/app/dashboard/layout.tsx", "r", "utf-8") as f:
    text = f.read()

# Add firstVisitBonus state
old_state = '  const [stampSuccess, setStampSuccess] = useState(false);'
new_state = '  const [stampSuccess, setStampSuccess] = useState(false);\n  const [firstVisitBonus, setFirstVisitBonus] = useState(false);'
text = text.replace(old_state, new_state)

# Update the set state logic
old_logic = """      const res = await addStampToClient(scannedCustomer.id);
      if (res.success) {
        if (res.isFirstVisitBonus) {
           setStampSuccess(true);
           // Podríamos mostrar un mensaje extra en la UI si quisiéramos, por ahora el success basta
        } else {
           setStampSuccess(true);
        }
        setTimeout(() => {
          setShowScanner(false);
          setScannedCustomer(null);
          setStampSuccess(false);
        }, 2000);
      } else {"""

new_logic = """      const res = await addStampToClient(scannedCustomer.id);
      if (res.success) {
        if (res.isFirstVisitBonus) {
           setStampSuccess(true);
           setFirstVisitBonus(true);
        } else {
           setStampSuccess(true);
           setFirstVisitBonus(false);
        }
        setTimeout(() => {
          setShowScanner(false);
          setScannedCustomer(null);
          setStampSuccess(false);
          setFirstVisitBonus(false);
        }, 2000);
      } else {"""
text = text.replace(old_logic, new_logic)

# Update UI
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
                                ? "Bono de bienvenida por referido aplicado. Invitador notificado." 
                                : "El cliente ha sido notificado."}
                          </p>
                        </div>"""

text = text.replace(old_ui, new_ui)

with codecs.open("src/app/dashboard/layout.tsx", "w", "utf-8") as f:
    f.write(text)
