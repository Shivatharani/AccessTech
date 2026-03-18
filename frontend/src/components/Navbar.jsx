import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { BookOpen, LogOut, Code2, Map, Sparkles } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";

export default function Navbar() {

  const { t } = useTranslation()
  const nav = useNavigate()
  const { logout } = useContext(AuthContext)

  const handleLogout = () => {
    logout()
    nav("/login")
  }

  return (
    <div className="flex justify-between items-center bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-100 px-6 lg:px-12 py-4 shadow-sm sticky top-0 z-50 transition-colors duration-300">
      <Link to="/dashboard" className="flex items-center gap-3 text-indigo-700 dark:text-indigo-400 font-extrabold text-2xl tracking-tight hover:opacity-80 transition-opacity">
        <img src="/logo.png" alt="AccessTech Logo" className="h-10 w-10 object-contain drop-shadow-md" />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-600 dark:from-indigo-400 dark:to-purple-400 hidden sm:inline-block">AccessTech</span>
      </Link>

      <div className="flex items-center space-x-4 lg:space-x-6 text-sm font-medium">
        <Link to="/dashboard" className="hidden md:block hover:text-indigo-600 transition-colors">{t('dashboard')}</Link>
        <Link to="/tutor" className="hidden lg:flex items-center gap-1 hover:text-indigo-600 transition-colors"><span className="text-xl">✨</span> <span className="hidden xl:block">{t('luminatutor')}</span></Link>
        <Link to="/mentor" className="hidden lg:flex items-center gap-1 hover:text-sky-600 transition-colors"><Map size={16} className="text-sky-500" /> <span className="hidden xl:block">{t('pathpilot')}</span></Link>
        <Link to="/dictionary" className="hidden lg:flex items-center gap-1 hover:text-emerald-600 transition-colors"><Sparkles size={16} className="text-emerald-500" /> <span className="hidden xl:block">{t('termcrystal')}</span></Link>
        <Link to="/codehelper" className="hidden lg:flex items-center gap-1 hover:text-amber-600 transition-colors"><Code2 size={16} className="text-amber-500" /> <span className="hidden xl:block">{t('syntaxsage')}</span></Link>
        
        <LanguageSwitcher />
        <ThemeToggle />

        <button onClick={handleLogout} className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 px-3 py-1.5 rounded-md transition-colors font-bold">
          <LogOut size={16} />
          <span className="hidden sm:inline-block">{t('logout', 'Logout')}</span>
        </button>
      </div>
    </div>
  )
}