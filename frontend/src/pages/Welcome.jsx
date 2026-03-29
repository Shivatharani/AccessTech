import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Sparkles, Map, BookOpen, Code2, LayoutDashboard, BrainCircuit,
  ArrowRight, Accessibility, Languages, Zap, BarChart3, TrendingUp, Award
} from "lucide-react";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export default function Welcome() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const { username } = useContext(AuthContext);

  const features = [
    {
      title: t('luminatutor'),
      icon: <Sparkles size={28} />,
      desc: t('luminatutor_desc_long'),
      path: "/tutor",
      gradientClasses: "bg-gradient-to-br from-fuchsia-300 to-fuchsia-500 dark:from-fuchsia-600 dark:to-fuchsia-800",
      iconClasses: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/50 dark:text-fuchsia-400",
      borderClasses: "border-fuchsia-200 hover:border-fuchsia-300 dark:border-fuchsia-900/50 dark:hover:border-fuchsia-800",
      badge: "Most Popular",
      badgeClasses: "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/50 dark:text-fuchsia-300",
      bgClasses: "bg-fuchsia-50 dark:bg-fuchsia-950/20",
    },
    {
      title: t('pathpilot'),
      icon: <Map size={28} />,
      desc: t('pathpilot_desc_long'),
      path: "/mentor",
      gradientClasses: "bg-gradient-to-br from-sky-300 to-sky-500 dark:from-sky-600 dark:to-sky-800",
      iconClasses: "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-400",
      borderClasses: "border-sky-200 hover:border-sky-300 dark:border-sky-900/50 dark:hover:border-sky-800",
      badge: "Career AI",
      badgeClasses: "bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300",
      bgClasses: "bg-sky-50 dark:bg-sky-950/20",
    },
    {
      title: t('termcrystal'),
      icon: <BookOpen size={28} />,
      desc: t('termcrystal_desc_long_welcome'),
      path: "/dictionary",
      gradientClasses: "bg-gradient-to-br from-emerald-300 to-emerald-500 dark:from-emerald-600 dark:to-emerald-800",
      iconClasses: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400",
      borderClasses: "border-emerald-200 hover:border-emerald-300 dark:border-emerald-900/50 dark:hover:border-emerald-800",
      badge: "Dictionary",
      badgeClasses: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300",
      bgClasses: "bg-emerald-50 dark:bg-emerald-950/20",
    },
    {
      title: t('syntaxsage'),
      icon: <Code2 size={28} />,
      desc: t('syntaxsage_desc_long'),
      path: "/codehelper",
      gradientClasses: "bg-gradient-to-br from-orange-300 to-orange-500 dark:from-orange-600 dark:to-orange-800",
      iconClasses: "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400",
      borderClasses: "border-orange-200 hover:border-orange-300 dark:border-orange-900/50 dark:hover:border-orange-800",
      badge: "Dev Tool",
      badgeClasses: "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300",
      bgClasses: "bg-orange-50 dark:bg-orange-950/20",
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-green-50 dark:bg-gray-950">
      <Navbar />

      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[100px] opacity-30 bg-green-200 dark:bg-green-900/20" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] opacity-20 bg-teal-200 dark:bg-teal-900/20" />
      </div>

      <main className="flex-1 relative z-10 max-w-7xl mx-auto px-6 py-16 w-full">

        {/* Hero */}
        <div className="text-center mb-20 space-y-6">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest border bg-green-100 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-800/50 dark:text-green-400">
            <Zap size={14} className="fill-current" />
            Your Personal AI Hub
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none text-green-900 dark:text-green-50 uppercase">
            WELCOME BACK,<br className="md:hidden" />{' '}
            <span className="bg-gradient-to-br from-green-400 via-teal-500 to-blue-500 bg-clip-text text-transparent">
              {username ? username : "GUEST"}
            </span>
          </h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed font-medium text-green-600 dark:text-green-400">
            {t('hero_description_welcome')}
          </p>
        </div>

        {/* Feature Grid */}
        <div className="mb-24">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-green-900 dark:text-green-50">The Mastery Suite</h2>
              <p className="mt-1 font-medium text-green-500 dark:text-green-400">Four AI-powered tools at your disposal.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, idx) => (
              <div key={idx}
                className={`group p-8 rounded-3xl shadow-sm border cursor-pointer relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 ${feature.bgClasses} ${feature.borderClasses}`}
                onClick={() => nav(feature.path)}>
                <div className={`absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-10 group-hover:opacity-20 blur-2xl transition-all duration-700 ${feature.gradientClasses}`} />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm ${feature.iconClasses}`}>
                      {feature.icon}
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${feature.badgeClasses}`}>
                      {feature.badge}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black tracking-tight mb-3 uppercase transition-colors text-green-900 dark:text-green-50">
                    {feature.title}
                  </h3>
                  <p className="leading-relaxed font-medium mb-6 text-green-700 dark:text-green-300/80">
                    {feature.desc}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                    <span className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
                      {t('get_started') || "Get Started"}
                    </span>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:translate-x-1 transition-transform duration-300 ${feature.gradientClasses}`}>
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
            { Icon: Languages, title: t('multilingual'), desc: t('multilingual_desc'), iconClasses: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400' },
            { Icon: Accessibility, title: t('accessible'), desc: t('accessible_desc'), iconClasses: 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-400' },
            { Icon: BrainCircuit, title: t('adaptive'), desc: t('adaptive_desc'), iconClasses: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400' },
          ].map(({ Icon, title, desc, iconClasses }) => (
            <div key={title} className="p-8 rounded-3xl text-center hover:shadow-xl transition-all duration-300 group border bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-800">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform ${iconClasses}`}>
                <Icon size={28} />
              </div>
              <h4 className="text-lg font-black mb-2 text-green-900 dark:text-green-50">{title}</h4>
              <p className="text-sm font-medium leading-relaxed text-green-500 dark:text-green-400">{desc}</p>
            </div>
          ))}
        </div>

        {/* Dashboard CTA */}
        <div className="relative rounded-[2.5rem] p-10 md:p-16 overflow-hidden border bg-gradient-to-br from-green-50 to-teal-50 border-green-200 dark:from-green-950/40 dark:to-teal-950/40 dark:border-green-900/50">
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-30 bg-green-300 dark:bg-green-700/20" />
          <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full blur-3xl opacity-20 bg-teal-300 dark:bg-teal-700/20" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="w-16 h-16 text-white rounded-2xl flex items-center justify-center shadow-xl bg-gradient-to-br from-green-400 to-teal-500 dark:from-green-600 dark:to-teal-700">
                <LayoutDashboard size={32} />
              </div>
              <h2 className="text-4xl font-black tracking-tight text-green-900 dark:text-green-50">
                Omni-ProgressHub
              </h2>
              <p className="text-lg font-medium leading-relaxed text-green-600 dark:text-green-400">
                {t('dashboard_intro_desc')}
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  { Icon: BarChart3, label: t('activity_heatmaps'), colorClass: 'text-green-500 dark:text-green-400' },
                  { Icon: TrendingUp, label: t('score_analytics'), colorClass: 'text-teal-500 dark:text-teal-400' },
                ].map(({ Icon, label, colorClass }) => (
                  <div key={label} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border bg-white border-green-200 dark:bg-gray-900/80 dark:border-green-900/50">
                    <Icon size={18} className={colorClass} />
                    <span className="text-sm font-bold text-green-700 dark:text-green-300">{label}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => nav("/dashboard")}
                className="flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-bold text-base shadow-xl transition-all hover:-translate-y-0.5 hover:shadow-2xl bg-gradient-to-br from-green-400 to-teal-500 dark:from-green-600 dark:to-teal-700">
                {t('explore_my_dashboard')} <ArrowRight size={20} />
              </button>
            </div>

            <div className="relative">
              <div className="rounded-3xl overflow-hidden aspect-video relative group border border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-gray-900">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800"
                  alt="ProgressHub Preview"
                  className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-700 dark:opacity-30 dark:group-hover:opacity-50"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="p-6 rounded-2xl border bg-white/60 border-green-200 dark:bg-gray-950/60 dark:border-green-900/50">
                    <Award className="w-12 h-12 animate-pulse text-green-400 dark:text-green-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t py-10 text-center text-sm font-bold uppercase tracking-widest border-green-200 text-green-500 dark:border-green-900/50 dark:text-green-700">
        &copy; {new Date().getFullYear()} AccessTech Intelligence Hub • Empowering Every Mind
      </footer>
    </div>
  );
}