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

  const accent = '#e65100';
  const accentMid = '#ff8f00';
  const accentLight = '#fff3e0';
  const border = '#ffe0b2';
  const text = '#bf360c';
  const sidebarBg = '#fffbf0';

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fff8e1' }}>
      <Navbar />
      <div className="flex flex-1 overflow-hidden relative">
        <div className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity md:hidden ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setSidebarOpen(false)} />

        {/* Sidebar */}
        <aside className={`fixed md:relative z-50 w-72 flex flex-col h-[calc(100vh-64px)] overflow-y-auto transition-transform duration-300 border-r ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
          style={{ backgroundColor: sidebarBg, borderColor: border }}>
          <div className="p-5 border-b" style={{ borderColor: border }}>
            <div className="flex items-center gap-2">
              <HistoryIcon size={16} style={{ color: accentMid }} />
              <span className="font-black text-xs uppercase tracking-widest" style={{ color: text }}>{t('history')}</span>
            </div>
          </div>

          <div className="p-4 border-b" style={{ borderColor: border }}>
            <button onClick={resetAnalysis}
              className="w-full flex items-center justify-center gap-2 text-white py-2.5 rounded-xl font-black text-sm shadow-lg active:scale-95 transition-all"
              style={{ background: 'linear-gradient(135deg, #ffb300, #e65100)' }}>
              <Plus size={16} /> {t('new_chat')}
            </button>
          </div>

          <div className="p-4 flex-1 overflow-y-auto">
            {history.length === 0 ? (
              <p className="text-xs italic text-center py-8" style={{ color: '#ffcc80' }}>{t('no_history_found')}</p>
            ) : history.map((item, idx) => {
              const match = item.question.match(/Code \((.*?)\): (.*?)$/);
              const parsedMode = match ? match[1] : "Code";
              const parsedQuery = match ? match[2] : item.question.replace('Code: ', '');
              return (
                <button key={idx}
                  className="w-full text-left p-3 rounded-xl border transition-all mb-2 group"
                  style={{ backgroundColor: accentLight, borderColor: border }}
                  onClick={() => {
                    setQuery(parsedQuery);
                    if (match) setMode(parsedMode);
                    const robustParse = (d) => { if (!d || typeof d !== "string") return d; try { const p = JSON.parse(d); if (typeof p === "string") return robustParse(p); return p; } catch { return d; } };
                    let parsed = item.response, savedCode = item.code || "";
                    let outer = robustParse(parsed);
                    if (outer?.explanation) { parsed = robustParse(outer.explanation); savedCode = outer.code || savedCode; } else parsed = outer;
                    setResponse(parsed); setCodeSnippet(savedCode); setSidebarOpen(false);
                  }}>
                  <span className="text-[9px] font-mono font-black uppercase tracking-widest px-2 py-0.5 rounded block w-fit mb-1"
                    style={{ backgroundColor: '#ffe0b2', color: text }}>{parsedMode}</span>
                  <p className="text-xs line-clamp-2 font-medium transition-colors" style={{ color: '#6d4c00' }}>{parsedQuery}</p>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="flex-1 p-6 md:p-10 overflow-y-auto h-[calc(100vh-64px)] w-full">
          <div className="max-w-6xl mx-auto">

            {/* Header */}
            <div className="flex items-center justify-between mb-10 pb-6 border-b" style={{ borderColor: border }}>
              <div className="flex items-center gap-4">
                <button onClick={() => nav(-1)} className="p-2.5 rounded-xl border shadow-sm transition-all"
                  style={{ backgroundColor: 'white', borderColor: border, color: accentMid }}>
                  <ArrowLeft size={18} />
                </button>
                <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2.5 rounded-xl border shadow-sm"
                  style={{ backgroundColor: 'white', borderColor: border }}>
                  <Menu size={18} />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #ffb300, #e65100)' }}>
                    <Terminal className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-black tracking-tighter font-mono" style={{ color: text }}>{t('syntaxsage')}</h1>
                    <p className="text-xs font-mono uppercase tracking-widest" style={{ color: '#ffcc80' }}>{t('expert_ai_intelligence')}</p>
                  </div>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-3 p-3 rounded-2xl border"
                style={{ backgroundColor: 'white', borderColor: border }}>
                <div className="text-right">
                  <span className="font-bold text-sm block truncate max-w-[150px]" style={{ color: text }}>{email}</span>
                  <div className="flex gap-2 justify-end mt-0.5">
                    <span className="text-[9px] uppercase font-mono" style={{ color: '#ffcc80' }}>{lang}</span>
                    <span className="text-[9px] uppercase font-mono" style={{ color: '#ffcc80' }}>{lvl}</span>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: accentLight }}>
                  <Code2 size={20} style={{ color: accentMid }} />
                </div>
              </div>
            </div>

            <div className="space-y-8 pb-20">
              {/* IDE Editor */}
              <div className="rounded-3xl border overflow-hidden shadow-xl"
                style={{ backgroundColor: '#1a1a2e', borderColor: '#2a2a3e' }}>
                {/* Window Bar */}
                <div className="px-5 py-3.5 border-b flex justify-between items-center"
                  style={{ backgroundColor: '#12121f', borderColor: '#2a2a3e' }}>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ff5f56' }} />
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ffbd2e' }} />
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#27c93f' }} />
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleCopy(codeSnippet)} className="p-1.5 rounded-lg transition-colors hover:bg-white/5" style={{ color: '#ffcc80' }}>
                      <Copy size={16} />
                    </button>
                    <div className="h-4 w-px bg-white/10" />
                    <select
                      value={mode}
                      onChange={e => setMode(e.target.value)}
                      className="text-xs font-mono font-black py-1.5 px-3 rounded-xl outline-none uppercase tracking-wider cursor-pointer border"
                      style={{ backgroundColor: '#2a2a3e', color: '#ffcc80', borderColor: '#3a3a4e' }}>
                      {MODES.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>

                {/* Code Area */}
                <div className="flex min-h-[300px]">
                  <div className="w-10 border-r flex flex-col pt-5 items-center select-none"
                    style={{ backgroundColor: '#12121f', borderColor: '#2a2a3e' }}>
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="h-6 text-[9px] font-mono" style={{ color: '#3a3a5e' }}>{i + 1}</div>
                    ))}
                  </div>
                  <textarea
                    className="flex-1 bg-transparent font-mono p-5 outline-none resize-none text-sm leading-relaxed h-[320px]"
                    style={{ color: '#ffd54f', caretColor: '#ffb300' }}
                    placeholder={t('paste_code_placeholder')}
                    spellCheck="false"
                    value={codeSnippet}
                    onChange={e => setCodeSnippet(e.target.value)}
                  />
                </div>

                {/* Query Bar */}
                <div className="p-4 border-t" style={{ borderColor: '#2a2a3e', backgroundColor: '#12121f' }}>
                  <div className="flex flex-col md:flex-row items-center gap-3 p-2 rounded-2xl border"
                    style={{ backgroundColor: '#1a1a2e', borderColor: '#2a2a3e' }}>
                    <div className="flex-1 flex items-center w-full">
                      <HelpCircle size={18} className="ml-3 flex-shrink-0" style={{ color: '#3a3a5e' }} />
                      <input
                        className="flex-1 bg-transparent outline-none px-3 py-3 font-medium text-sm"
                        style={{ color: '#ffd54f' }}
                        placeholder={t('ask_code_question')}
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && askCodeHelper()}
                      />
                    </div>
                    <button
                      onClick={askCodeHelper}
                      className="w-full md:w-auto text-white font-black px-7 py-5 rounded-xl shadow-xl transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2 text-sm uppercase tracking-widest"
                      style={{ background: 'linear-gradient(135deg, #ffb300, #e65100)' }}>
                      <Send size={16} /> {t('analyze')}
                    </button>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div id="results-area">
                {!response ? (
                  <div className="py-24 flex flex-col items-center opacity-50 border-2 border-dashed rounded-3xl transition-opacity hover:opacity-70"
                    style={{ borderColor: '#ffe0b2' }}>
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border"
                      style={{ backgroundColor: accentLight, borderColor: border }}>
                      <Terminal size={32} style={{ color: '#ffcc80' }} />
                    </div>
                    <p className="font-mono text-sm font-bold uppercase tracking-widest" style={{ color: '#ffcc80' }}>{t('awaiting_command')}</p>
                    <p className="text-xs mt-1 italic" style={{ color: '#ffe0b2' }}>{t('pulse_code_engage')}</p>
                  </div>
                ) : typeof response === 'object' ? (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl w-fit border"
                      style={{ backgroundColor: accentLight, borderColor: border }}>
                      <Code2 size={18} style={{ color: accentMid }} />
                      <span className="text-xs font-mono font-black uppercase tracking-widest" style={{ color: text }}>{t('sage_analysis_report')}</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                      <div className="lg:col-span-8 p-8 relative overflow-hidden group rounded-3xl border shadow-sm"
                        style={{ backgroundColor: 'white', borderColor: '#e0e0e0' }}>
                        <div className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: accentMid }}>
                          <FileText size={14} /> {t('code_summary')}
                        </div>
                        <p className="text-xl font-bold leading-tight" style={{ color: text }}>{response.summary}</p>
                      </div>
                      <div className="lg:col-span-4 p-8 flex flex-col justify-center rounded-3xl border shadow-sm"
                        style={{ backgroundColor: accentLight, borderColor: border }}>
                        <div className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: accentMid }}>
                          <Brain size={14} /> {t('intelligence')}
                        </div>
                        <p className="leading-relaxed italic text-sm border-l-4 pl-4" style={{ color: '#6d4c00', borderColor: '#ffcc80' }}>{response.intelligence}</p>
                      </div>
                    </div>

                    {/* Line by Line */}
                    <div className="rounded-3xl overflow-hidden border shadow-sm" style={{ backgroundColor: 'white', borderColor: '#e0e0e0' }}>
                      <div className="px-7 py-5 border-b flex items-center justify-between" style={{ backgroundColor: '#fffbf0', borderColor: '#f0f0f0' }}>
                        <div className="flex items-center gap-3 text-xs font-black font-mono uppercase tracking-widest" style={{ color: text }}>
                          <Search size={16} style={{ color: accentMid }} /> {t('logical_breakdown')}
                        </div>
                        <div className="text-[9px] font-mono px-2 py-1 rounded-lg border" style={{ color: '#9e9e9e', borderColor: '#e0e0e0' }}>
                          {response.line_by_line?.length || 0} {t('lines_analyzed')}
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr style={{ backgroundColor: '#fffde7' }}>
                              {[t('line'), t('code_architecture'), t('cognitive_explanation')].map(h => (
                                <th key={h} className="px-6 py-4 text-[9px] font-black font-mono uppercase tracking-widest border-b" style={{ color: '#9e9e9e', borderColor: '#f0f0f0' }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {response.line_by_line?.map((item, idx) => (
                              <tr key={idx} className="hover:bg-amber-50/50 transition-colors group border-b" style={{ borderColor: '#f5f5f5' }}>
                                <td className="px-6 py-4 font-mono text-sm font-black" style={{ color: accentMid }}>#{item.line}</td>
                                <td className="px-6 py-4 font-mono text-xs whitespace-pre" style={{ color: text, backgroundColor: '#fffbf0' }}>{item.code}</td>
                                <td className="px-6 py-4 text-sm leading-relaxed" style={{ color: '#616161' }}>
                                  <span className="mr-2" style={{ color: '#ffcc80' }}>→</span>{item.explanation}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Dry Run & Bugs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="p-7 rounded-3xl border shadow-sm" style={{ backgroundColor: 'white', borderColor: '#e0e0e0' }}>
                        <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest mb-5" style={{ color: '#0288d1' }}>
                          <Beaker size={14} className="rotate-12" /> {t('execution_walkthrough')}
                        </div>
                        <pre className="rounded-xl p-5 font-mono text-xs leading-relaxed overflow-x-auto min-h-[140px] whitespace-pre-wrap border"
                          style={{ backgroundColor: '#e1f5fe', color: '#01579b', borderColor: '#b3e5fc' }}>
                          {response.dry_run}
                        </pre>
                      </div>
                      <div className="p-7 rounded-3xl border shadow-sm" style={{ backgroundColor: 'white', borderColor: '#e0e0e0' }}>
                        <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest mb-5" style={{ color: '#c62828' }}>
                          <AlertTriangle size={14} className="animate-pulse" /> {t('vulnerabilities_logic')}
                        </div>
                        <ul className="space-y-4">
                          {response.bugs?.map((bug, idx) => (
                            <li key={idx} className="flex gap-3 text-sm leading-relaxed hover:text-gray-700 transition-colors" style={{ color: '#616161' }}>
                              <div className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#ef9a9a' }} /> {bug}
                            </li>
                          ))}
                          {(!response.bugs || response.bugs.length === 0) && (
                            <li className="flex flex-col items-center py-8 gap-2">
                              <div className="w-10 h-10 rounded-full flex items-center justify-center border" style={{ backgroundColor: '#e8f5e9', borderColor: '#c8e6c9' }}>
                                <CheckCircle2 size={20} style={{ color: '#43a047' }} />
                              </div>
                              <span className="text-sm italic" style={{ color: '#81c784' }}>{t('clean_compile_unit')}</span>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>

                    {/* Equivalents */}
                    <div className="rounded-3xl overflow-hidden border shadow-sm" style={{ backgroundColor: 'white', borderColor: '#e0e0e0' }}>
                      <div className="px-7 py-5 border-b flex items-center" style={{ backgroundColor: '#fffbf0', borderColor: '#f0f0f0' }}>
                        <div className="flex items-center gap-3 text-xs font-black font-mono uppercase tracking-widest" style={{ color: text }}>
                          <RefreshCcw size={16} style={{ color: accentMid }} /> {t('universal_equivalents')}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x" style={{ '--tw-divide-color': '#f0f0f0' }}>
                        {['python', 'java', 'c'].map((l) => (
                          <div key={l} className="p-7">
                            <div className="flex justify-between items-center mb-4">
                              <span className="text-[10px] font-black font-mono uppercase tracking-widest flex items-center gap-2" style={{ color: '#9e9e9e' }}>
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: l === 'python' ? '#29b6f6' : l === 'java' ? '#ffa726' : '#78909c' }} /> {l}
                              </span>
                              <button onClick={() => handleCopy(response.equivalents?.[l])}
                                className="p-1.5 rounded-lg transition-colors hover:bg-amber-50 border"
                                style={{ color: '#ffcc80', borderColor: '#f0f0f0' }}>
                                <Copy size={14} />
                              </button>
                            </div>
                            <pre className="text-xs font-mono overflow-x-auto leading-relaxed rounded-xl p-4 border"
                              style={{ color: text, backgroundColor: '#fffbf0', borderColor: '#ffe0b2' }}>
                              <code>{response.equivalents?.[l]}</code>
                            </pre>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="prose max-w-none animate-in fade-in duration-500 rounded-3xl p-8 border shadow-sm"
                    style={{ backgroundColor: 'white', borderColor: '#e0e0e0' }}>
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