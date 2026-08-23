import codecs

with codecs.open("src/app/dashboard/staff/page.tsx", "r", "utf-8") as f:
    text = f.read()

old_str = '        <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 overflow-hidden p-0 border-0">'
new_str = '        <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 max-h-[90vh] overflow-y-auto p-0 border-0">'

text = text.replace(old_str, new_str)

with codecs.open("src/app/dashboard/staff/page.tsx", "w", "utf-8") as f:
    f.write(text)
