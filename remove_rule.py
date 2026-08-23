import codecs

with codecs.open("AGENTS.md", "r", "utf-8") as f:
    text = f.read()

# Remove the rule
rule = """
<!-- BEGIN:shadcn-dialog-scroll-rule -->
# Shadcn / Radix UI Scrollable Modals
Whenever you create or modify a `<DialogContent>` (from Shadcn/Radix UI) that has scrolling enabled (e.g., `overflow-y-auto`), you MUST add `onOpenAutoFocus={(e) => e.preventDefault()}` to `<DialogContent>`. 
If you do not add this, Radix will auto-focus the first button (usually the close button at the bottom), causing the modal to jarringly scroll to the bottom the moment it opens.
<!-- END:shadcn-dialog-scroll-rule -->
"""

text = text.replace(rule, "")

with codecs.open("AGENTS.md", "w", "utf-8") as f:
    f.write(text)
