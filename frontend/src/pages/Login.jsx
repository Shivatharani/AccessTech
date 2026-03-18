import { useState, useContext, useEffect } from "react"
import { AuthContext } from "../context/AuthContext"
import API from "../services/api"
import { useNavigate, Link } from "react-router-dom"
import { GoogleLogin } from "@react-oauth/google"
import { Eye, EyeOff, Globe, Signal, ArrowLeft } from "lucide-react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAssistant } from "../context/AssistantContext"

export default function Login() {

  const nav = useNavigate()
  const { t } = useTranslation()
  const { login: contextLogin } = useContext(AuthContext)
  const { lastCommand } = useAssistant()

  useEffect(() => {
    if (lastCommand === "submit") {
      login();
    }
  }, [lastCommand]);

  const [showPassword,setShowPassword] = useState(false)

  const [form,setForm] = useState({
    email:"",
    password:"",
    language: "English",
    level: "Beginner"
  })

  const login = async () => {
    try {
      const res = await API.post("/auth/login", {
        email: form.email,
        password: form.password
      })
  
      contextLogin(form.email, res.data.access_token, res.data.language || form.language, res.data.level || form.level)
      
      toast.success(t('login_success'))
      nav("/dashboard")
    } catch (err) {
      toast.error(err.response?.data?.detail || t('invalid_credentials'))
    }
  }

  const handleGoogle = async (credentialResponse) => {
    console.log("Google Login attempt...", credentialResponse)
    try {
      const res = await API.post("/auth/google-login",{
        token:credentialResponse.credential
      })
      
      if (res.data.access_token) {
        contextLogin(res.data.email, res.data.access_token, res.data.language, res.data.level)
        toast.success(t('login_success'))
        nav("/dashboard")
      } else {
        throw new Error("No access token received")
      }
    } catch(err) {
      console.error("Google login error details:", err)
      toast.error(t('google_login_failed'))
    }
  }

  return(
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-950 dark:to-indigo-950 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-10 w-[450px] border border-gray-100 dark:border-gray-800 transition-colors duration-300 relative">
        <button 
          onClick={() => nav("/")} 
          className="absolute top-6 left-6 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="mb-8 text-center mt-4">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2 transition-colors">
            {t('welcome')}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">{t('login_continue')}</p>
        </div>

        <div className="space-y-4">
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

          <div className="flex relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
              <Signal size={18} />
            </div>
            <select
              className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-900 p-3 pl-11 rounded-xl w-full focus:ring-2 focus:ring-indigo-400 outline-none transition-all appearance-none cursor-pointer"
              value={form.level}
              onChange={(e)=>setForm({...form, level:e.target.value})}
            >
              <option value="Beginner">{t('beginner')}</option>
              <option value="Intermediate">{t('intermediate')}</option>
              <option value="Advanced">{t('advanced')}</option>
            </select>
          </div>
        </div>

        <Button
          onClick={login}
          className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white w-full py-6 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 mt-6 text-md"
        >
          {t('login')}
        </Button>

        <div className="mt-6 flex justify-center border-t border-gray-100 dark:border-gray-800 pt-6 transition-colors">
          <GoogleLogin
            onSuccess={handleGoogle}
            onError={()=>toast.error(t('google_login_failed'))}
            theme="filled_blue"
            shape="pill"
            text="signin_with"
          />
        </div>

        <p className="text-center mt-6 text-gray-600 dark:text-gray-400">
          {t('dont_have_account')}
          <Link
            to="/signup"
            className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline ml-2"
          >
            {t('signup')}
          </Link>
        </p>
      </div>
    </div>
  )
}