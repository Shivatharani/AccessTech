import { useState, useEffect, useContext } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { useTranslation } from "react-i18next";
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
    PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts";
import {
    Activity, BookOpen, Clock, Target, ArrowLeft, Code2, Map, Sparkles, Zap, ChevronRight,
    PieChart as PieIcon, Trophy, Brain, Flame, Calendar, TrendingUp, ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const { t } = useTranslation()
    const nav = useNavigate()
    const [chartData, setChartData] = useState([])
    const [usageData, setUsageData] = useState([])
    const [stats, setStats] = useState(null)
    const [lastLogin, setLastLogin] = useState(null)
    const [recentActivity, setRecentActivity] = useState([])
    const username = localStorage.getItem("email")?.split('@')[0] || "User"

    useEffect(() => {
        const email = localStorage.getItem("email")
        API.get(`/dashboard/analytics?email=${email}`)
            .then(res => {
                if (res.data.charts?.quiz_trend) setChartData(res.data.charts.quiz_trend)
                if (res.data.module_usage) {
                    const formattedUsage = Object.keys(res.data.module_usage).map(key => ({
                        name: key, value: res.data.module_usage[key]
                    })).filter(item => item.value > 0);
                    setUsageData(formattedUsage);
                }
                setStats({ qCount: res.data.total_questions, lCount: res.data.total_logins, avgScore: res.data.avg_quiz_score })
                if (res.data.history) setRecentActivity(res.data.history.slice(0, 5).reverse())
                if (res.data.login_activity?.length > 0) {
                    const sorted = res.data.login_activity.sort((a, b) => new Date(b.login_time) - new Date(a.login_time));
                    let rawTime = sorted[0].login_time;
                    if (!rawTime.endsWith("Z")) rawTime += "Z";
                    setLastLogin(new Date(rawTime).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }));
                }
            })
    }, [t])

    const CHART_COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];

    const tools = [
        { title: t('luminatutor'), path: "/tutor", icon: <span className="text-2xl">✨</span>, gradient: "from-violet-500 to-purple-600", desc: t('tutor_desc') },
        { title: t('pathpilot'), path: "/mentor", icon: <Map className="w-6 h-6 text-white" />, gradient: "from-cyan-500 to-sky-600", desc: t('pathpilot_desc') },
        { title: t('termcrystal'), path: "/dictionary", icon: <Sparkles className="w-6 h-6 text-white" />, gradient: "from-emerald-500 to-teal-600", desc: t('termcrystal_desc') },
        { title: t('syntaxsage'), path: "/codehelper", icon: <Code2 className="w-6 h-6 text-white" />, gradient: "from-amber-500 to-orange-600", desc: t('syntaxsage_desc') },
        { title: t('quiz'), path: "/quiz", icon: <Target className="w-6 h-6 text-white" />, gradient: "from-rose-500 to-pink-600", desc: t('quiz_desc') }
    ]

    const statCards = stats ? [
        { label: t('total_questions'), value: stats.qCount, Icon: BookOpen, color: "violet" },
        { label: t('total_logins'), value: stats.lCount, Icon: Activity, color: "sky" },
        { label: t('avg_quiz_score'), value: `${stats.avgScore.toFixed(1)}/10`, Icon: Flame, color: "emerald" },
    ] : [];

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-[#080810] transition-colors duration-500">
            <Navbar />

            <div className="p-6 md:p-10 max-w-[1600px] mx-auto space-y-8 pb-20">

                {/* Welcome Banner */}
                <div className="relative bg-gray-900 dark:bg-[#0d0d1a] rounded-3xl p-8 md:p-12 overflow-hidden border border-white/5">
                    <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-[100px] -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-purple-600/15 blur-[100px] translate-x-1/2 translate-y-1/2" />
                    <div className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                            backgroundSize: '50px 50px'
                        }}
                    />

                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-violet-500/20 border border-violet-500/30 px-4 py-1.5 rounded-full text-violet-300 text-xs font-black uppercase tracking-widest mb-5">
                                <Trophy size={12} className="text-yellow-400" /> {t('learning_level')}: {localStorage.getItem("level") || t('beginner')}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
                                {t('welcome_back')}, <span className="text-white/60">{username}</span>!
                            </h1>
                            <p className="text-gray-400 text-lg font-medium">{t('hero_subtitle')}</p>
                        </div>

                        {lastLogin && (
                            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-4 rounded-2xl">
                                <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                                    <Clock size={20} className="text-violet-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{t('last_login')}</p>
                                    <p className="text-white font-bold text-sm">{lastLogin}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stat Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {statCards.map(({ label, value, Icon, color }) => (
                            <div key={label} className="bg-white dark:bg-[#0d0d1a] border border-gray-100 dark:border-white/5 rounded-2xl p-6 flex items-center gap-5 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl group">
                                <div className={`w-14 h-14 rounded-2xl bg-${color}-100 dark:bg-${color}-900/30 text-${color}-600 dark:text-${color}-400 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                                    <Icon size={28} />
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">{label}</p>
                                    <h3 className="text-3xl font-black text-gray-900 dark:text-white">{value}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                    {/* Charts */}
                    <div className="xl:col-span-3 space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            {/* Quiz Trend */}
                            <div className="bg-white dark:bg-[#0d0d1a] border border-gray-100 dark:border-white/5 rounded-3xl p-8 shadow-sm">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">{t('quiz_trends')}</h2>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">{t('score_consistency')}</p>
                                    </div>
                                    <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                                        <TrendingUp size={18} />
                                    </div>
                                </div>
                                <div className="h-64">
                                    {chartData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e5e7eb" opacity={0.4} />
                                                <XAxis dataKey="name" hide />
                                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 700 }} domain={[0, 10]} />
                                                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: '#111827', color: '#fff', padding: '12px 16px', fontSize: '13px' }} />
                                                <Area type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorPerf)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-gray-300 dark:text-gray-600">
                                            <Activity size={40} className="mb-3 opacity-30" />
                                            <p className="text-sm font-bold">{t('take_quiz_notice')}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Module Engagement */}
                            <div className="bg-white dark:bg-[#0d0d1a] border border-gray-100 dark:border-white/5 rounded-3xl p-8 shadow-sm">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">{t('module_engagement')}</h2>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">{t('cross_tool_interaction')}</p>
                                    </div>
                                    <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                        <PieIcon size={18} />
                                    </div>
                                </div>
                                <div className="h-64 relative">
                                    {usageData.length > 0 ? (
                                        <>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie data={usageData} innerRadius={70} outerRadius={95} paddingAngle={6} dataKey="value" stroke="none">
                                                        {usageData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % 4]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: '#111827', color: '#fff', padding: '10px 14px' }} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                                <span className="text-2xl font-black text-gray-900 dark:text-white">{usageData.reduce((a, c) => a + c.value, 0)}</span>
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{t('total_actions')}</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-gray-300 dark:text-gray-600">
                                            <PieIcon size={40} className="mb-3 opacity-30" />
                                            <p className="text-sm font-bold">No interactions yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Tool Grid */}
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-5 flex items-center gap-2">
                                <Zap className="text-yellow-500 fill-current" size={24} /> {t('ai_toolset')}
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                {tools.map((tool, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => nav(tool.path)}
                                        className="bg-white dark:bg-[#0d0d1a] border border-gray-100 dark:border-white/5 rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative overflow-hidden"
                                    >
                                        <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                                            {tool.icon}
                                        </div>
                                        <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight mb-1">{tool.title}</h3>
                                        <p className="text-[10px] text-gray-400 leading-relaxed line-clamp-2">{tool.desc}</p>
                                        <div className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest mt-3 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                                            {t('launch_tool')} <ChevronRight size={12} className="ml-0.5" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-5">
                        {/* Recent Activity */}
                        <div className="bg-gray-900 dark:bg-[#0d0d1a] border border-white/5 rounded-3xl p-7 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/15 rounded-full blur-2xl" />
                            <h2 className="text-base font-black mb-6 flex items-center gap-2 relative z-10">
                                <Calendar className="text-violet-400" size={18} />
                                {t('recent_activity')}
                            </h2>
                            <div className="space-y-4 relative z-10">
                                {recentActivity.length > 0 ? recentActivity.map((act, idx) => (
                                    <div key={idx} className="flex gap-3 group">
                                        <div className="flex-shrink-0 w-1 h-10 bg-violet-600 rounded-full group-hover:bg-violet-400 transition-colors" />
                                        <div className="min-w-0">
                                            <p className="text-[9px] font-black text-violet-400 uppercase tracking-widest mb-0.5 truncate">{act.question.split(':')[0]}</p>
                                            <p className="text-xs font-medium text-gray-300 line-clamp-1">
                                                {act.question.includes(':') ? act.question.split(': ')[1] : act.question}
                                            </p>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-xs text-gray-600 font-medium text-center py-6">{t('start_learning_notice')}</p>
                                )}
                            </div>
                        </div>

                        {/* Achievement CTA */}
                        <div
                            className="relative bg-gradient-to-br from-violet-600 to-purple-700 rounded-3xl p-7 text-white cursor-pointer group overflow-hidden border border-violet-500/20"
                            onClick={() => nav("/quiz")}
                        >
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-x-1/2 translate-y-1/2 blur-2xl" />
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                    <Brain size={24} />
                                </div>
                                <h3 className="text-lg font-black tracking-tight mb-2">{t('knowledge_mastery')}</h3>
                                <p className="text-violet-200 text-xs font-medium leading-relaxed opacity-80 mb-5">{t('knowledge_mastery_desc')}</p>
                                <div className="flex items-center gap-1 text-xs font-black uppercase tracking-widest">
                                    {t('practice_now')} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}