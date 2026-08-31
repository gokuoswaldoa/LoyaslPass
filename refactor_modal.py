import codecs

with codecs.open("src/components/InstallTutorialModal.tsx", "r", "utf-8") as f:
    text = f.read()

# Make the state store the entire event payload so we can override texts/blocking
# Event type: CustomEvent<{title?: string, subtitle?: string, blocking?: boolean, forceShow?: boolean, storageKey?: string}>

old_state = """  const [isOpen, setIsOpen] = useState(false);
  const [os, setOs] = useState<"ios" | "android" | "other">("ios");"""

new_state = """  const [isOpen, setIsOpen] = useState(false);
  const [os, setOs] = useState<"ios" | "android" | "other">("ios");
  const [config, setConfig] = useState({
    title: "Guarda tu Tarjeta",
    subtitle: "Agrega esta tarjeta a la pantalla de inicio de tu celular para no perderla nunca y abrirla rpido.",
    blocking: false,
    storageKey: "tutorialSeen"
  });"""

text = text.replace(old_state, new_state)

old_effect = """  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("openTutorial", handleOpen);

    // Only show if not in standalone (installed) mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    const hasSeenTutorial = localStorage.getItem("tutorialSeen") === "true";
    
    if (!isStandalone && !hasSeenTutorial) {"""

new_effect = """  useEffect(() => {
    const handleOpen = (e: any) => {
      if (e.detail) {
        setConfig(prev => ({ ...prev, ...e.detail }));
      }
      setIsOpen(true);
    };
    window.addEventListener("openTutorial", handleOpen);

    // Only auto-show for customers by default if no params
    // Let's rely on the pages to trigger it, except for the customer pass which we trigger here
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    const hasSeenTutorial = localStorage.getItem("tutorialSeen") === "true";
    
    if (!isStandalone && !hasSeenTutorial && window.location.pathname.includes('/pass/')) {"""

text = text.replace(old_effect, new_effect)

# Update storage key usage
old_close = """  const closeTutorial = () => {
    localStorage.setItem("tutorialSeen", "true");
    setIsOpen(false);
  };"""

new_close = """  const closeTutorial = () => {
    localStorage.setItem(config.storageKey, "true");
    setIsOpen(false);
  };"""

text = text.replace(old_close, new_close)

# Render texts from config
old_render_text = """          <div className="text-center mb-6 mt-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
              Guarda tu Tarjeta
            </h2>
            <p className="text-slate-500 text-sm">
              Agrega esta tarjeta a la pantalla de inicio de tu celular para no perderla nunca y abrirla rpido.
            </p>
          </div>"""

new_render_text = """          <div className="text-center mb-6 mt-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
              {config.title}
            </h2>
            <p className="text-slate-500 text-sm">
              {config.subtitle}
            </p>
          </div>"""

text = text.replace(old_render_text, new_render_text)

# Block closing if blocking
old_close_btn = """          <button 
            onClick={() => closeTutorial()}
            className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-white"
          >
            <X size={20} />
          </button>"""

new_close_btn = """          {!config.blocking && (
            <button 
              onClick={() => closeTutorial()}
              className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-white"
            >
              <X size={20} />
            </button>
          )}"""

text = text.replace(old_close_btn, new_close_btn)

# Make backdrop non-clickable if blocking (we don't have onClick on backdrop anyway, so it's already safe)

with codecs.open("src/components/InstallTutorialModal.tsx", "w", "utf-8") as f:
    f.write(text)

print("Updated InstallTutorialModal to support config")
