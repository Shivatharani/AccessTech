from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# === ORIGINAL (LuminaTutor) ===
def generate_content(topic, language, level, image=None):
    if image:
        # Extract base64 content if it has the data:image prefix
        if "," in image:
            image = image.split(",")[1]
            
        prompt = f"""You are LuminaTutor. Based on the provided image and topic '{topic}', explain clearly in {language} for a {level} user.
Rules:
- Beginner: very simple, analogies, real-life examples
- Intermediate: technical + examples
- Advanced: deep details
Output only in {language}. Keep it encouraging and human-centric."""

        chat = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image}"}}
                    ]
                }
            ]
        )
    else:
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
# === NEW: Voice Assistant NLU ===
import json

def parse_voice_command(transcript, language):
    prompt = f"""You are a voice assistant parser for AccessTech.
The user said: \"{transcript}\" in {language}.
Extract the intent and any parameters from this transcript.

Supported Intents:
1. navigate: Change page. Params: path (e.g., \"/login\", \"/\", \"/dashboard\", \"/tutor\", \"/mentor\", \"/dictionary\", \"/codehelper\", \"/quiz\")
2. toggle_theme: Switch between light/dark mode. Params: mode (\"light\", \"dark\")
3. toggle_dyslexia: Toggle dyslexia mode.
4. toggle_contrast: Toggle high contrast.
5. adjust_font: Change font size. Params: size (\"sm\", \"base\", \"lg\")
6. logout: Logout user.
7. ask_ai: The user is asking a question or wanting to learn about something. Params: query (the question/topic)
8. submit: Submit a form or quiz.
9. unknown: Command not recognized.

Return ONLY a JSON object:
{{\"intent\": \"intent_name\", \"params\": {{ \"param_name\": \"value\" }}, \"feedback\": \"A short confirmation message in {language}\"}}

Output JSON ONLY."""

    try:
        from services.groq_service import client
    except ImportError:
        from groq_service import client

    chat = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        response_format={ "type": "json_object" }
    )
    
    try:
        return json.loads(chat.choices[0].message.content)
    except Exception as e:
        print(f"Error parsing voice command: {e}")
        return {"intent": "unknown", "feedback": "I didn't quite catch that."}
