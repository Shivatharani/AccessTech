import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English translations
const en = {
  translation: {
    "welcome": "Welcome to AccessTech",
    "login": "Login",
    "signup": "Sign Up",
    "email": "Email Address",
    "password": "Password",
    "name": "Full Name",
    "confirm_password": "Confirm Password",
    "language": "Language",
    "level": "Level",
    "beginner": "Beginner",
    "intermediate": "Intermediate",
    "advanced": "Advanced",
    "submit": "Submit",
    "dont_have_account": "Don't have an account?",
    "already_have_account": "Already have an account?",
    "home": "Home",
    "dashboard": "Dashboard",
    "tutor": "AI Tutor",
    "logout": "Logout",
    "total_questions": "Total Questions",
    "total_logins": "Total Logins",
    "avg_quiz_score": "Avg Quiz Score",
    "ask_ai": "Ask AI",
    "enter_topic": "Enter topic",
    "explanation": "Explanation",
    "history": "History",
    "last_login": "Last Login",
    "features": "Features",
    "contact": "Contact Us",
    "hero_title": "Adaptive Multilingual AI Learning Platform",
    "hero_subtitle": "Learn anything in your native language with an intelligent tutor.",
    "get_started": "Get Started",
    "quiz": "Quiz",
    "submit_quiz": "Submit Quiz"
  }
};

// Tamil translations
const ta = {
  translation: {
    "welcome": "AccessTech-க்கு நல்வரவு",
    "login": "உள்நுழைக",
    "signup": "பதிவு செய்க",
    "email": "மின்னஞ்சல் முகவரி",
    "password": "கடவுச்சொல்",
    "name": "முழு பெயர்",
    "confirm_password": "கடவுச்சொல்லை உறுதிப்படுத்துக",
    "language": "மொழி",
    "level": "நிலை",
    "beginner": "ஆரம்ப நிலை",
    "intermediate": "இடைநிலை",
    "advanced": "மேம்பட்ட நிலை",
    "submit": "சமர்ப்பி",
    "dont_have_account": "கணக்கு இல்லையா?",
    "already_have_account": "ஏற்கனவே கணக்கு உள்ளதா?",
    "home": "முகப்பு",
    "dashboard": "கட்டுப்பாட்டு அறை",
    "tutor": "AI ஆசிரியர்",
    "logout": "வெளியேறு",
    "total_questions": "மொத்த கேள்விகள்",
    "total_logins": "மொத்த உள்நுழைவுகள்",
    "avg_quiz_score": "சராசரி வினாடி வினா மதிப்பெண்",
    "ask_ai": "AI-யிடம் கேள்",
    "enter_topic": "தலைப்பை உள்ளிடுக",
    "explanation": "விளக்கம்",
    "history": "வரலாறு",
    "last_login": "கடைசி உள்நுழைவு",
    "features": "அம்சங்கள்",
    "contact": "தொடர்புகொள்ள",
    "hero_title": "தகவமைக்கும் பன்மொழி AI கற்றல் தளம்",
    "hero_subtitle": "அறிவார்ந்த ஆசிரியருடன் உங்கள் தாய்மொழியில் எதையும் கற்றுக்கொள்ளுங்கள்.",
    "get_started": "தொடங்குங்கள்",
    "quiz": "வினாடி வினா",
    "submit_quiz": "சமர்ப்பி"
  }
};

// Hindi translations
const hi = {
  translation: {
    "welcome": "AccessTech में आपका स्वागत है",
    "login": "लॉग इन करें",
    "signup": "साइन अप करें",
    "email": "ईमेल पता",
    "password": "पासवर्ड",
    "name": "पूरा नाम",
    "confirm_password": "पासवर्ड की पुष्टि करें",
    "language": "भाषा",
    "level": "स्तर",
    "beginner": "शुरुआती",
    "intermediate": "मध्यवर्ती",
    "advanced": "उन्नत",
    "submit": "जमा करें",
    "dont_have_account": "क्या आपके पास खाता नहीं है?",
    "already_have_account": "क्या आपके पास पहले से खाता है?",
    "home": "होम",
    "dashboard": "डैशबोर्ड",
    "tutor": "AI शिक्षक",
    "logout": "लॉग आउट",
    "total_questions": "कुल प्रश्न",
    "total_logins": "कुल लॉगिन",
    "avg_quiz_score": "औसत क्विज़ स्कोर",
    "ask_ai": "AI से पूछें",
    "enter_topic": "विषय दर्ज करें",
    "explanation": "स्पष्टीकरण",
    "history": "इतिहास",
    "last_login": "अंतिम लॉगिन",
    "features": "विशेषताएं",
    "contact": "संपर्क करें",
    "hero_title": "अनुकूली बहुभाषी AI शिक्षण मंच",
    "hero_subtitle": "एक बुद्धिमान शिक्षक के साथ अपनी मातृभाषा में कुछ भी सीखें।",
    "get_started": "शुरू करें",
    "quiz": "प्रश्नोत्तरी",
    "submit_quiz": "जमा करें"
  }
};

const savedLanguage = localStorage.getItem("language") || "English";

const mapLangToCode = (lang) => {
  if (lang === "Tamil") return "ta";
  if (lang === "Hindi") return "hi";
  return "en";
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: en,
      ta: ta,
      hi: hi
    },
    lng: mapLangToCode(savedLanguage), 
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, 
    }
  });

export default i18n;
