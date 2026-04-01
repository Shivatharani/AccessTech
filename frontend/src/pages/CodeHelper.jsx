import { useState, useEffect, useContext, useRef } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { useTranslation } from "react-i18next";
import {
  History as HistoryIcon, Clock, Menu, X, ArrowLeft, Code2, Terminal, HelpCircle,
  FileText, Brain, Search, Beaker, AlertTriangle, RefreshCcw, CheckCircle2,
  Copy, Plus, Send, Sparkles, Mic, MicOff, Volume2
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function CodeHelper() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [codeSnippet, setCodeSnippet] = useState("");
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("Python");
  const [response, setResponse] = useState("");
  const [history, setHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user: email, username, language: lang, level: lvl } = useContext(AuthContext);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const currentlySpeakingTextRef = useRef(null);
  const MODES = ["Python", "Java", "C", "General", "JavaScript", "HTML/CSS"];

  const getLangCode = () => {
    switch (lang) {
      case "Tamil": return "ta-IN";
      case "Hindi": return "hi-IN";
      case "Malayalam": return "ml-IN";
      case "Telugu": return "te-IN";
      default: return "en-US";
    }
  };

  const toggleLocalSTT = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { toast.error(t('speech_not_supported')); return; }
    if (isListening) {
      if (window.recognitionInstance) window.recognitionInstance.stop();
      setIsListening(false);
      return;
    }
    const recognition = new SR();
    window.recognitionInstance = recognition;
    recognition.lang = getLangCode();
    recognition.interimResults = true;
    recognition.onstart = () => { setIsListening(true); toast.info(t('listening')); };
    recognition.onresult = (e) => setQuery(e.results[0][0].transcript);
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const speakText = (text) => {
    if (!text || !window.speechSynthesis) return;
    
    const cleanText = text.replace(/[*#_`~]/g, "").trim();

    // Toggle off if clicking the EXACT SAME text that's already speaking
    if (isSpeaking && currentlySpeakingTextRef.current === cleanText) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      currentlySpeakingTextRef.current = null;
      return;
    }

    // Cancel any current speech to prepare for the new one (even if it's different text)
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    const startSpeech = () => {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      const langCode = getLangCode();
      const voices = window.speechSynthesis.getVoices();
      
      let selected = voices.find(v => v.lang.replace('_', '-').toLowerCase() === langCode.toLowerCase()) ||
                     voices.find(v => v.name.toLowerCase().includes(lang.toLowerCase())) ||
                     voices.find(v => v.lang.toLowerCase().startsWith(langCode.split('-')[0]));

      // Specifically prioritize "Natural" or "Google" voices if multiple Hindi ones exist
      if (lang === "Hindi") {
        const hindiVoices = voices.filter(v => v.lang.includes("hi") || v.name.toLowerCase().includes("hindi"));
        const bestHindi = hindiVoices.find(v => v.name.toLowerCase().includes("natural")) || 
                          hindiVoices.find(v => v.name.toLowerCase().includes("google")) ||
                          hindiVoices[0];
        if (bestHindi) selected = bestHindi;
      }

      if (selected) utterance.voice = selected;
      utterance.lang = langCode;

      utterance.onstart = () => {
        setIsSpeaking(true);
        currentlySpeakingTextRef.current = cleanText;
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
        currentlySpeakingTextRef.current = null;
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
        currentlySpeakingTextRef.current = null;
      };

      window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = startSpeech;
    } else {
      setTimeout(startSpeech, 50);
    }
  };

  useEffect(() => { if (email !== "User") fetchHistory(); }, [email, response]);

  const fetchHistory = async () => {
    try {
      const res = await API.get(`/ai/history?email=${email}`);
      setHistory(res.data.history.filter(h => h.question && h.question.startsWith('Code (')).sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)));
    } catch { console.error("Failed to fetch history"); }
  };

  const askCodeHelper = async () => {
    if (!codeSnippet) { toast.error(t('paste_code_placeholder')); return; }
    const tid = toast.loading(t('analyzing_code'));
    try {
      const res = await API.post("/ai/codehelper", {
        email, code_snippet: codeSnippet, mode, query: query || "explain every line from basics", language: lang, level: lvl
      });
      if (res.data.error) { toast.error(res.data.error, { id: tid }); return; }
      const robustParse = (data) => {
        if (!data || typeof data !== "string") return data;
        try { const p = JSON.parse(data); if (typeof p === "string") return robustParse(p); return p; } catch { return data; }
      };
      setResponse(robustParse(res.data.response));
      toast.success("Code explanation ready!", { id: tid });
      fetchHistory();
    } catch { toast.error(t('send_error')); }
  };

  const handleCopy = (text) => { navigator.clipboard.writeText(text); toast.success("Copied!"); };
  const resetAnalysis = () => { setQuery(""); setResponse(null); setCodeSnippet(""); toast.info(t('ready_new_chat')); };

  return (
    <div className="min-h-screen flex flex-col bg-amber-50 dark:bg-gray-950">
      <Navbar />
      <div className="flex flex-1 overflow-hidden relative">
        <div className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity md:hidden ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setSidebarOpen(false)} />

        {/* Sidebar */}
        <aside className={`fixed md:relative z-50 w-72 flex flex-col h-[calc(100vh-64px)] overflow-y-auto transition-transform duration-300 border-r ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} bg-orange-50 border-orange-200 dark:bg-gray-900 dark:border-orange-900/40`}>
          
          {/* User Info aligned with Sidebar */}
          <div className="p-5 border-b border-orange-200 dark:border-orange-900/40 bg-white/50 dark:bg-black/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-orange-100 dark:bg-orange-900/30">
                <Code2 size={24} className="text-orange-500 dark:text-orange-400" />
              </div>
              <div className="overflow-hidden">
                <p className="font-black text-xs truncate text-orange-900 dark:text-orange-50">{username}</p>
                <div className="flex gap-2 mt-0.5">
                  <span className="text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded bg-orange-200 dark:bg-orange-900 text-orange-700 dark:text-orange-300">{lang}</span>
                  <span className="text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded bg-amber-200 dark:bg-amber-900 text-amber-700 dark:text-amber-300">{lvl}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 border-b border-orange-200 dark:border-orange-900/40">
            <div className="flex items-center gap-2">
              <HistoryIcon size={16} className="text-orange-500 dark:text-orange-400" />
              <span className="font-black text-xs uppercase tracking-widest text-orange-900 dark:text-orange-50">{t('history')}</span>
            </div>
          </div>

          <div className="p-4 border-b border-orange-200 dark:border-orange-900/40">
            <button onClick={resetAnalysis}
              className="w-full flex items-center justify-center gap-2 text-white py-2.5 rounded-xl font-black text-sm shadow-lg active:scale-95 transition-all bg-gradient-to-br from-amber-400 to-orange-600 dark:from-orange-600 dark:to-orange-800 hover:opacity-90">
              <Plus size={16} /> {t('new_chat')}
            </button>
          </div>

          <div className="p-4 flex-1 overflow-y-auto">
            {history.length === 0 ? (
              <p className="text-xs italic text-center py-8 text-orange-300 dark:text-orange-600">{t('no_history_found')}</p>
            ) : history.map((item, idx) => {
              const match = item.question.match(/Code \((.*?)\): (.*?)$/);
              const parsedMode = match ? match[1] : "Code";
              const parsedQuery = match ? match[2] : item.question.replace('Code: ', '');
              return (
                <button key={idx}
                  className="w-full text-left p-3 rounded-xl border transition-all mb-2 group bg-orange-100 border-orange-200 hover:bg-orange-200 dark:bg-orange-900/20 dark:border-orange-900/40 dark:hover:bg-orange-900/40"
                  onClick={() => {
                    setQuery(parsedQuery);
                    if (match) setMode(parsedMode);

                    // Universal Brute-Force Parser
                    const parseRobustly = (content) => {
                      if (!content) return null;
                      let current = content;
                      for (let i = 0; i < 3; i++) {
                        if (typeof current !== 'string') break;
                        try {
                          const parsed = JSON.parse(current);
                          if (parsed === current) break;
                          current = parsed;
                        } catch { break; }
                      }
                      return current;
                    };

                    let outer = parseRobustly(item.response);
                    let finalExplanation = outer;
                    let finalCode = item.code || "";

                    if (typeof outer === 'string') {
                      try { outer = JSON.parse(outer); finalExplanation = outer; } catch(e) {}
                    }

                    if (outer && typeof outer === 'object') {
                      if (outer.explanation) {
                        finalExplanation = parseRobustly(outer.explanation);
                        if (typeof finalExplanation === 'string') {
                          try { finalExplanation = JSON.parse(finalExplanation); } catch(e) {}
                        }
                        finalCode = outer.code || finalCode;
                      }
                    }

                    // Force a clean React state cycle by clearing first
                    setResponse(null);
                    setCodeSnippet("");
                    setSidebarOpen(false);

                    // Re-injection with delay to force repaint
                    setTimeout(() => {
                      setResponse(finalExplanation);
                      setCodeSnippet(finalCode);
                    }, 50);
                  }}>
                  <span className="text-[9px] font-mono font-black uppercase tracking-widest px-2 py-0.5 rounded block w-fit mb-1 bg-orange-200 text-orange-900 dark:bg-orange-900/50 dark:text-orange-300">
                    {parsedMode}
                  </span>
                  <p className="text-xs line-clamp-2 font-medium transition-colors text-amber-900 dark:text-amber-100">{parsedQuery}</p>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="flex-1 p-6 md:p-10 overflow-y-auto h-[calc(100vh-64px)] w-full">
          <div className="max-w-6xl mx-auto">

            {/* Header */}
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-orange-200 dark:border-orange-900/40">
              <div className="flex items-center gap-4">
                <button onClick={() => nav(-1)} className="p-2.5 rounded-xl border shadow-sm transition-all bg-white border-orange-200 text-orange-500 hover:bg-orange-50 dark:bg-gray-900 dark:border-orange-900/40 dark:text-orange-500 dark:hover:bg-gray-800">
                  <ArrowLeft size={18} />
                </button>
                <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2.5 rounded-xl border shadow-sm bg-white border-orange-200 dark:bg-gray-900 dark:border-orange-900/40">
                  <Menu size={18} className="text-orange-500" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-amber-400 to-orange-600 dark:from-orange-600 dark:to-orange-800">
                    <Terminal className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-black tracking-tighter font-mono text-orange-900 dark:text-orange-50">{t('syntaxsage_title')}</h1>
                    <p className="text-xs font-mono uppercase tracking-widest text-orange-400 dark:text-orange-600">{t('syntaxsage_sub')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8 pb-20">
              {/* IDE Editor */}
              <div className="rounded-3xl border overflow-hidden shadow-xl bg-slate-900 border-slate-800">
                {/* Window Bar */}
                <div className="px-5 py-3.5 border-b flex justify-between items-center bg-slate-950 border-slate-800">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleCopy(codeSnippet)} className="p-1.5 rounded-lg transition-colors hover:bg-white/5 text-orange-300 dark:text-orange-500">
                      <Copy size={16} />
                    </button>
                    <div className="h-4 w-px bg-white/10" />
                    <select
                      value={mode}
                      onChange={e => setMode(e.target.value)}
                      className="text-xs font-mono font-black py-1.5 px-3 rounded-xl outline-none uppercase tracking-wider cursor-pointer border bg-slate-800 text-orange-300 border-slate-700 dark:text-orange-500">
                      {MODES.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>

                {/* Code Area */}
                <div className="flex min-h-[300px]">
                  <div className="w-10 border-r flex flex-col pt-5 items-center select-none bg-slate-950 border-slate-800">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="h-6 text-[9px] font-mono text-slate-700">{i + 1}</div>
                    ))}
                  </div>
                  <textarea
                    className="flex-1 bg-transparent font-mono p-5 outline-none resize-none text-sm leading-relaxed h-[320px] text-amber-300 focus:ring-0 dark:text-amber-400"
                    placeholder={t('paste_code_placeholder')}
                    spellCheck="false"
                    value={codeSnippet}
                    onChange={e => setCodeSnippet(e.target.value)}
                  />
                </div>

                {/* Query Bar */}
                <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950">
                  <div className="flex flex-col md:flex-row items-center gap-2 sm:gap-3 p-2 rounded-2xl border bg-slate-900 border-slate-800 dark:bg-black/50">
                    <div className="flex-1 flex items-center w-full">
                      <HelpCircle size={18} className="ml-3 flex-shrink-0 text-slate-600 dark:text-slate-500" />
                      <input
                        className="flex-1 bg-transparent outline-none px-3 py-3 font-medium text-sm text-amber-300 placeholder-slate-600 dark:text-amber-400 dark:placeholder-slate-500"
                        placeholder={t('ask_code_question')}
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && askCodeHelper()}
                      />
                      <button
                        onClick={toggleLocalSTT}
                        className={`p-3 rounded-xl transition-all mr-2 ${isListening ? 'bg-red-100 text-red-500 animate-pulse' : 'hover:bg-slate-800 text-slate-500'}`}
                      >
                        {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                      </button>
                    </div>
                    <button
                      onClick={askCodeHelper}
                      className="w-full md:w-auto text-white font-black px-5 sm:px-7 py-4 sm:py-5 rounded-xl shadow-xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 text-sm uppercase tracking-widest bg-gradient-to-br from-amber-400 to-orange-600 dark:from-orange-600 dark:to-orange-800">
                      <Send size={16} /> {t('analyze')}
                    </button>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div id="results-area">
                {!response ? (
                  <div className="py-24 flex flex-col items-center opacity-50 border-2 border-dashed rounded-3xl transition-opacity hover:opacity-70 border-orange-200 dark:border-orange-900/50">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border bg-orange-100 border-orange-200 dark:bg-orange-900/30 dark:border-orange-900/50">
                      <Terminal size={32} className="text-orange-400 dark:text-orange-600" />
                    </div>
                    <p className="font-mono text-sm font-bold uppercase tracking-widest text-orange-400 dark:text-orange-600">{t('awaiting_command')}</p>
                    <p className="text-xs mt-1 italic text-orange-300 dark:text-orange-700">{t('pulse_code_engage')}</p>
                  </div>
                ) : typeof response === 'object' ? (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border bg-orange-100 border-orange-200 dark:bg-orange-900/30 dark:border-orange-900/50">
                      <div className="flex items-center gap-3">
                        <Code2 size={18} className="text-orange-500 dark:text-orange-400" />
                        <span className="text-xs font-mono font-black uppercase tracking-widest text-orange-900 dark:text-orange-50">{t('sage_analysis_report')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => speakText(`${response.summary}. ${response.intelligence}`)}
                          className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all shadow-sm border ${isSpeaking ? 'bg-red-100 text-red-500 animate-pulse border-red-200' : 'bg-orange-100 text-orange-600 hover:bg-orange-200 border-orange-200'}`}>
                          <Volume2 size={12} /> {isSpeaking ? t('stop') : t('read_aloud')}
                        </button>
                        <button onClick={() => nav(`/tutor?topic=${encodeURIComponent(`Explain this ${mode} code in detail: \n\n${codeSnippet}`)}`)}
                          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all bg-orange-200 text-orange-700 hover:bg-orange-300 dark:bg-orange-800 dark:text-orange-200 dark:hover:bg-orange-700 shadow-sm border border-orange-300 dark:border-orange-600">
                          <Sparkles size={12} /> Explain in Tutor
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                      <div className="lg:col-span-8 p-8 relative overflow-hidden group rounded-3xl border shadow-sm bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-800">
                        <div className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-orange-500 dark:text-orange-400">
                          <FileText size={14} /> {t('code_summary')}
                        </div>
                        <p className="text-xl font-bold leading-tight text-orange-900 dark:text-orange-50">{response.summary}</p>
                      </div>
                      <div className="lg:col-span-4 p-8 flex flex-col justify-center rounded-3xl border shadow-sm bg-orange-100 border-orange-200 dark:bg-orange-900/30 dark:border-orange-900/50">
                        <div className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-orange-500 dark:text-orange-400">
                          <Brain size={14} /> {t('intelligence')}
                        </div>
                        <p className="leading-relaxed italic text-sm border-l-4 pl-4 text-amber-900 border-orange-400 dark:text-amber-100 dark:border-orange-600">{response.intelligence}</p>
                      </div>
                    </div>

                    {/* Line by Line */}
                    <div className="rounded-3xl overflow-hidden border shadow-sm bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-800">
                      <div className="px-7 py-5 border-b flex items-center justify-between bg-orange-50 border-gray-100 dark:bg-gray-950 dark:border-gray-800">
                        <div className="flex items-center gap-3 text-xs font-black font-mono uppercase tracking-widest text-orange-900 dark:text-orange-50">
                          <Search size={16} className="text-orange-500 dark:text-orange-400" /> {t('logical_breakdown')}
                        </div>
                        <div className="text-[9px] font-mono px-2 py-1 rounded-lg border text-gray-500 border-gray-200 dark:text-gray-400 dark:border-gray-700">
                          {response.line_by_line?.length || 0} {t('lines_analyzed')}
                        </div>
                      </div>
                      <div className="overflow-x-auto -mx-4 sm:mx-0">
                        <table className="w-full text-left min-w-[500px]">
                          <thead>
                            <tr className="bg-amber-50 dark:bg-gray-950">
                              {[t('line'), t('code_architecture'), t('cognitive_explanation')].map(h => (
                                <th key={h} className="px-6 py-4 text-[9px] font-black font-mono uppercase tracking-widest border-b text-gray-500 border-gray-100 dark:text-gray-400 dark:border-gray-800">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {response.line_by_line?.map((item, idx) => (
                              <tr key={idx} className="hover:bg-amber-50/50 dark:hover:bg-gray-800 transition-colors group border-b border-gray-50 dark:border-gray-800">
                                <td className="px-6 py-4 font-mono text-sm font-black text-orange-500 dark:text-orange-400">#{item.line}</td>
                                <td className="px-6 py-4 font-mono text-xs whitespace-pre text-orange-900 bg-orange-50 dark:text-orange-200 dark:bg-gray-950">{item.code}</td>
                                <td className="px-6 py-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                                  <span className="mr-2 text-orange-400 dark:text-orange-600">→</span>{item.explanation}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Dry Run & Bugs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="p-7 rounded-3xl border shadow-sm bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-800">
                        <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest mb-5 text-sky-600 dark:text-sky-400">
                          <Beaker size={14} className="rotate-12" /> {t('execution_walkthrough')}
                        </div>
                        <pre className="rounded-xl p-5 font-mono text-xs leading-relaxed overflow-x-auto min-h-[140px] whitespace-pre-wrap border bg-sky-50 text-sky-900 border-sky-200 dark:bg-sky-950/20 dark:text-sky-200 dark:border-sky-900/50">
                          {response.dry_run}
                        </pre>
                      </div>
                      <div className="p-7 rounded-3xl border shadow-sm bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-800">
                        <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest mb-5 text-red-700 dark:text-red-400">
                          <AlertTriangle size={14} className="animate-pulse" /> {t('vulnerabilities_logic')}
                        </div>
                        <ul className="space-y-4">
                          {response.bugs?.map((bug, idx) => (
                            <li key={idx} className="flex gap-3 text-sm leading-relaxed hover:text-gray-900 dark:hover:text-gray-100 transition-colors text-gray-700 dark:text-gray-300">
                              <div className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-red-300 dark:bg-red-500" /> {bug}
                            </li>
                          ))}
                          {(!response.bugs || response.bugs.length === 0) && (
                            <li className="flex flex-col items-center py-8 gap-2">
                              <div className="w-10 h-10 rounded-full flex items-center justify-center border bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900/50">
                                <CheckCircle2 size={20} className="text-green-600 dark:text-green-500" />
                              </div>
                              <span className="text-sm italic text-green-500 dark:text-green-400">{t('clean_compile_unit')}</span>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>

                    {/* Equivalents */}
                    <div className="rounded-3xl overflow-hidden border shadow-sm bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-800">
                      <div className="px-7 py-5 border-b flex items-center bg-orange-50 border-gray-100 dark:bg-gray-950 dark:border-gray-800">
                        <div className="flex items-center gap-3 text-xs font-black font-mono uppercase tracking-widest text-orange-900 dark:text-orange-50">
                          <RefreshCcw size={16} className="text-orange-500 dark:text-orange-400" /> {t('universal_equivalents')}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-100 dark:divide-gray-800">
                        {['python', 'java', 'c'].map((l) => (
                          <div key={l} className="p-7">
                            <div className="flex justify-between items-center mb-4">
                              <span className="text-[10px] font-black font-mono uppercase tracking-widest flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                <div className={`w-1.5 h-1.5 rounded-full ${l === 'python' ? 'bg-sky-400' : l === 'java' ? 'bg-orange-400' : 'bg-slate-400'}`} /> {l}
                              </span>
                              <button onClick={() => handleCopy(response.equivalents?.[l])}
                                className="p-1.5 rounded-lg transition-colors hover:bg-amber-50 dark:hover:bg-gray-800 border text-orange-400 border-gray-100 dark:text-orange-600 dark:border-gray-700">
                                <Copy size={14} />
                              </button>
                            </div>
                            <pre className="text-xs font-mono overflow-x-auto leading-relaxed rounded-xl p-4 border text-orange-900 bg-orange-50 border-orange-200 dark:text-orange-200 dark:bg-gray-950 dark:border-orange-900/50">
                              <code>{response.equivalents?.[l]}</code>
                            </pre>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="prose max-w-none animate-in fade-in duration-500 rounded-3xl p-8 border shadow-sm bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-800">
                    {response}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}