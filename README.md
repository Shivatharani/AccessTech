# AccessTech

AccessTech is an AI-powered multilingual learning platform. It transforms natural language prompts into personalized tutoring sessions and dynamic, interactive quizzes using LLaMa-3.1 via Groq. Designed with a clean aesthetic, AccessTech supports multi-language capabilities, a robust global Dark Mode, and deep user analytics.

## Features

### 1. AI-Powered Tutor and Quiz Engine
- **Personalized Tutor:** Ask any educational topic, and the Groq LLM synthesizes detailed, engaging explanations.
- **Dynamic Interactive Quizzes:** Convert any topic into a 10-question multiple-choice quiz. The AI returns strictly structured JSON objects to feed a UI that tracks, validates, and stores scores.

### 2. Global Multilingual Support
- Native support for English, Tamil, and Hindi.
- Users select their language and proficiency tier (Beginner, Intermediate, Advanced) upon Authentication, and the AI actively teaches them in their chosen dialect.

### 3. Deep Analytics Dashboard
- Visualized data using Recharts.
- AreaChart maps quiz score trendlines over time.
- BarChart evaluates discrete engagement metrics.
- Standardized UTC/Local Timezone conversion tracks precise login times backed by Supabase logging.

### 4. UI/UX and Native Dark Mode
- Built on Tailwind CSS, enhanced with Shadcn UI components and localized Sonner toast notifications.
- Explicit Tailwind dark classes implemented across the entire application, allowing seamless toggling.

### 5. Authentication Ecosystem
- Custom JWT-based Email/Password Registration.
- Native Google Workspace OAuth Integration. Securely binds federated Gmail tokens to map user history and preferences.

---

## Technology Stack

**Frontend Framework:**
- React (Vite)
- Tailwind CSS
- React Router DOM
- Radix UI / Shadcn
- Recharts (Data Visualization)
- react-i18next (Multilingual)
- next-themes (Dark Mode)

**Backend Architecture:**
- Python FastAPI
- Pydantic (Data Validation)
- Groq SDK (AI Interfacing)
- Google OAuth2 (Token Parsing verification)
- Passlib (Bcrypt Password Hashing)
- PyJWT (Token formulation)

**Database / Storage:**
- Supabase (PostgreSQL)

---

## Running the Application

Both the Frontend and Backend are decoupled servers. You must have both running simultaneously.

### 1. Environment Setup
You will need a `.env` file in the **backend/** directory containing your API Secrets:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_signature_secret
GROQ_API_KEY=your_groq_llama_key
GOOGLE_CLIENT_ID=your_oauth_client_id
```

### 2. Backend Initialization (FastAPI)
```bash
# Navigate to the backend directory
cd backend

# Create and activate your virtual environment (if not already done)
python -m venv venv
# On Windows
venv\Scripts\activate
# On Mac/Linux
source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Boot the API server (Hot-reload enabled)
uvicorn main:app --reload
```
The server will run on http://127.0.0.1:8000.

### 3. Frontend Initialization (React / Vite)
```bash
# Navigate to the frontend directory
cd frontend

# Install NodeJS dependencies
npm install

# Start the Vite development server
npm run dev
```
The webapp will typically run on http://localhost:5173.

---

## Project Architecture Overview

### Frontend Structure
- **components:** Generic building blocks (Navbar, ThemeToggle).
- **pages:** Dedicated views (Home, Login, Signup, Tutor, Quiz, Dashboard).
- **services:** The unified Axios wrapper pointing to the backend API.
- **i18n.js:** The core translation dictionary bridging UI text to English, Tamil, and Hindi.

### Backend Structure
- **main.py:** The FastAPI entry point booting CORS configurations and the Router inclusions.
- **routes:** Feature-segregated API channels (Authentication, AI logic, Dashboard aggregation).
- **services:** Core logic scripts (e.g., controlling the LLaMa-3 prompt behaviors to coerce strictly formatted JSON quiz models).
- **database.py:** The dedicated Supabase Python Client controller enabling direct select and insert data fetching.

---

## API Endpoints

The FastAPI backend securely exposes the following routes for client interaction:

### Authentication (/auth)
- **POST `/auth/signup`**
  Registers a new local user into the database.
  - Requires: `name`, `email`, `password`, `confirm_password`, `language`, `level`.
- **POST `/auth/login`**
  Authenticates an existing user and returns a secure JWT.
  - Requires: `email`, `password`.
- **POST `/auth/google-login`**
  Validates a Google OAuth JWT token to log the user in.
  - Requires: `token`.

### AI Core (/ai)
- **POST `/ai/ask`**
  Generates a specific Tutor response and tracks history.
  - Requires: `email`, `topic`.
- **POST `/ai/generate-quiz`**
  Forces LLaMa-3 to return a strictly formulated 10-Question JSON object.
  - Requires: `topic`, `language`.
- **POST `/ai/submit-quiz`**
  Commits an interactive quiz score to the database.
  - Requires: `email`, `topic`, `score`.
- **GET `/ai/history?email=`**
  Retrieves all previously generated Tutor sessions for the user.
  - Requires: The `email` as a URL Query Parameter.

### Analytics Dashboard (/dashboard)
- **GET `/dashboard/analytics?email=`**
  Aggregates user metrics (scores, logins, history) for Recharts UI rendering.
  - Requires: The `email` as a URL Query Parameter.
