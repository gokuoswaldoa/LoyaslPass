import codecs

with codecs.open("src/app/dashboard/layout.tsx", "r", "utf-8") as f:
    text = f.read()

old_logic = """      const res = await addStampToClient(scannedCustomer.id);
      if (res.success) {
        toast.success("¡Sello agregado exitosamente!");
        setScannedCustomer(null);
        setScannerOpen(false);
      } else {
        toast.error(res.error || "Error al agregar sello");
      }"""

new_logic = """      const res = await addStampToClient(scannedCustomer.id);
      if (res.success) {
        if (res.isFirstVisitBonus) {
           toast.success("¡Sello agregado! (Este cliente ganó su bono de bienvenida por referido)");
        } else {
           toast.success("¡Sello agregado exitosamente!");
        }
        setScannedCustomer(null);
        setScannerOpen(false);
      } else {
        toast.error(res.error || "Error al agregar sello");
      }"""

text = text.replace(old_logic, new_logic)

with codecs.open("src/app/dashboard/layout.tsx", "w", "utf-8") as f:
    f.write(text)
