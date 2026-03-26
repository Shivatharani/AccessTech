import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Sparkles, Map, BookOpen, Code2, LayoutDashboard, BrainCircuit,
  ArrowRight, Accessibility, Languages, Zap, BarChart3, TrendingUp, Award
} from "lucide-react";
import Navbar from "../components/Navbar";

export default function Welcome() {
  const { t } = useTranslation();
  const nav = useNavigate();

  const features = [
    {
      title: t('luminatutor'),
      icon: <Sparkles size={28} />,
      desc: t('luminatutor_desc_long'),
      path: "/tutor",
      gradient: "linear-gradient(135deg, #ce93d8, #ab47bc)",
      iconBg: "#f3e5f5",
      iconColor: "#8e24aa",
      border: "#e1bee7",
      hoverBorder: "#ce93d8",
      badge: "Most Popular",
      badgeBg: "#f3e5f5",
      badgeColor: "#7b1fa2",
      bg: "#fdf4ff",
    },
    {
      title: t('pathpilot'),
      icon: <Map size={28} />,
      desc: t('pathpilot_desc_long'),
      path: "/mentor",
      gradient: "linear-gradient(135deg, #81d4fa, #29b6f6)",
      iconBg: "#e1f5fe",
      iconColor: "#0288d1",
      border: "#b3e5fc",
      hoverBorder: "#81d4fa",
      badge: "Career AI",
      badgeBg: "#e1f5fe",
      badgeColor: "#01579b",
      bg: "#f0fbff",
    },
    {
      title: t('termcrystal'),
      icon: <BookOpen size={28} />,
      desc: t('termcrystal_desc_long_welcome'),
      path: "/dictionary",
      gradient: "linear-gradient(135deg, #a5d6a7, #66bb6a)",
      iconBg: "#e8f5e9",
      iconColor: "#388e3c",
      border: "#c8e6c9",
      hoverBorder: "#a5d6a7",
      badge: "Dictionary",
      badgeBg: "#e8f5e9",
      badgeColor: "#1b5e20",
      bg: "#f1f8e9",
    },
    {
      title: t('syntaxsage'),
      icon: <Code2 size={28} />,
      desc: t('syntaxsage_desc_long'),
      path: "/codehelper",
      gradient: "linear-gradient(135deg, #ffcc80, #ffa726)",
      iconBg: "#fff3e0",
      iconColor: "#e65100",
      border: "#ffe0b2",
      hoverBorder: "#ffcc80",
      badge: "Dev Tool",
      badgeBg: "#fff3e0",
      badgeColor: "#bf360c",
      bg: "#fffbf0",
    }
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#e8f5e9' }}>
      <Navbar />

      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[100px] opacity-30"
          style={{ backgroundColor: '#c8e6c9' }} />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] opacity-20"
          style={{ backgroundColor: '#b2dfdb' }} />
      </div>

      <main className="flex-1 relative z-10 max-w-7xl mx-auto px-6 py-16 w-full">

        {/* Hero */}
        <div className="text-center mb-20 space-y-6">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest border"
            style={{ backgroundColor: '#c8e6c9', borderColor: '#a5d6a7', color: '#2e7d32' }}>
            <Zap size={14} className="fill-current" />
            Welcome to AccessTech
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none" style={{ color: '#1b5e20' }}>
            Your Personal{' '}
            <span style={{ background: 'linear-gradient(135deg, #66bb6a, #26a69a, #42a5f5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              AI Hub
            </span>
          </h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed font-medium" style={{ color: '#4caf50' }}>
            {t('hero_description_welcome')}
          </p>
        </div>

        {/* Feature Grid */}
        <div className="mb-24">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black tracking-tight" style={{ color: '#1b5e20' }}>The Mastery Suite</h2>
              <p className="mt-1 font-medium" style={{ color: '#66bb6a' }}>Four AI-powered tools at your disposal.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, idx) => (
              <div key={idx}
                className="group p-8 rounded-3xl shadow-sm border cursor-pointer relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
                style={{ backgroundColor: feature.bg, borderColor: feature.border }}
                onClick={() => nav(feature.path)}>
                <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-10 group-hover:opacity-20 blur-2xl transition-all duration-700"
                  style={{ background: feature.gradient }} />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm"
                      style={{ backgroundColor: feature.iconBg, color: feature.iconColor }}>
                      {feature.icon}
                    </div>
                    <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest"
                      style={{ backgroundColor: feature.badgeBg, color: feature.badgeColor }}>
                      {feature.badge}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black tracking-tight mb-3 uppercase transition-colors" style={{ color: '#1b5e20' }}>
                    {feature.title}
                  </h3>
                  <p className="leading-relaxed font-medium mb-6" style={{ color: '#5a8a5a' }}>
                    {feature.desc}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: '#e0e0e0' }}>
                    <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#9e9e9e' }}>
                      {t('get_started') || "Get Started"}
                    </span>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:translate-x-1 transition-transform duration-300"
                      style={{ background: feature.gradient }}>
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {[
            { Icon: Languages, title: t('multilingual'), desc: t('multilingual_desc'), bg: '#f3e5f5', color: '#8e24aa' },
            { Icon: Accessibility, title: t('accessible'), desc: t('accessible_desc'), bg: '#e1f5fe', color: '#0288d1' },
            { Icon: BrainCircuit, title: t('adaptive'), desc: t('adaptive_desc'), bg: '#e8f5e9', color: '#388e3c' },
          ].map(({ Icon, title, desc, bg, color }) => (
            <div key={title} className="p-8 rounded-3xl text-center hover:shadow-xl transition-all duration-300 group border"
              style={{ backgroundColor: 'white', borderColor: '#e0e0e0' }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: bg, color }}>
                <Icon size={28} />
              </div>
              <h4 className="text-lg font-black mb-2" style={{ color: '#1b5e20' }}>{title}</h4>
              <p className="text-sm font-medium leading-relaxed" style={{ color: '#81c784' }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Dashboard CTA */}
        <div className="relative rounded-[2.5rem] p-10 md:p-16 overflow-hidden border"
          style={{ background: 'linear-gradient(135deg, #f1f8e9, #e0f2f1)', borderColor: '#c8e6c9' }}>
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-30"
            style={{ backgroundColor: '#a5d6a7' }} />
          <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: '#80cbc4' }} />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="w-16 h-16 text-white rounded-2xl flex items-center justify-center shadow-xl"
                style={{ background: 'linear-gradient(135deg, #66bb6a, #26a69a)' }}>
                <LayoutDashboard size={32} />
              </div>
              <h2 className="text-4xl font-black tracking-tight" style={{ color: '#1b5e20' }}>
                Omni-Dashboard
              </h2>
              <p className="text-lg font-medium leading-relaxed" style={{ color: '#4caf50' }}>
                {t('dashboard_intro_desc')}
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  { Icon: BarChart3, label: t('activity_heatmaps'), color: '#66bb6a' },
                  { Icon: TrendingUp, label: t('score_analytics'), color: '#26a69a' },
                ].map(({ Icon, label, color }) => (
                  <div key={label} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border"
                    style={{ backgroundColor: 'white', borderColor: '#c8e6c9' }}>
                    <Icon size={18} style={{ color }} />
                    <span className="text-sm font-bold" style={{ color: '#388e3c' }}>{label}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => nav("/dashboard")}
                className="flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-bold text-base shadow-xl transition-all hover:-translate-y-0.5 hover:shadow-2xl"
                style={{ background: 'linear-gradient(135deg, #66bb6a, #26a69a)' }}>
                {t('explore_my_dashboard')} <ArrowRight size={20} />
              </button>
            </div>

            <div className="relative">
              <div className="rounded-3xl overflow-hidden aspect-video relative group border"
                style={{ borderColor: '#c8e6c9', backgroundColor: '#e8f5e9' }}>
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800"
                  alt="Dashboard Preview"
                  className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-700"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="p-6 rounded-2xl border"
                    style={{ backgroundColor: 'rgba(255,255,255,0.6)', borderColor: '#c8e6c9' }}>
                    <Award className="w-12 h-12 animate-pulse" style={{ color: '#66bb6a' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t py-10 text-center text-sm font-bold uppercase tracking-widest"
        style={{ borderColor: '#c8e6c9', color: '#a5d6a7' }}>
        &copy; {new Date().getFullYear()} AccessTech Intelligence Hub • Empowering Every Mind
      </footer>
    </div>
  );
}