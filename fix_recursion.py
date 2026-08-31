import codecs

with codecs.open("src/components/InstallTutorialModal.tsx", "r", "utf-8") as f:
    text = f.read()

bad = """  const closeTutorial = () => {
    localStorage.setItem("tutorialSeen", "true");
    closeTutorial();
  };"""

good = """  const closeTutorial = () => {
    localStorage.setItem("tutorialSeen", "true");
    setIsOpen(false);
  };"""

text = text.replace(bad, good)

with codecs.open("src/components/InstallTutorialModal.tsx", "w", "utf-8") as f:
    f.write(text)

print("Fixed recursion")
