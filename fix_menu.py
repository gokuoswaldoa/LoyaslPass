import codecs
import re

with codecs.open("src/app/dashboard/layout.tsx", "r", "utf-8") as f:
    text = f.read()

# Replace the specific NotificationBell and button in the topbar
pattern = r'(<div className="flex items-center gap-2">\s*<ThemeToggle />\s*)(<NotificationBell />\s*<button\s*id="tour-mobile-menu"[\s\S]*?</button>)'

def replacer(match):
    return match.group(1) + '{userRole === "owner" && (\n              <>\n                ' + match.group(2).replace('\n', '\n                ') + '\n              </>\n            )}'

text = re.sub(pattern, replacer, text)

with codecs.open("src/app/dashboard/layout.tsx", "w", "utf-8") as f:
    f.write(text)
