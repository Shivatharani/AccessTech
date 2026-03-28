import json
import re
from groq import Groq
import os

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def generate_quiz(topic, language, count=10):

    prompt = f"""
Generate EXACTLY {count} multiple-choice questions (MCQs) about {topic}. 
It is ABSOLUTELY CRITICAL that you generate EXACTLY {count} questions, no more and no less.

CRITICAL INSTRUCTION: EVERY SINGLE PART OF THE OUTPUT (including questions, options, and keys) MUST BE WRITTEN ENTIRELY IN THE {language} LANGUAGE. 
If {language} is Tamil, everything must be in Tamil script. If Telugu, everything in Telugu script, etc.

Structure:
Provide a diverse range of sub-topics within {topic}. Ensure options are distinct for each question.

Format:
You MUST output your response strictly as a JSON object containing a single key "quiz", which maps to an array of question objects.
{{
  "quiz": [
    {{
      "question": "The question in {language}",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "answer": 0
    }}
  ]
}}
(Note: 'answer' is the 0-based index of the correct option).
"""

    try:
        chat = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=2048,
            response_format={"type": "json_object"}
        )

        content = chat.choices[0].message.content.strip()
        parsed = json.loads(content)
        return parsed.get("quiz", [])
    except Exception as e:
        print(f"Error generating quiz JSON: {e}")
        return []