import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { user, token, language, updateSettings } = useContext(AuthContext);

  const changeLanguage = async (e) => {
    const langStr = e.target.value;
    updateSettings(langStr, null);
    
    // Persist to backend if logged in
    if (user && token) {
      try {
        await API.post("/auth/update-profile", {
          email: user,
          language: langStr
        });
      } catch (err) {
        console.error("Failed to sync language to backend");
      }
    }
  };

  const getCurrentValue = () => {
    return language || "English";
  };

  return (
    <div className="flex relative items-center">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-indigo-500 dark:text-indigo-400">
        <Globe size={16} />
      </div>
      <select
        className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-indigo-100 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 text-gray-700 dark:text-gray-200 text-sm focus:ring-2 focus:ring-indigo-400 outline-none rounded-full py-1.5 pl-9 pr-6 transition-all appearance-none cursor-pointer font-medium shadow-sm hover:shadow"
        value={getCurrentValue()}
        onChange={changeLanguage}
      >
        <option value="English">English</option>
        <option value="Tamil">தமிழ்</option>
        <option value="Hindi">हिंदी</option>
      </select>
      {/* Custom arrow wrapper for the appearance-none select */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
}
