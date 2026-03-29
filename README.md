# AccessTech: The AI Intelligence Learning Ecosystem

AccessTech is a state-of-the-art, AI-powered multilingual learning platform designed to make education accessible, personalized, and engaging. By leveraging **LLaMa-3.1 via Groq**, AccessTech transforms static learning into a dynamic, interactive experience.

Whether you're looking for a personal tutor, a career mentor, a technical dictionary, or a code analyzer, AccessTech provides a unified suite of tools tailored to your proficiency level and native language.

---

## 🚀 Core Modules

### 1. LearnLift AI (AI Teacher)
Your 24/7 personal instructor.
- **Adaptive Lessons:** Explanations that adjust based on your level (Beginner, Intermediate, Advanced).
- **Multimodal Input:** Type your questions or upload/capture images of textbooks for instant analysis.
- **Voice Support:** Interactive learning with integrated speech recognition and text-to-speech.

### 2. PathSync (Career Mentor)
Your navigation co-pilot for professional growth.
- **Career Roadmaps:** Generates step-by-step paths to your dream career.
- **Skill Identification:** Identifies critical technical and soft skills required for specific roles.
- **Milestone Tracking:** Interactive roadmaps that track your progress from Apprentice to Master.

### 3. TermSync (Adaptive Dictionary)
Crystallizing complex concepts into clear definitions.
- **Dynamic Complexity:** Definitions that scale—from simple analogies for children to technical precision for experts.
- **Contextual Learning:** Includes "The Big Idea," "Real-Life Examples," and "Why It Matters."

### 4. CodeLift AI (Code Intelligence)
Wise, line-by-line code wisdom for developers.
- **Logical Breakdown:** Deep analysis of code snippets with logical explanations.
- **Vulnerability Detection:** Identifies potential bugs and security gaps.
- **Optimization Log:** Suggests architectural improvements and algorithmic efficiencies.

### 5. SkillCheck (Interactive Knowledge Mastery)
Dynamic assessments for any topic.
- **AI-Generated Quizzes:** Instantly creates 10-question MCQ quizzes based on any subject.
- **ProgressHub Integration:** Records results instantly for behavioral and skill intelligence analysis.

---

## 🛠️ Technology Stack

### Frontend Architecture
- **Framework:** React (Vite)
- **Styling:** Tailwind CSS & Shadcn UI
- **State & Routing:** React Router DOM
- **Visualization:** Recharts (Dynamic Analytics)
- **Internationalization:** `react-i18next` (English, Tamil, Hindi support)
- **Theming:** `next-themes` (Seamless Dark/Light Mode)
- **Notifications:** Sonner Toast Notifications

### Backend Architecture
- **Framework:** Python FastAPI
- **AI Engine:** Groq SDK (LLaMa-3.1 Models)
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Custom JWT & Google OAuth2 Integration
- **PDF Engine:** `fpdf2` & `uharfbuzz` (Professionally rendered multilingual documents)
- **Email Service:** SMTP Integration for support forms

---

## 📊 Omni-ProgressHub & Analytics
The AccessTech ProgressHub is designed as an AI-powered Learning Command Center that unifies insights from all core modules—LearnLift AI, PathSync, TermSync, and CodeLift AI—into a single intelligent interface. It features top-level summary cards displaying total questions, career progress, concepts learned, and code analyses, along with an AI-generated insight highlighting user strengths and weaknesses. The ProgressHub includes advanced visualizations such as a unified activity heatmap (module-wise engagement), module usage distribution (donut chart), quiz performance trends (area chart), skill analysis (radar chart), and a learning journey timeline showing career progression. Additionally, it incorporates a comparative performance bar chart to analyze strengths across different subjects and a weekly consistency tracker to monitor learning habits over time. A smart recommendation panel suggests personalized next steps based on user performance and engagement patterns. The design follows a clean, professional UI with light pale colors, ensuring accessibility and clarity, transforming the ProgressHub into a personalized AI-driven learning intelligence hub.

---

## 📡 API Documentation

### Authentication (`/auth`)
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/auth/signup` | POST | Register new user with language/level preferences. |
| `/auth/login` | POST | Authenticate and receive a secure JWT. |
| `/auth/google-login` | POST | Federated authentication via Google OAuth. |
| `/auth/update-profile`| POST | Update user language, proficiency, or accessibility settings. |

### AI Intelligence Core (`/ai`)
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/ai/ask` | POST | High-level tutoring with multimodal (image) support. |
| `/ai/mentor` | POST | Generate personalized career roadmaps (PathSync). |
| `/ai/dictionary` | POST | Fetch adaptive technical definitions (TermSync). |
| `/ai/codehelper` | POST | Analyze code snippets line-by-line (CodeLift AI). |
| `/ai/generate-quiz` | POST | Create dynamic 10-question JSON quizzes. |
| `/ai/submit-quiz` | POST | Record quiz scores for analytics. |
| `/ai/download-pdf` | POST | Generate professional lesson PDFs with Indic script support. |
| `/ai/history` | GET | Retrieve user-specific interaction history. |

### Analytics (`/dashboard`)
- **GET `/dashboard/analytics?email={user_email}`**
  Aggregates total questions, logins, average scores, and module usage for UI rendering.

### Communication (`/contact`)
- **POST `/contact`**
  Handles support requests and sends email notifications.

---

## ⚙️ Installation & Setup

### 1. Environment Configuration
Create a `.env` in the `backend/` directory:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_signature_secret
GROQ_API_KEY=your_groq_llama_key
GOOGLE_CLIENT_ID=your_oauth_client_id

# SMTP for Contact Form
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password
CONTACT_RECEIVER_EMAIL=support@accesstech.ai
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🚀 Deployment

### Frontend (Vercel)
The frontend is optimized for deployment on Vercel:
1. Push your code to GitHub.
2. In Vercel, create a new project and import your repository.
3. Set the Framework Preset to **Vite**.
4. The Build Command should be `npm run build` and Output Directory `dist`.
5. Deploy!

### Backend (Render / Railway / Heroku)
1. Ensure `requirements.txt` is updated.
2. Set the `Start Command` to `uvicorn main:app --host 0.0.0.0 --port $PORT`.
3. Add your `.env` variables in the deployment dashboard.

---

## ⚖️ Accessibility Commitment
AccessTech is built on the principle that knowledge belongs to everyone. Our **Accessibility Panel** allows users to toggle:
- **Dyslexia Friendly Fonts** (OpenDyslexic)
- **High Contrast Modes**
- **Dynamic Text Scaling**
- **Simplified UI Overlays**

---
© 2026 AccessTech Intelligence Hub • Empowering Every Mind.

