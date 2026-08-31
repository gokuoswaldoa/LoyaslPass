import codecs

with codecs.open("src/components/onboarding-tour.tsx", "r", "utf-8") as f:
    text = f.read()

old_finish = """    if (finishedStatuses.includes(status)) {
      setRun(false);
      setIsTourRunning?.(false);
      if (isMobile) setMobileMenuOpen?.(false);
      localStorage.setItem("loyalpass_tour_completed", "true");
    }"""

new_finish = """    if (finishedStatuses.includes(status)) {
      setRun(false);
      setIsTourRunning?.(false);
      if (isMobile) setMobileMenuOpen?.(false);
      localStorage.setItem("loyalpass_tour_completed", "true");
      
      // Mostrar tutorial de instalacion al terminar el tour (o skipear)
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("openTutorial", {
          detail: {
            title: "Instala tu Dashboard",
            subtitle: "Agrega tu panel a la pantalla de inicio para administrar todo rpidamente como una app.",
            blocking: false,
            storageKey: "dashboardTutorialSeen"
          }
        }));
      }, 500);
    }"""

text = text.replace(old_finish, new_finish)

with codecs.open("src/components/onboarding-tour.tsx", "w", "utf-8") as f:
    f.write(text)

print("Updated OnboardingTour")
