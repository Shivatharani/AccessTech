import { useState, useEffect } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { useTranslation } from "react-i18next";
import { User, History as HistoryIcon, Clock, Menu, X, ArrowLeft, Briefcase, Map, Target } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Mentor() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [goal, setGoal] = useState("");
  const [response, setResponse] = useState("");
  const [history, setHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const email = localStorage.getItem("email") || "User";
  const lang = localStorage.getItem("language") || "English";
  const lvl = localStorage.getItem("level") || "Beginner";

  useEffect(() => {
    if (email !== "User") {
      fetchHistory();
    }
  }, [email, response]);

  const fetchHistory = async () => {
    try {
      const res = await API.get(`/ai/history?email=${email}`);
      const mentorHistory = res.data.history.filter(h => h.question.startsWith('Career Goal:')).reverse();
      setHistory(mentorHistory);
    } catch (err) {
      console.error("Failed to fetch history");
    }
  };

  const askMentor = async () => {
    if (!goal) {
      toast.error(t('career_goal_prompt'));
      return;
    }

    const tid = toast.loading(t('generating_roadmap'));

    try {
      const res = await API.post("/ai/mentor", { email, goal });
      setResponse(res.data.response);
      toast.success(t('roadmap_success'), { id: tid });
      fetchHistory();
    } catch (err) {
      toast.error(t('send_error'), { id: tid });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col transition-colors duration-300">
      <Navbar />
      <div className="flex flex-1 overflow-hidden relative">
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 md:hidden transition-colors duration-300"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <aside className={`fixed md:relative z-50 w-80 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col h-[calc(100vh-64px)] overflow-y-auto transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 bg-sky-50/50 dark:bg-sky-950/20 flex justify-between items-start transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400 rounded-full flex items-center justify-center font-bold text-xl transition-colors">
                <Target size={24} />
              </div>
              <div>
                <h3 className="font-bold text-neutral-900 dark:text-neutral-100 truncate w-40 transition-colors" title={email}>{email}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 px-2 py-0.5 rounded-full font-medium transition-colors">{lang}</span>
                  <span className="text-xs bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-medium transition-colors">{lvl}</span>
                </div>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="p-6 flex-1">
            <div className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200 font-bold mb-4 transition-colors">
              <HistoryIcon size={18} className="text-sky-600 dark:text-sky-400" />
              {t('mentor_history')}
            </div>
            {history.length === 0 ? (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 italic transition-colors">{t('no_paths')}</p>
            ) : (
              <div className="space-y-4">
                {history.map((item, idx) => (
                  <div key={idx} className="bg-neutral-50 dark:bg-neutral-800/50 p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 shadow-sm cursor-pointer hover:bg-sky-50 dark:hover:bg-sky-900/30 transition-colors"
                    onClick={() => {
                      setGoal(item.question.replace('Career Goal: ', ''));
                      setResponse(item.response);
                      setSidebarOpen(false);
                    }}>
                    <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 line-clamp-2 transition-colors">{item.question.replace('Career Goal: ', '')}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-neutral-400 dark:text-neutral-500 transition-colors">
                      <Clock size={12} />
                      <span>{t('past_session')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
        <main className="flex-1 p-6 md:p-10 overflow-y-auto h-[calc(100vh-64px)] relative w-full">
          <div className="flex items-center gap-4 mb-8 border-b pb-4 border-neutral-200 dark:border-neutral-800">
            <button onClick={() => nav(-1)} className="p-2 bg-white dark:bg-neutral-900 rounded-full shadow-sm border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/50 transition-colors">
              <ArrowLeft size={20} />
            </button>
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 bg-white dark:bg-neutral-900 rounded-md shadow-sm border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800">
              <Menu size={20} />
            </button>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-600 dark:from-sky-400 dark:to-indigo-500 transition-colors flex items-center gap-3">
              <Map className="text-sky-500 w-10 h-10" />
              {t('pathpilot')}
            </h1>
          </div>
          
          <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 mb-8 max-w-4xl transition-all">
             <h2 className="text-xl font-bold mb-4 text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                 <Briefcase className="text-sky-500" />
                 {t('career_goal_prompt')}
             </h2>
             <div className="flex gap-4 flex-col sm:flex-row">
                 <input
                 className="flex-1 px-5 py-4 rounded-xl border-2 border-neutral-200 dark:border-neutral-800 outline-none text-neutral-800 dark:text-neutral-100 bg-neutral-50 dark:bg-neutral-950 focus:border-sky-400 dark:focus:border-sky-500 transition-colors text-lg"
                 placeholder={t('career_goal_placeholder')}
                 value={goal}
                 onChange={e => setGoal(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && askMentor()}
                 />
                 <Button
                 onClick={askMentor}
                 className="bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white px-10 h-14 sm:h-auto rounded-xl font-bold shadow-lg shadow-sky-500/30 transition-all text-lg whitespace-nowrap"
                 >
                 {t('map_path')}
                 </Button>
             </div>
          </div>
          {response && (
            <div className="mt-8 bg-white dark:bg-neutral-900 p-8 rounded-3xl shadow-lg border border-neutral-100 dark:border-neutral-800 max-w-4xl animate-in fade-in zoom-in-95 duration-500 transition-colors">
              <h2 className="font-extrabold pb-6 text-2xl mb-6 text-neutral-800 dark:text-neutral-100 border-b-2 border-sky-100 dark:border-sky-900/30 flex items-center gap-3 transition-colors">
                  <Target className="text-sky-500 w-8 h-8" />
                  {t('custom_roadmap')}
              </h2>
              <div className="prose prose-sky dark:prose-invert max-w-none text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap leading-loose text-lg transition-colors">
                {response}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
