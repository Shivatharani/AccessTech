import os
import re

i18n_path = "i18n.js"

replacements = [
    # English names
    (r"Lumina Tutor", "LearnLift AI"),
    (r"LuminaTutor", "LearnLift AI"),
    (r"PathPilot", "PathSync"),
    (r"Path Pilot", "PathSync"),
    (r"TermCrystal", "TermSync"),
    (r"Term Crystal", "TermSync"),
    (r"SyntaxSage", "CodeLift AI"),
    (r"Syntax Sage", "CodeLift AI"),
    (r"Quiz\b", "SkillCheck"),
    (r"quiz(?=\s|\.|\!)", "SkillCheck"),
    
    # Tamil
    (r"லுமினா டியூட்டர்", "LearnLift AI"),
    (r"பாதை பைலட்", "PathSync"),
    (r"டெர்ம் கிரிஸ்டல்", "TermSync"),
    (r"சின்டாக்ஸ் சேஜ்", "CodeLift AI"),
    (r"வினாடி வினா", "SkillCheck"),
    (r"கட்டுப்பாட்டு அறை", "ProgressHub"),

    # Hindi
    (r"लुमिना ट्यूटर", "LearnLift AI"),
    (r"पाथपायलट", "PathSync"),
    (r"टर्मक्रिस्टल", "TermSync"),
    (r"सिंटैक्स सेज", "CodeLift AI"),
    (r"प्रश्नोत्तरी", "SkillCheck"),
    (r"डैशबोर्ड", "ProgressHub"),

    # Telugu
    (r"లుమినా ట్యూటర్", "LearnLift AI"),
    (r"పాత్‌పైలట్", "PathSync"),
    (r"టర్మ్ క్రిస్టల్", "TermSync"),
    (r"సింటాక్స్ సేజ్", "CodeLift AI"),
    (r"క్విజ్", "SkillCheck"),
    (r"డ్యాష్‌బోర్డ్", "ProgressHub"),

    # Malayalam
    (r"ലുമിന ട്യൂട്ടർ", "LearnLift AI"),
    (r"പാത്ത് പൈലറ്റ്", "PathSync"),
    (r"ടേം ക്രിസ്റ്റൽ", "TermSync"),
    (r"സിൻ്റാക്സ് സേജ്", "CodeLift AI"),
    (r"ക്വിസ്", "SkillCheck"),
    (r"ഡാഷ്‌ബോർഡ്", "ProgressHub"),

    (r"Dashboard", "ProgressHub"),
    (r"dashboard\b", "ProgressHub"),
]

with open(i18n_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    match = re.match(r'^(\s*"[^"]+":\s*")(.*)(".*)$', line)
    if match:
        prefix = match.group(1)
        val = match.group(2)
        suffix = match.group(3)
        for old, new in replacements:
            val = re.sub(old, new, val)
        new_lines.append(prefix + val + suffix + "\n")
    else:
        new_lines.append(line)

with open(i18n_path, "w", encoding="utf-8") as f:
    f.writelines(new_lines)
print("i18n replacement complete.")
