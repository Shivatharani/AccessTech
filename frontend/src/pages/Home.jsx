import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Globe, Brain, Zap, Mail, Phone, MapPin, Loader2, Mic } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "../components/ThemeToggle";
import { LanguageSwitcher } from "../components/LanguageSwitcher";

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
      const response = await fetch('http://localhost:8000/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setSubmitStatus({ type: 'success', message: data.message || t('send_success') });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus({ type: 'error', message: data.detail || t('send_error') });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: t('network_error') });
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    {
      icon: "✨",
      key: 'luminatutor',
      descKey: 'tutor_desc',
      gradient: "from-violet-500 to-purple-600",
      bg: "bg-violet-50 dark:bg-violet-950/30",
      border: "border-violet-100 dark:border-violet-900/40",
      badge: "AI Tutor",
      badgeColor: "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300",
    },
    {
      icon: null,
      IconComp: Globe,
      key: 'pathpilot',
      descKey: 'pathpilot_desc',
      gradient: "from-cyan-500 to-sky-600",
      bg: "bg-sky-50 dark:bg-sky-950/30",
      border: "border-sky-100 dark:border-sky-900/40",
      badge: "Career Map",
      badgeColor: "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300",
    },
    {
      icon: null,
      IconComp: Brain,
      key: 'termcrystal',
      descKey: 'termcrystal_desc',
      gradient: "from-emerald-500 to-teal-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      border: "border-emerald-100 dark:border-emerald-900/40",
      badge: "Dictionary",
      badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
    },
    {
      icon: null,
      IconComp: Zap,
      key: 'syntaxsage',
      descKey: 'syntaxsage_desc',
      gradient: "from-amber-500 to-orange-600",
      bg: "bg-amber-50 dark:bg-amber-950/30",
      border: "border-amber-100 dark:border-amber-900/40",
      badge: "Code AI",
      badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#080810] flex flex-col font-sans text-gray-800 dark:text-gray-100 transition-colors duration-500 overflow-x-hidden">

      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] left-[-5%] w-[700px] h-[700px] rounded-full bg-gradient-to-br from-violet-400/20 to-purple-500/10 dark:from-violet-600/10 dark:to-purple-700/5 blur-[120px]" />
        <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-cyan-400/15 to-sky-500/10 dark:from-cyan-600/8 dark:to-sky-700/5 blur-[100px]" />
        <div className="absolute bottom-[10%] left-[20%] w-[600px] h-[400px] rounded-full bg-gradient-to-tr from-emerald-400/10 to-teal-500/8 dark:from-emerald-600/6 dark:to-teal-700/4 blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 flex justify-between items-center px-6 lg:px-12 py-4 backdrop-blur-xl bg-white/80 dark:bg-[#080810]/80 border-b border-gray-200/60 dark:border-white/5 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <img src="/logo.png" alt="AccessTech" className="h-6 w-6 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
              <span className="text-white font-black text-sm absolute">A</span>
            </div>
          </div>
          <span className="font-black text-xl tracking-tight bg-gradient-to-r from-violet-700 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
            AccessTech
          </span>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
          <Button
            variant="ghost"
            onClick={() => navigate('/login')}
            className="text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl text-sm"
          >
            {t('login')}
          </Button>
          <Button
            onClick={() => navigate('/signup')}
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold rounded-xl px-5 shadow-lg shadow-violet-500/25 transition-all hover:shadow-violet-500/40 hover:-translate-y-0.5 text-sm"
          >
            {t('signup')}
          </Button>
        </div>
      </nav>

      <main className="flex-grow relative z-10">

        {/* Hero */}
        <section className="px-6 lg:px-20 pt-24 pb-20 text-center max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-100/80 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800/50 text-violet-700 dark:text-violet-300 text-xs font-bold tracking-wider uppercase mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
            {t('hero_subtitle')}
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-8 text-gray-900 dark:text-white">
            {t('welcome').split(' ').map((word, i) => (
              <span key={i} className={i % 2 === 0 ? '' : 'bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent'}>
                {word}{' '}
              </span>
            ))}
          </h1>

          <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            {t('hero_desc')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/signup')}
              className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-lg font-bold rounded-2xl shadow-2xl hover:shadow-gray-900/30 dark:hover:shadow-white/20 hover:-translate-y-1 transition-all duration-300 h-14 px-10 group"
            >
              {t('get_started')}
              <Zap className="w-5 h-5 ml-2 text-yellow-400 dark:text-yellow-500 group-hover:scale-125 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/login')}
              className="bg-white/60 dark:bg-white/5 backdrop-blur-sm border-2 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 text-lg font-bold rounded-2xl hover:border-violet-400 dark:hover:border-violet-500/50 hover:-translate-y-1 transition-all duration-300 h-14 px-10"
            >
              <Globe className="w-5 h-5 mr-2" />
              {t('login')}
            </Button>
          </div>

          {/* Stats Row removed */}
        </section>

        {/* Features */}
        <section className="py-24 px-6 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white mb-4">
                {t('features')}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">Four intelligent tools, one unified learning experience.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f, idx) => (
                <div
                  key={f.key}
                  className={`relative group rounded-3xl p-7 border ${f.border} ${f.bg} hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden cursor-default`}
                >
                  {/* Gradient orb bg */}
                  <div className={`absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br ${f.gradient} opacity-10 group-hover:opacity-20 blur-2xl transition-opacity`} />

                  <div className="relative z-10">
                    <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest mb-5 ${f.badgeColor}`}>
                      {f.badge}
                    </span>

                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {f.icon ? (
                        <span className="text-2xl text-white">{f.icon}</span>
                      ) : (
                        <f.IconComp className="w-6 h-6 text-white" />
                      )}
                    </div>

                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2 tracking-tight">
                      {t(f.key)}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {t(f.descKey)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-24 px-6 lg:px-20">
          <div className="max-w-5xl mx-auto">
            <div className="relative rounded-[2.5rem] overflow-hidden bg-gray-900 dark:bg-[#0d0d1a] border border-white/5">
              {/* Decorative */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
              </div>

              <div className="relative z-10 p-10 md:p-14">
                <div className="grid md:grid-cols-2 gap-12 items-start">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-lg bg-violet-500/20 text-violet-300 text-xs font-black uppercase tracking-widest mb-6">
                      Get in Touch
                    </span>
                    <h2 className="text-4xl font-black text-white mb-4 tracking-tight">{t('contact')}</h2>
                    <p className="text-gray-400 text-lg mb-8 leading-relaxed">{t('contact_desc')}</p>

                    <div className="space-y-5">
                      {[
                        { Icon: Mail, text: 'supportaccesstech@gmail.com' },
                        { Icon: Phone, text: '+91 6380906053' },
                        { Icon: MapPin, text: t('address') },
                      ].map(({ Icon, text }) => (
                        <div key={text} className="flex items-center gap-4 group">
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-violet-500/20 group-hover:border-violet-500/30 transition-colors">
                            <Icon className="w-5 h-5 text-gray-400 group-hover:text-violet-400 transition-colors" />
                          </div>
                          <span className="text-gray-300 group-hover:text-white transition-colors text-sm font-medium">{text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                      <Input
                        type="text" id="name"
                        placeholder={t('name')}
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="bg-white/5 border-white/10 text-white placeholder-gray-500 h-12 rounded-xl focus-visible:ring-violet-500 focus-visible:border-violet-500"
                      />
                      <Input
                        type="email" id="email"
                        placeholder={t('email')}
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="bg-white/5 border-white/10 text-white placeholder-gray-500 h-12 rounded-xl focus-visible:ring-violet-500 focus-visible:border-violet-500"
                      />
                      <textarea
                        id="message"
                        placeholder={t('message')}
                        rows="4"
                        value={formData.message}
                        onChange={handleTextareaChange}
                        required
                        className="w-full px-4 py-3 bg-white/5 text-white border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 placeholder-gray-500 resize-none text-sm transition-all"
                      />
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-12 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-violet-500/25 transition-all"
                      >
                        {isSubmitting ? (
                          <><Loader2 className="w-4 h-4 animate-spin mr-2" />{t('sending')}</>
                        ) : t('send_message')}
                      </Button>
                      {submitStatus.message && (
                        <div className={`p-3 rounded-xl text-sm font-medium ${submitStatus.type === 'success' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/20' : 'bg-red-500/20 text-red-300 border border-red-500/20'}`}>
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

      <footer className="relative z-10 py-8 text-center border-t border-gray-200/60 dark:border-white/5">
        <p className="text-gray-400 dark:text-gray-500 text-sm font-medium">
          &copy; {new Date().getFullYear()} {t('footer_rights')}
        </p>
      </footer>
    </div>
  );
}