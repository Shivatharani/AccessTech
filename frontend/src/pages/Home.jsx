import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Globe, Brain, Zap, Mail, Phone, MapPin, Loader2 } from 'lucide-react';
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
      gradient: "from-violet-400 to-purple-500",
      bg: "bg-violet-50",
      border: "border-violet-200",
      badge: "AI Tutor",
      badgeColor: "bg-violet-100 text-violet-700",
      dot: "bg-violet-400",
    },
    {
      icon: null,
      IconComp: Globe,
      key: 'pathpilot',
      descKey: 'pathpilot_desc',
      gradient: "from-sky-400 to-cyan-500",
      bg: "bg-sky-50",
      border: "border-sky-200",
      badge: "Career Map",
      badgeColor: "bg-sky-100 text-sky-700",
      dot: "bg-sky-400",
    },
    {
      icon: null,
      IconComp: Brain,
      key: 'termcrystal',
      descKey: 'termcrystal_desc',
      gradient: "from-emerald-400 to-teal-500",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      badge: "Dictionary",
      badgeColor: "bg-emerald-100 text-emerald-700",
      dot: "bg-emerald-400",
    },
    {
      icon: null,
      IconComp: Zap,
      key: 'syntaxsage',
      descKey: 'syntaxsage_desc',
      gradient: "from-amber-400 to-orange-500",
      bg: "bg-amber-50",
      border: "border-amber-200",
      badge: "Code AI",
      badgeColor: "bg-amber-100 text-amber-700",
      dot: "bg-amber-400",
    },
  ];

  return (
    <div className="min-h-screen font-sans text-gray-700 overflow-x-hidden"
      style={{ backgroundColor: '#e8f5e9' }}>

      {/* Soft ambient shapes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, #a5d6a7, transparent)' }} />
        <div className="absolute top-[40%] right-[-8%] w-[400px] h-[400px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #80cbc4, transparent)' }} />
        <div className="absolute bottom-[5%] left-[25%] w-[500px] h-[300px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #c8e6c9, transparent)' }} />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 flex justify-between items-center px-6 lg:px-12 py-4 sticky top-0"
        style={{ backgroundColor: 'rgba(232,245,233,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #c8e6c9' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
            style={{ background: 'linear-gradient(135deg, #66bb6a, #43a047)' }}>
            <span className="text-white font-black text-sm">A</span>
          </div>
          <span className="font-black text-xl tracking-tight" style={{ color: '#2e7d32' }}>
            AccessTech
          </span>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 rounded-xl font-semibold text-sm transition-all hover:bg-green-100"
            style={{ color: '#388e3c' }}>
            {t('login')}
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="px-5 py-2 rounded-xl font-bold text-sm text-white shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #66bb6a, #43a047)' }}>
            {t('signup')}
          </button>
        </div>
      </nav>

      <main className="flex-grow relative z-10">

        {/* Hero */}
        <section className="px-6 lg:px-20 pt-24 pb-20 text-center max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-8 border"
            style={{ backgroundColor: '#c8e6c9', borderColor: '#a5d6a7', color: '#2e7d32' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#43a047' }} />
            {t('hero_subtitle')}
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight mb-8" style={{ color: '#1b5e20' }}>
            {t('welcome').split(' ').map((word, i) => (
              <span key={i} className={i % 2 !== 0 ? 'italic' : ''} style={i % 2 !== 0 ? { color: '#43a047' } : {}}>
                {word}{' '}
              </span>
            ))}
          </h1>

          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed font-medium" style={{ color: '#4caf50' }}>
            {t('hero_desc')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/signup')}
              className="flex items-center justify-center gap-2 h-14 px-10 rounded-2xl text-white font-bold text-lg shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl"
              style={{ background: 'linear-gradient(135deg, #66bb6a, #2e7d32)' }}>
              {t('get_started')}
              <Zap className="w-5 h-5 text-yellow-200" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="flex items-center justify-center gap-2 h-14 px-10 rounded-2xl font-bold text-lg border-2 transition-all hover:-translate-y-1 bg-white/60"
              style={{ borderColor: '#a5d6a7', color: '#388e3c' }}>
              <Globe className="w-5 h-5" />
              {t('login')}
            </button>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-6 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4" style={{ color: '#1b5e20' }}>
                {t('features')}
              </h2>
              <p className="text-lg max-w-xl mx-auto" style={{ color: '#66bb6a' }}>
                Four intelligent tools, one unified learning experience.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {features.map((f) => (
                <div key={f.key}
                  className={`relative group rounded-3xl p-7 border ${f.border} ${f.bg} hover:shadow-xl hover:-translate-y-2 transition-all duration-500 overflow-hidden cursor-default`}>
                  <div className={`absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br ${f.gradient} opacity-10 group-hover:opacity-25 blur-2xl transition-opacity`} />
                  <div className="relative z-10">
                    <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest mb-5 ${f.badgeColor}`}>
                      {f.badge}
                    </span>
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      {f.icon ? <span className="text-2xl text-white">{f.icon}</span>
                        : <f.IconComp className="w-6 h-6 text-white" />}
                    </div>
                    <h3 className="text-lg font-black mb-2 tracking-tight" style={{ color: '#1b5e20' }}>
                      {t(f.key)}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#5a8a5a' }}>
                      {t(f.descKey)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-20 px-6 lg:px-20">
          <div className="max-w-5xl mx-auto">
            <div className="relative rounded-[2.5rem] overflow-hidden border"
              style={{ backgroundColor: '#f1f8e9', borderColor: '#c8e6c9' }}>
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-72 h-72 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-40"
                  style={{ backgroundColor: '#a5d6a7' }} />
                <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 opacity-30"
                  style={{ backgroundColor: '#80cbc4' }} />
              </div>
              <div className="relative z-10 p-10 md:p-14">
                <div className="grid md:grid-cols-2 gap-12 items-start">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest mb-6"
                      style={{ backgroundColor: '#c8e6c9', color: '#2e7d32' }}>
                      Get in Touch
                    </span>
                    <h2 className="text-4xl font-black mb-4 tracking-tight" style={{ color: '#1b5e20' }}>{t('contact')}</h2>
                    <p className="text-lg mb-8 leading-relaxed" style={{ color: '#4caf50' }}>{t('contact_desc')}</p>
                    <div className="space-y-5">
                      {[
                        { Icon: Mail, text: 'supportaccesstech@gmail.com' },
                        { Icon: Phone, text: '+91 6380906053' },
                        { Icon: MapPin, text: t('address') },
                      ].map(({ Icon, text }) => (
                        <div key={text} className="flex items-center gap-4 group">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center border transition-colors group-hover:border-green-400"
                            style={{ backgroundColor: '#e8f5e9', borderColor: '#c8e6c9' }}>
                            <Icon className="w-5 h-5" style={{ color: '#66bb6a' }} />
                          </div>
                          <span className="text-sm font-medium" style={{ color: '#388e3c' }}>{text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl p-6 border"
                    style={{ backgroundColor: 'white', borderColor: '#c8e6c9' }}>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                      <Input type="text" id="name" placeholder={t('name')} value={formData.name}
                        onChange={handleInputChange} required
                        className="border-green-200 focus-visible:ring-green-400 h-12 rounded-xl" />
                      <Input type="email" id="email" placeholder={t('email')} value={formData.email}
                        onChange={handleInputChange} required
                        className="border-green-200 focus-visible:ring-green-400 h-12 rounded-xl" />
                      <textarea id="message" placeholder={t('message')} rows="4"
                        value={formData.message} onChange={handleTextareaChange} required
                        className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-300 resize-none text-sm transition-all"
                        style={{ borderColor: '#c8e6c9', backgroundColor: '#f9fbe7' }} />
                      <button type="submit" disabled={isSubmitting}
                        className="w-full h-12 rounded-xl text-white font-bold shadow-md transition-all hover:shadow-lg"
                        style={{ background: 'linear-gradient(135deg, #66bb6a, #43a047)' }}>
                        {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin inline mr-2" />{t('sending')}</> : t('send_message')}
                      </button>
                      {submitStatus.message && (
                        <div className={`p-3 rounded-xl text-sm font-medium ${submitStatus.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
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

      <footer className="relative z-10 py-8 text-center border-t" style={{ borderColor: '#c8e6c9', color: '#81c784' }}>
        <p className="text-sm font-medium">
          &copy; {new Date().getFullYear()} {t('footer_rights')}
        </p>
      </footer>
    </div>
  );
}