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
        "response": ai_response,
        "quiz": quiz
    }


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