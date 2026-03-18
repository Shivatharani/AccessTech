import {useEffect,useState} from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import {AreaChart,Area,BarChart,Bar,XAxis,YAxis,Tooltip, ResponsiveContainer, CartesianGrid} from "recharts";
import { useTranslation } from "react-i18next";
import { Activity, BookOpen, Clock, Target, ArrowLeft, Code2, Map, Sparkles, Zap, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard(){

 const { t } = useTranslation()
 const nav = useNavigate()
 const [chartData,setChartData]=useState([])
 const [stats,setStats]=useState(null)
 const [lastLogin, setLastLogin] = useState(null)
 const username = localStorage.getItem("email")?.split('@')[0] || "User"

 useEffect(()=>{
  const email=localStorage.getItem("email")
  API.get(`/dashboard/analytics?email=${email}`)
  .then(res=>{
   if (res.data.charts && res.data.charts.quiz_trend) {
     setChartData(res.data.charts.quiz_trend)
   }
   setStats({
     qCount: res.data.total_questions,
     lCount: res.data.total_logins,
     avgScore: res.data.avg_quiz_score
   })
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
   <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans transition-colors duration-300">
    <Navbar/>
 
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-12">
      {/* Welcome Header */}
      <div className="bg-white dark:bg-gray-900 p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden transition-all">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-gray-100 tracking-tight mb-2">
            {t('welcome_back')}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">{username}</span>! 👋
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">{t('hero_subtitle')}</p>
        </div>
        {lastLogin && (
          <div className="relative z-10 flex items-center gap-3 bg-gray-50 dark:bg-gray-950 px-5 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <Clock className="text-indigo-500" size={20} />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{t('last_login')}</p>
              <p className="text-gray-900 dark:text-gray-100 font-mono text-sm">{lastLogin}</p>
            </div>
          </div>
        )}
      </div>

      {/* Tools Portal Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <Zap className="text-yellow-500" />
            {t('ai_toolset')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {tools.map((tool, idx) => (
                <div 
                    key={idx} 
                    onClick={() => nav(tool.path)}
                    className={`bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:border-${tool.color}-300 dark:hover:border-${tool.color}-700/50 cursor-pointer transition-all duration-300 group flex flex-col h-full`}
                >
                    <div className={`w-14 h-14 bg-${tool.color}-50 dark:bg-${tool.color}-900/30 text-${tool.color}-600 dark:text-${tool.color}-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm`}>
                        {tool.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{tool.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex-1">{tool.desc}</p>
                    <div className={`flex items-center text-sm font-bold text-${tool.color}-600 dark:text-${tool.color}-400 group-hover:translate-x-2 transition-transform`}>
                        {t('open_tool')} <ChevronRight size={16} className="ml-1" />
                    </div>
                </div>
            ))}
        </div>
      </div>

     {/* Stat Cards */}
     {stats && (
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
         <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4 hover:shadow-md transition-all duration-300">
           <div className="w-14 h-14 rounded-xl bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
             <BookOpen size={28} />
           </div>
           <div>
             <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t('total_questions')}</p>
             <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.qCount}</h3>
           </div>
         </div>
         <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4 hover:shadow-md transition-all duration-300">
           <div className="w-14 h-14 rounded-xl bg-purple-50 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
             <Activity size={28} />
           </div>
           <div>
             <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t('total_logins')}</p>
             <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.lCount}</h3>
           </div>
         </div>
         <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4 hover:shadow-md transition-all duration-300">
           <div className="w-14 h-14 rounded-xl bg-emerald-50 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
             <Target size={28} />
           </div>
           <div>
             <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t('avg_quiz_score')}</p>
             <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.avgScore.toFixed(1)} / 10</h3>
           </div>
         </div>
       </div>
     )}
 
     {/* Charts Container */}
     <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
       {/* Area Chart */}
       <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-300 flex flex-col min-h-[400px]">
         <div className="flex justify-between items-center mb-6">
           <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{t('quiz_trends')}</h2>
           <span className="text-sm border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 px-3 py-1 rounded-full">{t('score')} out of 10</span>
         </div>
         <div className="flex-1 w-full relative">
           {chartData.length > 0 ? (
             <div className="absolute inset-0">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                   <defs>
                     <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                       <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.3} />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#8ca3ba', fontSize: 12}} dy={10} />
                   <YAxis axisLine={false} tickLine={false} tick={{fill: '#8ca3ba', fontSize: 12}} dx={-10} domain={[0, 10]} />
                   <Tooltip 
                     cursor={{stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '5 5'}}
                     contentStyle={{borderRadius: '12px', border: '1px solid #374151', backgroundColor: '#1f2937', color: '#fff'}}
                     itemStyle={{color: '#fff', fontWeight: 'bold'}}
                   />
                   <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
           ) : (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 dark:text-gray-600">
               <Target size={48} className="mb-4 text-gray-300 dark:text-gray-700" />
               <p className="text-center px-4">{t('take_quiz_notice')}</p>
             </div>
           )}
         </div>
       </div>

       {/* Bar Chart */}
       <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-300 flex flex-col min-h-[400px]">
         <div className="flex justify-between items-center mb-6">
           <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{t('quiz_engagement')}</h2>
           <span className="text-sm border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 px-3 py-1 rounded-full">{t('score')} out of 10</span>
         </div>
         <div className="flex-1 w-full relative">
           {chartData.length > 0 ? (
             <div className="absolute inset-0">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.3} />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#8ca3ba', fontSize: 12}} dy={10} />
                   <YAxis axisLine={false} tickLine={false} tick={{fill: '#8ca3ba', fontSize: 12}} dx={-10} domain={[0, 10]} />
                   <Tooltip 
                     cursor={{fill: '#f1f5f9', opacity: 0.1}}
                     contentStyle={{borderRadius: '12px', border: '1px solid #374151', backgroundColor: '#1f2937', color: '#fff'}}
                     itemStyle={{color: '#fff', fontWeight: 'bold'}}
                   />
                   <Bar dataKey="score" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                 </BarChart>
               </ResponsiveContainer>
             </div>
           ) : (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 dark:text-gray-600">
               <Activity size={48} className="mb-4 text-gray-300 dark:text-gray-700" />
               <p className="text-center px-4">{t('take_quiz_notice')}</p>
             </div>
           )}
         </div>
       </div>
     </div>
   
    </div>
   
   </div>
   
  )

}