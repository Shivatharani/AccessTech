import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
  Sparkles, 
  Map, 
  BookOpen, 
  Code2, 
  LayoutDashboard, 
  BrainCircuit, 
  ArrowRight,
  Accessibility,
  Languages,
  Zap,
  BarChart3,
  TrendingUp,
  Award
} from "lucide-react";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";

export default function Welcome() {
  const { t } = useTranslation();
  const nav = useNavigate();

  const features = [
    {
      title: t('luminatutor'),
      icon: <Sparkles className="text-indigo-500" size={32} />,
      desc: t('luminatutor_desc_long'),
      path: "/tutor",
      accent: "indigo"
    },
    {
      title: t('pathpilot'),
      icon: <Map className="text-sky-500" size={32} />,
      desc: t('pathpilot_desc_long'),
      path: "/mentor",
      accent: "sky"
    },
    {
      title: t('termcrystal'),
      icon: <BookOpen className="text-emerald-500" size={32} />,
      desc: t('termcrystal_desc_long_welcome'),
      path: "/dictionary",
      accent: "emerald"
    },
    {
      title: t('syntaxsage'),
      icon: <Code2 className="text-amber-500" size={32} />,
      desc: t('syntaxsage_desc_long'),
      path: "/codehelper",
      accent: "amber"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto px-6 py-16 w-full">
        {/* Hero Section */}
        <div className="text-center mb-24 space-y-8 animate-in fade-in slide-in-from-top-10 duration-1000">
          <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-6 py-2.5 rounded-full text-sm font-black uppercase tracking-widest shadow-sm">
            <Zap size={18} className="fill-current" />
            {t('welcome_to_accesstech') || "Welcome to AccessTech Intelligence"}
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
            {t('your_personal') || "Your Personal"} <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-gradient-x">{t('ai_intelligence_hub') || "AI Intelligence Hub"}</span>
          </h1>
          <p className="text-2xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto leading-relaxed font-medium">
            {t('hero_description_welcome')}
          </p>
        </div>

        {/* Feature Grid */}
        <div className="mb-20">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">{t('the_mastery_suite') || "The Mastery Suite"}</h2>
            <p className="text-xl text-slate-500 dark:text-slate-400 mb-12 font-medium">{t('deep_dives_intro') || "Deep dives into every module at your disposal."}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {features.map((feature, idx) => (
                <div 
                key={idx} 
                className="group bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all hover:shadow-2xl flex flex-col justify-between cursor-pointer relative overflow-hidden"
                onClick={() => nav(feature.path)}
                >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-${feature.accent}-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700`}></div>
                <div className="space-y-6 relative z-10">
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:bg-white dark:group-hover:bg-slate-700 transition-all shadow-inner border border-slate-100 dark:border-slate-700">
                    {feature.icon}
                    </div>
                    <h3 className="text-3xl font-black dark:text-white group-hover:text-indigo-600 transition-colors uppercase tracking-tighter">{feature.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-xl font-medium">
                    {feature.desc}
                    </p>
                </div>
                <div className="mt-10 pt-8 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between relative z-10">
                    <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{t('get_started') || "Start Learning Now"}</span>
                    <div className="bg-indigo-600 text-white p-3 rounded-2xl group-hover:translate-x-2 transition-transform shadow-lg">
                    <ArrowRight size={24} />
                    </div>
                </div>
                </div>
            ))}
            </div>
        </div>

        {/* Global Features Recap */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20 text-center">
            <div className="p-10 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-3xl border border-indigo-100/50 dark:border-indigo-900/20">
                <Languages className="mx-auto mb-6 text-indigo-600" size={48} />
                <h4 className="text-2xl font-bold mb-4 dark:text-white">{t('multilingual')}</h4>
                <p className="text-slate-500 dark:text-slate-400 font-medium">{t('multilingual_desc')}</p>
            </div>
            <div className="p-10 bg-purple-50/50 dark:bg-purple-900/10 rounded-3xl border border-purple-100/50 dark:border-purple-900/20">
                <Accessibility className="mx-auto mb-6 text-purple-600" size={48} />
                <h4 className="text-2xl font-bold mb-4 dark:text-white">{t('accessible')}</h4>
                <p className="text-slate-500 dark:text-slate-400 font-medium">{t('accessible_desc')}</p>
            </div>
            <div className="p-10 bg-amber-50/50 dark:bg-amber-900/10 rounded-3xl border border-amber-100/50 dark:border-amber-900/20">
                <BrainCircuit className="mx-auto mb-6 text-amber-600" size={48} />
                <h4 className="text-2xl font-bold mb-4 dark:text-white">{t('adaptive')}</h4>
                <p className="text-slate-500 dark:text-slate-400 font-medium">{t('adaptive_desc')}</p>
            </div>
        </div>

        {/* Dashboard Introduction Section (Moved to the end) */}
        <div className="mb-32 bg-white dark:bg-slate-900 rounded-[3rem] p-12 md:p-20 shadow-2xl border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-indigo-500/10 transition-colors"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8 relative z-10">
                    <div className="w-20 h-20 bg-indigo-600 text-white rounded-3xl flex items-center justify-center shadow-lg transform -rotate-3 group-hover:rotate-0 transition-transform">
                        <LayoutDashboard size={40} />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">{t('omni_dashboard') || "Omni-Dashboard"}</h2>
                    <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                        {t('dashboard_intro_desc')}
                    </p>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-bold bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                           <BarChart3 className="text-indigo-500" size={24} />
                           {t('activity_heatmaps')}
                        </div>
                        <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-bold bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                           <TrendingUp className="text-emerald-500" size={24} />
                           {t('score_analytics')}
                        </div>
                    </div>
                    <Button 
                        onClick={() => nav("/dashboard")}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-10 py-7 rounded-2xl text-lg shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 uppercase tracking-wider"
                    >
                        {t('explore_my_dashboard')} <ArrowRight size={20} />
                    </Button>
                </div>
                <div className="relative">
                    <div className="bg-slate-200 dark:bg-slate-800 aspect-video rounded-3xl shadow-inner border-8 border-slate-50 dark:border-slate-900 overflow-hidden relative group">
                        <img 
                            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" 
                            alt="Dashboard Preview" 
                            className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-8 rounded-full shadow-2xl">
                                <Award className="text-indigo-600 w-16 h-16 animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-12 text-center text-slate-400 text-sm font-bold uppercase tracking-widest">
        &copy; {new Date().getFullYear()} {t('footer_text') || "AccessTech Intelligence Hub • Empowering Every Mind"}
      </footer>
    </div>
  );
}
