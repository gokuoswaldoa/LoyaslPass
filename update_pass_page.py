import codecs

with codecs.open("src/app/[businessId]/pass/[walletPassId]/page.tsx", "r", "utf-8") as f:
    text = f.read()

# Import InstallTutorialModal
text = text.replace('import WebPushPrompt from "@/components/WebPushPrompt";', 'import WebPushPrompt from "@/components/WebPushPrompt";\nimport InstallTutorialModal from "@/components/InstallTutorialModal";')

# Add InstallTutorialModal to render
old_render_start = """    <div style={{ backgroundColor: bgColor }} className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden">
      <WebPushPrompt walletPassId={walletPassId} businessName={business.name} />"""

new_render_start = """    <div style={{ backgroundColor: bgColor }} className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden">
      <WebPushPrompt walletPassId={walletPassId} businessName={business.name} />
      <InstallTutorialModal />"""
      
text = text.replace(old_render_start, new_render_start)

# Add referral button
old_buttons = """        <div className="flex flex-col gap-4 mt-8 w-full max-w-sm justify-center items-center">
          <button """

new_buttons = """        <div className="flex flex-col gap-4 mt-8 w-full max-w-sm justify-center items-center">
          <a 
            href={`https://wa.me/?text=${encodeURIComponent(`¡Hola! Te invito a ${business.name}. Regístrate aquí y en tu primera visita te regalarán 2 sellos: https://loyasl-pass.vercel.app/${businessId}/join?ref=${customer.id}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 bg-[#25D366] text-white rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/10"
          >
            Invita a un amigo y Gana
          </a>
          <button """

text = text.replace(old_buttons, new_buttons)

with codecs.open("src/app/[businessId]/pass/[walletPassId]/page.tsx", "w", "utf-8") as f:
    f.write(text)
