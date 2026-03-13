import {useEffect,useState} from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import {AreaChart,Area,BarChart,Bar,XAxis,YAxis,Tooltip, ResponsiveContainer, CartesianGrid, Legend} from "recharts";
import { useTranslation } from "react-i18next";
import { Activity, BookOpen, Clock, Target, ArrowLeft } from "lucide-react";

export default function Dashboard(){

 const { t } = useTranslation()
 const [chartData,setChartData]=useState([])
 const [stats,setStats]=useState(null)
 const [lastLogin, setLastLogin] = useState(null)

 useEffect(()=>{

  const email=localStorage.getItem("email")

  API.get(`/dashboard/analytics?email=${email}`)
  .then(res=>{

   // Populate the quiz trend line chart
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
     if (!rawTime.endsWith("Z")) {
       rawTime += "Z";
     }
     const latest = new Date(rawTime);
     setLastLogin(latest.toLocaleString(undefined, {
       dateStyle: 'medium',
       timeStyle: 'short'
     }));
   }

  })

 },[t])

  return(
 
   <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans transition-colors duration-300">
 
    <Navbar/>
 
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
 
      <div className="flex justify-between items-end mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => window.history.back()} className="p-2 bg-white dark:bg-gray-900 rounded-full shadow-sm border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 transition-colors duration-300">
             {t('dashboard')}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 transition-colors duration-300">Activity overview and performance metrics</p>
          </div>
        </div>
        {lastLogin && (
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/50 border border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300">
              <Clock size={16} />
              {t('last_login')}
            </div>
            <span className="text-gray-500 dark:text-gray-400 mt-1 font-mono text-sm transition-colors duration-300">{lastLogin}</span>
          </div>
        )}
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
             <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Logins</p>
             <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.lCount}</h3>
           </div>
         </div>
         <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4 hover:shadow-md transition-all duration-300">
           <div className="w-14 h-14 rounded-xl bg-emerald-50 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
             <Target size={28} />
           </div>
           <div>
             <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Average Quiz Score</p>
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
           <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Quiz Performance Trends</h2>
           <span className="text-sm border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 px-3 py-1 rounded-full">Score out of 10</span>
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
               <p className="text-center px-4">Take some quizzes to generate performance trends!</p>
             </div>
           )}
         </div>
       </div>

       {/* Bar Chart */}
       <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-300 flex flex-col min-h-[400px]">
         <div className="flex justify-between items-center mb-6">
           <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Quiz Engagement</h2>
           <span className="text-sm border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 px-3 py-1 rounded-full">Recent scores</span>
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
               <p className="text-center px-4">Engagement tracking will appear once you complete quizzes.</p>
             </div>
           )}
         </div>
       </div>
     </div>
  
    </div>
  
   </div>
  
  )

}