import { useState, useEffect, useContext } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { useTranslation } from "react-i18next";
import {
  History as HistoryIcon, Clock, Menu, X, ArrowLeft, Code2, Terminal, HelpCircle,
  FileText, Brain, Search, Beaker, AlertTriangle, RefreshCcw, CheckCircle2,
  Copy, Plus, Send
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
  const { user: email, language: lang, level: lvl } = useContext(AuthContext);
  const MODES = ["Python", "Java", "C", "General", "JavaScript", "HTML/CSS"];

  useEffect(() => { if (email !== "User") fetchHistory(); }, [email, response]);

  const fetchHistory = async () => {
    try {
      const res = await API.get(`/ai/history?email=${email}`);
      setHistory(res.data.history.filter(h => h.question.startsWith('Code (')).reverse());
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

  const sectionBlock = "bg-[#0d0d1a] border border-white/5 rounded-2xl p-6";

  return (
    <div className="min-h-screen bg-[#080810] flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden relative">
        <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity md:hidden ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setSidebarOpen(false)} />

        {/* Sidebar */}
        <aside className={`fixed md:relative z-50 w-72 bg-[#0a0a12] border-r border-white/5 flex flex-col h-[calc(100vh-64px)] overflow-y-auto transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="p-5 border-b border-white/5 flex items-center gap-2">
            <HistoryIcon size={16} className="text-amber-500" />
            <span className="font-black text-white text-xs uppercase tracking-widest">{t('history')}</span>
          </div>

          <div className="p-4 border-b border-white/5">
            <button
              onClick={resetAnalysis}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black py-2.5 rounded-xl font-black text-sm shadow-lg active:scale-95 transition-all"
            >
              <Plus size={16} /> {t('new_chat')}
            </button>
          </div>

          <div className="p-4 flex-1 overflow-y-auto">
            {history.length === 0 ? (
              <p className="text-xs text-zinc-600 italic text-center py-8 font-mono">{t('no_history_found')}</p>
            ) : history.map((item, idx) => {
              const match = item.question.match(/Code \((.*?)\): (.*?)$/);
              const parsedMode = match ? match[1] : "Code";
              const parsedQuery = match ? match[2] : item.question.replace('Code: ', '');
              return (
                <button key={idx}
                  className="w-full text-left p-3 rounded-xl bg-white/3 border border-white/5 hover:bg-white/8 hover:border-amber-500/20 transition-all mb-2 group"
                  onClick={() => {
                    setQuery(parsedQuery);
                    if (match) setMode(parsedMode);
                    const robustParse = (d) => { if (!d || typeof d !== "string") return d; try { const p = JSON.parse(d); if (typeof p === "string") return robustParse(p); return p; } catch { return d; } };
                    let parsed = item.response, savedCode = item.code || "";
                    let outer = robustParse(parsed);
                    if (outer?.explanation) { parsed = robustParse(outer.explanation); savedCode = outer.code || savedCode; } else parsed = outer;
                    setResponse(parsed); setCodeSnippet(savedCode); setSidebarOpen(false);
                  }}>
                  <span className="text-[9px] font-mono text-amber-500 font-black uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded block w-fit mb-1">{parsedMode}</span>
                  <p className="text-xs text-zinc-400 line-clamp-2 group-hover:text-zinc-200 transition-colors font-medium">{parsedQuery}</p>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="flex-1 p-6 md:p-10 overflow-y-auto h-[calc(100vh-64px)] w-full">
          <div className="max-w-6xl mx-auto">

            {/* Header */}
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
              <div className="flex items-center gap-4">
                <button onClick={() => nav(-1)} className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-zinc-400 hover:text-amber-500 hover:bg-white/10 hover:border-amber-500/20 transition-all">
                  <ArrowLeft size={18} />
                </button>
                <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2.5 bg-white/5 border border-white/10 rounded-xl text-zinc-400">
                  <Menu size={18} />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
                    <Terminal className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-black text-white tracking-tighter font-mono">{t('syntaxsage')}</h1>
                    <p className="text-zinc-600 text-xs font-mono uppercase tracking-widest">{t('expert_ai_intelligence')}</p>
                  </div>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-3 bg-white/3 border border-white/8 p-3 rounded-2xl">
                <div className="text-right">
                  <span className="text-zinc-100 font-bold text-sm block truncate max-w-[150px]">{email}</span>
                  <div className="flex gap-2 justify-end mt-0.5">
                    <span className="text-[9px] uppercase font-mono text-zinc-600">{lang}</span>
                    <span className="text-[9px] uppercase font-mono text-zinc-600">{lvl}</span>
                  </div>
                </div>
                <div className="w-9 h-9 bg-amber-500/20 text-amber-500 rounded-xl flex items-center justify-center"><Code2 size={20} /></div>
              </div>
            </div>

            <div className="space-y-8 pb-20">
              {/* IDE Editor */}
              <div className="bg-[#0a0a12] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
                {/* Window Bar */}
                <div className="bg-black/40 px-5 py-3.5 border-b border-white/5 flex justify-between items-center">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/60 border border-red-500/40" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60 border border-yellow-500/40" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/60 border border-emerald-500/40" />
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleCopy(codeSnippet)} className="text-zinc-600 hover:text-amber-500 transition-colors p-1.5 hover:bg-white/5 rounded-lg">
                      <Copy size={16} />
                    </button>
                    <div className="h-4 w-px bg-white/10" />
                    <select
                      value={mode}
                      onChange={e => setMode(e.target.value)}
                      className="bg-white/5 text-zinc-200 text-xs font-mono font-black py-1.5 px-3 rounded-xl outline-none border border-white/10 hover:border-amber-500/30 transition-all cursor-pointer uppercase tracking-wider"
                    >
                      {MODES.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>

                {/* Code Area */}
                <div className="flex min-h-[300px]">
                  <div className="w-10 bg-black/20 border-r border-white/5 flex flex-col pt-5 items-center select-none">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="h-6 text-[9px] font-mono text-zinc-700">{i + 1}</div>
                    ))}
                  </div>
                  <textarea
                    className="flex-1 bg-transparent text-amber-50/80 font-mono p-5 outline-none resize-none text-sm leading-relaxed placeholder:text-zinc-700 focus:text-amber-50/95 transition-colors h-[320px]"
                    placeholder={t('paste_code_placeholder')}
                    spellCheck="false"
                    value={codeSnippet}
                    onChange={e => setCodeSnippet(e.target.value)}
                  />
                </div>

                {/* Query Bar */}
                <div className="bg-black/30 p-4 border-t border-white/5">
                  <div className="flex flex-col md:flex-row items-center gap-3 bg-white/3 rounded-2xl p-2 border border-white/8 focus-within:border-amber-500/30 focus-within:ring-2 focus-within:ring-amber-500/10 transition-all">
                    <div className="flex-1 flex items-center w-full">
                      <HelpCircle size={18} className="text-zinc-600 ml-3 flex-shrink-0" />
                      <input
                        className="flex-1 bg-transparent text-zinc-100 outline-none placeholder:text-zinc-700 px-3 py-3 font-medium text-sm"
                        placeholder={t('ask_code_question')}
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && askCodeHelper()}
                      />
                    </div>
                    <Button
                      onClick={askCodeHelper}
                      className="w-full md:w-auto bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-black px-7 py-5 rounded-xl shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2 text-sm uppercase tracking-widest"
                    >
                      <Send size={16} /> {t('analyze')}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div id="results-area">
                {!response ? (
                  <div className="py-24 flex flex-col items-center text-zinc-700 opacity-40 border-2 border-dashed border-white/5 rounded-3xl hover:opacity-70 transition-opacity group">
                    <div className="w-16 h-16 bg-white/3 rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform duration-500 border border-white/5">
                      <Terminal size={32} className="text-zinc-600" />
                    </div>
                    <p className="font-mono text-sm font-bold uppercase tracking-widest">{t('awaiting_command')}</p>
                    <p className="text-xs mt-1 text-zinc-700 italic">{t('pulse_code_engage')}</p>
                  </div>
                ) : typeof response === 'object' ? (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    {/* Analysis Badge */}
                    <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 px-4 py-2.5 rounded-xl w-fit">
                      <Code2 size={18} className="text-amber-500" />
                      <span className="text-xs font-mono text-amber-500 font-black uppercase tracking-widest">{t('sage_analysis_report')}</span>
                    </div>

                    {/* Summary & Intelligence */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                      <div className="lg:col-span-8 bg-[#0d0d1a] border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/5 rounded-full -mr-20 -mt-20 blur-2xl group-hover:opacity-100 opacity-60 transition-opacity" />
                        <div className="text-amber-500 font-black text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
                          <FileText size={14} /> {t('code_summary')}
                        </div>
                        <p className="text-zinc-100 text-xl font-bold leading-tight relative z-10">{response.summary}</p>
                      </div>
                      <div className="lg:col-span-4 bg-white/3 border border-white/5 rounded-3xl p-8 flex flex-col justify-center">
                        <div className="text-amber-500 font-black text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Brain size={14} /> {t('intelligence')}
                        </div>
                        <p className="text-zinc-400 leading-relaxed italic text-sm border-l-2 border-amber-500/30 pl-4">{response.intelligence}</p>
                      </div>
                    </div>

                    {/* Line by Line */}
                    <div className="bg-[#0a0a12] border border-white/5 rounded-3xl overflow-hidden">
                      <div className="bg-black/30 px-7 py-5 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-zinc-200 text-xs font-black font-mono uppercase tracking-widest">
                          <Search size={16} className="text-amber-500" /> {t('logical_breakdown')}
                        </div>
                        <div className="text-[9px] font-mono text-zinc-600 bg-white/3 border border-white/5 px-2 py-1 rounded-lg">
                          {response.line_by_line?.length || 0} {t('lines_analyzed')}
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-black/20">
                              {[t('line'), t('code_architecture'), t('cognitive_explanation')].map(h => (
                                <th key={h} className="px-6 py-4 text-[9px] font-black font-mono text-zinc-700 uppercase tracking-widest border-b border-white/5">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/3">
                            {response.line_by_line?.map((item, idx) => (
                              <tr key={idx} className="hover:bg-white/2 transition-colors group">
                                <td className="px-6 py-4 font-mono text-zinc-700 text-sm group-hover:text-amber-500 transition-colors font-black">#{item.line}</td>
                                <td className="px-6 py-4 font-mono text-amber-400/80 text-xs whitespace-pre bg-black/10">{item.code}</td>
                                <td className="px-6 py-4 text-zinc-400 text-sm leading-relaxed group-hover:text-zinc-200 transition-colors">
                                  <span className="text-amber-600/60 mr-2">→</span>{item.explanation}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Dry Run & Bugs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="bg-[#0d0d1a] border border-white/5 rounded-3xl p-7">
                        <div className="flex items-center gap-2 text-sky-400 font-black text-[10px] uppercase tracking-widest mb-5">
                          <Beaker size={14} className="rotate-12" /> {t('execution_walkthrough')}
                        </div>
                        <pre className="bg-black/40 border border-sky-900/20 rounded-xl p-5 font-mono text-xs text-sky-100/60 leading-relaxed overflow-x-auto min-h-[140px] whitespace-pre-wrap">
                          {response.dry_run}
                        </pre>
                      </div>
                      <div className="bg-[#0d0d1a] border border-white/5 rounded-3xl p-7">
                        <div className="flex items-center gap-2 text-red-500 font-black text-[10px] uppercase tracking-widest mb-5">
                          <AlertTriangle size={14} className="animate-pulse" /> {t('vulnerabilities_logic')}
                        </div>
                        <ul className="space-y-4">
                          {response.bugs?.map((bug, idx) => (
                            <li key={idx} className="flex gap-3 text-sm text-zinc-400 leading-relaxed hover:text-zinc-200 transition-colors">
                              <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500/50 flex-shrink-0" /> {bug}
                            </li>
                          ))}
                          {(!response.bugs || response.bugs.length === 0) && (
                            <li className="flex flex-col items-center py-8 text-zinc-600 italic gap-2">
                              <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                                <CheckCircle2 size={20} className="text-emerald-500" />
                              </div>
                              <span className="text-sm">{t('clean_compile_unit')}</span>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>

                    {/* Equivalents */}
                    <div className="bg-[#0a0a12] border border-white/5 rounded-3xl overflow-hidden">
                      <div className="bg-black/30 px-7 py-5 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-zinc-200 text-xs font-black font-mono uppercase tracking-widest">
                          <RefreshCcw size={16} className="text-amber-500" /> {t('universal_equivalents')}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-white/5">
                        {['python', 'java', 'c'].map((l) => (
                          <div key={l} className="p-7">
                            <div className="flex justify-between items-center mb-4">
                              <span className="text-[10px] font-black font-mono text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${l === 'python' ? 'bg-sky-400' : l === 'java' ? 'bg-orange-400' : 'bg-zinc-400'}`} /> {l}
                              </span>
                              <button onClick={() => handleCopy(response.equivalents?.[l])} className="text-zinc-600 hover:text-amber-500 transition-colors p-1.5 bg-white/3 rounded-lg">
                                <Copy size={14} />
                              </button>
                            </div>
                            <pre className="text-xs font-mono text-amber-50/60 overflow-x-auto leading-relaxed bg-black/30 border border-white/5 rounded-xl p-4">
                              <code>{response.equivalents?.[l]}</code>
                            </pre>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="prose prose-invert prose-amber max-w-none animate-in fade-in duration-500 bg-[#0d0d1a] border border-white/5 rounded-3xl p-8">
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