import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Globe, Brain, Zap, Mail, Phone, MapPin, Loader2, Target, LayoutDashboard } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "../components/ThemeToggle";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { LevelSwitcher } from "../components/LevelSwitcher";
import API from "../services/api";

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleTextareaChange = (e) => {
    setFormData(prev => ({ ...prev, message: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });
    try {
      const response = await API.post('/contact', formData);
      setSubmitStatus({ type: 'success', message: response.data.message || t('send_success') });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      if (error.response) {
        setSubmitStatus({ type: 'error', message: error.response.data.detail || t('send_error') });
      } else {
        setSubmitStatus({ type: 'error', message: t('network_error') });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    {
      icon: "✨",
      key: 'luminatutor',
      descKey: 'tutor_desc',
      gradient: "from-fuchsia-400 to-fuchsia-600 dark:from-fuchsia-600 dark:to-fuchsia-800",
      bgClass: "bg-fuchsia-50 dark:bg-fuchsia-950/20",
      borderClass: "border-fuchsia-200 dark:border-fuchsia-900/40",
      badge: "AI Tutor",
      badgeClass: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/50 dark:text-fuchsia-400",
      titleClass: "text-fuchsia-900 dark:text-fuchsia-50",
      descClass: "text-fuchsia-700 dark:text-fuchsia-300",
    },
    {
      icon: null,
      IconComp: Globe,
      key: 'pathpilot',
      descKey: 'pathpilot_desc',
      gradient: "from-sky-400 to-sky-600 dark:from-sky-600 dark:to-sky-800",
      bgClass: "bg-sky-50 dark:bg-sky-950/20",
      borderClass: "border-sky-200 dark:border-sky-900/40",
      badge: "Career Map",
      badgeClass: "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-400",
      titleClass: "text-sky-900 dark:text-sky-50",
      descClass: "text-sky-700 dark:text-sky-300",
    },
    {
      icon: null,
      IconComp: Brain,
      key: 'termcrystal',
      descKey: 'termcrystal_desc',
      gradient: "from-emerald-400 to-teal-500 dark:from-emerald-600 dark:to-teal-700",
      bgClass: "bg-emerald-50 dark:bg-emerald-950/20",
      borderClass: "border-emerald-200 dark:border-emerald-900/40",
      badge: "Dictionary",
      badgeClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400",
      titleClass: "text-emerald-900 dark:text-emerald-50",
      descClass: "text-emerald-700 dark:text-emerald-300",
    },
    {
      icon: null,
      IconComp: Zap,
      key: 'syntaxsage',
      descKey: 'syntaxsage_desc',
      gradient: "from-amber-400 to-orange-500 dark:from-amber-600 dark:to-orange-700",
      bgClass: "bg-amber-50 dark:bg-amber-950/20",
      borderClass: "border-amber-200 dark:border-amber-900/40",
      badge: "Code AI",
      badgeClass: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400",
      titleClass: "text-amber-900 dark:text-amber-50",
      descClass: "text-amber-700 dark:text-amber-300",
    },
    {
      icon: null,
      IconComp: Target,
      key: 'quiz',
      descKey: 'quiz_desc',
      gradient: "from-indigo-400 to-indigo-600 dark:from-indigo-600 dark:to-indigo-800",
      bgClass: "bg-indigo-50 dark:bg-indigo-950/20",
      borderClass: "border-indigo-200 dark:border-indigo-900/40",
      badge: "Assessment",
      badgeClass: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400",
      titleClass: "text-indigo-900 dark:text-indigo-50",
      descClass: "text-indigo-700 dark:text-indigo-300",
    },
    {
      icon: null,
      IconComp: LayoutDashboard,
      key: 'dashboard',
      descKey: 'dashboard_intro_desc',
      gradient: "from-rose-400 to-rose-600 dark:from-rose-600 dark:to-rose-800",
      bgClass: "bg-rose-50 dark:bg-rose-950/20",
      borderClass: "border-rose-200 dark:border-rose-900/40",
      badge: "Analytics",
      badgeClass: "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400",
      titleClass: "text-rose-900 dark:text-rose-50",
      descClass: "text-rose-700 dark:text-rose-300",
    },
  ];

  return (
    <div className="min-h-screen font-sans text-gray-700 dark:text-gray-300 overflow-x-hidden bg-green-50 dark:bg-gray-950 transition-colors duration-300">

      {/* Soft ambient shapes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full opacity-30 blur-3xl bg-green-300 dark:bg-green-800/20 dark:opacity-20" />
        <div className="absolute top-[40%] right-[-8%] w-[400px] h-[400px] rounded-full opacity-20 blur-3xl bg-teal-300 dark:bg-teal-800/20 dark:opacity-20" />
        <div className="absolute bottom-[5%] left-[25%] w-[500px] h-[300px] rounded-full opacity-20 blur-3xl bg-green-200 dark:bg-green-900/20 dark:opacity-10" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 flex justify-between items-center px-6 lg:px-12 py-4 sticky top-0 bg-green-50/85 dark:bg-gray-950/85 backdrop-blur-md border-b border-green-200 dark:border-green-900/40 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md bg-gradient-to-br from-green-400 to-green-600 dark:from-green-600 dark:to-green-800">
            <span className="text-white font-black text-sm">A</span>
          </div>
          <span className="font-black text-xl tracking-tight text-green-800 dark:text-green-400">
            AccessTech
          </span>
        </div>
        <div className="flex items-center gap-3">
          <LevelSwitcher />
          <LanguageSwitcher />
          <ThemeToggle />
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 rounded-xl font-semibold text-sm transition-all hover:bg-green-100 dark:hover:bg-green-900/30 text-green-700 dark:text-green-500">
            {t('login')}
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="px-5 py-2 rounded-xl font-bold text-sm text-white shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 bg-gradient-to-br from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 dark:from-green-600 dark:to-green-800">
            {t('signup')}
          </button>
        </div>
      </nav>

      <main className="flex-grow relative z-10 w-full">

        {/* Hero */}
        <section className="px-5 sm:px-6 lg:px-20 pt-16 md:pt-24 pb-16 md:pb-20 text-center max-w-6xl mx-auto w-full">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-6 md:mb-8 border bg-green-100 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-800/50 dark:text-green-400">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-green-600 dark:bg-green-400" />
            {t('hero_subtitle')}
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter leading-tight mb-6 md:mb-8 text-green-900 dark:text-green-50 px-2">
            {t('welcome').split(' ').map((word, i) => (
              <span key={i} className={`${i % 2 !== 0 ? 'italic text-green-600 dark:text-green-400' : ''}`}>
                {word}{' '}
              </span>
            ))}
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed font-medium text-green-600 dark:text-green-400/80 px-4">
            {t('hero_desc')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 w-full">
            <button
              onClick={() => navigate('/signup')}
              className="flex items-center justify-center gap-2 h-14 px-10 rounded-2xl text-white font-bold text-lg shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl bg-gradient-to-br from-green-400 to-green-700 dark:from-green-600 dark:to-green-800">
              {t('get_started')}
              <Zap className="w-5 h-5 text-yellow-200" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="flex items-center justify-center gap-2 h-14 px-10 rounded-2xl font-bold text-lg border-2 transition-all hover:-translate-y-1 bg-white/60 dark:bg-gray-900/60 border-green-300 text-green-700 dark:border-green-800 dark:text-green-400 hover:bg-white dark:hover:bg-gray-900">
              <Globe className="w-5 h-5" />
              {t('login')}
            </button>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 md:py-20 px-5 sm:px-6 lg:px-20 w-full">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 text-green-900 dark:text-green-50">
                {t('features')}
              </h2>
              <p className="text-lg max-w-xl mx-auto text-green-400 dark:text-green-600">
                Four intelligent tools, one unified learning experience.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((f) => (
                <div key={f.key}
                  className={`relative group rounded-3xl p-7 border transition-all duration-500 overflow-hidden cursor-default ${f.bgClass} ${f.borderClass} hover:shadow-xl hover:-translate-y-2 dark:hover:bg-gray-900`}>
                  <div className={`absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br ${f.gradient} opacity-10 group-hover:opacity-25 blur-2xl transition-opacity`} />
                  <div className="relative z-10">
                    <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest mb-5 ${f.badgeClass}`}>
                      {f.badge}
                    </span>
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      {f.icon ? <span className="text-2xl text-white">{f.icon}</span>
                        : <f.IconComp className="w-6 h-6 text-white" />}
                    </div>
                    <h3 className={`text-lg font-black mb-2 tracking-tight ${f.titleClass}`}>
                      {t(f.key)}
                    </h3>
                    <p className={`text-sm leading-relaxed ${f.descClass}`}>
                      {t(f.descKey)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-20 w-full">
          <div className="max-w-5xl mx-auto">
            <div className="relative rounded-[2.5rem] overflow-hidden border bg-gradient-to-br from-green-50 to-teal-50 border-green-200 dark:from-green-900/20 dark:to-teal-900/20 dark:border-green-800/40">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-72 h-72 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-40 bg-green-300 dark:bg-green-800/30" />
                <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 opacity-30 bg-teal-300 dark:bg-teal-800/30" />
              </div>
              <div className="relative z-10 p-6 sm:p-10 md:p-14">
                <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
                  <div className="px-2">
                    <span className="inline-block px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest mb-6 bg-green-200 text-green-800 dark:bg-green-900/40 dark:text-green-400">
                      Get in Touch
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-black mb-4 tracking-tight text-green-900 dark:text-green-50">{t('contact')}</h2>
                    <p className="text-lg mb-8 leading-relaxed text-green-600 dark:text-green-400">{t('contact_desc')}</p>
                    <div className="space-y-5">
                      {[
                        { Icon: Mail, text: 'supportaccesstech@gmail.com' },
                        { Icon: Phone, text: '+91 6380906053' },
                        { Icon: MapPin, text: t('address') },
                      ].map(({ Icon, text }) => (
                        <div key={text} className="flex items-center gap-4 group">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center border transition-colors group-hover:border-green-400 dark:group-hover:border-green-600 bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-800/50">
                            <Icon className="w-5 h-5 text-green-400 dark:text-green-500" />
                          </div>
                          <span className="text-sm font-medium text-green-700 dark:text-green-300">{text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl p-6 border bg-white border-green-200 dark:bg-gray-900 dark:border-green-900/50 shadow-sm">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                      <Input type="text" id="name" placeholder={t('name')} value={formData.name}
                        onChange={handleInputChange} required
                        className="h-12 rounded-xl bg-green-50/50 border-green-200 focus-visible:ring-green-400 text-green-900 placeholder-green-400/70 dark:bg-gray-950 dark:border-green-900/50 dark:focus-visible:ring-green-600 dark:text-green-50 dark:placeholder-gray-500" />
                      <Input type="email" id="email" placeholder={t('email')} value={formData.email}
                        onChange={handleInputChange} required
                        className="h-12 rounded-xl bg-green-50/50 border-green-200 focus-visible:ring-green-400 text-green-900 placeholder-green-400/70 dark:bg-gray-950 dark:border-green-900/50 dark:focus-visible:ring-green-600 dark:text-green-50 dark:placeholder-gray-500" />
                      <textarea id="message" placeholder={t('message')} rows="4"
                        value={formData.message} onChange={handleTextareaChange} required
                        className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 resize-none text-sm transition-all focus:ring-green-300 bg-green-50/50 border-green-200 text-green-900 placeholder-green-400/70 dark:bg-gray-950 dark:border-green-900/50 dark:focus:ring-green-600 dark:text-green-50 dark:placeholder-gray-500" />
                      <button type="submit" disabled={isSubmitting}
                        className="w-full h-12 rounded-xl text-white font-bold shadow-md transition-all hover:shadow-lg bg-gradient-to-br from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 dark:from-green-600 dark:to-green-800">
                        {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin inline mr-2" />{t('sending')}</> : t('send_message')}
                      </button>
                      {submitStatus.message && (
                        <div className={`p-3 rounded-xl text-sm font-medium ${submitStatus.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : 'bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'}`}>
                          {submitStatus.type === 'success' ? t('send_success') : t('send_error')}
                        </div>
                      )}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 py-8 text-center border-t border-green-200 text-green-400 dark:border-green-900/50 dark:text-green-600">
        <p className="text-sm font-medium">
          &copy; {new Date().getFullYear()} {t('footer_rights')}
        </p>
      </footer>
    </div>
  );
}