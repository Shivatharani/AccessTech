from groq import Groq
import os

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def generate_quiz(topic, language):

    prompt = f"""
Generate 5 MCQ quiz questions about {topic}.

Language: {language}

Format:

Question
A)
B)
C)
D)

Answer:
"""

    chat = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}]
    )

    return chat.choices[0].message.content