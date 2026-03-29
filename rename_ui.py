import os
import re

files = [
    "frontend/src/pages/Dictionary.jsx",
    "frontend/src/pages/Dashboard.jsx",
    "frontend/src/pages/Mentor.jsx",
    "frontend/src/pages/CodeHelper.jsx",
    "frontend/src/pages/Quiz.jsx",
    "frontend/src/pages/Tutor.jsx"
]

replacements = [
    (r'"TermCrystal"', '"TermSync"'),
    (r'PathPilot Progress Visualization', 'PathSync Progress Visualization'),
    (r'Awaiting First PathPilot Protocol\.\.\.', 'Awaiting First PathSync Protocol...'),
    (r'pathpilot_progress', 'pathsync_progress'),
    (r"'Return to PathPilot'", "'Return to PathSync'")
]

for filepath in files:
    filepath = os.path.join(os.getcwd(), filepath)
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        orig = content
        for old, new in replacements:
            content = re.sub(old, new, content)
            
        if content != orig:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated {filepath}")
