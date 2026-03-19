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
Output only in {language}. IGNORE the language of the user's question; always respond ONLY in {language}. Keep it encouraging and human-centric."""

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
Output only in {language}. IGNORE the language of the user's input; ALWAYS respond ONLY in {language}. Keep it encouraging and human-centric."""
        chat = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}]
        )
    return chat.choices[0].message.content

# === NEW: PathPilot (Career Mentor) ===
def generate_mentor_response(goal, language, level):

    prompt = f"""
You are PathPilot, an expert AI career mentor.
Goal: {goal} | Level: {level}
EVERY SINGLE WORD in your response MUST be in {language}.

You MUST return ONLY a valid JSON object with EXACTLY this structure:
{{
  "overview": {{
    "role": "Role in {language}",
    "daily_tasks": "Tasks in {language}",
    "industries": ["Industries in {language}"],
    "salary_range": "Salary in {language}",
    "future_demand": "Outlook in {language}"
  }},
  "skills": {{
    "technical": ["Technical in {language}"],
    "soft": ["Soft in {language}"]
  }},
  "roadmap": [
    {{"phase": "Phase in {language}", "description": "Details in {language}", "time_estimate": "Time in {language}"}}
  ],
  "learning_resources": {{
    "youtube": [{{"name": "Name", "link": "URL"}}],
    "free_courses": [{{"name": "Name", "link": "URL"}}],
    "paid_courses": [{{"name": "Name", "link": "URL"}}],
    "books": ["Books in {language}"],
    "practice_websites": [{{"name": "Name", "link": "URL"}}]
  }},
  "projects": [{{"level": "Level", "name": "Name", "description": "Description in {language}"}}],
  "certifications": [{{"name": "Name", "link": "URL"}}],
  "job_preparation": {{
    "resume_tips": ["Tips in {language}"],
    "portfolio_tips": ["Tips in {language}"],
    "interview_prep": ["Tips in {language}"]
  }},
  "job_roles": ["Roles in {language}"],
  "industry_trends": {{
    "trending_tools": ["Tools in {language}"],
    "new_technologies": ["Tech in {language}"],
    "market_demand": "Market in {language}"
  }},
  "motivation": "Message in {language}"
}}

CRITICAL: Output ONLY valid JSON. Use double quotes. Strictly use {language}.
"""

    chat = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"}
    )

    return chat.choices[0].message.content


def generate_roadmap(goal):

    prompt = f"""
Create a visual roadmap for becoming a {goal}.

Return in this format:

Phase 1: Fundamentals
Phase 2: Core Skills
Phase 3: Advanced Tools
Phase 4: Projects
Phase 5: Job Preparation

Each phase should include:
- skills to learn
- estimated time
"""

    chat = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}]
    )

    return chat.choices[0].message.content


# === NEW: TermCrystal (Dictionary) ===
def generate_dictionary(term, language, level):
    prompt = f"""
You are TermCrystal, a helpful AI definer.
Explain '{term}' strictly in {language} for a {level} user.
ONLY return a valid JSON:
{{
  "term": "{term}",
  "pronunciation": "Pronunciation in {language}",
  "definition": "Definition in {language}",
  "real_life_example": "Example in {language}",
  "analogy": "Analogy in {language}",
  "where_used": "Industries in {language}",
  "related_terms": [
    {{"term": "T1", "def": "D1 in {language}"}},
    {{"term": "T2", "def": "D2 in {language}"}}
  ],
  "why_it_matters": "Why in {language}"
}}
CRITICAL: Output JSON ONLY. No markdown. Translate everything to {language}.
"""
    chat = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"}
    )
    return chat.choices[0].message.content

# === NEW: SyntaxSage (Code Helper) ===
def generate_code_explanation(code, mode, query, language, level):
    prompt = f"""
You are SyntaxSage. Analyze this code strictly in {language} for a {level} user.
ONLY return a valid JSON:
{{
  "summary": "Summary in {language}",
  "intelligence": "Logic in {language}",
  "line_by_line": [
    {{"line": 1, "code": "code", "explanation": "explanation in {language}"}}
  ],
  "dry_run": "Walkthrough in {language}",
  "bugs": ["Bugs in {language}"],
  "equivalents": {{
    "python": "Code",
    "java": "Code",
    "c": "Code"
  }}
}}
CRITICAL: Output JSON ONLY. No markdown. Translate everything to {language}.
Code: {code}
Query: {query or 'Full analysis'}
"""
    chat = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"}
    )
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


def analyze_skill_gap(resume_text, target_role):

    prompt = f"""
You are an AI career analyzer.

Target Role: {target_role}

User Resume:
{resume_text}

Analyze and produce:

1. Skills the user already has
2. Missing critical skills
3. Recommended learning order
4. Estimated time to become job-ready

Format clearly with bullet points.
"""

    chat = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}]
    )

    return chat.choices[0].message.content
