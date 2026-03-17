from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from database import fetch_data, insert_data, update_data
from services.groq_service import generate_content
from services.quiz_service import generate_quiz

router = APIRouter()


# -----------------------------
# Request Models
# -----------------------------
class AskRequest(BaseModel):
    email: str
    topic: str

class QuizRequest(BaseModel):
    topic: str
    language: str


class QuizSubmit(BaseModel):
    email: str
    topic: str
    score: int


# -----------------------------
# Ask AI Tutor
# -----------------------------
@router.post("/ask")
def ask_ai(data: AskRequest):

    users = fetch_data("users", "email", data.email)

    if not users:
        raise HTTPException(status_code=404, detail="User not found")

    user = users[0]

    language = user["language"]
    level = user["level"]

    ai_response = generate_content(
        topic=data.topic,
        language=language,
        level=level
    )

    # store history
    insert_data("history", {
        "email": data.email,
        "question": data.topic,
        "response": ai_response
    })

    # generate quiz
    quiz = generate_quiz(data.topic, language)

    # -----------------------------
    # Update Progress Table
    # -----------------------------

    progress = fetch_data("progress", "email", data.email)

    if progress:

        current_questions = progress[0]["total_questions"] + 1

        update_data(
            "progress",
            "email",
            data.email,
            {
                "total_questions": current_questions,
                "last_topic": data.topic,
                "current_level": level
            }
        )

    else:

        insert_data("progress", {
            "email": data.email,
            "total_questions": 1,
            "quiz_attempts": 0,
            "average_score": 0,
            "current_level": level,
            "last_topic": data.topic
        })

    return {
        "topic": data.topic,
        "language": language,
        "level": level,
        "response": ai_response
    }

# -----------------------------
# Generate Interactive Quiz
# -----------------------------
@router.post("/generate-quiz")
def get_quiz(data: QuizRequest):
    quiz_data = generate_quiz(data.topic, data.language)
    
    if not quiz_data:
        raise HTTPException(status_code=500, detail="Failed to generate quiz JSON from AI")
        
    return {"quiz": quiz_data}


# -----------------------------
# Submit Quiz
# -----------------------------
@router.post("/submit-quiz")
def submit_quiz(data: QuizSubmit):

    insert_data("quiz", {
        "email": data.email,
        "topic": data.topic,
        "score": data.score
    })

    return {
        "message": "Quiz stored successfully"
    }

# -----------------------------
# PathPilot (Career Mentor)
# -----------------------------
class MentorRequest(BaseModel):
    email: str
    goal: str

@router.post("/mentor")
def ask_mentor(data: MentorRequest):
    users = fetch_data("users", "email", data.email)
    if not users:
        raise HTTPException(status_code=404, detail="User not found")
    
    user = users[0]
    language = user.get("language", "English")
    level = user.get("level", "Beginner")

    from services.groq_service import generate_mentor_response
    ai_response = generate_mentor_response(
        goal=data.goal,
        language=language,
        level=level
    )

    insert_data("history", {
        "email": data.email,
        "question": f"Career Goal: {data.goal}",
        "response": ai_response
    })

    return {"response": ai_response}

# -----------------------------
# TermCrystal (Dictionary)
# -----------------------------
class DictionaryRequest(BaseModel):
    email: str
    term: str

@router.post("/dictionary")
def ask_dictionary(data: DictionaryRequest):
    users = fetch_data("users", "email", data.email)
    if not users:
        raise HTTPException(status_code=404, detail="User not found")
    
    user = users[0]
    language = user.get("language", "English")
    level = user.get("level", "Beginner")

    from services.groq_service import generate_dictionary
    ai_response = generate_dictionary(
        term=data.term,
        language=language,
        level=level
    )

    insert_data("history", {
        "email": data.email,
        "question": f"Term: {data.term}",
        "response": ai_response
    })

    return {"response": ai_response}

# -----------------------------
# SyntaxSage (Code Helper)
# -----------------------------
class CodeHelperRequest(BaseModel):
    email: str
    code_snippet: str
    mode: str
    query: str

@router.post("/codehelper")
def ask_code_helper(data: CodeHelperRequest):
    users = fetch_data("users", "email", data.email)
    if not users:
        raise HTTPException(status_code=404, detail="User not found")
    
    user = users[0]
    language = user.get("language", "English")
    level = user.get("level", "Beginner")

    from services.groq_service import generate_code_explanation
    ai_response = generate_code_explanation(
        code=data.code_snippet,
        mode=data.mode,
        query=data.query,
        language=language,
        level=level
    )

    insert_data("history", {
        "email": data.email,
        "question": f"Code ({data.mode}): {data.query[:50]}...",
        "response": ai_response
    })

    return {"response": ai_response}


# -----------------------------
# Get History
# -----------------------------
@router.get("/history")
def get_history(email: str):
    history = fetch_data("history", "email", email)
    return {"history": history}


