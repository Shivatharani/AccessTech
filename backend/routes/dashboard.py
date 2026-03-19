from fastapi import APIRouter
from database import fetch_data

router = APIRouter()


@router.get("/analytics")

def dashboard(email: str):

    history = fetch_data("history", "email", email)
    logins = fetch_data("login_activity", "email", email)
    quiz = fetch_data("quiz", "email", email)

    total_questions = len(history)
    total_logins = len(logins)

    quiz_scores = [q["score"] for q in quiz if "score" in q]
    quiz_trend = [{"name": f"Quiz {i+1}", "score": q["score"]} for i, q in enumerate(quiz) if "score" in q]

    avg_score = sum(quiz_scores)/len(quiz_scores) if quiz_scores else 0

    return {
        "total_questions": total_questions,
        "total_logins": total_logins,
        "avg_quiz_score": avg_score,
        "module_usage": {
            "Tutor": sum(1 for h in history if h.get("question", "").startswith("Tutor:")),
            "Mentor": sum(1 for h in history if h.get("question", "").startswith("Mentor:")),
            "Dictionary": sum(1 for h in history if h.get("question", "").startswith("Dictionary:")),
            "SyntaxSage": sum(1 for h in history if h.get("question", "").startswith("Code (")),
        },
        "history": history,
        "login_activity": logins,
        "charts": {
            "quiz_trend": quiz_trend
        }
    }