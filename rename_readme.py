import re

readme_path = r"c:\Users\shiva\OneDrive\Desktop\Access\AccessTech\README.md"
with open(readme_path, "r", encoding="utf-8") as f:
    content = f.read()

replacements = [
    (r"Lumina Tutor", "LearnLift AI"),
    (r"PathPilot", "PathSync"),
    (r"TermCrystal", "TermSync"),
    (r"SyntaxSage", "CodeLift AI"),
    (r"Omni-Dashboard", "Omni-ProgressHub"),
    (r"Dashboard(?= & Analytics)", "ProgressHub"),
    (r"dashboard(?= is designed)", "ProgressHub"),
    (r"Interactive Knowledge Mastery \(Quizzes\)", "Interactive Knowledge Mastery (SkillCheck)"),
]

for old, new in replacements:
    content = re.sub(old, new, content)

with open(readme_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated README")
