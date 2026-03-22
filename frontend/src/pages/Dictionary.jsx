import { useState, useEffect, useContext } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { useTranslation } from "react-i18next";
import {
  User, History as HistoryIcon, Clock, Menu, X, ArrowLeft, Book, Sparkles, Search,
  Volume2, MapPin, Lightbulb, Briefcase, Link, Target, GraduationCap, Award, Crown, Plus
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Dictionary() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const { user: email, language: lang, level: lvl } = useContext(AuthContext);
  const [term, setTerm] = useState("");
  const [response, setResponse] = useState(null);
  const [history, setHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [level, setLevel] = useState(lvl || "Beginner");
  const [language, setLanguage] = useState(lang || "English");

  useEffect(() => { if (lvl) setLevel(lvl); if (lang) setLanguage(lang); }, [lang, lvl]);
  useEffect(() => { if (email !== "User") fetchHistory(); }, [email, response]);

  const fetchHistory = async () => {
    try {
      const res = await API.get(`/ai/history?email=${email}`);
      setHistory(res.data.history.filter(h => h.question.startsWith('Dictionary: ')).reverse());
    } catch { console.error("Failed to fetch history"); }
  };

  const handleSetResponse = (data) => {
    if (typeof data === "string") {
      try { setResponse(JSON.parse(data)); } catch { setResponse(data); }
    } else setResponse(data);
  };

  const askDictionary = async () => {
    if (!term) { toast.error(t('search_term_placeholder')); return; }
    const tid = toast.loading(t('crystallizing'));
    try {
      const res = await API.post("/ai/dictionary", { email, term, level, language });
      if (res.data.error) { toast.error(res.data.error, { id: tid }); return; }
      handleSetResponse(res.data.response);
      toast.success(t('definition_found'), { id: tid });
      fetchHistory();
    } catch { toast.error(t('send_error')); }
  };

  const handleSpeech = () => {
    if (!response?.term) return;
    const utterance = new SpeechSynthesisUtterance(response.term);
    utterance.lang = language === 'Tamil' ? 'ta-IN' : language === 'Hindi' ? 'hi-IN' : 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const levelOptions = [
    { label: t('beginner'), value: "Beginner", Icon: GraduationCap, color: "emerald" },
    { label: t('intermediate'), value: "Intermediate", Icon: Award, color: "sky" },
    { label: t('advanced'), value: "Expert", Icon: Crown, color: "amber" },
  ];

  const card = "bg-white dark:bg-[#0d0d1a] border border-gray-100 dark:border-white/5 rounded-3xl shadow-sm";

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#080810] flex flex-col transition-colors duration-500">
      <Navbar />
      <div className="flex flex-1 overflow-hidden relative">
        {sidebarOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

        {/* Sidebar */}
        <aside className={`fixed md:relative z-50 w-72 bg-white dark:bg-[#0d0d1a] border-r border-gray-100 dark:border-white/5 flex flex-col h-[calc(100vh-64px)] overflow-y-auto transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="p-5 border-b border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Sparkles size={18} className="text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{email}</p>
                <div className="flex gap-1.5 mt-1">
                  <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-black uppercase tracking-wide rounded-md">{language}</span>
                  <span className="px-2 py-0.5 bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 text-[10px] font-black uppercase tracking-wide rounded-md">{level}</span>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
          </div>

          <div className="p-4 border-b border-gray-100 dark:border-white/5">
            <button
              onClick={() => { setTerm(""); setResponse(null); setSidebarOpen(false); }}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-2.5 rounded-xl font-bold text-sm shadow-lg active:scale-95"
            >
              <Plus size={16} /> {t('new_chat')}
            </button>
          </div>

          <div className="p-4 flex-1 overflow-y-auto">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
              <HistoryIcon size={14} /> {t('search_history')}
            </div>
            {history.length === 0 ? (
              <p className="text-xs text-gray-400 dark:text-gray-600 italic text-center py-6">{t('no_terms')}</p>
            ) : history.map((item, idx) => (
              <button key={idx}
                className="w-full text-left p-3 rounded-xl bg-gray-50 dark:bg-white/3 border border-gray-100 dark:border-white/5 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all mb-2 group"
                onClick={() => { setTerm(item.question.replace('Dictionary: ', '')); handleSetResponse(item.response); setSidebarOpen(false); }}
              >
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 line-clamp-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                  {item.question.replace('Dictionary: ', '')}
                </p>
                <div className="flex items-center gap-1 mt-1.5 text-[10px] text-gray-400 uppercase tracking-wider">
                  <Clock size={10} /> {t('past_search')}
                </div>
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-1 p-6 md:p-10 overflow-y-auto h-[calc(100vh-64px)] w-full flex flex-col items-center">
          {/* Header */}
          <div className="w-full max-w-3xl flex items-center gap-4 mb-10">
            <div className="flex items-center gap-3">
              <button onClick={() => nav(-1)} className="p-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all shadow-sm">
                <ArrowLeft size={18} />
              </button>
              <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-500 shadow-sm">
                <Menu size={18} />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                {t('termcrystal') || "TermCrystal"}
              </h1>
            </div>
          </div>

          {/* Search */}
          <div className="w-full max-w-2xl mb-5">
            <div className="bg-white dark:bg-[#0d0d1a] border-2 border-gray-200 dark:border-white/8 rounded-2xl p-2 flex items-center focus-within:border-emerald-400 dark:focus-within:border-emerald-600 focus-within:ring-4 focus-within:ring-emerald-400/15 dark:focus-within:ring-emerald-600/10 transition-all shadow-sm">
              <div className="pl-4 text-gray-400"><Search size={20} /></div>
              <input
                className="flex-1 px-4 py-3 outline-none text-gray-800 dark:text-gray-100 bg-transparent text-lg font-medium"
                placeholder={t('search_term_placeholder')}
                value={term}
                onChange={e => setTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && askDictionary()}
              />
              <Button
                onClick={askDictionary}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-7 h-12 rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all text-base"
              >
                {t('define')}
              </Button>
            </div>
          </div>

          {/* Level Selector */}
          <div className="flex items-center gap-3 mb-10 p-2 bg-white dark:bg-[#0d0d1a] border border-gray-100 dark:border-white/5 rounded-2xl shadow-sm">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest px-3">{t('level')}:</span>
            {levelOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setLevel(opt.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${level === opt.value
                    ? `bg-${opt.color}-100 dark:bg-${opt.color}-900/40 text-${opt.color}-700 dark:text-${opt.color}-300 ring-2 ring-${opt.color}-400/30 dark:ring-${opt.color}-600/20`
                    : "text-gray-500 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5"
                  }`}
              >
                <opt.Icon size={16} /> {opt.label}
              </button>
            ))}
          </div>

          {/* Response */}
          {response && typeof response === 'object' ? (
            <div className="w-full max-w-4xl space-y-5 animate-in fade-in slide-in-from-bottom-8 duration-700">
              {/* Header */}
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-7 rounded-3xl text-white shadow-xl shadow-emerald-500/20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-black mb-2">{response.term}</h2>
                    <button
                      className="flex items-center gap-2 bg-white/15 border border-white/20 px-3 py-1.5 rounded-xl hover:bg-white/25 transition-all cursor-pointer backdrop-blur-sm"
                      onClick={handleSpeech}
                    >
                      <Volume2 size={16} />
                      <span className="text-sm font-medium">{response.pronunciation}</span>
                    </button>
                  </div>
                  <div className="bg-white/15 border border-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl text-sm font-bold">
                    {levelOptions.find(o => o.value === level)?.label} Level
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className={`${card} p-7`}>
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black mb-4 text-xs uppercase tracking-widest"><Book size={16} /> {t('definition')}</div>
                  <p className="text-gray-800 dark:text-gray-100 text-lg font-medium leading-relaxed">{response.definition}</p>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-3xl p-7">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-black mb-4 text-xs uppercase tracking-widest"><Lightbulb size={16} /> {t('analogy')}</div>
                  <p className="text-gray-800 dark:text-gray-100 text-base italic leading-relaxed">"{response.analogy}"</p>
                </div>

                <div className={`${card} p-7`}>
                  <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 font-black mb-4 text-xs uppercase tracking-widest"><MapPin size={16} /> {t('real_life_example')}</div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{response.real_life_example}</p>
                </div>

                <div className={`${card} p-7`}>
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-black mb-4 text-xs uppercase tracking-widest"><Briefcase size={16} /> {t('where_used')}</div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{response.where_used}</p>
                </div>

                <div className="md:col-span-2 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-3xl p-7">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black mb-4 text-xs uppercase tracking-widest"><Target size={16} /> {t('why_it_matters')}</div>
                  <p className="text-xl font-bold text-indigo-900 dark:text-indigo-100 leading-relaxed">{response.why_it_matters}</p>
                </div>

                <div className={`md:col-span-2 ${card} p-7`}>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 font-black mb-6 text-xs uppercase tracking-widest"><Link size={16} /> {t('related_terms')}</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {response.related_terms?.map((rt, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 dark:bg-white/3 border border-gray-100 dark:border-white/5 hover:border-emerald-300 dark:hover:border-emerald-700 rounded-2xl p-4 cursor-pointer group transition-all hover:shadow-md"
                        onClick={() => { setTerm(rt.term); askDictionary(); }}
                      >
                        <h4 className="font-black text-emerald-600 dark:text-emerald-400 group-hover:underline underline-offset-4 mb-1">{rt.term}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{rt.def}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : response && (
            <div className={`w-full max-w-3xl ${card} p-8 animate-in fade-in slide-in-from-bottom-8 duration-700`}>
              <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                {response}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}