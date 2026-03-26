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

  return (
    <div className="min-h-screen flex relative transition-colors duration-500" style={{ backgroundColor: '#e0f2f1' }}>
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>

      {/* Left decorative panel — teal/mint */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #4db6ac, #26a69a, #00897b)' }}>
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-10 blur-3xl bg-white" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full opacity-10 blur-3xl bg-white" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-black text-xl tracking-tight">AccessTech</span>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 rounded-full">
              <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
              <span className="text-white/80 text-sm font-semibold">Free to get started</span>
            </div>
            <h1 className="text-5xl font-black text-white leading-tight tracking-tight">
              Join the Future<br />
              <span className="text-white/60">of Learning.</span>
            </h1>
            <p className="text-white/70 text-lg max-w-sm font-medium leading-relaxed">
              Create your account and unlock AI-powered tools designed to accelerate your journey.
            </p>
          </div>
          <div className="space-y-3">
            {['Personalized AI tutoring', 'Career roadmap generator', 'Multilingual support', 'Real-time code analysis'].map(item => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 border border-white/40 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-white/70 text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 bg-white/10 border border-white/20 rounded-2xl p-5">
          <p className="text-white/80 text-sm italic font-medium leading-relaxed">
            "AccessTech transformed how students study. The AI tutor adapts to all levels perfectly."
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-[420px] py-8">
          <button onClick={() => nav(-1)}
            className="flex items-center gap-2 mb-8 group transition-colors"
            style={{ color: '#5a8a80' }}>
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-semibold">Back</span>
          </button>

          <div className="mb-8">
            <h2 className="text-3xl font-black tracking-tight mb-2" style={{ color: '#00695c' }}>
              {t('create_account')}
            </h2>
            <p className="font-medium" style={{ color: '#4db6ac' }}>{t('join_today')}</p>
          </div>

          <div className="space-y-4">
            {[
              { label: t('name'), key: 'name', type: 'text', placeholder: 'Your full name' },
              { label: t('email'), key: 'email', type: 'email', placeholder: 'you@example.com' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#80cbc4' }}>{label}</label>
                <input
                  type={type}
                  className="w-full px-4 py-3 rounded-xl border outline-none transition-all font-medium text-sm focus:ring-2 focus:ring-teal-300"
                  style={{ backgroundColor: '#e0f2f1', borderColor: '#b2dfdb', color: '#00695c' }}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </div>
            ))}

            {[
              { label: t('password'), key: 'password', show: showPassword, toggle: () => setShowPassword(!showPassword) },
              { label: t('confirm_password'), key: 'confirm_password', show: showConfirm, toggle: () => setShowConfirm(!showConfirm) },
            ].map(({ label, key, show, toggle }) => (
              <div key={key}>
                <label className="block text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#80cbc4' }}>{label}</label>
                <div className="relative">
                  <input
                    type={show ? "text" : "password"}
                    className="w-full px-4 py-3 rounded-xl border outline-none transition-all font-medium text-sm pr-12 focus:ring-2 focus:ring-teal-300"
                    style={{ backgroundColor: '#e0f2f1', borderColor: '#b2dfdb', color: '#00695c' }}
                    placeholder="••••••••"
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  />
                  <button className="absolute right-3 top-3 p-1 transition-colors" style={{ color: '#80cbc4' }} onClick={toggle}>
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            ))}

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: t('language') || 'Language', key: 'language', Icon: Globe, options: [{ val: 'English', label: t('english') }, { val: 'Tamil', label: t('tamil') }, { val: 'Hindi', label: t('hindi') }] },
                { label: t('level') || 'Level', key: 'level', Icon: Activity, options: [{ val: 'Beginner', label: t('beginner') }, { val: 'Intermediate', label: t('intermediate') }, { val: 'Advanced', label: t('advanced') }] },
              ].map(({ label, key, Icon, options }) => (
                <div key={key}>
                  <label className="block text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#80cbc4' }}>{label}</label>
                  <div className="relative">
                    <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#80cbc4' }} />
                    <select
                      className="w-full pl-8 pr-3 h-11 rounded-xl border outline-none appearance-none cursor-pointer font-medium text-sm transition-all focus:ring-2 focus:ring-teal-300"
                      style={{ backgroundColor: '#e0f2f1', borderColor: '#b2dfdb', color: '#00695c' }}
                      value={form[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}>
                      {options.map(o => <option key={o.val} value={o.val}>{o.label}</option>)}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={signup}
            className="w-full h-12 mt-6 text-white font-bold rounded-xl shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5 text-base"
            style={{ background: 'linear-gradient(135deg, #4db6ac, #00897b)' }}>
            {t('signup')}
          </button>

          <p className="text-center mt-6 text-sm font-medium" style={{ color: '#4db6ac' }}>
            {t('already_have_account')}
            <Link to="/login" className="font-bold hover:underline ml-2" style={{ color: '#00897b' }}>
              {t('login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}