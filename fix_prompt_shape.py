import codecs

with codecs.open("src/components/WebPushPrompt.tsx", "r", "utf-8") as f:
    text = f.read()

old_style = """        style={{
          borderRadius: "50% 50% 50% 0", // Teardrop / Gota de agua effect
          width: "280px",
          height: "280px",
          transform: "rotate(45deg)", // Rotate the teardrop
        }}
      >
        <div style={{ transform: "rotate(-45deg)" }} className="flex flex-col items-center">"""

new_style = """        style={{
          borderRadius: "50%",
          width: "280px",
          height: "280px",
        }}
      >
        <div className="flex flex-col items-center">"""

text = text.replace(old_style, new_style)

with codecs.open("src/components/WebPushPrompt.tsx", "w", "utf-8") as f:
    f.write(text)

print("Fixed prompt shape")
