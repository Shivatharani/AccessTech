import {Link, useNavigate} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BookOpen, LogOut } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar(){

 const { t } = useTranslation()
 const nav = useNavigate()

 const handleLogout = () => {
   localStorage.removeItem("token")
   nav("/login")
 }

 return(
  <div className="flex justify-between items-center bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-100 px-6 lg:px-12 py-4 shadow-sm sticky top-0 z-50 transition-colors duration-300">

   <Link to="/tutor" className="flex items-center gap-3 text-indigo-700 dark:text-indigo-400 font-extrabold text-2xl tracking-tight hover:opacity-80 transition-opacity">
    <img src="/logo.png" alt="AccessTech Logo" className="h-10 w-10 object-contain drop-shadow-md" />
    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-600 dark:from-indigo-400 dark:to-purple-400">AccessTech</span>
   </Link>

   <div className="flex items-center space-x-6 text-sm font-medium">

    <Link to="/tutor" className="hover:text-indigo-600 transition-colors">{t('tutor')}</Link>

    <Link to="/dashboard" className="hover:text-indigo-600 transition-colors">{t('dashboard')}</Link>

    <Link to="/quiz" className="hover:text-indigo-600 transition-colors">{t('quiz')}</Link>

    <ThemeToggle />

    <button onClick={handleLogout} className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-md transition-colors">
      <LogOut size={16} />
      {t('logout', 'Logout')}
    </button>

   </div>

  </div>
 )

}