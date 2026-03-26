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
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ backgroundColor: '#e8f5e9' }}>
      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full opacity-30 blur-[100px]"
          style={{ backgroundColor: '#a5d6a7' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] rounded-full opacity-20 blur-[80px]"
          style={{ backgroundColor: '#80cbc4' }} />
      </div>

      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>

      <div className="relative w-full max-w-md">
        <div className="rounded-3xl p-1 shadow-2xl"
          style={{ background: 'linear-gradient(135deg, #a5d6a7, #80cbc4)' }}>
          <div className="rounded-3xl p-8 md:p-10 relative overflow-hidden"
            style={{ backgroundColor: '#f1f8e9' }}>
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-30"
              style={{ backgroundColor: '#c8e6c9' }} />

            <button onClick={() => nav("/")}
              className="absolute top-6 left-6 w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-green-100 border"
              style={{ borderColor: '#c8e6c9', color: '#66bb6a' }}>
              <ArrowLeft size={16} />
            </button>

            <div className="flex flex-col items-center mb-8 mt-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg mb-4"
                style={{ background: 'linear-gradient(135deg, #66bb6a, #43a047)' }}>
                <Zap className="w-6 h-6 text-white fill-white" />
              </div>
              <h2 className="text-2xl font-black tracking-tight" style={{ color: '#1b5e20' }}>{t('welcome')}</h2>
              <p className="text-sm mt-1" style={{ color: '#81c784' }}>{t('login_continue')}</p>
            </div>

            <div className="space-y-3">
              <input
                className="w-full px-4 py-3.5 rounded-xl text-sm font-medium outline-none transition-all border focus:border-green-400 focus:ring-2 focus:ring-green-200"
                style={{ backgroundColor: '#e8f5e9', borderColor: '#c8e6c9', color: '#2e7d32' }}
                placeholder={t('email')}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3.5 rounded-xl text-sm font-medium outline-none transition-all border focus:border-green-400 focus:ring-2 focus:ring-green-200 pr-12"
                  style={{ backgroundColor: '#e8f5e9', borderColor: '#c8e6c9', color: '#2e7d32' }}
                  placeholder={t('password')}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#81c784' }}
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div className="relative">
                <Activity size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#81c784' }} />
                <select
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl text-sm font-medium outline-none transition-all border focus:border-green-400 appearance-none cursor-pointer"
                  style={{ backgroundColor: '#e8f5e9', borderColor: '#c8e6c9', color: '#2e7d32' }}
                  value={form.level}
                  onChange={(e) => setForm({ ...form, level: e.target.value })}>
                  <option value="Beginner">{t('beginner')}</option>
                  <option value="Intermediate">{t('intermediate')}</option>
                  <option value="Advanced">{t('advanced')}</option>
                </select>
              </div>
            </div>

            <button
              onClick={login}
              className="w-full mt-5 py-3.5 text-white font-bold rounded-xl shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] text-sm"
              style={{ background: 'linear-gradient(135deg, #66bb6a, #43a047)' }}>
              {t('login')}
            </button>

            <div className="mt-5 pt-5 border-t flex justify-center" style={{ borderColor: '#c8e6c9' }}>
              <GoogleLogin
                onSuccess={handleGoogle}
                onError={() => toast.error(t('google_login_failed'))}
                theme="outline"
                shape="pill"
                text="signin_with"
              />
            </div>

            <p className="text-center mt-5 text-sm" style={{ color: '#81c784' }}>
              {t('dont_have_account')}
              <Link to="/signup" className="ml-1.5 font-bold hover:underline" style={{ color: '#43a047' }}>
                {t('signup')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}