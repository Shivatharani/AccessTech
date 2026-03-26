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
        { title: t('luminatutor'), path: "/tutor", icon: <span className="text-2xl">✨</span>, gradient: "linear-gradient(135deg, #ce93d8, #ab47bc)", desc: t('tutor_desc') },
        { title: t('pathpilot'), path: "/mentor", icon: <Map className="w-6 h-6 text-white" />, gradient: "linear-gradient(135deg, #81d4fa, #29b6f6)", desc: t('pathpilot_desc') },
        { title: t('termcrystal'), path: "/dictionary", icon: <Sparkles className="w-6 h-6 text-white" />, gradient: "linear-gradient(135deg, #a5d6a7, #66bb6a)", desc: t('termcrystal_desc') },
        { title: t('syntaxsage'), path: "/codehelper", icon: <Code2 className="w-6 h-6 text-white" />, gradient: "linear-gradient(135deg, #ffcc80, #ffa726)", desc: t('syntaxsage_desc') },
        { title: t('quiz'), path: "/quiz", icon: <Target className="w-6 h-6 text-white" />, gradient: "linear-gradient(135deg, #f48fb1, #e91e63)", desc: t('quiz_desc') }
    ]

    const statCards = stats ? [
        { label: t('total_questions'), value: stats.qCount, Icon: BookOpen, bg: '#e8f5e9', color: '#388e3c', iconBg: '#c8e6c9' },
        { label: t('total_logins'), value: stats.lCount, Icon: Activity, bg: '#e1f5fe', color: '#0288d1', iconBg: '#b3e5fc' },
        { label: t('avg_quiz_score'), value: `${stats.avgScore.toFixed(1)}/10`, Icon: Flame, bg: '#f3e5f5', color: '#8e24aa', iconBg: '#e1bee7' },
    ] : [];

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#e8f5e9' }}>
            <Navbar />

            <div className="p-6 md:p-10 max-w-[1600px] mx-auto space-y-8 pb-20">

                {/* Welcome Banner */}
                <div className="relative rounded-3xl p-8 md:p-12 overflow-hidden border"
                    style={{ background: 'linear-gradient(135deg, #f1f8e9, #e0f2f1)', borderColor: '#c8e6c9' }}>
                    <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2 opacity-40"
                        style={{ backgroundColor: '#a5d6a7' }} />
                    <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full blur-[80px] translate-x-1/2 translate-y-1/2 opacity-30"
                        style={{ backgroundColor: '#80cbc4' }} />
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-5 border"
                                style={{ backgroundColor: '#c8e6c9', borderColor: '#a5d6a7', color: '#2e7d32' }}>
                                <Trophy size={12} style={{ color: '#ffc107' }} /> {t('learning_level')}: {localStorage.getItem("level") || t('beginner')}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2" style={{ color: '#1b5e20' }}>
                                {t('welcome_back')}, <span style={{ color: '#66bb6a' }}>{username}</span>!
                            </h1>
                            <p className="text-lg font-medium" style={{ color: '#4caf50' }}>{t('hero_subtitle')}</p>
                        </div>
                        {lastLogin && (
                            <div className="flex items-center gap-3 px-5 py-4 rounded-2xl border"
                                style={{ backgroundColor: 'white', borderColor: '#c8e6c9' }}>
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#e8f5e9' }}>
                                    <Clock size={20} style={{ color: '#66bb6a' }} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#a5d6a7' }}>{t('last_login')}</p>
                                    <p className="font-bold text-sm" style={{ color: '#2e7d32' }}>{lastLogin}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stat Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {statCards.map(({ label, value, Icon, bg, color, iconBg }) => (
                            <div key={label} className="rounded-2xl p-6 flex items-center gap-5 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl group border"
                                style={{ backgroundColor: 'white', borderColor: '#e0e0e0' }}>
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform"
                                    style={{ backgroundColor: iconBg, color }}>
                                    <Icon size={28} />
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: '#9e9e9e' }}>{label}</p>
                                    <h3 className="text-3xl font-black" style={{ color: '#1b5e20' }}>{value}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                    <div className="xl:col-span-3 space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            {/* Quiz Trend */}
                            <div className="bg-white border rounded-3xl p-8 shadow-sm" style={{ borderColor: '#e0e0e0' }}>
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h2 className="text-xl font-black tracking-tight" style={{ color: '#1b5e20' }}>{t('quiz_trends')}</h2>
                                        <p className="text-xs font-bold uppercase tracking-widest mt-0.5" style={{ color: '#a5d6a7' }}>{t('score_consistency')}</p>
                                    </div>
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#e8f5e9', color: '#388e3c' }}>
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
                                                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e8f5e9" />
                                                <XAxis dataKey="name" hide />
                                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a5d6a7', fontSize: 11, fontWeight: 700 }} domain={[0, 10]} />
                                                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: '#f1f8e9', color: '#2e7d32', padding: '12px 16px' }} />
                                                <Area type="monotone" dataKey="score" stroke="#66bb6a" strokeWidth={3} fillOpacity={1} fill="url(#colorPerf)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center" style={{ color: '#c8e6c9' }}>
                                            <Activity size={40} className="mb-3 opacity-50" />
                                            <p className="text-sm font-bold">{t('take_quiz_notice')}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Module Engagement */}
                            <div className="bg-white border rounded-3xl p-8 shadow-sm" style={{ borderColor: '#e0e0e0' }}>
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h2 className="text-xl font-black tracking-tight" style={{ color: '#1b5e20' }}>{t('module_engagement')}</h2>
                                        <p className="text-xs font-bold uppercase tracking-widest mt-0.5" style={{ color: '#a5d6a7' }}>{t('cross_tool_interaction')}</p>
                                    </div>
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#e8f5e9', color: '#388e3c' }}>
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
                                                <span className="text-2xl font-black" style={{ color: '#1b5e20' }}>{usageData.reduce((a, c) => a + c.value, 0)}</span>
                                                <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#a5d6a7' }}>{t('total_actions')}</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center" style={{ color: '#c8e6c9' }}>
                                            <PieIcon size={40} className="mb-3 opacity-50" />
                                            <p className="text-sm font-bold">No interactions yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Tool Grid */}
                        <div>
                            <h2 className="text-2xl font-black tracking-tight mb-5 flex items-center gap-2" style={{ color: '#1b5e20' }}>
                                <Zap style={{ color: '#ffc107', fill: '#ffc107' }} size={24} /> {t('ai_toolset')}
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                {tools.map((tool, idx) => (
                                    <div key={idx} onClick={() => nav(tool.path)}
                                        className="bg-white rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative overflow-hidden border"
                                        style={{ borderColor: '#e0e0e0' }}>
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform"
                                            style={{ background: tool.gradient }}>
                                            {tool.icon}
                                        </div>
                                        <h3 className="text-sm font-black uppercase tracking-tight mb-1" style={{ color: '#1b5e20' }}>{tool.title}</h3>
                                        <p className="text-[10px] leading-relaxed line-clamp-2" style={{ color: '#81c784' }}>{tool.desc}</p>
                                        <div className="flex items-center text-[10px] font-black uppercase tracking-widest mt-3" style={{ color: '#a5d6a7' }}>
                                            {t('launch_tool')} <ChevronRight size={12} className="ml-0.5" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-5">
                        <div className="rounded-3xl p-7 relative overflow-hidden border"
                            style={{ background: 'linear-gradient(135deg, #f1f8e9, #e0f2f1)', borderColor: '#c8e6c9' }}>
                            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-40"
                                style={{ backgroundColor: '#a5d6a7' }} />
                            <h2 className="text-base font-black mb-6 flex items-center gap-2 relative z-10" style={{ color: '#1b5e20' }}>
                                <Calendar style={{ color: '#66bb6a' }} size={18} />
                                {t('recent_activity')}
                            </h2>
                            <div className="space-y-4 relative z-10">
                                {recentActivity.length > 0 ? recentActivity.map((act, idx) => (
                                    <div key={idx} className="flex gap-3 group">
                                        <div className="flex-shrink-0 w-1 h-10 rounded-full" style={{ backgroundColor: '#66bb6a' }} />
                                        <div className="min-w-0">
                                            <p className="text-[9px] font-black uppercase tracking-widest mb-0.5 truncate" style={{ color: '#43a047' }}>{act.question.split(':')[0]}</p>
                                            <p className="text-xs font-medium line-clamp-1" style={{ color: '#388e3c' }}>
                                                {act.question.includes(':') ? act.question.split(': ')[1] : act.question}
                                            </p>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-xs font-medium text-center py-6" style={{ color: '#a5d6a7' }}>{t('start_learning_notice')}</p>
                                )}
                            </div>
                        </div>

                        <div
                            className="relative rounded-3xl p-7 text-white cursor-pointer group overflow-hidden border"
                            style={{ background: 'linear-gradient(135deg, #66bb6a, #26a69a)', borderColor: '#a5d6a7' }}
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