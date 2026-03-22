import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Sparkles, Map, BookOpen, Code2, LayoutDashboard, BrainCircuit,
  ArrowRight, Accessibility, Languages, Zap, BarChart3, TrendingUp, Award
} from "lucide-react";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";

export default function Welcome() {
  const { t } = useTranslation();
  const nav = useNavigate();

  const features = [
    {
      title: t('luminatutor'),
      icon: <Sparkles size={28} />,
      desc: t('luminatutor_desc_long'),
      path: "/tutor",
      gradient: "from-violet-500 to-purple-600",
      iconBg: "bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400",
      border: "hover:border-violet-300 dark:hover:border-violet-700",
      badge: "Most Popular",
      badgeColor: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
    },
    {
      title: t('pathpilot'),
      icon: <Map size={28} />,
      desc: t('pathpilot_desc_long'),
      path: "/mentor",
      gradient: "from-cyan-500 to-sky-600",
      iconBg: "bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400",
      border: "hover:border-sky-300 dark:hover:border-sky-700",
      badge: "Career AI",
      badgeColor: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    },
    {
      title: t('termcrystal'),
      icon: <BookOpen size={28} />,
      desc: t('termcrystal_desc_long_welcome'),
      path: "/dictionary",
      gradient: "from-emerald-500 to-teal-600",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400",
      border: "hover:border-emerald-300 dark:hover:border-emerald-700",
      badge: "Dictionary",
      badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    },
    {
      title: t('syntaxsage'),
      icon: <Code2 size={28} />,
      desc: t('syntaxsage_desc_long'),
      path: "/codehelper",
      gradient: "from-amber-500 to-orange-600",
      iconBg: "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400",
      border: "hover:border-amber-300 dark:hover:border-amber-700",
      badge: "Dev Tool",
      badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#080810] flex flex-col transition-colors duration-500">
      <Navbar />

      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-violet-400/10 dark:bg-violet-600/5 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-400/8 dark:bg-cyan-600/4 blur-[120px]" />
      </div>

      <main className="flex-1 relative z-10 max-w-7xl mx-auto px-6 py-16 w-full">

        {/* Hero */}
        <div className="text-center mb-20 space-y-6">
          <div className="inline-flex items-center gap-2 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-violet-200 dark:border-violet-800/50">
            <Zap size={14} className="fill-current" />
            {t('welcome_to_accesstech') || "Welcome to AccessTech"}
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-8xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
            {t('your_personal') || "Your Personal"}{' '}
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 dark:from-violet-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
              {t('ai_intelligence_hub') || "AI Hub"}
            </span>
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed font-medium">
            {t('hero_description_welcome')}
          </p>
        </div>

        {/* Feature Grid */}
        <div className="mb-24">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                {t('the_mastery_suite') || "The Mastery Suite"}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">
                {t('deep_dives_intro') || "Four AI-powered tools at your disposal."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className={`group bg-white dark:bg-gray-900/60 backdrop-blur-sm p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 ${feature.border} transition-all duration-500 hover:shadow-2xl cursor-pointer relative overflow-hidden`}
                onClick={() => nav(feature.path)}
              >
                {/* Background gradient orb */}
                <div className={`absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-to-br ${feature.gradient} opacity-5 group-hover:opacity-15 blur-2xl transition-all duration-700`} />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl ${feature.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                      {feature.icon}
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${feature.badgeColor}`}>
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-3 uppercase group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium mb-6">
                    {feature.desc}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5">
                    <span className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
                      {t('get_started') || "Get Started"}
                    </span>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white shadow-lg group-hover:translate-x-1 transition-transform duration-300`}>
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
            { Icon: Languages, title: t('multilingual'), desc: t('multilingual_desc'), color: "violet" },
            { Icon: Accessibility, title: t('accessible'), desc: t('accessible_desc'), color: "purple" },
            { Icon: BrainCircuit, title: t('adaptive'), desc: t('adaptive_desc'), color: "indigo" },
          ].map(({ Icon, title, desc, color }) => (
            <div key={title} className={`p-8 bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-white/5 rounded-3xl text-center hover:shadow-xl transition-all duration-300 group`}>
              <div className={`w-14 h-14 rounded-2xl bg-${color}-100 dark:bg-${color}-900/30 text-${color}-600 dark:text-${color}-400 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform`}>
                <Icon size={28} />
              </div>
              <h4 className="text-lg font-black text-gray-900 dark:text-white mb-2">{title}</h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Dashboard CTA */}
        <div className="relative bg-gray-900 dark:bg-[#0d0d1a] rounded-[2.5rem] p-10 md:p-16 overflow-hidden border border-white/5">
          <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-purple-600/15 rounded-full blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-violet-500/30">
                <LayoutDashboard size={32} />
              </div>
              <h2 className="text-4xl font-black text-white tracking-tight">
                {t('omni_dashboard') || "Omni-Dashboard"}
              </h2>
              <p className="text-gray-400 text-lg font-medium leading-relaxed">
                {t('dashboard_intro_desc')}
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl">
                  <BarChart3 className="text-violet-400" size={18} />
                  <span className="text-gray-300 text-sm font-bold">{t('activity_heatmaps')}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl">
                  <TrendingUp className="text-emerald-400" size={18} />
                  <span className="text-gray-300 text-sm font-bold">{t('score_analytics')}</span>
                </div>
              </div>
              <Button
                onClick={() => nav("/dashboard")}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold px-8 py-6 rounded-2xl text-base shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 transition-all hover:-translate-y-0.5 flex items-center gap-3"
              >
                {t('explore_my_dashboard')} <ArrowRight size={20} />
              </Button>
            </div>

            <div className="relative">
              <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden aspect-video relative group">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800"
                  alt="Dashboard Preview"
                  className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-700 group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                    <Award className="text-violet-400 w-12 h-12 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-gray-200/60 dark:border-white/5 py-10 text-center text-gray-400 text-sm font-bold uppercase tracking-widest">
        &copy; {new Date().getFullYear()} {t('footer_text') || "AccessTech Intelligence Hub • Empowering Every Mind"}
      </footer>
    </div>
  );
}