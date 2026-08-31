import codecs

with codecs.open("src/app/dashboard/layout.tsx", "r", "utf-8") as f:
    text = f.read()

# Let's just put it right after `<main ...>`
start_main = '<main className={`flex-1 flex flex-col h-full overflow-y-auto overflow-x-hidden pt-16 md:pt-0 ${isTourRunning ? "opacity-50 pointer-events-none" : "transition-opacity duration-500"}`}>'
new_main = '<main className={`flex-1 flex flex-col h-full overflow-y-auto overflow-x-hidden pt-16 md:pt-0 ${isTourRunning ? "opacity-50 pointer-events-none" : "transition-opacity duration-500"}`}>\n        <InstallTutorialModal />'

if start_main in text:
    text = text.replace(start_main, new_main)
else:
    # Let's find `<main`
    idx = text.find('<main ')
    if idx != -1:
        end_idx = text.find('>', idx)
        text = text[:end_idx+1] + '\n        <InstallTutorialModal />' + text[end_idx+1:]

with codecs.open("src/app/dashboard/layout.tsx", "w", "utf-8") as f:
    f.write(text)

print("Injected into main")
