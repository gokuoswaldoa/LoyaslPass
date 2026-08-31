import codecs
import re

def update_file(filepath):
    with codecs.open(filepath, "r", "utf-8") as f:
        text = f.read()
    
    # We want to insert `variant: "dashboard"` into the detail object
    text = text.replace('storageKey: "dashboardTutorialSeen"', 'storageKey: "dashboardTutorialSeen", variant: "dashboard"')
    text = text.replace('storageKey: "staffTutorialSeen"', 'storageKey: "staffTutorialSeen", variant: "dashboard"')
    
    with codecs.open(filepath, "w", "utf-8") as f:
        f.write(text)

update_file("src/app/dashboard/page.tsx")
update_file("src/components/onboarding-tour.tsx")
update_file("src/app/staff/join/page.tsx")

print("Updated events with variant")
