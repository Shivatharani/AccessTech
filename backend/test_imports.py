try:
    import groq
    print("Groq imported successfully")
except ImportError:
    print("Groq NOT found")

try:
    import fpdf
    from fpdf import FPDF
    print("FPDF imported successfully")
except ImportError:
    print("FPDF NOT found")

import os
from dotenv import load_dotenv
load_dotenv()
print("GROQ_API_KEY set:", "Yes" if os.getenv("GROQ_API_KEY") else "No")
