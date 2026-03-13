import json
import re
from groq import Groq
import os

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def generate_quiz(topic, language):

    prompt = f"""
Generate EXACTLY 10 multiple-choice questions (MCQs) about {topic}. IT IS ABSOLUTELY CRITICAL THAT YOU GENERATE EXACTLY 10 QUESTIONS, NO MORE AND NO LESS.

CRITICAL INSTRUCTION: EVERY SINGLE QUESTION MUST BE COMPLETELY UNIQUE. DO NOT REPEAT ANY CONCEPT, QUESTION, OR SET OF OPTIONS. Provide a diverse range of sub-topics within {topic}. Ensure options are distinct for each question.

Language: You MUST write the questions, options, and answers entirely in the {language} language.

You MUST output your response strictly as a JSON object containing a single key "quiz", which maps to an array of question objects.

Format exactly like this example:
{{
  "quiz": [
    {{
      "question": "What is 2+2?",
      "options": ["1", "2", "3", "4"],
      "answer": 3
    }}
  ]
}}

(Note: 'answer' is the 0-based index of the correct option in the options array).
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