import codecs

with codecs.open("src/app/dashboard/layout.tsx", "r", "utf-8") as f:
    text = f.read()

old_logic = """      const res = await addStampToClient(scannedCustomer.id);
      if (res.success) {
        setStampSuccess(true);
        setTimeout(() => {
          setShowScanner(false);
          setScannedCustomer(null);
          setStampSuccess(false);
        }, 2000);
      } else {
        setScanError(res.error || "Error al agregar sello.");
      }"""

new_logic = """      const res = await addStampToClient(scannedCustomer.id);
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
      } else {
        setScanError(res.error || "Error al agregar sello.");
      }"""

text = text.replace(old_logic, new_logic)

with codecs.open("src/app/dashboard/layout.tsx", "w", "utf-8") as f:
    f.write(text)
