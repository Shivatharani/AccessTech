import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import API from "../services/api"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { useAssistant } from "../context/AssistantContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTranslation } from "react-i18next"

export default function Signup(){

  const nav = useNavigate()
  const { t } = useTranslation()
  const { lastCommand } = useAssistant()

  useEffect(() => {
    if (lastCommand === "submit") {
      signup();
    }
  }, [lastCommand]);

  const [showPassword,setShowPassword] = useState(false)
  const [showConfirm,setShowConfirm] = useState(false)

  const [form,setForm] = useState({
    name:"",
    email:"",
    password:"",
    confirm_password:"",
    language:"English",
    level:"Beginner"
  })

  const signup = async () => {
    if (form.password !== form.confirm_password) {
      return toast.error(t('passwords_not_matching'))
    }
    try {
      await API.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        language: form.language,
        level: form.level
      })
      toast.success(t('signup_success'))
      nav("/login")
    } catch (err) {
      toast.error(err.response?.data?.detail || t('signup_failed'))
    }
  }

  return(
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-950 dark:to-indigo-950 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-10 w-[450px] border border-gray-100 dark:border-gray-800 transition-colors duration-300 relative">
        <button 
          onClick={() => nav(-1)} 
          className="absolute top-6 left-6 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="mb-8 text-center mt-4">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2 transition-colors">
            {t('create_account')}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">{t('join_today')}</p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Input
              className="bg-gray-50 dark:bg-gray-800 focus-visible:ring-indigo-400 dark:focus-visible:ring-indigo-500 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 h-12 transition-colors"
              placeholder={t('name')}
              value={form.name}
              onChange={(e)=>setForm({...form,name:e.target.value})}
            />
          </div>

          <div className="relative">
            <Input
              className="bg-gray-50 dark:bg-gray-800 focus-visible:ring-indigo-400 dark:focus-visible:ring-indigo-500 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 h-12 transition-colors"
              placeholder={t('email')}
              value={form.email}
              onChange={(e)=>setForm({...form,email:e.target.value})}
            />
          </div>

          <div className="relative">
            <Input
              type={showPassword ? "text":"password"}
              className="bg-gray-50 dark:bg-gray-800 focus-visible:ring-indigo-400 dark:focus-visible:ring-indigo-500 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 h-12 pr-12 transition-colors"
              placeholder={t('password')}
              value={form.password}
              onChange={(e)=>setForm({...form,password:e.target.value})}
            />
            <button
              className="absolute right-4 top-3.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              onClick={()=>setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
            </button>
          </div>

          <div className="relative">
            <Input
              type={showConfirm ? "text":"password"}
              className="bg-gray-50 dark:bg-gray-800 focus-visible:ring-indigo-400 dark:focus-visible:ring-indigo-500 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 h-12 pr-12 transition-colors"
              placeholder={t('confirm_password')}
              value={form.confirm_password}
              onChange={(e)=>setForm({...form,confirm_password:e.target.value})}
            />
            <button
              className="absolute right-4 top-3.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              onClick={()=>setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <EyeOff size={20}/> : <Eye size={20}/>}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <select
              className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-900 px-3 py-3 rounded-xl w-full focus:ring-2 focus:ring-indigo-400 outline-none transition-all cursor-pointer text-sm"
              value={form.language}
              onChange={(e)=>setForm({...form,language:e.target.value})}
            >
              <option value="English">{t('english')}</option>
              <option value="Tamil">{t('tamil')}</option>
              <option value="Hindi">{t('hindi')}</option>
            </select>
            <select
              className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-900 px-3 py-3 rounded-xl w-full focus:ring-2 focus:ring-indigo-400 outline-none transition-all cursor-pointer text-sm"
              value={form.level}
              onChange={(e)=>setForm({...form,level:e.target.value})}
            >
              <option value="Beginner">{t('beginner')}</option>
              <option value="Intermediate">{t('intermediate')}</option>
              <option value="Advanced">{t('advanced')}</option>
            </select>
          </div>
        </div>

        <Button
          onClick={signup}
          className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white w-full py-6 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 mt-8 text-md"
        >
          {t('signup')}
        </Button>

        <p className="text-center mt-6 text-gray-600 dark:text-gray-400">
          {t('already_have_account')}
          <Link
            to="/login"
            className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline ml-2"
          >
            {t('login')}
          </Link>
        </p>
      </div>
    </div>
  )
}