import { Activity, ChevronDown, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";

export function LevelSwitcher() {
  const { t } = useTranslation();
  const { user, token, level, updateSettings } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const levels = [
    { code: "Beginner", label: t('beginner', 'Beginner') },
    { code: "Intermediate", label: t('intermediate', 'Intermediate') },
    { code: "Advanced", label: t('advanced', 'Advanced') },
  ];

  const handleLevelChange = async (levelCode) => {
    updateSettings(null, levelCode);
    setIsOpen(false);
    
    if (user && token) {
      try {
        await API.post("/auth/update-profile", {
          email: user,
          level: levelCode
        });
      } catch (err) {
        console.error("Failed to sync level to backend");
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

  const currentLevel = levels.find(l => l.code === (level || "Beginner"));

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 hover:bg-zinc-800/80 border border-zinc-700/50 hover:border-emerald-500/50 rounded-full transition-all duration-300 text-sm font-medium text-zinc-300 group shadow-lg"
      >
        <Activity size={16} className={`text-emerald-500 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} />
        <span className="inline-block font-mono tracking-tight">{currentLevel?.label}</span>
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-48 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200 origin-top-right">
          <div className="py-2">
            {levels.map((lvl) => (
              <button
                key={lvl.code}
                onClick={() => handleLevelChange(lvl.code)}
                className={`w-full flex items-center justify-between px-5 py-3 text-sm transition-all hover:bg-emerald-500/10 group ${
                  level === lvl.code ? 'text-emerald-500 bg-emerald-500/5' : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                <div className="flex flex-col items-start">
                  <span className="font-bold tracking-tight">{lvl.label}</span>
                </div>
                {level === lvl.code && <Check size={16} className="text-emerald-500" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
