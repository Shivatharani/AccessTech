import { createContext, useState, useEffect } from "react";
import i18n from "../i18n";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(localStorage.getItem("email"));
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [language, setLanguage] = useState(localStorage.getItem("language") || "English");
  const [level, setLevel] = useState(localStorage.getItem("level") || "Beginner");

  useEffect(() => {
    // Sync i18n if language changes or on load
    const code = language === "Tamil" ? "ta" : language === "Hindi" ? "hi" : "en";
    const dyslexiaFont = language === "Tamil" ? "'Noto Sans Tamil'" : language === "Hindi" ? "'Noto Sans Devanagari'" : "'OpenDyslexic', 'Lexend'";
    
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
    setUser(email);
    setToken(accessToken);
  };

  const logout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  const updateSettings = (newLang, newLvl) => {
    if (newLang) setLanguage(newLang);
    if (newLvl) setLevel(newLvl);
  };

  return (
    <AuthContext.Provider value={{ user, token, language, level, login, logout, updateSettings }}>
      {children}
    </AuthContext.Provider>
  );
};