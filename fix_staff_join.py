import codecs

with codecs.open("src/app/staff/join/page.tsx", "r", "utf-8") as f:
    text = f.read()

# 1. Add import
if "InstallTutorialModal" not in text:
    text = text.replace('import { Button } from "@/components/ui/button";', 'import { Button } from "@/components/ui/button";\nimport InstallTutorialModal from "@/components/InstallTutorialModal";')

# 2. Add useEffect to trigger tutorial alert
# we can trigger a state that shows the "alert" first, or use window.alert/confirm.
# User requested: "les salga una alerta que diga, antes de ingresar tu codigo de acceso es necesario añadir el acceso directo a tu pantalla de incio y en seguida de dar continuar les salga el tutorial, necesito que no puedan salir de esa ventana jasta que vean el tutorial completo"

old_effect = """  useEffect(() => {
    if (!token) {"""

new_effect = """  useEffect(() => {
    // Check PWA tutorial for staff
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    const hasSeenTutorial = localStorage.getItem("staffTutorialSeen") === "true";
    
    if (!isStandalone && !hasSeenTutorial) {
      setTimeout(() => {
        alert("Antes de ingresar tu código de acceso es necesario añadir el acceso directo a tu pantalla de inicio.");
        window.dispatchEvent(new CustomEvent("openTutorial", {
          detail: {
            title: "Instala tu Portal",
            subtitle: "Agrega el portal de empleados a tu pantalla de inicio para escanear más rápido.",
            blocking: true,
            storageKey: "staffTutorialSeen"
          }
        }));
      }, 500);
    }

    if (!token) {"""

text = text.replace(old_effect, new_effect)

# 3. Add link to reopen tutorial
old_form_end = """                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12"
                disabled={isSubmitting || pin.length !== 6}
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Entrar al Escáner"}
              </Button>
            </form>
          )}"""

new_form_end = """                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12"
                disabled={isSubmitting || pin.length !== 6}
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Entrar al Escáner"}
              </Button>
              
              <button 
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("openTutorial", {
                    detail: {
                      title: "Instala tu Portal",
                      subtitle: "Agrega el portal de empleados a tu pantalla de inicio para escanear más rápido.",
                      blocking: false,
                      storageKey: "staffTutorialSeen"
                    }
                  }));
                }}
                className="text-slate-500 text-xs font-bold underline mt-4 hover:text-slate-700 transition-colors w-full"
              >
                ¿No sabes cómo instalar la app? Ver tutorial
              </button>
            </form>
          )}"""

text = text.replace(old_form_end, new_form_end)

# 4. Render the modal inside the component
old_return = """  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">"""

new_return = """  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      <InstallTutorialModal />"""

text = text.replace(old_return, new_return)

with codecs.open("src/app/staff/join/page.tsx", "w", "utf-8") as f:
    f.write(text)

print("Updated StaffJoinContent")
