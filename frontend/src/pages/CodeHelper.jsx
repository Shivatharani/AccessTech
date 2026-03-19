import { useState, useEffect, useContext } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { useTranslation } from "react-i18next";
import { User, History as HistoryIcon, Clock, Menu, X, ArrowLeft, Code2, Terminal, HelpCircle, FileText, Brain, Search, Beaker, AlertTriangle, Sparkles, RefreshCcw, CheckCircle2, ChevronDown, ChevronUp, Copy, Plus, Send } from "lucide-react";
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

  const { user: email, language: lang, level: lvl } = useContext(AuthContext);

  const MODES = ["Python", "Java", "C", "General", "JavaScript", "HTML/CSS"];

  useEffect(() => {
    if (email !== "User") {
      fetchHistory();
    }
  }, [email, response]);

  const fetchHistory = async () => {
    try {
      const res = await API.get(`/ai/history?email=${email}`);
      const codeHistory = res.data.history.filter(h => h.question.startsWith('Code (')).reverse();
      setHistory(codeHistory);
    } catch (err) {
      console.error("Failed to fetch history");
    }
  };

  const askCodeHelper = async () => {
    if (!codeSnippet) {
      toast.error(t('paste_code_placeholder'));
      return;
    }

    const tid = toast.loading(t('analyzing_code'));

    try {
      const res = await API.post("/ai/codehelper", { 
          email, 
          code_snippet: codeSnippet,
          mode: mode,
          query: query || "explain every line from basics",
          language: lang,
          level: lvl
      });
      if (res.data.error) {
        toast.error(res.data.error, { id: tid });
        return;
      }
      
      const robustParse = (data) => {
        if (!data || typeof data !== "string") return data;
        try {
          const p = JSON.parse(data);
          if (typeof p === "string") return robustParse(p);
          return p;
        } catch(e) { return data; }
      };

      let parsedResponse = robustParse(res.data.response);
      setResponse(parsedResponse);
      toast.success("Code explanation ready!", { id: tid });
      fetchHistory();
    } catch (err) {
      toast.error(t('send_error'), { id: tid });
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Code copied to clipboard!");
  };

  const resetAnalysis = () => {
    setQuery("");
    setResponse(null);
    setCodeSnippet("");
    toast.info(t('ready_new_chat'));
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col transition-colors duration-300">
      {/* Dark theme forced for CodeHelper for 'IDE' feel, but respecting dark mode classes slightly */}
      <Navbar />
      <div className="flex flex-1 overflow-hidden relative">
        {/* Collapsible Sidebar (Drawer) */}
        <div
          className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 md:hidden ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setSidebarOpen(false)}
        />
        <aside 
          className={`fixed md:relative z-50 w-80 bg-zinc-900 border-r border-zinc-800 flex flex-col h-[calc(100vh-64px)] overflow-y-auto transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        >
          <div className="p-6 border-b border-zinc-800 bg-zinc-900/50 flex items-center gap-3">
             <HistoryIcon size={20} className="text-amber-500" />
             <span className="font-bold text-zinc-100 uppercase tracking-widest text-sm font-mono">{t('history') || "History"}</span>
          </div>
          <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
            <button
              onClick={resetAnalysis}
              className="w-full mb-6 flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-zinc-950 py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95 text-sm"
            >
              <Plus size={18} />
              {t('new_chat')}
            </button>
            
            <div className="space-y-4">
              {history.length === 0 ? (
                <p className="text-sm text-zinc-600 italic text-center py-10 font-mono">{t('no_history_found')}</p>
              ) : (
                history.map((item, idx) => {
                    // Try to parse the mode and query from the question
                    // format: Code (Python): my query
                    const match = item.question.match(/Code \((.*?)\): (.*?)$/);
                    const parsedMode = match ? match[1] : "Code";
                    const parsedQuery = match ? match[2] : item.question.replace('Code: ', '');

                    return (
                        <div key={idx} className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/50 shadow-sm cursor-pointer hover:bg-zinc-800 hover:border-amber-500/30 transition-all group"
                        onClick={() => {
                            setQuery(parsedQuery);
                            if (match) setMode(parsedMode);
                             const robustParse = (data) => {
                                 if (!data || typeof data !== "string") return data;
                                 try {
                                     const p = JSON.parse(data);
                                     if (typeof p === "string") return robustParse(p);
                                     return p;
                                 } catch(e) { return data; }
                             };

                             let parsedResp = item.response;
                             let savedCode = item.code || "";
                             let outer = robustParse(parsedResp);
                             
                             if (outer && typeof outer === "object" && outer.explanation) {
                                 parsedResp = robustParse(outer.explanation);
                                 savedCode = outer.code || savedCode;
                             } else {
                                 parsedResp = outer;
                             }
                             
                             setResponse(parsedResp);
                            setCodeSnippet(savedCode);
                            setSidebarOpen(false);
                            
                            setTimeout(() => {
                              document.getElementById('results-area')?.scrollIntoView({ behavior: 'smooth' });
                            }, 100);
                        }}>
                          <div className="flex justify-between items-center mb-2">
                             <span className="text-[10px] font-mono text-amber-500 font-bold uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded">{parsedMode}</span>
                             <Clock size={12} className="text-zinc-600" />
                          </div>
                          <p className="text-xs font-medium text-zinc-400 line-clamp-2 leading-relaxed group-hover:text-zinc-200 transition-colors uppercase tracking-tight">{parsedQuery}</p>
                        </div>
                    )
                })
              )}
            </div>
          </div>
        </aside>
        
        <main className="flex-1 p-6 md:p-12 overflow-y-auto h-[calc(100vh-64px)] relative w-full flex flex-col items-center">
          <div className="w-full max-w-6xl">
            {/* Header section with toggle */}
            <div className="flex items-center justify-between mb-10 border-b pb-6 border-zinc-800">
               <div className="flex items-center gap-6">
                  <button onClick={() => nav(-1)} className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800 transition-all shadow-md active:scale-90">
                    <ArrowLeft size={20} />
                  </button>
                  <div>
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 flex items-center gap-4 tracking-tighter font-mono">
                        <Terminal className="text-amber-500 w-10 h-10" />
                        {t('syntaxsage')}
                    </h1>
                    <p className="text-zinc-500 text-sm font-mono mt-1 tracking-widest uppercase">{t('expert_ai_intelligence')}</p>
                  </div>
               </div>
               
               <div className="hidden md:flex items-center gap-4 bg-zinc-900 p-2 rounded-2xl border border-zinc-800">
                  <div className="flex flex-col items-end px-4">
                     <span className="text-zinc-100 font-bold text-sm tracking-tight">{email}</span>
                     <div className="flex gap-2">
                        <span className="text-[10px] uppercase font-mono text-zinc-500">{lang}</span>
                        <span className="text-[10px] uppercase font-mono text-zinc-500">{lvl}</span>
                     </div>
                  </div>
                  <div className="w-10 h-10 bg-amber-500/20 text-amber-500 rounded-xl flex items-center justify-center font-bold">
                    <Code2 size={24} />
                  </div>
               </div>
            </div>
            
            {/* Main Content Area - Vertical Flow */}
            <div className="space-y-12 pb-24">
               
               {/* IDE Input Form - Full Width */}
               <div className="bg-zinc-900 rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden group transition-all duration-500 hover:border-amber-500/20">
                  <div className="bg-zinc-950 px-6 py-4 border-b border-zinc-800 flex justify-between items-center">
                      <div className="flex gap-2.5">
                          <div className="w-3.5 h-3.5 rounded-full bg-red-500/20 border border-red-500/40"></div>
                          <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/20 border border-yellow-500/40"></div>
                          <div className="w-3.5 h-3.5 rounded-full bg-green-500/20 border border-green-500/40"></div>
                      </div>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => handleCopy(codeSnippet)} 
                          className="text-zinc-500 hover:text-amber-500 transition-colors p-2 hover:bg-zinc-800 rounded-lg"
                          title={t('copy_code') || "Copy Code"}
                        >
                          <Copy size={18} />
                        </button>
                        <div className="h-6 w-[1px] bg-zinc-800" />
                        <select 
                            value={mode} 
                            onChange={e => setMode(e.target.value)}
                            className="bg-zinc-800 text-zinc-100 text-xs font-mono font-black py-2 px-4 rounded-xl outline-none border border-zinc-700 hover:border-amber-500/50 transition-all cursor-pointer uppercase tracking-widest shadow-inner drop-shadow-md"
                        >
                            {MODES.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>
                  </div>
                  
                  <div className="relative min-h-[350px] flex">
                    <div className="w-12 bg-zinc-950/50 border-r border-zinc-800/50 flex flex-col pt-6 font-mono text-[10px] text-zinc-700 items-center select-none">
                      {Array.from({length: 15}).map((_, i) => <div key={i} className="h-6">{i + 1}</div>)}
                    </div>
                    <textarea
                        className="flex-1 bg-zinc-900/40 text-amber-50/90 font-mono p-6 outline-none resize-none text-base leading-relaxed custom-scrollbar placeholder:text-zinc-700 focus:bg-zinc-900/60 transition-all font-medium h-[400px]"
                        placeholder={t('paste_code_placeholder')}
                        spellCheck="false"
                        value={codeSnippet}
                        onChange={e => setCodeSnippet(e.target.value)}
                    ></textarea>
                  </div>
                  
                  <div className="bg-zinc-950 p-6 border-t border-zinc-800">
                      <div className="flex flex-col md:flex-row items-center gap-4 bg-zinc-900 rounded-2xl p-2 border border-zinc-800 focus-within:border-amber-500/50 focus-within:ring-4 focus-within:ring-amber-500/5 transition-all shadow-inner">
                          <div className="flex-1 flex items-center w-full">
                            <HelpCircle size={20} className="text-zinc-600 ml-4 flex-shrink-0" />
                            <input 
                                className="flex-1 bg-transparent text-zinc-100 text-base outline-none placeholder:text-zinc-700 px-4 py-4 font-medium"
                                placeholder={t('ask_code_question')}
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && askCodeHelper()}
                            />
                          </div>
                          <Button 
                              onClick={askCodeHelper}
                              className="w-full md:w-auto bg-amber-600 hover:bg-amber-500 text-zinc-950 font-black px-10 py-7 rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-amber-900/20 text-lg uppercase tracking-widest flex gap-3 group"
                          >
                              <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                              {t('analyze')}
                          </Button>
                      </div>
                  </div>
               </div>
               
               {/* Response Area - Full Width Below Editor */}
               <div id="results-area" className="w-full">
                  {!response ? (
                      <div className="py-32 flex flex-col items-center justify-center text-zinc-700 gap-6 opacity-40 border-2 border-dashed border-zinc-800 rounded-3xl group hover:opacity-100 transition-opacity">
                          <div className="w-24 h-24 bg-zinc-900 rounded-3xl flex items-center justify-center border border-zinc-800 shadow-xl overflow-hidden group-hover:rotate-12 transition-transform duration-500">
                            <Terminal size={48} className="text-zinc-700 group-hover:text-amber-500 transition-colors" />
                          </div>
                          <div className="text-center">
                            <p className="font-mono text-lg font-bold uppercase tracking-widest">{t('awaiting_command')}</p>
                            <p className="text-sm italic mt-1 bg-zinc-800/50 px-3 py-1 rounded-lg">{t('pulse_code_engage')}</p>
                          </div>
                      </div>
                  ) : typeof response === 'object' ? (
                      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                          {/* Sage Output Header */}
                          <div className="flex items-center gap-4 bg-amber-500/10 p-4 rounded-2xl border border-amber-500/20 w-fit">
                            <Code2 size={24} className="text-amber-500" />
                            <span className="text-sm font-mono text-amber-500 font-black uppercase tracking-[0.3em]">{t('sage_analysis_report')}</span>
                          </div>

                          {/* 1. Summary & 2. Intelligence */}
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                              <div className="lg:col-span-8 bg-zinc-900/80 backdrop-blur-md p-10 rounded-[2.5rem] border border-zinc-800 shadow-2xl relative overflow-hidden group">
                                  <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full -mr-32 -mt-32 blur-3xl transition-opacity group-hover:opacity-100 opacity-50"></div>
                                  <div className="flex items-center gap-4 text-amber-500 mb-6 uppercase tracking-[0.2em] text-xs font-black font-mono">
                                      <FileText size={22} className="drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                                      {t('code_summary')}
                                  </div>
                                  <p className="text-zinc-100 text-2xl font-bold leading-tight tracking-tight">
                                      {response.summary}
                                  </p>
                              </div>
                              <div className="lg:col-span-4 bg-zinc-800/40 p-10 rounded-[2.5rem] border border-zinc-700/20 flex flex-col justify-center">
                                  <div className="flex items-center gap-4 text-amber-500 mb-6 uppercase tracking-[0.2em] text-xs font-black font-mono">
                                      <Brain size={22} />
                                      {t('intelligence')}
                                  </div>
                                  <p className="text-zinc-400 text-lg leading-relaxed italic border-l-4 border-amber-500/30 pl-6 py-2">
                                      {response.intelligence}
                                  </p>
                              </div>
                          </div>

                          {/* 3. Line-by-line Explanation */}
                          <div className="bg-zinc-900 rounded-[2.5rem] border border-zinc-800 overflow-hidden shadow-2xl transition-all hover:border-zinc-700">
                              <div className="bg-zinc-950/80 px-10 py-8 border-b border-zinc-800 flex items-center justify-between">
                                  <div className="flex items-center gap-4 text-zinc-100 uppercase tracking-[0.2em] text-xs font-black font-mono">
                                      <Search size={22} className="text-amber-500 shadow-amber-500/20" />
                                      {t('logical_breakdown')}
                                  </div>
                                  <div className="text-[10px] font-mono text-zinc-600 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
                                    {(response.line_by_line?.length || 0)} {t('lines_analyzed')}
                                  </div>
                              </div>
                              <div className="overflow-x-auto">
                                  <table className="w-full text-left border-collapse">
                                      <thead>
                                          <tr className="bg-zinc-950/50">
                                              <th className="px-10 py-5 text-[10px] font-black font-mono text-zinc-600 uppercase tracking-widest border-b border-zinc-800">{t('line')}</th>
                                              <th className="px-10 py-5 text-[10px] font-black font-mono text-zinc-600 uppercase tracking-widest border-b border-zinc-800">{t('code_architecture')}</th>
                                              <th className="px-10 py-5 text-[10px] font-black font-mono text-zinc-600 uppercase tracking-widest border-b border-zinc-800">{t('cognitive_explanation')}</th>
                                          </tr>
                                      </thead>
                                      <tbody className="divide-y divide-zinc-800/50">
                                          {response.line_by_line?.map((item, idx) => (
                                              <tr key={idx} className="hover:bg-zinc-800/20 transition-all group">
                                                  <td className="px-10 py-6 font-mono text-zinc-600 text-sm group-hover:text-amber-500 transition-colors font-black">#{item.line}</td>
                                                  <td className="px-10 py-6 font-mono text-amber-500/90 text-[13px] whitespace-pre bg-zinc-950/20">{item.code}</td>
                                                  <td className="px-10 py-6 text-zinc-300 text-[15px] leading-relaxed font-medium transition-colors group-hover:text-white">
                                                    <span className="opacity-60 inline-block mr-2 text-amber-600">→</span>
                                                    {item.explanation}
                                                  </td>
                                              </tr>
                                          ))}
                                      </tbody>
                                  </table>
                              </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                              {/* 4. Dry Run Execution */}
                              <div className="bg-zinc-900/60 border border-zinc-800 p-10 rounded-[2.5rem] shadow-2xl relative group overflow-hidden">
                                  <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                  <div className="flex items-center gap-4 text-blue-400 mb-8 uppercase tracking-[0.2em] text-xs font-black font-mono">
                                      <Beaker size={22} className="rotate-12" />
                                      {t('execution_walkthrough')}
                                  </div>
                                  <div className="bg-zinc-950/80 p-6 rounded-2xl font-mono text-[13px] text-blue-100/70 leading-relaxed border border-blue-900/20 whitespace-pre-wrap min-h-[200px] shadow-inner drop-shadow-xl relative z-10">
                                      {response.dry_run}
                                  </div>
                              </div>

                              {/* 5. Bug Detection */}
                              <div className="bg-zinc-900/60 border border-zinc-800 p-10 rounded-[2.5rem] shadow-2xl relative group overflow-hidden">
                                  <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                  <div className="flex items-center gap-4 text-red-500 mb-8 uppercase tracking-[0.2em] text-xs font-black font-mono">
                                      <AlertTriangle size={22} className="animate-pulse" />
                                      {t('vulnerabilities_logic')}
                                  </div>
                                  <ul className="space-y-6 relative z-10">
                                      {response.bugs?.map((bug, idx) => (
                                          <li key={idx} className="flex gap-4 text-[15px] text-zinc-400 leading-relaxed group/item hover:text-zinc-200 transition-all">
                                              <div className="mt-1.5 w-2 h-2 rounded-full bg-red-500/40 ring-4 ring-red-500/10 flex-shrink-0 group-hover/item:scale-150 transition-transform" />
                                              {bug}
                                          </li>
                                      ))}
                                      {(!response.bugs || response.bugs.length === 0) && (
                                          <li className="flex flex-col items-center justify-center py-10 gap-3 text-zinc-500 italic">
                                              <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                                                <CheckCircle2 size={24} className="text-emerald-500" />
                                              </div>
                                              {t('clean_compile_unit')}
                                          </li>
                                      )}
                                  </ul>
                              </div>
                          </div>


                          {/* 9. Equivalent Code */}
                          <div className="bg-zinc-950 rounded-[3rem] border border-zinc-800 overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative group">
                              <div className="absolute inset-0 bg-gradient-to-b from-amber-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              <div className="bg-zinc-900/80 backdrop-blur-md px-10 py-8 border-b border-zinc-800 flex items-center justify-between">
                                  <div className="flex items-center gap-4 text-zinc-100 uppercase tracking-[0.3em] text-xs font-black font-mono">
                                      <RefreshCcw size={22} className="text-amber-500 animate-slow-spin" />
                                      {t('universal_equivalents')}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
                                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-black">{t('multi_lang_kernel')}</span>
                                  </div>
                              </div>
                              <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-zinc-800/50">
                                  {['python', 'java', 'c'].map((lang) => (
                                      <div key={lang} className="p-10 hover:bg-white/[0.01] transition-all flex flex-col h-full">
                                          <div className="flex justify-between items-center mb-6">
                                             <span className="text-[11px] uppercase font-black font-mono text-zinc-500 tracking-[0.3em] flex items-center gap-2">
                                               <div className={`w-1.5 h-1.5 rounded-full ${lang === 'python' ? 'bg-blue-400' : lang === 'java' ? 'bg-orange-400' : 'bg-zinc-400'}`}></div>
                                               {lang}
                                             </span>
                                             <button 
                                              onClick={() => handleCopy(response.equivalents?.[lang])}
                                              className="text-zinc-600 hover:text-amber-500 transition-all p-2 bg-zinc-900 rounded-xl hover:shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                                              title={`Copy ${lang} Code`}
                                             >
                                               <Copy size={14} />
                                             </button>
                                          </div>
                                          <div className="flex-1 bg-black/40 p-6 rounded-2xl border border-zinc-800/80 group/code relative shadow-inner">
                                            <pre className="text-[13px] font-mono text-amber-50/70 overflow-x-auto custom-scrollbar leading-relaxed">
                                                <code>{response.equivalents?.[lang]}</code>
                                            </pre>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      </div>
                  ) : (
                      <div className="prose prose-invert prose-amber max-w-none prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800 prose-headings:font-mono prose-a:text-amber-500 transition-colors animate-in fade-in duration-500">
                          {response}
                      </div>
                  )}
               </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Global styles specifically applied when this component mounts for sweet scrollbars & animations */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #000000; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #27272a; 
            border-radius: 20px;
            border: 2px solid #000000;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #3f3f46; 
        }
        @keyframes slow-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-slow-spin {
          animation: slow-spin 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
