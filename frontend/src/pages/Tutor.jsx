import {useState, useEffect} from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { useTranslation } from "react-i18next";
import { User, History as HistoryIcon, Clock, LogOut, Menu, X, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

export default function Tutor(){

  const { t } = useTranslation()
  const nav = useNavigate()
  const [topic,setTopic]=useState("")
  const [response,setResponse]=useState("")
  const [history, setHistory] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const email = localStorage.getItem("email") || "User"
  const lang = localStorage.getItem("language") || "English"
  const lvl = localStorage.getItem("level") || "Beginner"

  useEffect(() => {
    if (email !== "User") {
      fetchHistory()
    }
  }, [email, response]) // Refetch history when a new response is generated

  const fetchHistory = async () => {
    try {
      const res = await API.get(`/ai/history?email=${email}`)
      setHistory(res.data.history.reverse()) // Show newest first
    } catch (err) {
      console.error("Failed to fetch history")
    }
  }

 const askAI=async()=>{

  if (!topic) {
    toast.error("Please enter a topic first.");
    return;
  }

  const tid = toast.loading("Generating your personalized lesson...");

  try {
   const res=await API.post("/ai/ask",{
    email,
    topic
   })
 
   setResponse(res.data.response)
   toast.success("Lesson generated successfully!", { id: tid })
   fetchHistory()
  } catch(err) {
    toast.error("Failed to generate lesson.", { id: tid })
  }
 }

 const goToQuiz = () => {
    nav(`/quiz?topic=${encodeURIComponent(topic)}&lang=${encodeURIComponent(lang)}`)
 }

 return(

  <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-300">

   <Navbar/>

   <div className="flex flex-1 overflow-hidden relative">
    
    {/* Mobile Sidebar Overlay */}
    {sidebarOpen && (
      <div 
        className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 md:hidden transition-colors duration-300" 
        onClick={() => setSidebarOpen(false)}
      />
    )}

    {/* Sidebar */}
    <aside className={`fixed md:relative z-50 w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-[calc(100vh-64px)] overflow-y-auto transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-indigo-50/50 dark:bg-indigo-950/20 flex justify-between items-start transition-colors">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center font-bold text-xl transition-colors">
            <User size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate w-40 transition-colors" title={email}>{email}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full font-medium transition-colors">{lang}</span>
              <span className="text-xs bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full font-medium transition-colors">{lvl}</span>
            </div>
          </div>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          <X size={20} />
        </button>
      </div>
      
      <div className="p-6 flex-1">
        <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200 font-bold mb-4 transition-colors">
          <HistoryIcon size={18} className="text-indigo-600 dark:text-indigo-400" />
          {t('history')}
        </div>
        {history.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 italic transition-colors">No history yet.</p>
        ) : (
          <div className="space-y-4">
            {history.map((item, idx) => (
              <div key={idx} className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                onClick={() => {
                  setTopic(item.question);
                  setResponse(item.response);
                  setSidebarOpen(false);
                }}>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 line-clamp-2 transition-colors">{item.question}</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-400 dark:text-gray-500 transition-colors">
                  <Clock size={12} />
                  <span>Previously asked</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>

    {/* Main Content */}
    <main className="flex-1 p-6 md:p-10 overflow-y-auto h-[calc(100vh-64px)] relative w-full">

     <div className="flex items-center gap-4 mb-8">
        <button onClick={() => nav(-1)} className="p-2 bg-white dark:bg-gray-900 rounded-full shadow-sm border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 bg-white dark:bg-gray-900 rounded-md shadow-sm border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
          <Menu size={20} />
        </button>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 transition-colors">
          {t('tutor')}
        </h1>
     </div>

     <div className="flex items-center bg-white dark:bg-gray-900 p-2 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 mb-8 max-w-3xl focus-within:ring-2 focus-within:ring-indigo-400 dark:focus-within:ring-indigo-500 transition-all">
      <input
       className="flex-1 px-4 py-2 outline-none text-gray-800 dark:text-gray-100 bg-transparent h-12 transition-colors"
       placeholder={t('enter_topic')}
       value={topic}
       onChange={e=>setTopic(e.target.value)}
       onKeyDown={(e) => e.key === 'Enter' && askAI()}
      />
      <Button
       onClick={askAI}
       className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-8 h-12 rounded-lg font-semibold shadow-md ml-2 transition-colors"
      >
       {t('ask_ai')}
      </Button>
     </div>

     {response && (
      <div className="mt-8 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500 transition-colors">
  
       <h2 className="font-bold border-b border-gray-100 dark:border-gray-800 pb-4 text-xl mb-4 text-gray-800 dark:text-gray-100 flex items-center justify-between gap-2 transition-colors">
        <span>{t('explanation')}</span>
        <Button onClick={goToQuiz} className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all">
          Take Interactive Quiz
        </Button>
       </h2>
  
       <div className="prose prose-indigo dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed transition-colors">
        {response}
       </div>
  
      </div>
     )}

    </main>
   </div>

  </div>

 )

}