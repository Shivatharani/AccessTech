from fastapi import APIRouter
from database import fetch_data
from services.groq_service import generate_dashboard_insight
import json
from datetime import datetime, date, timedelta
from collections import Counter

router = APIRouter()

def calculate_streak(history, logins):
    all_dates = set()
    for h in history:
        if "created_at" in h:
            try:
                # Handle possible Z or missing Z in timestamps
                clean_ts = h["created_at"].replace("Z", "").split(".")[0]
                all_dates.add(datetime.fromisoformat(clean_ts).date())
            except: pass
    for l in logins:
        if "login_time" in l:
            try:
                clean_ts = l["login_time"].replace("Z", "").split(".")[0]
                all_dates.add(datetime.fromisoformat(clean_ts).date())
            except: pass
    
    if not all_dates: return 0, [False]*7
    
    sorted_dates = sorted(list(all_dates), reverse=True)
    today = date.today()
    
    # Check if last activity was today or yesterday to continue streak
    if sorted_dates[0] < today - timedelta(days=1):
        streak = 0
    else:
        streak = 1
        for i in range(len(sorted_dates)-1):
            if (sorted_dates[i] - sorted_dates[i+1]).days == 1:
                streak += 1
            else:
                break
    
    # Weekly streak bits (Mon-Sun for current week)
    monday = today - timedelta(days=today.weekday())
    weekly = []
    for i in range(7):
        d = monday + timedelta(days=i)
        weekly.append(d in all_dates)
        
    return streak, weekly

@router.get("/analytics")
def dashboard(email: str):
    history = fetch_data("history", "email", email)
    logins = fetch_data("login_activity", "email", email)
    quiz = fetch_data("quiz", "email", email)
    users = fetch_data("users", "email", email)
    
    user_lang = users[0].get("language", "English") if users else "English"

    # 1. Base Stats
    total_questions = len(history)
    quiz_scores = [q["score"] for q in quiz if "score" in q]
    avg_score = sum(quiz_scores)/len(quiz_scores) if quiz_scores else 0

    # 2. Module Counts
    mentor_sessions = sum(1 for h in history if h.get("question", "").startswith("Mentor:"))
    dict_sessions = sum(1 for h in history if h.get("question", "").startswith("Dictionary:"))
    code_sessions = sum(1 for h in history if h.get("question", "").startswith("Code ("))
    tutor_sessions = sum(1 for h in history if h.get("question", "").startswith("Tutor:"))
    
    # "Concepts Learned" count from unique dictionary/tutor terms
    concepts_learned = sum(1 for h in history if "Dictionary:" in h.get("question", ""))

    # 3. Streak and Habit Tracking
    current_streak, weekly_streak = calculate_streak(history, logins)

    # 4. PathPilot Domain Progress (Stages: Apprentice, Intermediate, Advanced, Master)
    domain_map = {}
    for h in history:
        q = h.get("question", "")
        if q.startswith("Mentor:"):
            goal = q.split("Mentor: ")[1] if ": " in q else q
            if goal not in domain_map:
                domain_map[goal] = {"sessions": 0, "last_active": "", "milestones": []}
            domain_map[goal]["sessions"] += 1
            domain_map[goal]["last_active"] = h.get("created_at", "")
            
            # Simple Milestone Tracking
            if domain_map[goal]["sessions"] == 1: domain_map[goal]["milestones"].append("Goal Set")
            if domain_map[goal]["sessions"] == 5: domain_map[goal]["milestones"].append("Roadmap Created")
            if domain_map[goal]["sessions"] == 10: domain_map[goal]["milestones"].append("Advanced Mastery")
    
    domain_progress = []
    for goal, data in domain_map.items():
        prog = min(data["sessions"] * 10, 100) # 10 sessions = Master
        
        # Stage Logic: Apprentice (0-20), Intermediate (21-50), Advanced (51-80), Master (81-100)
        if prog >= 81: stage = "Master"
        elif prog >= 51: stage = "Advanced"
        elif prog >= 21: stage = "Intermediate"
        else: stage = "Beginner"
        
        domain_progress.append({
            "domain": goal,
            "progress": prog,
            "stage": stage,
            "sessions": data["sessions"],
            "last_active": data["last_active"],
            "milestones": data["milestones"]
        })
    
    # 5. Skill Radar
    skill_radar = [
        {"subject": "Tutoring", "A": min(tutor_sessions * 10, 100)},
        {"subject": "Career", "A": min(mentor_sessions * 20, 100)},
        {"subject": "Vocabulary", "A": min(dict_sessions * 15, 100)},
        {"subject": "Code", "A": min(code_sessions * 15, 100)},
        {"subject": "Assessment", "A": min(len(quiz) * 10, 100)},
    ]

    # 6. Subject Performance (Bar Chart)
    topic_scores = Counter()
    topic_counts = Counter()
    for q in quiz:
        t = q.get("topic", "General")
        topic_scores[t] += q.get("score", 0)
        topic_counts[t] += 1
    
    subject_perf = [
        {"subject": t, "score": round(topic_scores[t]/topic_counts[t], 1) if topic_counts[t] > 0 else 0} 
        for t in topic_scores
    ]

    # 7. Timeline (Overall Progress)
    timeline = []
    for h in history[-8:]:
        timeline.append({
            "event": h.get("question", "").split(":")[0] if ":" in h.get("question", "") else "Action",
            "details": h.get("question", "").split(":")[1] if ":" in h.get("question", "") else h.get("question", ""),
            "time": h.get("created_at", "")
        })
    timeline.reverse()

    # 8. AI Insight & Recommendations
    stats_summary = f"Total Interactions: {total_questions}, Streak: {current_streak} days, Career domains: {len(domain_progress)}."
    try:
        ai_raw = generate_dashboard_insight(stats_summary, user_lang)
        ai_json = json.loads(ai_raw)
        ai_insight = ai_json.get("insight", "Your learning journey is accelerating! Focus on your career milestones today.")
        recommendations = ai_json.get("recommendations", ["Take a quiz on recent code snippets", "Explore deeper mentorship paths"])
    except:
        ai_insight = "Continue your modules to unlock AI-powered insights!"
        recommendations = ["Complete a tutoring session", "Update your career goal"]

    # 9. Career Progress % (Overall average of all domains)
    overall_career_prog = sum(d["progress"] for d in domain_progress) / len(domain_progress) if domain_progress else 0

    return {
        "total_questions": total_questions,
        "career_progress_total": round(overall_career_prog, 1),
        "concepts_learned": concepts_learned,
        "code_analyses": code_sessions,
        "avg_quiz_score": avg_score,
        "current_streak": current_streak,
        "weekly_streak": weekly_streak,
        "domain_progress": domain_progress,
        "module_usage": {
            "Tutor": tutor_sessions,
            "Mentor": mentor_sessions,
            "Dictionary": dict_sessions,
            "SyntaxSage": code_sessions,
        },
        "charts": {
            "quiz_trend": [{"name": f"Q{i+1}", "score": q["score"]} for i, q in enumerate(quiz) if "score" in q],
            "skill_radar": skill_radar,
            "subject_perf": subject_perf,
        },
        "timeline": timeline,
        "ai_insight": ai_insight,
        "recommendations": recommendations,
        "login_activity": logins
    }