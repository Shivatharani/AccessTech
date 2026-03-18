import { useState, useEffect, useContext } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { useTranslation } from "react-i18next";
import { User, History as HistoryIcon, Clock, Menu, X, ArrowLeft, Book, Sparkles, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Dictionary() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const { user: email, language: lang, level: lvl } = useContext(AuthContext);
  const [term, setTerm] = useState("");
  const [response, setResponse] = useState("");
  const [history, setHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (email !== "User") {
      fetchHistory();
    }
  }, [email, response]);

  const fetchHistory = async () => {
    try {
      const res = await API.get(`/ai/history?email=${email}`);
      const dictHistory = res.data.history.filter(h => h.question.startsWith('Term: ')).reverse();
      setHistory(dictHistory);
    } catch (err) {
      console.error("Failed to fetch history");
    }
  };

  const askDictionary = async () => {
    if (!term) {
      toast.error(t('search_term_placeholder'));
      return;
    }

    const tid = toast.loading(t('crystallizing'));

    try {
      const res = await API.post("/ai/dictionary", { email, term });
      setResponse(res.data.response);
      toast.success(t('definition_found'), { id: tid });
      fetchHistory();
    } catch (err) {
      toast.error(t('send_error'), { id: tid });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
      <Navbar />
      <div className="flex flex-1 overflow-hidden relative">
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 md:hidden transition-colors duration-300"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <aside className={`fixed md:relative z-50 w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-[calc(100vh-64px)] overflow-y-auto transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-emerald-50/50 dark:bg-emerald-950/20 flex justify-between items-start transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center font-bold text-xl transition-colors">
                <Sparkles size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 truncate w-40 transition-colors" title={email}>{email}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-medium transition-colors">{lang}</span>
                  <span className="text-xs bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded-full font-medium transition-colors">{lvl}</span>
                </div>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="p-6 flex-1">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold mb-4 transition-colors">
              <HistoryIcon size={18} className="text-emerald-600 dark:text-emerald-400" />
              {t('search_history')}
            </div>
            {history.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400 italic transition-colors">{t('no_terms')}</p>
            ) : (
              <div className="space-y-4">
                {history.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors"
                    onClick={() => {
                      setTerm(item.question.replace('Term: ', ''));
                      setResponse(item.response);
                      setSidebarOpen(false);
                    }}>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 line-clamp-2 transition-colors">{item.question.replace('Term: ', '')}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-slate-400 dark:text-slate-500 transition-colors">
                      <Clock size={12} />
                      <span>{t('past_search')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
        <main className="flex-1 p-6 md:p-10 overflow-y-auto h-[calc(100vh-64px)] relative w-full flex flex-col items-center">
          <div className="w-full max-w-4xl flex items-center justify-between mb-12 border-b pb-4 border-slate-200 dark:border-slate-800">
             <div className="flex items-center gap-4">
                <button onClick={() => nav(-1)} className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 transition-colors">
                <ArrowLeft size={20} />
                </button>
                <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 bg-white dark:bg-slate-900 rounded-md shadow-sm border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800">
                <Menu size={20} />
                </button>
             </div>
             
             <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-500 transition-colors flex items-center gap-3 tracking-tight">
                <Sparkles className="text-emerald-500 w-10 h-10" />
                {t('termcrystal') || "TermCrystal"}
             </h1>
             <div className="w-10 md:hidden"></div> {/*Spacer*/}
          </div>
          
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 p-2 rounded-full shadow-lg border border-slate-200 dark:border-slate-800 mb-8 focus-within:ring-4 focus-within:ring-emerald-400/50 dark:focus-within:ring-emerald-500/50 transition-all flex items-center">
             <div className="pl-6 text-slate-400">
                 <Search size={24} />
             </div>
             <input
                 className="flex-1 px-4 py-4 outline-none text-slate-800 dark:text-slate-100 bg-transparent h-14 transition-colors text-xl font-medium"
                 placeholder={t('search_term_placeholder') || "Search any confusing technical term..."}
                 value={term}
                 onChange={e => setTerm(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && askDictionary()}
             />
             <Button
                 onClick={askDictionary}
                 className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white px-8 h-14 rounded-full font-bold shadow-md transition-colors text-lg mr-1"
             >
                 {t('define') || "Define"}
             </Button>
          </div>
          
          {response && (
            <div className="w-full bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700 transition-colors">
              <div className="prose prose-emerald prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed transition-colors marker:text-emerald-500">
                {response}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
