import { useState, useEffect, useCallback } from "react"
import { useNavigate, Link } from "react-router-dom"
import API from "../services/api"
import { Eye, EyeOff, ArrowLeft, Sparkles, Globe, Activity } from "lucide-react"
import { toast } from "sonner"
import { useAssistant } from "../context/AssistantContext"
import { useTranslation } from "react-i18next"
import { LanguageSwitcher } from "../components/LanguageSwitcher"
import { LevelSwitcher } from "../components/LevelSwitcher"

export default function Signup() {
  const nav = useNavigate()
  const { t } = useTranslation()
  const { lastCommand } = useAssistant()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    language: "English",
    level: "Beginner",
  })

  const signup = useCallback(async () => {
    const name = form.name.trim()
    const email = form.email.trim().toLowerCase()
    const password = form.password.trim()
    const confirm = form.confirm_password.trim()

    if (!name || !email || !password) return toast.error("Please fill in all fields")
    if (password !== confirm) return toast.error(t("passwords_not_matching"))

    const tid = toast.loading("Creating your account...")
    try {
      await API.post("/auth/signup", {
        name,
        email,
        password,
        confirm_password: confirm,
        language: form.language,
        level: form.level,
      })
      toast.success(t("signup_success"), { id: tid })
      nav("/login")
    } catch (err) {
      const msg = err.response?.data?.detail || t("signup_failed")
      toast.error(msg, { id: tid })
    }
  }, [form, nav, t])

  useEffect(() => {
    if (lastCommand === "submit") signup()
  }, [lastCommand, signup])

  return (
    <div className="min-h-screen flex relative transition-colors duration-500 bg-teal-50 dark:bg-gray-950">
      <div className="absolute top-6 right-6 z-50 flex items-center gap-2">
        <LevelSwitcher />
        <LanguageSwitcher />
      </div>

      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] p-12 relative overflow-hidden bg-gradient-to-br from-teal-400 via-teal-500 to-teal-700 dark:from-teal-700 dark:via-teal-800 dark:to-teal-950 border-r border-teal-600 dark:border-teal-900">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-10 blur-3xl bg-white dark:opacity-5" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full opacity-10 blur-3xl bg-white dark:opacity-5" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 dark:bg-black/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-black text-xl tracking-tight">AccessTech</span>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 dark:bg-black/20 rounded-full">
              <span className="w-2 h-2 rounded-full bg-green-300 dark:bg-green-400 animate-pulse" />
              <span className="text-white/80 dark:text-white/90 text-sm font-semibold">
                Free to get started
              </span>
            </div>
            <h1 className="text-5xl font-black text-white leading-tight tracking-tight">
              Join the Future
              <br />
              <span className="text-white/60 dark:text-white/50">of Learning.</span>
            </h1>
            <p className="text-white/70 dark:text-white/60 text-lg max-w-sm font-medium leading-relaxed">
              Create your account and unlock AI-powered tools designed to accelerate your journey.
            </p>
          </div>
          <div className="space-y-3">
            {[
              "Personalized AI tutoring",
              "Career roadmap generator",
              "Multilingual support",
              "Real-time code analysis",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 dark:bg-black/20 border border-white/40 dark:border-white/10 flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-white/70 dark:text-white/60 text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-2xl p-5">
          <p className="text-white/80 dark:text-white/70 text-sm italic font-medium leading-relaxed">
            "AccessTech transformed how students study. The AI tutor adapts to all levels perfectly."
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
        <div className="w-full max-w-[420px] py-6 sm:py-8">
          <button
            onClick={() => nav(-1)}
            className="flex items-center gap-2 mb-8 group transition-colors text-teal-600 dark:text-teal-500 hover:text-teal-800 dark:hover:text-teal-400"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-semibold">Back</span>
          </button>

          <div className="mb-8">
            <h2 className="text-3xl font-black tracking-tight mb-2 text-teal-900 dark:text-teal-50">
              {t("create_account")}
            </h2>
            <p className="font-medium text-teal-500 dark:text-teal-400">{t("join_today")}</p>
          </div>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              signup()
            }}
          >
            {[
              { label: t("name"), key: "name", type: "text", placeholder: "Your full name" },
              { label: t("email"), key: "email", type: "email", placeholder: "you@example.com" },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-black uppercase tracking-widest mb-2 text-teal-400 dark:text-teal-600">
                  {label}
                </label>
                <input
                  type={type}
                  className="w-full px-4 py-3 rounded-xl border outline-none transition-all font-medium text-sm focus:ring-2 focus:ring-teal-300 dark:focus:ring-teal-700 bg-teal-50 border-teal-100 text-teal-900 placeholder-teal-400/50 dark:bg-gray-950 dark:border-teal-900/50 dark:text-teal-100 dark:placeholder-gray-500"
                  placeholder={placeholder}
                  value={form[key]}
                  required
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </div>
            ))}

            {[
              {
                label: t("password"),
                key: "password",
                show: showPassword,
                toggle: () => setShowPassword((v) => !v),
              },
              {
                label: t("confirm_password"),
                key: "confirm_password",
                show: showConfirm,
                toggle: () => setShowConfirm((v) => !v),
              },
            ].map(({ label, key, show, toggle }) => (
              <div key={key}>
                <label className="block text-xs font-black uppercase tracking-widest mb-2 text-teal-400 dark:text-teal-600">
                  {label}
                </label>
                <div className="relative">
                  <input
                    type={show ? "text" : "password"}
                    className="w-full px-4 py-3 rounded-xl border outline-none transition-all font-medium text-sm pr-12 focus:ring-2 focus:ring-teal-300 dark:focus:ring-teal-700 bg-teal-50 border-teal-100 text-teal-900 placeholder-teal-400/50 dark:bg-gray-950 dark:border-teal-900/50 dark:text-teal-100 dark:placeholder-gray-500"
                    placeholder="••••••••"
                    value={form[key]}
                    required
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 p-1 transition-colors text-teal-400 hover:text-teal-600 dark:text-teal-600 dark:hover:text-teal-400"
                    onClick={toggle}
                  >
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            ))}

            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: t("language") || "Language",
                  key: "language",
                  Icon: Globe,
                  options: [
                    { val: "English", label: t("english") },
                    { val: "Tamil", label: t("tamil") },
                    { val: "Hindi", label: t("hindi") },
                  ],
                },
                {
                  label: t("level") || "Level",
                  key: "level",
                  Icon: Activity,
                  options: [
                    { val: "Beginner", label: t("beginner") },
                    { val: "Intermediate", label: t("intermediate") },
                    { val: "Advanced", label: t("advanced") },
                  ],
                },
              ].map(({ label, key, Icon, options }) => (
                <div key={key}>
                  <label className="block text-xs font-black uppercase tracking-widest mb-2 text-teal-400 dark:text-teal-600">
                    {label}
                  </label>
                  <div className="relative">
                    <Icon
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-400 dark:text-teal-600"
                    />
                    <select
                      className="w-full pl-8 pr-3 h-11 rounded-xl border outline-none appearance-none cursor-pointer font-medium text-sm transition-all focus:ring-2 focus:ring-teal-300 dark:focus:ring-teal-700 bg-teal-50 border-teal-100 text-teal-900 dark:bg-gray-950 dark:border-teal-900/50 dark:text-teal-100"
                      value={form[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    >
                      {options.map((o) => (
                        <option key={o.val} value={o.val}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="w-full h-12 mt-6 text-white font-bold rounded-xl shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5 text-base bg-gradient-to-br from-teal-400 to-teal-700 hover:from-teal-500 hover:to-teal-800 dark:from-teal-600 dark:to-teal-900"
            >
              {t("signup")}
            </button>
          </form>

          <p className="text-center mt-6 text-sm font-medium text-teal-500 dark:text-teal-400">
            {t("already_have_account")}
            <Link
              to="/login"
              className="font-bold hover:underline ml-2 text-teal-700 dark:text-teal-500"
            >
              {t("login")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}