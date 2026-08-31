import codecs

with codecs.open("src/app/staff/join/page.tsx", "r", "utf-8") as f:
    text = f.read()

old_str = """              <Button type="submit" disabled={isSubmitting || pin.length !== 6} className="w-full bg-blue-500 hover:bg-blue-600 h-12 text-md">
                {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : "Entrar al Escaner"}
              </Button>
            </form>"""

new_str = """              <Button type="submit" disabled={isSubmitting || pin.length !== 6} className="w-full bg-blue-500 hover:bg-blue-600 h-12 text-md">
                {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : "Entrar al Escaner"}
              </Button>

              <button 
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("openTutorial", {
                    detail: {
                      title: "Guarda tu acceso",
                      subtitle: "Agrega el portal de empleados a tu pantalla de inicio para escanear más rápido.",
                      blocking: false,
                      storageKey: "staffTutorialSeen"
                    }
                  }));
                }}
                className="text-slate-500 text-xs font-bold underline mt-4 hover:text-slate-700 transition-colors w-full text-center"
              >
                ¿No sabes cómo instalar la app? Ver tutorial
              </button>
            </form>"""

text = text.replace(old_str, new_str)

with codecs.open("src/app/staff/join/page.tsx", "w", "utf-8") as f:
    f.write(text)

print("Injected staff manual button")
