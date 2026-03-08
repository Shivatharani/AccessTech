from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def generate_content(topic, language, level):

    prompt = f"""
Explain '{topic}' in {language}.

User Level: {level}

Rules:

Beginner:
- very simple explanation
- examples
- real life analogy

Intermediate:
- technical explanation
- examples

Advanced:
- deep explanation
- technical details
- diagrams if needed

Output Language: {language}
"""

    chat = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}]
    )

    return chat.choices[0].message.content