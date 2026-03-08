# AccessTech – Adaptive Multilingual AI Learning Platform (Backend)

This repository contains the **FastAPI backend** for the AccessTech platform.
The backend provides APIs for:

* User Authentication
* Google Login
* AI Tutor (multilingual)
* Quiz Generation
* Learning Progress Tracking
* Dashboard Analytics

The backend uses:

* **FastAPI** – API framework
* **Supabase** – Database
* **Groq AI** – AI tutor content generation

---

# Project Structure

```
backend/
│
├── routes/
│   ├── auth.py
│   ├── ai.py
│   └── dashboard.py
│
├── services/
│   ├── groq_service.py
│   └── quiz_service.py
│
├── utils/
│   └── auth_utils.py
│
├── database.py
├── oauth_google.py
├── main.py
├── requirements.txt
└── .env
```

---

# 1. Clone the Repository

```
git clone https://github.com/<your-team-repo>/accesstech.git
```

Navigate to backend folder:

```
cd accesstech/backend
```

---

# 2. Create Virtual Environment

Create environment:

```
python -m venv venv
```

Activate environment:

### Windows

```
venv\Scripts\activate
```

### Mac/Linux

```
source venv/bin/activate
```

---

# 3. Install Dependencies

Install required packages:

```
pip install -r requirements.txt
```

---

# 4. Create Environment Variables

Create a file:

```
.env
```

Add the following values:

```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key

GROQ_API_KEY=your_groq_api_key

JWT_SECRET=your_secret_key

GOOGLE_CLIENT_ID=your_google_client_id
```

---

# 5. Run the Backend Server

Start the FastAPI server:

```
uvicorn main:app --reload
```

Server will run at:

```
http://127.0.0.1:8000
```

Swagger documentation:

```
http://127.0.0.1:8000/docs
```

---

# 6. Database Tables (Supabase)

The project uses the following tables.

## users

Stores user profile.

| column   | description       |
| -------- | ----------------- |
| name     | user name         |
| email    | user email        |
| password | hashed password   |
| language | selected language |
| level    | learning level    |
| provider | manual/google     |

---

## history

Stores AI questions asked by user.

| column   |
| -------- |
| email    |
| question |
| response |

---

## login_activity

Tracks login history.

| column     |
| ---------- |
| email      |
| login_time |
| ip_address |
| device     |

---

## progress

Tracks learning progress.

| column          |
| --------------- |
| email           |
| total_questions |
| last_topic      |
| current_level   |
| average_score   |
| quiz_attempts   |

---

## quiz

Stores quiz results.

| column |
| ------ |
| email  |
| topic  |
| score  |

---

# 7. API Endpoints

## Signup

```
POST /auth/signup
```

Register a new user.

Example request:

```
{
"name":"Shiva",
"email":"shiva@gmail.com",
"password":"123456",
"language":"Tamil",
"level":"Beginner"
}
```

---

## Login

```
POST /auth/login
```

Authenticate user.

Example request:

```
{
"email":"shiva@gmail.com",
"password":"123456"
}
```

Stores login activity.

---

## Google Login

```
POST /auth/google-login
```

Login using Google account.

---

## Ask AI Tutor

```
POST /ai/ask
```

Request AI explanation for a topic.

Example request:

```
{
"email":"shiva@gmail.com",
"topic":"Machine Learning"
}
```

This API:

* generates AI explanation
* generates quiz
* stores history
* updates learning progress

---

## Submit Quiz

```
POST /ai/submit-quiz
```

Submit quiz results.

Example request:

```
{
"email":"shiva@gmail.com",
"topic":"Machine Learning",
"score":4
}
```

Stores quiz result.

---

## Dashboard Analytics

```
GET /dashboard/analytics
```

Example:

```
/dashboard/analytics?email=shiva@gmail.com
```

Returns:

* total questions asked
* login activity
* quiz performance
* history
* chart data

---

# 8. Testing APIs

Use **Postman** or **Swagger UI**.

Recommended order:

1. Signup
2. Login
3. Ask AI
4. Ask AI again
5. Submit Quiz
6. Dashboard Analytics

---

# 9. Tech Stack

Backend Framework: FastAPI
Database: Supabase
AI Model: Groq (Llama 3.1)
Authentication: JWT
API Testing: Postman

---

# 10. Future Development

Planned improvements:

* Adaptive learning level upgrade
* AI performance analytics
* Advanced dashboard charts
* Real Google OAuth login
* Frontend integration

---
