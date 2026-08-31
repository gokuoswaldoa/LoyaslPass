import codecs

with codecs.open("src/components/InstallTutorialModal.tsx", "r", "utf-8") as f:
    text = f.read()

# Add localStorage logic
old_effect = """  useEffect(() => {
    // Only show if not in standalone (installed) mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (!isStandalone) {
      // Small delay to not be too aggressive
      const timer = setTimeout(() => setIsOpen(true), 1500);"""

new_effect = """  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("openTutorial", handleOpen);

    // Only show if not in standalone (installed) mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    const hasSeenTutorial = localStorage.getItem("tutorialSeen") === "true";
    
    if (!isStandalone && !hasSeenTutorial) {
      // Small delay to not be too aggressive
      const timer = setTimeout(() => setIsOpen(true), 1500);"""

old_cleanup = """      return () => clearTimeout(timer);
    }
  }, []);"""

new_cleanup = """      return () => {
        clearTimeout(timer);
        window.removeEventListener("openTutorial", handleOpen);
      };
    }
    return () => window.removeEventListener("openTutorial", handleOpen);
  }, []);

  const closeTutorial = () => {
    localStorage.setItem("tutorialSeen", "true");
    setIsOpen(false);
  };
"""

text = text.replace(old_effect, new_effect)
text = text.replace(old_cleanup, new_cleanup)

# Replace all setIsOpen(false) with closeTutorial() in onClick
text = text.replace("setIsOpen(false)", "closeTutorial()")

with codecs.open("src/components/InstallTutorialModal.tsx", "w", "utf-8") as f:
    f.write(text)

print("Updated InstallTutorialModal")
