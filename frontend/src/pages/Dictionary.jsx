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
    { label: t('beginner'), value: "Beginner", Icon: GraduationCap, color: '#2e7d32', bg: '#e8f5e9' },
    { label: t('intermediate'), value: "Intermediate", Icon: Award, color: '#01579b', bg: '#e1f5fe' },
    { label: t('advanced'), value: "Expert", Icon: Crown, color: '#bf360c', bg: '#fff3e0' },
  ];

  const accent = '#00897b';
  const accentLight = '#e0f2f1';
  const border = '#b2dfdb';
  const text = '#004d40';

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#e0f7fa' }}>
      <Navbar />
      <div className="flex flex-1 overflow-hidden relative">
        {sidebarOpen && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

        {/* Sidebar */}
        <aside className={`fixed md:relative z-50 w-72 flex flex-col h-[calc(100vh-64px)] overflow-y-auto transition-transform duration-300 border-r ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
          style={{ backgroundColor: '#f0fdfa', borderColor: border }}>
          <div className="p-5 border-b" style={{ borderColor: border }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ background: 'linear-gradient(135deg, #4db6ac, #00897b)' }}>
                <Sparkles size={18} className="text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm truncate" style={{ color: text }}>{email}</p>
                <div className="flex gap-1.5 mt-1">
                  <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wide rounded-md" style={{ backgroundColor: accentLight, color: accent }}>{language}</span>
                  <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wide rounded-md" style={{ backgroundColor: '#e8f5e9', color: '#388e3c' }}>{level}</span>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="md:hidden" style={{ color: '#80cbc4' }}><X size={18} /></button>
            </div>
          </div>

          <div className="p-4 border-b" style={{ borderColor: border }}>
            <button onClick={() => { setTerm(""); setResponse(null); setSidebarOpen(false); }}
              className="w-full flex items-center justify-center gap-2 text-white py-2.5 rounded-xl font-bold text-sm shadow-lg"
              style={{ background: 'linear-gradient(135deg, #4db6ac, #00897b)' }}>
              <Plus size={16} /> {t('new_chat')}
            </button>
          </div>

          <div className="p-4 flex-1 overflow-y-auto">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#80cbc4' }}>
              <HistoryIcon size={14} /> {t('search_history')}
            </div>
            {history.length === 0 ? (
              <p className="text-xs italic text-center py-6" style={{ color: '#80cbc4' }}>{t('no_terms')}</p>
            ) : history.map((item, idx) => (
              <button key={idx}
                className="w-full text-left p-3 rounded-xl border transition-all mb-2 group"
                style={{ backgroundColor: accentLight, borderColor: border }}
                onClick={() => { setTerm(item.question.replace('Dictionary: ', '')); handleSetResponse(item.response); setSidebarOpen(false); }}>
                <p className="text-sm font-semibold line-clamp-2 transition-colors" style={{ color: text }}>
                  {item.question.replace('Dictionary: ', '')}
                </p>
                <div className="flex items-center gap-1 mt-1.5 text-[10px] uppercase tracking-wider" style={{ color: '#80cbc4' }}>
                  <Clock size={10} /> {t('past_search')}
                </div>
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-1 p-6 md:p-10 overflow-y-auto h-[calc(100vh-64px)] w-full flex flex-col items-center">
          <div className="w-full max-w-3xl flex items-center gap-4 mb-10">
            <div className="flex items-center gap-3">
              <button onClick={() => nav(-1)} className="p-2.5 rounded-xl border shadow-sm transition-all"
                style={{ backgroundColor: 'white', borderColor: border, color: '#80cbc4' }}>
                <ArrowLeft size={18} />
              </button>
              <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2.5 rounded-xl border shadow-sm"
                style={{ backgroundColor: 'white', borderColor: border }}>
                <Menu size={18} />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                style={{ background: 'linear-gradient(135deg, #4db6ac, #00897b)' }}>
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-black tracking-tight" style={{ color: text }}>
                {t('termcrystal') || "TermCrystal"}
              </h1>
            </div>
          </div>

          {/* Search */}
          <div className="w-full max-w-2xl mb-5">
            <div className="rounded-2xl p-2 flex items-center border-2 transition-all shadow-sm"
              style={{ backgroundColor: 'white', borderColor: border }}>
              <div className="pl-4" style={{ color: '#80cbc4' }}><Search size={20} /></div>
              <input
                className="flex-1 px-4 py-3 outline-none text-lg font-medium bg-transparent"
                style={{ color: text }}
                placeholder={t('search_term_placeholder')}
                value={term}
                onChange={e => setTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && askDictionary()}
              />
              <button onClick={askDictionary}
                className="text-white px-7 h-12 rounded-xl font-bold shadow-lg text-base"
                style={{ background: 'linear-gradient(135deg, #4db6ac, #00897b)' }}>
                {t('define')}
              </button>
            </div>
          </div>

          {/* Level Selector */}
          <div className="flex items-center gap-3 mb-10 p-2 rounded-2xl shadow-sm border"
            style={{ backgroundColor: 'white', borderColor: border }}>
            <span className="text-xs font-black uppercase tracking-widest px-3" style={{ color: '#80cbc4' }}>{t('level')}:</span>
            {levelOptions.map((opt) => (
              <button key={opt.value} onClick={() => setLevel(opt.value)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200"
                style={level === opt.value ? { backgroundColor: opt.bg, color: opt.color, outline: `2px solid ${opt.color}30` }
                  : { color: '#9e9e9e' }}>
                <opt.Icon size={16} /> {opt.label}
              </button>
            ))}
          </div>

          {/* Response */}
          {response && typeof response === 'object' ? (
            <div className="w-full max-w-4xl space-y-5 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="p-7 rounded-3xl text-white shadow-xl"
                style={{ background: 'linear-gradient(135deg, #4db6ac, #00897b)' }}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-black mb-2">{response.term}</h2>
                    <button className="flex items-center gap-2 bg-white/20 border border-white/30 px-3 py-1.5 rounded-xl hover:bg-white/30 transition-all cursor-pointer"
                      onClick={handleSpeech}>
                      <Volume2 size={16} />
                      <span className="text-sm font-medium">{response.pronunciation}</span>
                    </button>
                  </div>
                  <div className="bg-white/20 border border-white/30 px-4 py-2 rounded-2xl text-sm font-bold">
                    {levelOptions.find(o => o.value === level)?.label} Level
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { Icon: Book, label: t('definition'), content: response.definition, bg: 'white', iconColor: accent },
                  { Icon: Lightbulb, label: t('analogy'), content: `"${response.analogy}"`, bg: '#fff8e1', iconColor: '#f57f17', italic: true },
                  { Icon: MapPin, label: t('real_life_example'), content: response.real_life_example, bg: 'white', iconColor: '#7b1fa2' },
                  { Icon: Briefcase, label: t('where_used'), content: response.where_used, bg: 'white', iconColor: '#c62828' },
                ].map(({ Icon, label, content, bg, iconColor, italic }) => (
                  <div key={label} className="p-7 rounded-3xl border shadow-sm" style={{ backgroundColor: bg, borderColor: '#e0e0e0' }}>
                    <div className="flex items-center gap-2 font-black mb-4 text-xs uppercase tracking-widest" style={{ color: iconColor }}>
                      <Icon size={16} /> {label}
                    </div>
                    <p className={`leading-relaxed ${italic ? 'italic text-base' : 'text-lg font-medium'}`} style={{ color: '#424242' }}>{content}</p>
                  </div>
                ))}

                <div className="md:col-span-2 p-7 rounded-3xl border shadow-sm" style={{ backgroundColor: '#e8f5e9', borderColor: '#c8e6c9' }}>
                  <div className="flex items-center gap-2 font-black mb-4 text-xs uppercase tracking-widest" style={{ color: '#2e7d32' }}>
                    <Target size={16} /> {t('why_it_matters')}
                  </div>
                  <p className="text-xl font-bold leading-relaxed" style={{ color: '#1b5e20' }}>{response.why_it_matters}</p>
                </div>

                <div className="md:col-span-2 p-7 rounded-3xl border shadow-sm" style={{ backgroundColor: 'white', borderColor: '#e0e0e0' }}>
                  <div className="flex items-center gap-2 font-black mb-6 text-xs uppercase tracking-widest" style={{ color: '#616161' }}>
                    <Link size={16} /> {t('related_terms')}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {response.related_terms?.map((rt, idx) => (
                      <div key={idx}
                        className="rounded-2xl p-4 cursor-pointer group transition-all hover:shadow-md border"
                        style={{ backgroundColor: accentLight, borderColor: border }}
                        onClick={() => { setTerm(rt.term); askDictionary(); }}>
                        <h4 className="font-black mb-1 group-hover:underline underline-offset-4" style={{ color: accent }}>{rt.term}</h4>
                        <p className="text-xs" style={{ color: '#78909c' }}>{rt.def}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : response && (
            <div className="w-full max-w-3xl rounded-3xl p-8 border shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-700"
              style={{ backgroundColor: 'white', borderColor: border }}>
              <div className="prose max-w-none whitespace-pre-wrap leading-relaxed" style={{ color: '#424242' }}>
                {response}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}