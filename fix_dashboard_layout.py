import codecs

with codecs.open("src/app/dashboard/layout.tsx", "r", "utf-8") as f:
    text = f.read()

if "InstallTutorialModal" not in text:
    text = text.replace('import { OnboardingTour } from "@/components/onboarding-tour";', 'import { OnboardingTour } from "@/components/onboarding-tour";\nimport InstallTutorialModal from "@/components/InstallTutorialModal";')
    
    # We want to add <InstallTutorialModal /> right before {children}
    text = text.replace('{children}', '<InstallTutorialModal />\n            {children}')
    
    with codecs.open("src/app/dashboard/layout.tsx", "w", "utf-8") as f:
        f.write(text)

print("Updated dashboard layout")
