import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import API from "../services/api"
import { Eye, EyeOff, ArrowLeft, Sparkles, Globe, Activity } from "lucide-react"
import { toast } from "sonner"
import { useAssistant } from "../context/AssistantContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTranslation } from "react-i18next"
import { LanguageSwitcher } from "../components/LanguageSwitcher"

export default function Signup() {
  const nav = useNavigate()
  const { t } = useTranslation()
  const { lastCommand } = useAssistant()

  useEffect(() => {
    if (lastCommand === "submit") signup();
  }, [lastCommand]);

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirm_password: "", language: "English", level: "Beginner"
  })

  const signup = async () => {
    if (form.password !== form.confirm_password) return toast.error(t('passwords_not_matching'))
    try {
      await API.post("/auth/register", {
        name: form.name, email: form.email, password: form.password,
        language: form.language, level: form.level
      })
      toast.success(t('signup_success'))
      nav("/login")
    } catch (err) {
      toast.error(err.response?.data?.detail || t('signup_failed'))
    }
  }

  const steps = [
    { label: 'Personal', done: form.name && form.email },
    { label: 'Security', done: form.password && form.confirm_password },
    { label: 'Preferences', done: true },
  ];

  return (
    <div className="min-h-screen flex bg-[#fafafa] dark:bg-[#080810] transition-colors duration-500 relative">
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-gradient-to-br from-indigo-600 via-violet-700 to-purple-800 p-12 relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }}
        />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-black text-xl tracking-tight">AccessTech</span>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white/80 text-sm font-semibold">{t('signup_left_badge', 'Free to get started')}</span>
            </div>
            <h1 className="text-5xl font-black text-white leading-tight tracking-tight">
              {t('signup_left_title_1', 'Join the Future')}<br />
              <span className="text-white/60">{t('signup_left_title_2', 'of Learning.')}</span>
            </h1>
            <p className="text-white/70 text-lg max-w-sm font-medium leading-relaxed">
              {t('signup_left_desc', 'Create your account and unlock AI-powered tools designed to accelerate your journey.')}
            </p>
          </div>

          {/* Checklist */}
          <div className="space-y-3">
            {[t('signup_left_feature_1', 'Personalized AI tutoring'), t('signup_left_feature_2', 'Career roadmap generator'), t('signup_left_feature_3', 'Multilingual support'), t('signup_left_feature_4', 'Real-time code analysis')].map(item => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-400/30 border border-emerald-400/50 flex items-center justify-center">
                  <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-white/70 text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-white/80 text-sm italic font-medium leading-relaxed">
            {t('signup_left_testimonial', '"AccessTech transformed how students study. The AI tutor adapts to all level perfectly."')}
          </p>

        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-[420px] py-8">
          <button
            onClick={() => nav(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors mb-8 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-semibold">Back</span>
          </button>

          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
              {t('create_account')}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium">{t('join_today')}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">{t('name')}</label>
              <Input
                className="bg-gray-100/80 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white h-12 rounded-xl focus-visible:ring-violet-500 focus-visible:border-violet-500 transition-all font-medium"
                placeholder="Your full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">{t('email')}</label>
              <Input
                className="bg-gray-100/80 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white h-12 rounded-xl focus-visible:ring-violet-500 focus-visible:border-violet-500 transition-all font-medium"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">{t('password')}</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  className="bg-gray-100/80 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white h-12 rounded-xl pr-12 focus-visible:ring-violet-500 focus-visible:border-violet-500 transition-all font-medium"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">{t('confirm_password')}</label>
              <div className="relative">
                <Input
                  type={showConfirm ? "text" : "password"}
                  className="bg-gray-100/80 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white h-12 rounded-xl pr-12 focus-visible:ring-violet-500 focus-visible:border-violet-500 transition-all font-medium"
                  placeholder="••••••••"
                  value={form.confirm_password}
                  onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
                />
                <button className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">{t('language') || 'Language'}</label>
                <div className="relative">
                  <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    className="w-full pl-8 pr-3 h-11 bg-gray-100/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all appearance-none cursor-pointer font-medium text-sm"
                    value={form.language}
                    onChange={(e) => setForm({ ...form, language: e.target.value })}
                  >
                    <option value="English">{t('english')}</option>
                    <option value="Tamil">{t('tamil')}</option>
                    <option value="Hindi">{t('hindi')}</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">{t('level') || 'Level'}</label>
                <div className="relative">
                  <Activity size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    className="w-full pl-8 pr-3 h-11 bg-gray-100/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all appearance-none cursor-pointer font-medium text-sm"
                    value={form.level}
                    onChange={(e) => setForm({ ...form, level: e.target.value })}
                  >
                    <option value="Beginner">{t('beginner')}</option>
                    <option value="Intermediate">{t('intermediate')}</option>
                    <option value="Advanced">{t('advanced')}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={signup}
            className="w-full h-12 mt-6 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all hover:-translate-y-0.5 text-base"
          >
            {t('signup')}
          </Button>

          <p className="text-center mt-6 text-gray-500 dark:text-gray-400 text-sm font-medium">
            {t('already_have_account')}
            <Link to="/login" className="text-violet-600 dark:text-violet-400 font-bold hover:underline ml-2">
              {t('login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}