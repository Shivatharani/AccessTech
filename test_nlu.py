import sys
import os

# Add backend to path to import services
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from backend.services.groq_service import parse_voice_command

test_cases = [
    ("Take me to the tutor page please", "English"),
    ("நன்றி, வெளியேறு", "Tamil"),
    ("बड़ा फ़ॉन्ट करें", "Hindi"),
    ("What is photosynthesis?", "English"),
    ("டியூட்டருக்குச் செல்லுங்கள்", "Tamil"), # Go to tutor
    ("डार्क मोड ऑन करो", "Hindi"), # Turn on dark mode
]

print("Testing Voice Command NLU...")
for transcript, lang in test_cases:
    print(f"\nTranscript: {transcript} ({lang})")
    result = parse_voice_command(transcript, lang)
    print(f"Intent: {result.get('intent')}")
    print(f"Params: {result.get('params')}")
    print(f"Feedback: {result.get('feedback')}")
