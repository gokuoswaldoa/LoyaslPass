import codecs

with codecs.open("src/app/dashboard/staff/page.tsx", "r", "utf-8") as f:
    text = f.read()

# Revert the onOpenAutoFocus
old_dialog = '        <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 max-h-[90vh] overflow-y-auto p-0 border-0" onOpenAutoFocus={(e) => e.preventDefault()}>'
new_dialog = '        <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 max-h-[90vh] overflow-y-auto p-0 border-0">'
text = text.replace(old_dialog, new_dialog)

# Let's add tabIndex={0} to the top element of the modal to hijack the focus natively
top_element = '<div className="bg-emerald-500 p-6 text-white text-center rounded-t-lg relative">'
new_top_element = '<div tabIndex={0} className="bg-emerald-500 p-6 text-white text-center rounded-t-lg relative outline-none">'
text = text.replace(top_element, new_top_element)

with codecs.open("src/app/dashboard/staff/page.tsx", "w", "utf-8") as f:
    f.write(text)
