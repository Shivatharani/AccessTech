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

    prompt = f"""
You are PathPilot, an expert AI career mentor.
User goal: {goal}
User level: {level}
Language: {language}

Generate a comprehensive, highly structured career guide.
You MUST respond ONLY with a valid JSON object. Do not include any markdown formatting, code blocks like ```json, or conversational text. Output raw JSON only.

Structure your JSON exactly like this:
{{
  "overview": {{
    "role": "What the job is",
    "daily_tasks": "What people in that role actually do daily",
    "industries": ["Industry 1", "Industry 2", "Industry 3"],
    "salary_range": "Typical global average salary range",
    "future_demand": "Future demand and growth outlook"
  }},
  "skills": {{
    "technical": ["Skill 1", "Skill 2"],
    "soft": ["Skill 1", "Skill 2"]
  }},
  "roadmap": [
    {{
      "phase": "Phase 1: Fundamentals",
      "description": "What to learn here in detail",
      "time_estimate": "e.g., 2-4 weeks"
    }},
    {{
      "phase": "Phase 2: Core Skills",
      "description": "...",
      "time_estimate": "..."
    }}
  ],
  "learning_resources": {{
    "youtube": [
      {{"name": "Channel Name", "link": "https://youtube.com/..."}}
    ],
    "free_courses": [
      {{"name": "Course Name", "link": "https://..."}}
    ],
    "paid_courses": [
      {{"name": "Course Name", "link": "https://..."}}
    ],
    "books": ["Book 1", "Book 2"],
    "practice_websites": [
      {{"name": "Site Name", "link": "https://..."}}
    ]
  }},
  "projects": [
    {{"level": "Beginner", "name": "Project Name", "description": "What to build and why"}}
  ],
  "certifications": [
    {{"name": "Cert Name", "link": "https://..."}}
  ],
  "job_preparation": {{
    "resume_tips": ["Tip 1", "Tip 2"],
    "portfolio_tips": ["Tip 1"],
    "interview_prep": ["Tip 1"]
  }},
  "job_roles": ["Role 1", "Role 2"],
  "industry_trends": {{
    "trending_tools": ["Tool 1"],
    "new_technologies": ["Tech 1"],
    "market_demand": "Description of current market"
  }},
  "motivation": "A highly encouraging, personalized message to keep the user motivated."
}}

Use real, accurate URLs for resources and certifications if possible (e.g., Coursera, Udemy, YouTube channels).
Make the content empowering, clear, and perfectly tailored for a {level} learner.
Respond ONLY with the JSON object.
"""

    chat = client.chat.completions.create(
        model="llama-3.1-8b-instant",
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
You are TermCrystal, an expert at explaining complex technical terms clearly.
Generate a structured explanation for the term '{term}' in {language} for a {level} user.

Rules for Levels:
- Kid: Use simple 5-year-old language, playful emojis, and relatable analogies (toys, playground, etc.).
- Beginner: Simple language, avoid jargon, use clear real-world examples.
- Intermediate: Use technical context but explain core concepts, provide professional examples.
- Expert: Deep technical details, specific use cases in architecture/system design, technical nuance.

Return ONLY a valid JSON object with the following structure:
{{
  "term": "{term}",
  "pronunciation": "Phonetic pronunciation (e.g., /kən-trol-er/)",
  "definition": "Clear, concise definition",
  "visual_explanation": "A text-based description of what this looks like visually (e.g., 'Imagine a traffic light directing cars...')",
  "real_life_example": "A concrete real-world example",
  "analogy": "A relatable analogy to explain the concept",
  "where_used": "Common industries or technical areas where this is used",
  "related_terms": [
    {{"term": "Term 1", "def": "Short definition"}},
    {{"term": "Term 2", "def": "Short definition"}},
    {{"term": "Term 3", "def": "Short definition"}}
  ],
  "why_it_matters": "Why this concept is important to understand"
}}

Respond ONLY with raw JSON. No markdown, no code blocks.
"""
    chat = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"}
    )
    return chat.choices[0].message.content

# === NEW: SyntaxSage (Code Helper) ===
def generate_code_explanation(code, mode, query, language, level):
    prompt = f"""
You are SyntaxSage, a world-class AI code architect and mentor.
Analyze the following {mode} code snippet for a {level} user who speaks {language}.

User Question/Focus: {query or 'Provide a full 9-point intelligence analysis'}

Code:
{code}

You MUST return ONLY a valid JSON object with EXACTLY this structure:
{{
  "summary": "A high-level 2-sentence summary of what the code does",
  "intelligence": "Deep logic analysis: what is the core algorithm or pattern?",
  "line_by_line": [
    {{"line": 1, "code": "line of code", "explanation": "detailed explanation"}}
  ],
  "dry_run": "A step-by-step walkthrough of how the code executes with a sample input",
  "bugs": ["List any potential bugs, edge cases, or security risks"],
  "complexity": {{
    "time": "e.g., O(n)",
    "space": "e.g., O(1)",
    "explanation": "Brief reasoning for complexity"
  }},
  "improvements": ["List 2-3 ways to make this code more 'clean', efficient, or 'pythonic'"],
  "eli10": "Explain the concept like I'm 10 years old (use a non-tech analogy)",
  "equivalents": {{
    "python": "Equivalent Python code",
    "java": "Equivalent Java code",
    "c": "Equivalent C code"
  }}
}}

Respond ONLY with raw JSON. No markdown, no code blocks like ```json.
"""
    chat = client.chat.completions.create(
        model="llama-3.1-8b-instant",
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
