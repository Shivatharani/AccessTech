import { createContext, useState, useEffect } from "react";
import i18n from "../i18n";

export const AuthContext = createContext();

const isTokenValid = (token) => {
  if (!token || token === "null" || token === "undefined") return false;
  try {
    const parts = token.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(atob(parts[1]));
      if (payload.exp && (payload.exp * 1000) < Date.now()) {
        return false;
      }
    }
  } catch(e) {
    // Ignore parse errors, fallback to true
  }
  return true;
};

export const AuthProvider = ({ children }) => {

  const initialToken = localStorage.getItem("token");
  const validToken = isTokenValid(initialToken) ? initialToken : null;
  
  if (!validToken && initialToken) {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
  }

  const [user, setUser] = useState(validToken ? localStorage.getItem("email") : null);
  const [rawName, setRawName] = useState(validToken ? localStorage.getItem("name") : null);

  // Auto-capitalize the first letter
  const username = rawName 
    ? rawName.charAt(0).toUpperCase() + rawName.slice(1) 
    : (user ? user.split('@')[0].charAt(0).toUpperCase() + user.split('@')[0].slice(1) : "User");

  const [token, setToken] = useState(validToken);
  const [language, setLanguage] = useState(localStorage.getItem("language") || "English");
  const [level, setLevel] = useState(localStorage.getItem("level") || "Beginner");

  useEffect(() => {
    // Sync i18n if language changes or on load
    const langMap = {
    Tamil:     { code: "ta", font: "'Noto Sans Tamil'"       },
    Hindi:     { code: "hi", font: "'Noto Sans Devanagari'"  },
    Telugu:    { code: "te", font: "'Noto Sans Telugu'"      },
    Malayalam: { code: "ml", font: "'Noto Sans Malayalam'"   },
  };
  const { code = "en", font = "'OpenDyslexic', 'Lexend'" } = langMap[language] || {};
  const dyslexiaFont = font;
  
    if (i18n.language !== code) {
      i18n.changeLanguage(code);
    }
    
    document.documentElement.lang = code;
    document.body.style.setProperty('--dyslexia-font', dyslexiaFont);
    localStorage.setItem("language", language);
  }, [language]);

  const login = (email, accessToken, lang, lvl) => {
    localStorage.setItem("email", email);
    localStorage.setItem("token", accessToken);
    if (lang) {
      localStorage.setItem("language", lang);
      setLanguage(lang);
    }
    if (lvl) {
      localStorage.setItem("level", lvl);
      setLevel(lvl);
    }
    
    // Fallback if name isn't provided (legacy)
    const finalName = name || email.split('@')[0];
    localStorage.setItem("name", finalName);
    setRawName(finalName);

    setUser(email);
    setToken(accessToken);
  };

  const logout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    setUser(null);
    setRawName(null);
    setToken(null);
  };

  const updateSettings = (newLang, newLvl) => {
    if (newLang) setLanguage(newLang);
    if (newLvl) {
      localStorage.setItem("level", newLvl);
      setLevel(newLvl);
    }
  };

  return (
    <AuthContext.Provider value={{ user, username, token, language, level, login, logout, updateSettings }}>
      {children}
    </AuthContext.Provider>
  );
};