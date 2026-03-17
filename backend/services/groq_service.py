from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# === ORIGINAL (LuminaTutor) ===
def generate_content(topic, language, level):
    prompt = f"""You are LuminaTutor. Explain '{topic}' in {language} for a {level} user.
Rules:
- Beginner: very simple, analogies, real-life examples
- Intermediate: technical + examples
- Advanced: deep details
Output only in {language}. Keep it encouraging and human-centric."""
    chat = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}]
    )
    return chat.choices[0].message.content

# === NEW: PathPilot (Career Mentor) ===
def generate_mentor_response(goal, language, level):
    prompt = f"""You are PathPilot, a caring career mentor. User goal: '{goal}'.
Provide:
1. Clear 4-5 step roadmap with timeline
2. Must-learn skills (with free resources)
3. Potential challenges & how to overcome
4. Motivation quote
Tailor exactly to {level} level. Respond in {language}. Use bullet points and emojis for readability. Make it inspiring and inclusive."""
    chat = client.chat.completions.create(model="llama-3.1-8b-instant", messages=[{"role": "user", "content": prompt}])
    return chat.choices[0].message.content

# === NEW: TermCrystal (Dictionary) ===
def generate_dictionary(term, language, level):
    prompt = f"""You are TermCrystal. Define technical term '{term}' super clearly for {level} user in {language}.
Structure exactly:
- 💎 Definition (simple)
- 📌 Real-life example
- 🔗 3 related terms (with 1-line defs)
- 🧠 Analogy
Use very easy language. Output only in {language}."""
    chat = client.chat.completions.create(model="llama-3.1-8b-instant", messages=[{"role": "user", "content": prompt}])
    return chat.choices[0].message.content

# === NEW: SyntaxSage (Code Helper) ===
def generate_code_explanation(code, mode, query, language, level):
    prompt = f"""You are SyntaxSage, expert code explainer. Mode: {mode}.
Code snippet:
{code}

User question: {query or 'Explain every line from basics'}
Break down line-by-line (number each line). Explain what it does, why it matters, common mistakes.
For {level} user in {language}. Start from absolute basics. Use simple language and code comments style."""
    chat = client.chat.completions.create(model="llama-3.1-8b-instant", messages=[{"role": "user", "content": prompt}])
    return chat.choices[0].message.content