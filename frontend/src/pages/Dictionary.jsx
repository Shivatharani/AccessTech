import { useState, useEffect } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { useTranslation } from "react-i18next";
import { User, History as HistoryIcon, Clock, Menu, X, ArrowLeft, Book, Sparkles, Search, Volume2, Eye, MapPin, Lightbulb, Briefcase, Link, Target, Baby, GraduationCap, Award, Crown, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Dictionary() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [term, setTerm] = useState("");
  const [response, setResponse] = useState(null);
  const [history, setHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const defaultEmail = localStorage.getItem("email") || "User";
  const defaultLang = localStorage.getItem("language") || "English";
  const defaultLvl = localStorage.getItem("level") || "Beginner";

  const [level, setLevel] = useState(defaultLvl);
  const [language, setLanguage] = useState(defaultLang);

  const email = defaultEmail;

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

  const handleSetResponse = (data) => {
    if (typeof data === "string") {
      try {
        const parsed = JSON.parse(data);
        setResponse(parsed);
      } catch (e) {
        setResponse(data);
      }
    } else {
      setResponse(data);
    }
  };

  const askDictionary = async () => {
    if (!term) {
      toast.error("Please enter a term first.");
      return;
    }

    const tid = toast.loading("Crystallizing the definition...");

    try {
      const res = await API.post("/ai/dictionary", { email, term, level, language });
      handleSetResponse(res.data.response);
      toast.success("Definition found!", { id: tid });
      fetchHistory();
    } catch (err) {
      toast.error("Failed to get definition.", { id: tid });
    }
  };

  const handleSpeech = () => {
    if (!response || !response.term) return;
    const utterance = new SpeechSynthesisUtterance(response.term);
    utterance.lang = language === 'Tamil' ? 'ta-IN' : 'en-US'; // Basic lang support
    window.speechSynthesis.speak(utterance);
  };

  const levelOptions = [
    { label: "Kid", value: "Kid", icon: <Baby size={18} />, color: "bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300" },
    { label: "Beginner", value: "Beginner", icon: <GraduationCap size={18} />, color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300" },
    { label: "Intermediate", value: "Intermediate", icon: <Award size={18} />, color: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300" },
    { label: "Expert", value: "Expert", icon: <Crown size={18} />, color: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300" },
  ];

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
                  <span className="text-xs bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-medium transition-colors">{language}</span>
                  <span className="text-xs bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded-full font-medium transition-colors">{level}</span>
                </div>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="p-6 flex-1">
            <button
              onClick={() => {
                setTerm("");
                setResponse(null);
                setSidebarOpen(false);
              }}
              className="w-full mb-6 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold shadow-md transition-all active:scale-95"
            >
              <Plus size={18} />
              New Word
            </button>

            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold mb-4 transition-colors">
              <HistoryIcon size={18} className="text-emerald-600 dark:text-emerald-400" />
              Search History
            </div>
            {history.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400 italic transition-colors">No terms searched yet.</p>
            ) : (
              <div className="space-y-4">
                {history.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors"
                    onClick={() => {
                      setTerm(item.question.replace('Term: ', ''));
                      handleSetResponse(item.response);
                      setSidebarOpen(false);
                    }}>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 line-clamp-2 transition-colors">{item.question.replace('Term: ', '')}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-slate-400 dark:text-slate-500 transition-colors">
                      <Clock size={12} />
                      <span>Past Search</span>
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
                TermCrystal
             </h1>
             <div className="w-10 md:hidden"></div> {/*Spacer*/}
          </div>
          
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 mb-6 focus-within:ring-4 focus-within:ring-emerald-400/50 dark:focus-within:ring-emerald-500/50 transition-all">
             <div className="flex items-center">
                <div className="pl-6 text-slate-400">
                    <Search size={24} />
                </div>
                <input
                    className="flex-1 px-4 py-4 outline-none text-slate-800 dark:text-slate-100 bg-transparent h-14 transition-colors text-xl font-medium"
                    placeholder="Search any confusing technical term..."
                    value={term}
                    onChange={e => setTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && askDictionary()}
                />
                <Button
                    onClick={askDictionary}
                    className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white px-8 h-14 rounded-xl font-bold shadow-md transition-colors text-lg mr-1"
                >
                    Define
                </Button>
             </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-10 bg-white/50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400 mr-2 uppercase tracking-wider">Level:</span>
            {levelOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setLevel(opt.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 border-2 ${
                  level === opt.value
                    ? `${opt.color.replace('bg-', 'border-').replace('text-', 'text-')} ring-2 ring-offset-2 ring-emerald-400 dark:ring-offset-slate-950`
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-transparent hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>
          
          {response && typeof response === 'object' ? (
            <div className="w-full max-w-5xl space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
              {/* Header Card */}
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-8 rounded-3xl shadow-xl text-white">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-4xl font-extrabold mb-1">{response.term}</h2>
                    <div 
                      className="flex items-center gap-2 opacity-90 cursor-pointer hover:opacity-100 transition-opacity bg-white/10 w-fit px-3 py-1 rounded-lg"
                      onClick={handleSpeech}
                      title="Listen to pronunciation"
                    >
                      <Volume2 size={18} />
                      <span className="text-lg font-medium">{response.pronunciation}</span>
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 border border-white/30">
                    {levelOptions.find(o => o.value === level)?.icon}
                    <span className="font-bold text-sm tracking-wide uppercase">{level} Level</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Definition Card */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-black mb-4 text-sm uppercase tracking-widest">
                    <Book size={20} />
                    Definition
                  </div>
                  <p className="text-xl text-slate-800 dark:text-slate-100 font-medium leading-relaxed">
                    {response.definition}
                  </p>
                </div>

                {/* Analogy Card */}
                <div className="bg-amber-50 dark:bg-amber-950/20 p-8 rounded-3xl shadow-lg border border-amber-100 dark:border-amber-900/50">
                  <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400 font-black mb-4 text-sm uppercase tracking-widest">
                    <Lightbulb size={20} />
                    Analogy
                  </div>
                  <p className="text-lg text-slate-800 dark:text-slate-100 leading-relaxed italic">
                    "{response.analogy}"
                  </p>
                </div>

                {/* Visual Explanation Card */}
                <div className="bg-blue-50 dark:bg-blue-950/20 p-8 rounded-3xl shadow-lg border border-blue-100 dark:border-blue-900/50 md:col-span-2">
                  <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 font-black mb-4 text-sm uppercase tracking-widest">
                    <Eye size={20} />
                    Visual Explanation
                  </div>
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="flex-1">
                      <p className="text-lg text-slate-800 dark:text-slate-100 leading-relaxed">
                        {response.visual_explanation}
                      </p>
                    </div>
                    <div className="w-full md:w-1/3 aspect-video bg-slate-200 dark:bg-slate-800 rounded-2xl overflow-hidden border-2 border-blue-200 dark:border-blue-800 shadow-inner group relative">
                      <img 
                        src={`https://image.pollinations.ai/prompt/${encodeURIComponent(response.term + " professional educational illustration technology clean design")}`} 
                        alt={response.term}
                        className="w-full h-full object-cover transition-transform hover:scale-110 duration-700"
                        onLoad={(e) => { e.target.classList.add('opacity-100'); }}
                        style={{ opacity: 0, transition: 'opacity 0.5s ease-in-out' }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center -z-10 bg-slate-100 dark:bg-slate-800 animate-pulse">
                         <Search className="text-slate-300 animate-bounce" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real-life Example Card */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3 text-purple-600 dark:text-purple-400 font-black mb-4 text-sm uppercase tracking-widest">
                    <MapPin size={20} />
                    Real-life Example
                  </div>
                  <p className="text-lg text-slate-800 dark:text-slate-100 leading-relaxed">
                    {response.real_life_example}
                  </p>
                </div>

                {/* Where Used Card */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400 font-black mb-4 text-sm uppercase tracking-widest">
                    <Briefcase size={20} />
                    Where Used
                  </div>
                  <p className="text-lg text-slate-800 dark:text-slate-100 leading-relaxed">
                    {response.where_used}
                  </p>
                </div>

                {/* Why It Matters Card */}
                <div className="bg-indigo-50 dark:bg-indigo-950/20 p-8 rounded-3xl shadow-lg border border-indigo-100 dark:border-indigo-900/50 md:col-span-2">
                  <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 font-black mb-4 text-sm uppercase tracking-widest">
                    <Target size={20} />
                    Why It Matters
                  </div>
                  <p className="text-xl font-bold text-indigo-900 dark:text-indigo-100 leading-relaxed">
                    {response.why_it_matters}
                  </p>
                </div>

                {/* Related Terms Card */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 md:col-span-2">
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-black mb-6 text-sm uppercase tracking-widest">
                    <Link size={20} />
                    Related Terms
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {response.related_terms?.map((rt, idx) => (
                      <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors group cursor-pointer" onClick={() => { setTerm(rt.term); askDictionary(); }}>
                        <h4 className="font-bold text-emerald-600 dark:text-emerald-400 group-hover:underline underline-offset-4">{rt.term}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{rt.def}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : response && (
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
