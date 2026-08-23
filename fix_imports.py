import codecs

with codecs.open("src/app/dashboard/staff/page.tsx", "r", "utf-8") as f:
    text = f.read()

text = text.replace('UserMinus } from "lucide-react";', 'UserMinus, CheckCircle2 } from "lucide-react";')

with codecs.open("src/app/dashboard/staff/page.tsx", "w", "utf-8") as f:
    f.write(text)
