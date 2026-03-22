import { Globe, ChevronDown, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { user, token, language, updateSettings } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: "English", label: "English", native: "English" },
    { code: "Tamil", label: "Tamil", native: "தமிழ்" },
    { code: "Hindi", label: "Hindi", native: "हिंदी" },
    { code: "Telugu", label: "Telugu", native: "తెలుగు"  },
    { code: "Malayalam", label: "Malayalam", native: "മലയാളം" },
  ];

  const handleLanguageChange = async (langCode) => {
    updateSettings(langCode, null);
    setIsOpen(false);
    
    if (user && token) {
      try {
        await API.post("/auth/update-profile", {
          email: user,
          language: langCode
        });
      } catch (err) {
        console.error("Failed to sync language to backend");
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLang = languages.find(l => l.code === (language || "English"));

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 hover:bg-zinc-800/80 border border-zinc-700/50 hover:border-amber-500/50 rounded-full transition-all duration-300 text-sm font-medium text-zinc-300 group shadow-lg"
      >
        <Globe size={16} className={`text-amber-500 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} />
        <span className="hidden sm:inline-block font-mono tracking-tight">{currentLang?.native}</span>
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-48 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200 origin-top-right">
          <div className="py-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center justify-between px-5 py-3 text-sm transition-all hover:bg-amber-500/10 group ${
                  language === lang.code ? 'text-amber-500 bg-amber-500/5' : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                <div className="flex flex-col items-start">
                  <span className="font-bold tracking-tight">{lang.native}</span>
                  <span className="text-[10px] text-zinc-500 group-hover:text-zinc-400 font-mono uppercase">{lang.label}</span>
                </div>
                {language === lang.code && <Check size={16} className="text-amber-500" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
