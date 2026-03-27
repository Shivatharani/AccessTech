import { useState, useEffect, useContext } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { useTranslation } from "react-i18next";
import {
  History as HistoryIcon, Clock, Menu, X, ArrowLeft, Book, Sparkles, Search,
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
    { label: t('beginner'), value: "Beginner", Icon: GraduationCap, colorClass: 'text-green-700 dark:text-green-400', bgClass: 'bg-green-50 dark:bg-green-900/30' },
    { label: t('intermediate'), value: "Intermediate", Icon: Award, colorClass: 'text-sky-700 dark:text-sky-400', bgClass: 'bg-sky-50 dark:bg-sky-900/30' },
    { label: t('advanced'), value: "Expert", Icon: Crown, colorClass: 'text-orange-700 dark:text-orange-400', bgClass: 'bg-orange-50 dark:bg-orange-900/30' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-cyan-50 dark:bg-gray-950">
      <Navbar />
      <div className="flex flex-1 overflow-hidden relative">
        {sidebarOpen && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

        {/* Sidebar */}
        <aside className={`fixed md:relative z-50 w-72 flex flex-col h-[calc(100vh-64px)] overflow-y-auto transition-transform duration-300 border-r ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} bg-teal-50 border-teal-200 dark:bg-gray-900 dark:border-teal-900/40`}>
          <div className="p-5 border-b border-teal-200 dark:border-teal-900/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br from-teal-400 to-teal-600 dark:from-teal-600 dark:to-teal-800">
                <Sparkles size={18} className="text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm truncate text-teal-900 dark:text-teal-50">{email}</p>
                <div className="flex gap-1.5 mt-1">
                  <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wide rounded-md bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-400">{language}</span>
                  <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wide rounded-md bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400">{level}</span>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="md:hidden text-teal-300 dark:text-teal-700"><X size={18} /></button>
            </div>
          </div>

          <div className="p-4 border-b border-teal-200 dark:border-teal-900/40">
            <button onClick={() => { setTerm(""); setResponse(null); setSidebarOpen(false); }}
              className="w-full flex items-center justify-center gap-2 text-white py-2.5 rounded-xl font-bold text-sm shadow-lg bg-gradient-to-br from-teal-400 to-teal-600 dark:from-teal-600 dark:to-teal-800 hover:opacity-90 transition-opacity">
              <Plus size={16} /> {t('new_chat')}
            </button>
          </div>

          <div className="p-4 flex-1 overflow-y-auto">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest mb-3 text-teal-400 dark:text-teal-600">
              <HistoryIcon size={14} /> {t('search_history')}
            </div>
            {history.length === 0 ? (
              <p className="text-xs italic text-center py-6 text-teal-400 dark:text-teal-600">{t('no_terms')}</p>
            ) : history.map((item, idx) => (
              <button key={idx}
                className="w-full text-left p-3 rounded-xl border transition-all mb-2 group bg-teal-100/50 border-teal-200 hover:bg-teal-100 dark:bg-teal-900/20 dark:border-teal-900/40 dark:hover:bg-teal-900/40"
                onClick={() => { setTerm(item.question.replace('Dictionary: ', '')); handleSetResponse(item.response); setSidebarOpen(false); }}>
                <p className="text-sm font-semibold line-clamp-2 transition-colors text-teal-900 dark:text-teal-100">
                  {item.question.replace('Dictionary: ', '')}
                </p>
                <div className="flex items-center gap-1 mt-1.5 text-[10px] uppercase tracking-wider text-teal-500 dark:text-teal-600">
                  <Clock size={10} /> {t('past_search')}
                </div>
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-1 p-6 md:p-10 overflow-y-auto h-[calc(100vh-64px)] w-full flex flex-col items-center">
          <div className="w-full max-w-3xl flex items-center gap-4 mb-10">
            <div className="flex items-center gap-3">
              <button onClick={() => nav(-1)} className="p-2.5 rounded-xl border shadow-sm transition-all bg-white border-teal-200 text-teal-500 hover:bg-teal-50 dark:bg-gray-900 dark:border-teal-900/40 dark:text-teal-500 dark:hover:bg-gray-800">
                <ArrowLeft size={18} />
              </button>
              <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2.5 rounded-xl border shadow-sm bg-white border-teal-200 dark:bg-gray-900 dark:border-teal-900/40 dark:text-teal-500">
                <Menu size={18} />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-teal-400 to-teal-600 dark:from-teal-600 dark:to-teal-800">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-black tracking-tight text-teal-900 dark:text-teal-50">
                {t('termcrystal') || "TermCrystal"}
              </h1>
            </div>
          </div>

          {/* Search */}
          <div className="w-full max-w-2xl mb-5">
            <div className="rounded-2xl p-2 flex items-center border-2 transition-all shadow-sm bg-white border-teal-200 focus-within:border-teal-400 dark:bg-gray-900 dark:border-teal-900/50 dark:focus-within:border-teal-700">
              <div className="pl-4 text-teal-400 dark:text-teal-600"><Search size={20} /></div>
              <input
                className="flex-1 px-4 py-3 outline-none text-lg font-medium bg-transparent text-teal-900 dark:text-teal-50 placeholder-teal-300 dark:placeholder-teal-700"
                placeholder={t('search_term_placeholder')}
                value={term}
                onChange={e => setTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && askDictionary()}
              />
              <button onClick={askDictionary}
                className="text-white px-7 h-12 rounded-xl font-bold shadow-lg text-base bg-gradient-to-br from-teal-400 to-teal-600 hover:from-teal-500 hover:to-teal-700 dark:from-teal-600 dark:to-teal-800 dark:hover:from-teal-500 dark:hover:to-teal-700 transition-all">
                {t('define')}
              </button>
            </div>
          </div>

          {/* Level Selector */}
          <div className="flex items-center gap-3 mb-10 p-2 rounded-2xl shadow-sm border bg-white border-teal-200 dark:bg-gray-900 dark:border-teal-900/50">
            <span className="text-xs font-black uppercase tracking-widest px-3 text-teal-400 dark:text-teal-600">{t('level')}:</span>
            {levelOptions.map((opt) => (
              <button key={opt.value} onClick={() => setLevel(opt.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${level === opt.value ? `${opt.bgClass} ${opt.colorClass} ring-2 ring-current/30` : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'}`}>
                <opt.Icon size={16} /> {opt.label}
              </button>
            ))}
          </div>

          {/* Response */}
          {response && typeof response === 'object' ? (
            <div className="w-full max-w-4xl space-y-5 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="p-7 rounded-3xl text-white shadow-xl bg-gradient-to-br from-teal-400 to-teal-600 dark:from-teal-600 dark:to-teal-800">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-black mb-2">{response.term}</h2>
                    <button className="flex items-center gap-2 bg-white/20 border border-white/30 px-3 py-1.5 rounded-xl hover:bg-white/30 transition-all cursor-pointer dark:bg-black/20 dark:border-black/30 dark:hover:bg-black/30"
                      onClick={handleSpeech}>
                      <Volume2 size={16} />
                      <span className="text-sm font-medium">{response.pronunciation}</span>
                    </button>
                  </div>
                  <div className="bg-white/20 border border-white/30 px-4 py-2 rounded-2xl text-sm font-bold dark:bg-black/20 dark:border-black/30">
                    {levelOptions.find(o => o.value === level)?.label} Level
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { Icon: Book, label: t('definition'), content: response.definition, bgClass: 'bg-white dark:bg-gray-900', iconColorClass: 'text-teal-600 dark:text-teal-400' },
                  { Icon: Lightbulb, label: t('analogy'), content: `"${response.analogy}"`, bgClass: 'bg-amber-50 dark:bg-amber-950/20', iconColorClass: 'text-orange-500 dark:text-orange-400', italic: true },
                  { Icon: MapPin, label: t('real_life_example'), content: response.real_life_example, bgClass: 'bg-white dark:bg-gray-900', iconColorClass: 'text-purple-600 dark:text-purple-400' },
                  { Icon: Briefcase, label: t('where_used'), content: response.where_used, bgClass: 'bg-white dark:bg-gray-900', iconColorClass: 'text-red-700 dark:text-red-400' },
                ].map(({ Icon, label, content, bgClass, iconColorClass, italic }) => (
                  <div key={label} className={`p-7 rounded-3xl border shadow-sm border-gray-200 dark:border-gray-800 ${bgClass}`}>
                    <div className={`flex items-center gap-2 font-black mb-4 text-xs uppercase tracking-widest ${iconColorClass}`}>
                      <Icon size={16} /> {label}
                    </div>
                    <p className={`leading-relaxed text-gray-800 dark:text-gray-200 ${italic ? 'italic text-base' : 'text-lg font-medium'}`}>{content}</p>
                  </div>
                ))}

                <div className="md:col-span-2 p-7 rounded-3xl border shadow-sm bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900/40">
                  <div className="flex items-center gap-2 font-black mb-4 text-xs uppercase tracking-widest text-green-700 dark:text-green-500">
                    <Target size={16} /> {t('why_it_matters')}
                  </div>
                  <p className="text-xl font-bold leading-relaxed text-green-900 dark:text-green-100">{response.why_it_matters}</p>
                </div>

                <div className="md:col-span-2 p-7 rounded-3xl border shadow-sm bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-800">
                  <div className="flex items-center gap-2 font-black mb-6 text-xs uppercase tracking-widest text-gray-600 dark:text-gray-400">
                    <Link size={16} /> {t('related_terms')}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {response.related_terms?.map((rt, idx) => (
                      <div key={idx}
                        className="rounded-2xl p-4 cursor-pointer group transition-all hover:shadow-md border bg-teal-50 border-teal-200 hover:border-teal-300 dark:bg-teal-950/30 dark:border-teal-900/40 dark:hover:border-teal-800"
                        onClick={() => { setTerm(rt.term); askDictionary(); }}>
                        <h4 className="font-black mb-1 group-hover:underline underline-offset-4 text-teal-700 dark:text-teal-400">{rt.term}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{rt.def}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : response && (
            <div className="w-full max-w-3xl rounded-3xl p-8 border shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-700 bg-white border-teal-200 dark:bg-gray-900 dark:border-teal-900/50">
              <div className="prose max-w-none whitespace-pre-wrap leading-relaxed text-gray-800 dark:text-gray-200">
                {response}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}