import {useEffect,useState} from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, 
  PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts";
import { useTranslation } from "react-i18next";
import {
  Activity, BookOpen, Clock, Target, ArrowLeft, Code2, Map, Sparkles, Zap, ChevronRight, 
  PieChart as PieIcon, Trophy, Brain, Flame, Calendar, TrendingUp, ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard(){

 const { t } = useTranslation()
 const nav = useNavigate()
 const [chartData,setChartData]=useState([])
 const [usageData, setUsageData] = useState([])
 const [stats,setStats]=useState(null)
 const [lastLogin, setLastLogin] = useState(null)
 const [recentActivity, setRecentActivity] = useState([])
 const username = localStorage.getItem("email")?.split('@')[0] || "User"

 useEffect(()=>{
  const email=localStorage.getItem("email")
  API.get(`/dashboard/analytics?email=${email}`)
  .then(res=>{
   if (res.data.charts && res.data.charts.quiz_trend) {
     setChartData(res.data.charts.quiz_trend)
   }
   if (res.data.module_usage) {
     const formattedUsage = Object.keys(res.data.module_usage).map(key => ({
       name: key,
       value: res.data.module_usage[key]
     })).filter(item => item.value > 0);
     setUsageData(formattedUsage);
   }
   setStats({
     qCount: res.data.total_questions,
     lCount: res.data.total_logins,
     avgScore: res.data.avg_quiz_score
   })
   if (res.data.history) {
     setRecentActivity(res.data.history.slice(0, 5).reverse())
   }
   if (res.data.login_activity && res.data.login_activity.length > 0) {
     const sorted = res.data.login_activity.sort((a,b) => new Date(b.login_time) - new Date(a.login_time));
     let rawTime = sorted[0].login_time;
     if (!rawTime.endsWith("Z")) rawTime += "Z";
     const latest = new Date(rawTime);
     setLastLogin(latest.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }));
   }
  })
 },[t])

 const tools = [
  {
    title: t('luminatutor'),
    path: "/tutor",
    icon: <span className="text-3xl pt-1">✨</span>,
    color: "indigo",
    desc: t('tutor_desc')
  },
  {
    title: t('pathpilot'),
    path: "/mentor",
    icon: <Map className="w-8 h-8" />,
    color: "sky",
    desc: t('pathpilot_desc')
  },
  {
    title: t('termcrystal'),
    path: "/dictionary",
    icon: <Sparkles className="w-8 h-8" />,
    color: "emerald",
    desc: t('termcrystal_desc')
  },
  {
    title: t('syntaxsage'),
    path: "/codehelper",
    icon: <Code2 className="w-8 h-8" />,
    color: "amber",
    desc: t('syntaxsage_desc')
  },
  {
    title: t('quiz'),
    path: "/quiz",
    icon: <Target className="w-8 h-8" />,
    color: "rose",
    desc: t('quiz_desc')
  }
 ]

  return(
   <div className="min-h-screen bg-white dark:bg-gray-950 font-sans transition-colors duration-300">
    <Navbar/>
 
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto space-y-12 pb-20">
      {/* Welcome Header */}
      <div className="bg-indigo-600 dark:bg-indigo-900/40 p-10 md:p-16 rounded-[3rem] shadow-2xl text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden transition-all border border-indigo-500/20">
        <div className="absolute top-0 right-0 -mt-24 -mr-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-24 -ml-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex-1">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6">
            <Trophy size={14} className="text-yellow-400" /> {t('learning_level')}: {localStorage.getItem("level") || t('beginner')}
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 leading-none">
            {t('welcome_back')}, <span className="text-white/80">{username}</span>!
          </h1>
          <p className="text-xl text-indigo-100 font-medium max-w-2xl">{t('hero_subtitle')}</p>
        </div>
        {lastLogin && (
          <div className="relative z-10 flex items-center gap-4 bg-white/10 backdrop-blur-md px-8 py-6 rounded-[2rem] border border-white/20 shadow-xl">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white">
                <Clock size={24} />
            </div>
            <div>
              <p className="text-xs text-indigo-200 font-black uppercase tracking-widest">{t('last_login')}</p>
              <p className="text-white font-mono text-lg">{lastLogin}</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Main Analytics Column */}
        <div className="xl:col-span-3 space-y-8">
            {/* Stat Cards Row */}
            {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800 flex items-center gap-6 hover:scale-105 transition-transform duration-300 group">
                    <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner group-hover:rotate-6 transition-transform">
                        <BookOpen size={32} />
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-black uppercase tracking-widest mb-1">{t('total_questions')}</p>
                        <h3 className="text-4xl font-black text-gray-900 dark:text-gray-100">{stats.qCount}</h3>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800 flex items-center gap-6 hover:scale-105 transition-transform duration-300 group">
                    <div className="w-16 h-16 rounded-3xl bg-purple-50 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-inner group-hover:rotate-6 transition-transform">
                        <Activity size={32} />
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-black uppercase tracking-widest mb-1">{t('total_logins')}</p>
                        <h3 className="text-4xl font-black text-gray-900 dark:text-gray-100">{stats.lCount}</h3>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800 flex items-center gap-6 hover:scale-105 transition-transform duration-300 group">
                    <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner group-hover:rotate-6 transition-transform">
                        <Flame size={32} />
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-black uppercase tracking-widest mb-1">{t('avg_quiz_score')}</p>
                        <h3 className="text-4xl font-black text-gray-900 dark:text-gray-100">{stats.avgScore.toFixed(1)} / 10</h3>
                    </div>
                </div>
            </div>
            )}

            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Quiz Performance History */}
                <div className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">{t('quiz_trends')}</h2>
                            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-1">{t('score_consistency')}</p>
                        </div>
                        <div className="bg-indigo-50 dark:bg-indigo-900/50 p-2 rounded-xl text-indigo-600">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <div className="h-80 w-full relative">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#E5E7EB" opacity={0.3} />
                                    <XAxis dataKey="name" hide />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#8ca3ba', fontSize: 12, fontWeight: 'bold'}} domain={[0, 10]} />
                                    <Tooltip 
                                        contentStyle={{borderRadius: '20px', border: 'none', backgroundColor: '#111827', color: '#fff', padding: '15px'}}
                                    />
                                    <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={5} fillOpacity={1} fill="url(#colorPerf)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <Activity size={48} className="mb-4 opacity-20" />
                                <p className="font-bold">{t('take_quiz_notice')}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Module Engagement Chart */}
                <div className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">{t('module_engagement')}</h2>
                            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-1">{t('cross_tool_interaction')}</p>
                        </div>
                        <div className="bg-emerald-50 dark:bg-emerald-900/50 p-2 rounded-xl text-emerald-600">
                            <PieIcon size={24} />
                        </div>
                    </div>
                    <div className="h-80 w-full flex flex-col items-center justify-center">
                        {usageData.length > 0 ? (
                            <div className="relative w-full h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={usageData}
                                            innerRadius={80}
                                            outerRadius={110}
                                            paddingAngle={8}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {usageData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={['#6366f1', '#0ea5e9', '#10b981', '#f59e0b'][index % 4]} className="hover:opacity-80 transition-opacity" />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{borderRadius: '20px', border: 'none', backgroundColor: '#111827', color: '#fff'}}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-3xl font-black text-gray-900 dark:text-white">{usageData.reduce((acc, curr) => acc + curr.value, 0)}</span>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('total_actions')}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-gray-400">
                                <PieIcon size={48} className="mb-4 opacity-20" />
                                <p className="font-bold">No interactions detected yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* AI Toolset Portal */}
            <div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-gray-100 mb-8 tracking-tight flex items-center gap-3">
                    <Zap className="text-yellow-500 fill-current" size={32} />
                    {t('ai_toolset')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {tools.map((tool, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => nav(tool.path)}
                            className={`bg-white dark:bg-gray-900 p-8 rounded-[2rem] shadow-xl border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:border-${tool.color}-300 dark:hover:border-${tool.color}-700/50 cursor-pointer transition-all duration-300 group relative overflow-hidden h-full flex flex-col justify-between`}
                        >
                            <div className={`absolute -right-4 -top-4 w-20 h-20 bg-${tool.color}-500/5 rounded-full group-hover:scale-150 transition-transform`}></div>
                            <div>
                                <div className={`w-16 h-16 bg-${tool.color}-50 dark:bg-${tool.color}-900/40 text-${tool.color}-600 dark:text-${tool.color}-400 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform`}>
                                    {tool.icon}
                                </div>
                                <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 mb-3 group-hover:text-indigo-600 transition-colors uppercase tracking-tighter">{tool.title}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-6">{tool.desc}</p>
                            </div>
                            <div className={`flex items-center text-xs font-black text-${tool.color}-600 dark:text-${tool.color}-400 uppercase tracking-widest group-hover:translate-x-2 transition-transform`}>
                                {t('launch_tool')} <ChevronRight size={14} className="ml-1" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Sidebar Analytics Column */}
        <div className="space-y-8">
            {/* Recent Activity Card */}
            <div className="bg-gray-900 dark:bg-black rounded-[2.5rem] p-10 text-white shadow-2xl overflow-hidden relative border border-gray-800">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl"></div>
                <h2 className="text-xl font-black mb-8 flex items-center gap-3 tracking-tight">
                    <Calendar className="text-indigo-400" size={24} />
                    {t('recent_activity', 'Recent Activity')}
                </h2>
                <div className="space-y-6 relative z-10">
                    {recentActivity.length > 0 ? recentActivity.map((act, idx) => (
                        <div key={idx} className="flex gap-4 group cursor-default">
                            <div className="flex-shrink-0 w-1.5 h-12 bg-indigo-600 dark:bg-indigo-500 rounded-full group-hover:h-14 transition-all duration-300"></div>
                            <div className="min-w-0">
                                <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-1 truncate">
                                    {act.question.split(':')[0]}
                                </p>
                                <p className="text-sm font-medium text-gray-300 line-clamp-1">{act.question.includes(':') ? act.question.split(': ')[1] : act.question}</p>
                            </div>
                        </div>
                    )) : (
                        <div className="py-10 text-center text-gray-500">
                            <p className="text-sm font-bold">{t('start_learning_notice', 'Start a conversation to see activity logs')}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Achievement Card */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-[2.5rem] p-10 text-white shadow-2xl relative group cursor-pointer transition-all hover:shadow-indigo-500/20" onClick={() => nav("/quiz")}>
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity rounded-[2.5rem]"></div>
                <div className="relative z-10 space-y-6">
                    <div className="flex justify-between items-start">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white backdrop-blur-md shadow-lg">
                            <Brain size={32} />
                        </div>
                        <div className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{t('next_goal')}</div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-black tracking-tight leading-tight">{t('knowledge_mastery')}</h3>
                        <p className="text-indigo-100 text-sm mt-3 font-medium leading-relaxed opacity-80">{t('knowledge_mastery_desc')}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest">
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