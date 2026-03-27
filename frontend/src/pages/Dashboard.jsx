import { useState, useEffect } from "react";
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

    const CHART_COLORS = ['#66bb6a', '#29b6f6', '#ab47bc', '#ffa726'];

    const tools = [
        { title: t('luminatutor'), path: "/tutor", icon: <span className="text-2xl">✨</span>, gradientClasses: "bg-gradient-to-br from-fuchsia-300 to-fuchsia-500 hover:from-fuchsia-400 hover:to-fuchsia-600 dark:from-fuchsia-600 dark:to-fuchsia-800", desc: t('tutor_desc') },
        { title: t('pathpilot'), path: "/mentor", icon: <Map className="w-6 h-6 text-white" />, gradientClasses: "bg-gradient-to-br from-sky-300 to-sky-500 hover:from-sky-400 hover:to-sky-600 dark:from-sky-600 dark:to-sky-800", desc: t('pathpilot_desc') },
        { title: t('termcrystal'), path: "/dictionary", icon: <Sparkles className="w-6 h-6 text-white" />, gradientClasses: "bg-gradient-to-br from-emerald-300 to-emerald-500 hover:from-emerald-400 hover:to-emerald-600 dark:from-emerald-600 dark:to-emerald-800", desc: t('termcrystal_desc') },
        { title: t('syntaxsage'), path: "/codehelper", icon: <Code2 className="w-6 h-6 text-white" />, gradientClasses: "bg-gradient-to-br from-orange-300 to-orange-500 hover:from-orange-400 hover:to-orange-600 dark:from-orange-600 dark:to-orange-800", desc: t('syntaxsage_desc') },
        { title: t('quiz'), path: "/quiz", icon: <Target className="w-6 h-6 text-white" />, gradientClasses: "bg-gradient-to-br from-pink-300 to-pink-500 hover:from-pink-400 hover:to-pink-600 dark:from-pink-600 dark:to-pink-800", desc: t('quiz_desc') }
    ]

    const statCards = stats ? [
        { label: t('total_questions'), value: stats.qCount, Icon: BookOpen, textClass: 'text-green-700 dark:text-green-400', bgClass: 'bg-green-50 dark:bg-green-950/20', iconBgClass: 'bg-green-100 dark:bg-green-900/40' },
        { label: t('total_logins'), value: stats.lCount, Icon: Activity, textClass: 'text-sky-700 dark:text-sky-400', bgClass: 'bg-sky-50 dark:bg-sky-950/20', iconBgClass: 'bg-sky-100 dark:bg-sky-900/40' },
        { label: t('avg_quiz_score'), value: `${stats.avgScore.toFixed(1)}/10`, Icon: Flame, textClass: 'text-fuchsia-700 dark:text-fuchsia-400', bgClass: 'bg-fuchsia-50 dark:bg-fuchsia-950/20', iconBgClass: 'bg-fuchsia-100 dark:bg-fuchsia-900/40' },
    ] : [];

    return (
        <div className="min-h-screen bg-green-50 dark:bg-gray-950">
            <Navbar />

            <div className="p-6 md:p-10 max-w-[1600px] mx-auto space-y-8 pb-20">

                {/* Welcome Banner */}
                <div className="relative rounded-3xl p-8 md:p-12 overflow-hidden border bg-gradient-to-br from-green-50 to-teal-50 border-green-200 dark:from-green-900/20 dark:to-teal-900/20 dark:border-green-800/40">
                    <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2 opacity-40 bg-green-300 dark:bg-green-700/30" />
                    <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full blur-[80px] translate-x-1/2 translate-y-1/2 opacity-30 bg-teal-300 dark:bg-teal-700/30" />
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-5 border bg-green-100 border-green-300 text-green-800 dark:bg-green-900/40 dark:border-green-800/50 dark:text-green-400">
                                <Trophy size={12} className="text-amber-400" /> {t('learning_level')}: {localStorage.getItem("level") || t('beginner')}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 text-green-900 dark:text-green-50">
                                {t('welcome_back')}, <span className="text-green-500 dark:text-green-400">{username}</span>!
                            </h1>
                            <p className="text-lg font-medium text-green-600 dark:text-green-400/80">{t('hero_subtitle')}</p>
                        </div>
                        {lastLogin && (
                            <div className="flex items-center gap-3 px-5 py-4 rounded-2xl border bg-white border-green-200 dark:bg-gray-900/80 dark:border-green-800/40">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-green-50 dark:bg-green-900/30">
                                    <Clock size={20} className="text-green-500 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-green-400 dark:text-green-600">{t('last_login')}</p>
                                    <p className="font-bold text-sm text-green-800 dark:text-green-300">{lastLogin}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stat Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {statCards.map(({ label, value, Icon, textClass, bgClass, iconBgClass }) => (
                            <div key={label} className={`rounded-2xl p-6 flex items-center gap-5 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl group border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900`}>
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform ${iconBgClass} ${textClass}`}>
                                    <Icon size={28} />
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest mb-1 text-gray-400 dark:text-gray-500">{label}</p>
                                    <h3 className="text-3xl font-black text-green-900 dark:text-green-50">{value}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                    <div className="xl:col-span-3 space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            {/* Quiz Trend */}
                            <div className="bg-white border rounded-3xl p-8 shadow-sm border-gray-200 dark:bg-gray-900 dark:border-gray-800">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h2 className="text-xl font-black tracking-tight text-green-900 dark:text-green-50">{t('quiz_trends')}</h2>
                                        <p className="text-xs font-bold uppercase tracking-widest mt-0.5 text-green-400 dark:text-green-600">{t('score_consistency')}</p>
                                    </div>
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                        <TrendingUp size={18} />
                                    </div>
                                </div>
                                <div className="h-64">
                                    {chartData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#66bb6a" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#66bb6a" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e8f5e9" className="dark:stroke-gray-800" />
                                                <XAxis dataKey="name" hide />
                                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a5d6a7', fontSize: 11, fontWeight: 700 }} domain={[0, 10]} className="dark:fill-green-700" />
                                                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: '#f1f8e9', color: '#2e7d32', padding: '12px 16px' }} />
                                                <Area type="monotone" dataKey="score" stroke="#66bb6a" strokeWidth={3} fillOpacity={1} fill="url(#colorPerf)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-green-200 dark:text-green-900/40">
                                            <Activity size={40} className="mb-3 opacity-50" />
                                            <p className="text-sm font-bold">{t('take_quiz_notice')}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Module Engagement */}
                            <div className="bg-white border rounded-3xl p-8 shadow-sm border-gray-200 dark:bg-gray-900 dark:border-gray-800">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h2 className="text-xl font-black tracking-tight text-green-900 dark:text-green-50">{t('module_engagement')}</h2>
                                        <p className="text-xs font-bold uppercase tracking-widest mt-0.5 text-green-400 dark:text-green-600">{t('cross_tool_interaction')}</p>
                                    </div>
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
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
                                                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: '#f1f8e9', color: '#2e7d32', padding: '10px 14px' }} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                                <span className="text-2xl font-black text-green-900 dark:text-green-50">{usageData.reduce((a, c) => a + c.value, 0)}</span>
                                                <span className="text-[9px] font-black uppercase tracking-widest text-green-300 dark:text-green-700">{t('total_actions')}</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-green-200 dark:text-green-900/40">
                                            <PieIcon size={40} className="mb-3 opacity-50" />
                                            <p className="text-sm font-bold">No interactions yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Tool Grid */}
                        <div>
                            <h2 className="text-2xl font-black tracking-tight mb-5 flex items-center gap-2 text-green-900 dark:text-green-50">
                                <Zap className="text-amber-400 fill-amber-400" size={24} /> {t('ai_toolset')}
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                {tools.map((tool, idx) => (
                                    <div key={idx} onClick={() => nav(tool.path)}
                                        className="bg-white rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative overflow-hidden border border-gray-200 dark:bg-gray-900 dark:border-gray-800">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform ${tool.gradientClasses}`}>
                                            {tool.icon}
                                        </div>
                                        <h3 className="text-sm font-black uppercase tracking-tight mb-1 text-green-900 dark:text-green-50">{tool.title}</h3>
                                        <p className="text-[10px] leading-relaxed line-clamp-2 text-green-400 dark:text-green-600">{tool.desc}</p>
                                        <div className="flex items-center text-[10px] font-black uppercase tracking-widest mt-3 text-green-300 dark:text-green-700">
                                            {t('launch_tool')} <ChevronRight size={12} className="ml-0.5" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-5">
                        <div className="rounded-3xl p-7 relative overflow-hidden border bg-gradient-to-br from-green-50 to-teal-50 border-green-200 dark:from-green-900/20 dark:to-teal-900/20 dark:border-green-800/40">
                            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-40 bg-green-300 dark:bg-green-700/30" />
                            <h2 className="text-base font-black mb-6 flex items-center gap-2 relative z-10 text-green-900 dark:text-green-50">
                                <Calendar className="text-green-500" size={18} />
                                {t('recent_activity')}
                            </h2>
                            <div className="space-y-4 relative z-10">
                                {recentActivity.length > 0 ? recentActivity.map((act, idx) => (
                                    <div key={idx} className="flex gap-3 group">
                                        <div className="flex-shrink-0 w-1 h-10 rounded-full bg-green-400 dark:bg-green-600" />
                                        <div className="min-w-0">
                                            <p className="text-[9px] font-black uppercase tracking-widest mb-0.5 truncate text-green-600 dark:text-green-500">{act.question.split(':')[0]}</p>
                                            <p className="text-xs font-medium line-clamp-1 text-green-700 dark:text-green-400">
                                                {act.question.includes(':') ? act.question.split(': ')[1] : act.question}
                                            </p>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-xs font-medium text-center py-6 text-green-300 dark:text-green-700">{t('start_learning_notice')}</p>
                                )}
                            </div>
                        </div>

                        <div
                            className="relative rounded-3xl p-7 text-white cursor-pointer group overflow-hidden border bg-gradient-to-br from-green-400 to-teal-500 border-green-300 dark:from-green-600 dark:to-teal-700 dark:border-green-700/50"
                            onClick={() => nav("/quiz")}>
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-x-1/2 translate-y-1/2 blur-2xl" />
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                    <Brain size={24} />
                                </div>
                                <h3 className="text-lg font-black tracking-tight mb-2">{t('knowledge_mastery')}</h3>
                                <p className="text-white/80 text-xs font-medium leading-relaxed mb-5">{t('knowledge_mastery_desc')}</p>
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