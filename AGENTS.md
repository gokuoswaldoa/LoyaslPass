<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:shadcn-dialog-scroll-rule -->
# Shadcn / Radix UI Scrollable Modals
Whenever you create or modify a `<DialogContent>` (from Shadcn/Radix UI) that has scrolling enabled (e.g., `overflow-y-auto`), you MUST add `onOpenAutoFocus={(e) => e.preventDefault()}` to `<DialogContent>`. 
If you do not add this, Radix will auto-focus the first button (usually the close button at the bottom), causing the modal to jarringly scroll to the bottom the moment it opens.
<!-- END:shadcn-dialog-scroll-rule -->
