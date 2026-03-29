import { useState, useEffect } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { useTranslation } from "react-i18next";
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
    PieChart, Pie, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";
import {
    Activity, BookOpen, Clock, Target, Code2, Map, Sparkles, ChevronRight,
    Trophy, Brain, Flame, TrendingUp, ArrowRight, Lightbulb,
    ShieldCheck, Layers, LayoutDashboard, CheckCircle2, Zap, Rocket,
    Medal, GraduationCap, Star, BookMarked, Monitor, Briefcase, User, Languages, Award
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
    const { t } = useTranslation();
    const nav = useNavigate();
    
    // Core Analytics States
    const [stats, setStats] = useState({
        total_questions: 0,
        career_progress_total: 0,
        concepts_learned: 0,
        code_analyses: 0,
        avg_quiz_score: 0
    });
    
    const [currentStreak, setCurrentStreak] = useState(0);
    const [weeklyStreak, setWeeklyStreak] = useState([false, false, false, false, false, false, false]);
    const [domainProgress, setDomainProgress] = useState([]);
    const [usageData, setUsageData] = useState([]);
    const [skillRadar, setSkillRadar] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [subjectPerf, setSubjectPerf] = useState([]);
    const [timeline, setTimeline] = useState([]);
    const [aiInsight, setAiInsight] = useState("");
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    const { username, language, level } = useContext(AuthContext);
    const email = localStorage.getItem("email");

    useEffect(() => {
        if (!email) {
            nav("/login");
            return;
        }

        API.get(`/dashboard/analytics?email=${email}`)
            .then(res => {
                const d = res.data;
                setStats({
                    total_questions: d.total_questions || 0,
                    career_progress_total: d.career_progress_total || 0,
                    concepts_learned: d.concepts_learned || 0,
                    code_analyses: d.code_analyses || 0,
                    avg_quiz_score: d.avg_quiz_score || 0
                });
                
                setCurrentStreak(d.current_streak || 0);
                setWeeklyStreak(d.weekly_streak || [false, false, false, false, false, false, false]);
                setDomainProgress(d.domain_progress || []);
                
                if (d.module_usage) {
                    setUsageData(Object.keys(d.module_usage).map(key => ({
                        name: key, value: d.module_usage[key]
                    })).filter(item => item.value > 0));
                }
                
                setSkillRadar(d.charts?.skill_radar || []);
                setChartData(d.charts?.quiz_trend || []);
                setSubjectPerf(d.charts?.subject_perf || []);
                setTimeline(d.timeline || []);
                setAiInsight(d.ai_insight || "");
                setRecommendations(d.recommendations || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Dashboard Load Error:", err);
                setLoading(false);
            });
    }, [email, nav]);

    const COLORS = ['#10b981', '#0ea5e9', '#d946ef', '#f59e0b', '#ec4899'];
    const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const STAGE_CONFIG = {
        "Beginner": { color: "bg-blue-50 text-blue-600 border-blue-100", icon: <BookMarked size={12}/> },
        "Intermediate": { color: "bg-emerald-50 text-emerald-600 border-emerald-100", icon: <Medal size={12}/> },
        "Advanced": { color: "bg-orange-50 text-orange-600 border-orange-100", icon: <Star size={12}/> },
        "Master": { color: "bg-purple-50 text-purple-600 border-purple-100", icon: <GraduationCap size={12}/> }
    };

    const TOOLS = [
        { title: `${t('luminatutor_title')} – ${t('luminatutor_sub')}`, path: "/tutor", icon: "✨", color: "emerald", desc: t('tutor_desc') },
        { title: `${t('pathpilot_title')} – ${t('pathpilot_sub')}`, path: "/mentor", icon: <Map className="w-5 h-5"/>, color: "sky", desc: t('pathpilot_desc') },
        { title: `${t('termcrystal_title')} – ${t('termcrystal_sub')}`, path: "/dictionary", icon: <Sparkles className="w-5 h-5"/>, color: "emerald", desc: t('termcrystal_desc') },
        { title: `${t('syntaxsage_title')} – ${t('syntaxsage_sub')}`, path: "/codehelper", icon: <Code2 className="w-5 h-5"/>, color: "orange", desc: t('syntaxsage_desc') },
        { title: `${t('quiz_title')} – ${t('quiz_sub')}`, path: "/quiz", icon: <Target className="w-5 h-5"/>, color: "pink", desc: t('quiz_desc') }
    ];

    if (loading) return (
        <div className="min-h-screen bg-[#F8FAF9] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAF9] dark:bg-gray-950 font-sans selection:bg-emerald-100">
            <Navbar />

            <div className="p-4 sm:p-6 md:p-10 max-w-[1700px] mx-auto space-y-6 sm:space-y-8 pb-24 sm:pb-32">

                {/* --- TOP: BRANDED HEADER & AI INSIGHT --- */}
                <div className="flex flex-col xl:flex-row gap-8 items-stretch">
                    
                    {/* Branded Welcome */}
                    <div className="flex-1 relative rounded-3xl sm:rounded-[2rem] p-6 sm:p-10 overflow-hidden border border-emerald-100 bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 dark:bg-emerald-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        
                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-800">
                                <ShieldCheck size={14} /> {t('learning_command_center')}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-emerald-600 dark:text-emerald-400">
                                {username}
                            </h1>
                            <div className="flex flex-wrap gap-4 mt-4 text-sm font-bold text-gray-600 dark:text-gray-400">
                                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                                  <User size={16} className="text-emerald-500" /> {email}
                                </span>
                                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                                  <Languages size={16} className="text-emerald-500" /> {language}
                                </span>
                                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                                  <Award size={16} className="text-emerald-500" /> {level}
                                </span>
                            </div>
                            <p className="mt-6 text-lg font-medium text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
                                {t('intelligence_hub_active')} {t('achieved_prefix')} <span className="text-emerald-600 font-bold">{stats.career_progress_total}%</span> {t('of_targeted_growth')}
                            </p>
                        </div>
                    </div>

                    {/* AI Insight Insight */}
                    <div className="xl:w-1/3 rounded-[2rem] p-8 border border-orange-100 bg-orange-50/20 dark:bg-orange-900/10 dark:border-orange-900/20 relative overflow-hidden group">
                        <div className="absolute top-4 right-4 text-orange-200 dark:text-orange-900/20 group-hover:scale-110 transition-transform duration-500">
                             <Zap size={64} strokeWidth={1} />
                        </div>
                        <h2 className="text-sm font-black uppercase tracking-widest text-orange-600 mb-4 flex items-center gap-2">
                             <Sparkles size={16} /> {t('learning_intelligence_node')}
                        </h2>
                        <div className="relative z-10">
                            <p className="text-base font-bold text-gray-800 dark:text-orange-200 leading-relaxed italic">
                                "{aiInsight || "Your journey is unique. Continue exploring to generate deep learning intelligence."}"
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- PHASE 2: SUMMARY METRIC CARDS --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: t('total_questions'), value: stats.total_questions, Icon: BookOpen, color: "emerald" },
                        { label: t('career_progress'), value: `${stats.career_progress_total}%`, Icon: Target, color: "sky" },
                        { label: t('concepts_learned'), value: stats.concepts_learned, Icon: Brain, color: "orange" },
                        { label: t('code_analyses'), value: stats.code_analyses, Icon: Code2, color: "fuchsia" },
                    ].map((card, i) => (
                        <div key={i} className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all group overflow-hidden relative">
                             <div className={`absolute top-0 right-0 w-24 h-24 opacity-5 group-hover:opacity-10 transition-opacity -translate-y-1/2 translate-x-1/2 rounded-full bg-current text-${card.color}-500`} />
                             <div className="flex items-center justify-between mb-4 relative z-10">
                                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-${card.color}-50 text-${card.color}-500 dark:bg-${card.color}-900/20 shadow-sm border border-${card.color}-100/50`}>
                                     <card.Icon size={28} />
                                 </div>
                                 <div className="text-right">
                                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">{card.label}</span>
                                     <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{card.value}</h3>
                                 </div>
                             </div>
                        </div>
                    ))}
                </div>

                {/* --- PHASE 3: BEHAVIORAL & SKILL INTELLIGENCE --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Streak & Consistency */}
                    <div className="lg:col-span-4 bg-white dark:bg-gray-900 border border-emerald-100 dark:border-emerald-900/30 rounded-[2rem] p-10 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden group">
                       <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                       <div className="w-24 h-24 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mb-6 animate-pulse">
                           <Flame size={48} className="text-orange-500 fill-orange-500" />
                       </div>
                       <h3 className="text-6xl font-black text-gray-900 dark:text-white">{currentStreak}</h3>
                       <p className="text-sm font-black uppercase tracking-widest text-orange-500 mt-2">Active Day Streak</p>
                       
                       <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5 mt-8 sm:mt-10">
                            {WEEKDAYS.map((day, i) => (
                                <div key={day} className="flex flex-col items-center gap-2">
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-[10px] font-black border transition-all duration-300
                                        ${weeklyStreak[i] ? 'bg-emerald-500 border-emerald-600 text-white shadow-xl scale-110' : 'bg-gray-50 border-gray-100 text-gray-300 dark:bg-gray-800'}`}>
                                        {weeklyStreak[i] ? <CheckCircle2 size={16} /> : day[0]}
                                    </div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase">{day}</span>
                                </div>
                            ))}
                       </div>
                    </div>

                    {/* Skill Radar Analysis */}
                    <div className="lg:col-span-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-10 shadow-sm">
                        <h2 className="text-sm font-black uppercase tracking-widest text-emerald-500 mb-8 flex items-center gap-2">
                            <Zap size={18} /> {t('intelligence_radar')}
                        </h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart data={skillRadar}>
                                    <PolarGrid stroke="#e5e7eb" className="dark:stroke-gray-800" />
                                    <PolarAngleAxis dataKey="subject" tick={{fontSize: 9, fontWeight: 900, fill: '#94a3b8'}} />
                                    <Radar name={t('proficiency')} dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                                    <Tooltip />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="lg:col-span-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] p-8 shadow-sm">
                        <h2 className="text-lg font-black tracking-tight text-gray-900 dark:text-white mb-8 flex items-center gap-2">
                            <Activity className="text-sky-500" size={20} /> {t('learning_journey_title')}
                        </h2>
                        <div className="space-y-6 relative ml-2">
                            <div className="absolute left-[3px] top-2 bottom-2 w-[1.5px] bg-gray-50 dark:bg-gray-800" />
                            {timeline.map((entry, i) => (
                                <div key={i} className="relative pl-8 group">
                                    <div className="absolute left-[-2px] top-1.5 w-3.5 h-3.5 rounded-full bg-sky-200 dark:bg-sky-900 border-2 border-white dark:border-gray-900 group-hover:bg-sky-500 transition-colors" />
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-sky-400 mb-0.5">{entry.event}</p>
                                        <p className="text-xs font-bold text-gray-700 dark:text-gray-300 line-clamp-1 truncate">{entry.details}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- PHASE 4: THE ANALYTICS COMMAND LAYER --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Comparative Mastery (Subject Bar) */}
                    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 shadow-sm">
                        <h2 className="text-xl font-black tracking-tight text-gray-900 dark:text-white mb-10 flex items-center gap-3">
                             <Layers className="text-fuchsia-500" size={24} /> Subject Proficiency Matrix
                        </h2>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={subjectPerf} layout="vertical" margin={{left: 40}}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" className="dark:stroke-gray-800" />
                                    <XAxis type="number" domain={[0, 10]} hide />
                                    <YAxis dataKey="subject" type="category" axisLine={false} tickLine={false} tick={{fontSize:12, fontWeight:900, textTransform: 'uppercase'}} width={100} />
                                    <Tooltip cursor={{fill: '#f8fafc'}} />
                                    <Bar dataKey="score" radius={[0, 12, 12, 0]} barSize={32}>
                                        {subjectPerf.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Skill Radar & Velocity Trend */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm">
                            <h2 className="text-sm font-black text-gray-900 dark:text-white mb-8 flex items-center gap-2 uppercase tracking-widest">
                                <Zap className="text-emerald-500" size={18} /> Module Distribution
                            </h2>
                            <div className="h-64 relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={usageData} innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value" stroke="none">
                                            {usageData.map((e, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-3xl font-black text-emerald-500">{usageData.reduce((a,c)=>a+c.value, 0)}</span>
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Nodes</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm">
                            <h2 className="text-sm font-black text-gray-900 dark:text-white mb-8 flex items-center gap-2 uppercase tracking-widest">
                                 <Monitor className="text-sky-500" size={18} /> Performance Velocity
                            </h2>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="vGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid stroke="#f0f0f0" vertical={false} strokeDasharray="3 3"/>
                                        <XAxis hide />
                                        <YAxis hide domain={[0, 10]} />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="score" stroke="#0ea5e9" strokeWidth={3} fill="url(#vGrad)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                   </div>
                </div>

                {/* --- PHASE 5: RECOMMENDATIONS & SECONDARY --- */}
                <div className="grid grid-cols-1 gap-8">
                     {/* Recommendation Panel */}
                     <div className="rounded-3xl sm:rounded-[2.5rem] bg-emerald-500 p-6 sm:p-10 text-white relative overflow-hidden group">
                        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                        <h2 className="text-xl font-black uppercase tracking-widest mb-10 flex items-center gap-3">
                            <Sparkles size={24} /> Smart Growth Protocol
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             {recommendations.length > 0 ? recommendations.map((rec, i) => (
                                 <div key={i} className="flex gap-5 items-start bg-white/10 p-6 rounded-3xl hover:bg-white/20 transition-all cursor-pointer border border-white/5 backdrop-blur-md">
                                     <div className="mt-1 w-8 h-8 rounded-2xl bg-emerald-400 flex items-center justify-center flex-shrink-0 shadow-lg">
                                         <ChevronRight size={18} />
                                     </div>
                                     <p className="text-sm font-bold leading-relaxed">{rec}</p>
                                 </div>
                             )) : <p className="italic opacity-80">Syncing with learning patterns...</p>}
                        </div>
                     </div>
                </div>

                {/* --- PHASE 6: PATHPILOT BLUEPRINT (BOTTOM SECTION) --- */}
                <div className="bg-white dark:bg-gray-900 border border-sky-100 dark:border-sky-900/30 rounded-[2.5rem] p-10 shadow-sm">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
                                <Map className="text-sky-500" size={32} /> PathSync Progress Visualization
                            </h2>
                            <p className="text-sm font-medium text-gray-400 mt-2 uppercase tracking-widest font-black">Domain-Specific Growth Tracking</p>
                        </div>
                        <div className="hidden sm:block">
                            <div className="p-4 rounded-3xl bg-sky-50 dark:bg-sky-900/20 text-sky-600 text-xs font-black uppercase tracking-widest border border-sky-100">
                                {domainProgress.length} Blueprint(s) Active
                            </div>
                        </div>
                    </div>

                    <div className="space-y-12">
                        {domainProgress.length > 0 ? domainProgress.map((domain, i) => (
                            <div key={i} className="relative p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-gray-50 bg-[#FCFDFD] dark:bg-gray-800/20 dark:border-gray-800">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 flex items-center justify-center text-2xl">
                                            <Briefcase className="text-sky-500" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-black text-gray-900 dark:text-white capitalize">{domain.domain}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-tighter border flex items-center gap-1 ${STAGE_CONFIG[domain.stage]?.color}`}>
                                                    {STAGE_CONFIG[domain.stage]?.icon} {domain.stage}
                                                </span>
                                                <span className="text-xs text-gray-300"> | </span>
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{domain.sessions} Mentorship Nodes</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <span className="text-4xl font-black text-sky-500">{domain.progress}%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden border border-white dark:border-gray-700">
                                    <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-sky-400 to-sky-600 transition-all duration-1000 ease-out z-10" style={{ width: `${domain.progress}%` }} />
                                    <div className="absolute inset-0 flex justify-between px-4 z-20 pointer-events-none">
                                        {[25, 50, 75].map(tick => (
                                            <div key={tick} className="w-[1px] h-full bg-white/20" />
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-6 flex flex-wrap gap-3">
                                    {domain.milestones?.map((m, mi) => (
                                        <div key={mi} className="px-3 py-1.5 rounded-xl bg-sky-50/50 text-sky-600 text-[10px] font-black flex items-center gap-2 border border-sky-100 group-hover:bg-sky-50">
                                            <CheckCircle2 size={12} className="text-sky-400" /> {m}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )) : (
                            <div className="h-48 rounded-[2rem] border-2 border-dashed border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center">
                                <Rocket className="text-gray-200 mb-4" size={48} />
                                <p className="text-sm font-bold text-gray-300 uppercase tracking-widest">Awaiting First PathSync Protocol...</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- QUICK ACTION HUB --- */}
                <div className="pt-12">
                    <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white mb-10 flex items-center gap-3">
                        <LayoutDashboard className="text-emerald-500" size={32} /> Central AI Hub Operations
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-8">
                        {TOOLS.map((tool, i) => (
                            <div key={i} onClick={() => nav(tool.path)}
                                 className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] p-8 hover:shadow-2xl hover:-translate-y-3 transition-all cursor-pointer group shadow-sm">
                                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 text-2xl transition-all group-hover:scale-110 shadow-md border 
                                                ${tool.color === 'emerald' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 
                                                  tool.color === 'sky' ? 'bg-sky-50 text-sky-500 border-sky-100' :
                                                  tool.color === 'orange' ? 'bg-orange-50 text-orange-500 border-orange-100' :
                                                  'bg-pink-50 text-pink-500 border-pink-100'}`}>
                                    {tool.icon}
                                </div>
                                <h3 className="text-base font-black uppercase tracking-tight text-gray-900 dark:text-white mb-3">{tool.title}</h3>
                                <p className="text-xs font-medium text-gray-400 leading-relaxed line-clamp-3">{tool.desc}</p>
                                <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                                    Initiate Module <ChevronRight size={14} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}