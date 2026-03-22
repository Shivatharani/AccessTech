import { useState, useContext, useEffect } from "react"
import { AuthContext } from "../context/AuthContext"
import API from "../services/api"
import { useNavigate, Link } from "react-router-dom"
import { GoogleLogin } from "@react-oauth/google"
import { Eye, EyeOff, Activity, ArrowLeft, Zap } from "lucide-react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { useAssistant } from "../context/AssistantContext"
import { LanguageSwitcher } from "../components/LanguageSwitcher"

export default function Login() {
  const nav = useNavigate()
  const { t } = useTranslation()
  const { login: contextLogin } = useContext(AuthContext)
  const { lastCommand } = useAssistant()

  useEffect(() => {
    if (lastCommand === "submit") login();
  }, [lastCommand]);

  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ email: "", password: "", language: "English", level: "Beginner" })

  const login = async () => {
    try {
      const res = await API.post("/auth/login", { email: form.email, password: form.password })
      contextLogin(form.email, res.data.access_token, res.data.language || form.language, res.data.level || form.level)
      toast.success(t('login_success'))
      nav("/welcome")
    } catch (err) {
      toast.error(err.response?.data?.detail || t('invalid_credentials'))
    }
  }

  const handleGoogle = async (credentialResponse) => {
    try {
      const res = await API.post("/auth/google-login", { token: credentialResponse.credential })
      if (res.data.access_token) {
        contextLogin(res.data.email, res.data.access_token, res.data.language, res.data.level)
        toast.success(t('login_success'))
        nav("/welcome")
      } else {
        throw new Error("No access token received")
      }
    } catch {
      toast.error(t('google_login_failed'))
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafe] dark:bg-[#06060f] flex items-center justify-center px-4 transition-colors duration-300 relative overflow-hidden">
      {/* Ambient bg */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-violet-500/10 dark:bg-violet-500/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] bg-indigo-500/10 dark:bg-cyan-500/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 opacity-30 dark:opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="relative p-[1px] rounded-3xl bg-gradient-to-br from-violet-500/30 via-transparent to-indigo-500/20 shadow-2xl shadow-violet-500/10">
          <div className="bg-white dark:bg-[#0d0d1f] rounded-3xl p-8 md:p-10 relative overflow-hidden">
            {/* Inner ambient */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-violet-500/5 rounded-full blur-3xl" />

            {/* Back button */}
            <button onClick={() => nav("/")} className="absolute top-6 left-6 w-9 h-9 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-all">
              <ArrowLeft size={16} />
            </button>

            {/* Logo */}
            <div className="flex flex-col items-center mb-8 mt-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30 mb-4">
                <Zap className="w-6 h-6 text-white fill-white" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{t('welcome')}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{t('login_continue')}</p>
            </div>

            <div className="space-y-3">
              {/* Email */}
              <div>
                <input
                  className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl text-gray-900 dark:text-gray-100 text-sm font-medium placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-violet-500/50 focus:bg-white dark:focus:bg-white/8 transition-all"
                  placeholder={t('email')}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl text-gray-900 dark:text-gray-100 text-sm font-medium placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-violet-500/50 focus:bg-white dark:focus:bg-white/8 transition-all pr-12"
                  placeholder={t('password')}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Level */}
              <div className="relative">
                <Activity size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600" />
                <select
                  className="w-full pl-10 pr-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl text-gray-900 dark:text-gray-100 text-sm font-medium focus:outline-none focus:border-violet-500/50 focus:bg-white dark:focus:bg-white/8 transition-all appearance-none cursor-pointer"
                  value={form.level}
                  onChange={(e) => setForm({ ...form, level: e.target.value })}
                >
                  <option value="Beginner">{t('beginner')}</option>
                  <option value="Intermediate">{t('intermediate')}</option>
                  <option value="Advanced">{t('advanced')}</option>
                </select>
              </div>
            </div>

            <button
              onClick={login}
              className="w-full mt-5 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] transition-all duration-200 text-sm"
            >
              {t('login')}
            </button>

            <div className="mt-5 pt-5 border-t border-gray-100 dark:border-white/5 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogle}
                onError={() => toast.error(t('google_login_failed'))}
                theme="filled_blue"
                shape="pill"
                text="signin_with"
              />
            </div>

            <p className="text-center mt-5 text-sm text-gray-500 dark:text-gray-500">
              {t('dont_have_account')}
              <Link to="/signup" className="ml-1.5 text-violet-600 dark:text-violet-400 font-bold hover:underline">
                {t('signup')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}