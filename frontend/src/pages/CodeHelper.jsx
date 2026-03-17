import { useState, useEffect } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { useTranslation } from "react-i18next";
import { User, History as HistoryIcon, Clock, Menu, X, ArrowLeft, Code2, Terminal, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function CodeHelper() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [codeSnippet, setCodeSnippet] = useState("");
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("Python");
  const [response, setResponse] = useState("");
  const [history, setHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const email = localStorage.getItem("email") || "User";
  const lang = localStorage.getItem("language") || "English";
  const lvl = localStorage.getItem("level") || "Beginner";

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
      toast.error("Please paste some code first.");
      return;
    }

    const tid = toast.loading("SyntaxSage is analyzing your code...");

    try {
      const res = await API.post("/ai/codehelper", { 
          email, 
          code_snippet: codeSnippet,
          mode: mode,
          query: query || "explain every line from basics"
      });
      setResponse(res.data.response);
      toast.success("Code explanation ready!", { id: tid });
      fetchHistory();
    } catch (err) {
      toast.error("Failed to analyze code.", { id: tid });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col transition-colors duration-300">
      {/* Dark theme forced for CodeHelper for 'IDE' feel, but respecting dark mode classes slightly */}
      <Navbar />
      <div className="flex flex-1 overflow-hidden relative">
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/80 z-40 md:hidden transition-colors duration-300"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <aside className={`fixed md:relative z-50 w-80 bg-zinc-900 border-r border-zinc-800 flex flex-col h-[calc(100vh-64px)] overflow-y-auto transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="p-6 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-start">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center font-bold text-xl">
                <Code2 size={24} />
              </div>
              <div>
                <h3 className="font-bold text-zinc-100 truncate w-40" title={email}>{email}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full font-mono">{lang}</span>
                  <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full font-mono">{lvl}</span>
                </div>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-zinc-500 hover:text-zinc-300 transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="p-6 flex-1">
            <div className="flex items-center gap-2 text-zinc-300 font-bold mb-4 font-mono">
              <HistoryIcon size={18} className="text-amber-500" />
              Snippets History
            </div>
            {history.length === 0 ? (
              <p className="text-sm text-zinc-600 italic">No code analyzed yet.</p>
            ) : (
              <div className="space-y-4">
                {history.map((item, idx) => {
                    const match = item.question.match(/Code \((.*?)\): (.*?)$/);
                    const parsedMode = match ? match[1] : "Unknown";
                    const parsedQuery = match ? match[2] : item.question;

                    return (
                        <div key={idx} className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50 shadow-sm cursor-pointer hover:bg-zinc-800 transition-colors"
                        onClick={() => {
                            // Extract just the query part if possible, code snippet isn't preserved in history fully in this minimal implementation
                            setQuery(parsedQuery.replace('...', ''));
                            setMode(parsedMode);
                            setResponse(item.response);
                            setCodeSnippet("// Code snippet hidden from history view. Result below is based on past analysis.");
                            setSidebarOpen(false);
                        }}>
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-mono text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">{parsedMode}</span>
                        </div>
                        <p className="text-sm font-medium text-zinc-300 line-clamp-2 truncate">{parsedQuery}</p>
                        </div>
                    )
                })}
              </div>
            )}
          </div>
        </aside>
        
        <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-64px)] relative w-full flex flex-col">
          <div className="flex items-center gap-4 mb-6 border-b pb-4 border-zinc-800">
             <button onClick={() => nav(-1)} className="p-2 bg-zinc-900 rounded-lg border border-zinc-700 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800 transition-colors">
              <ArrowLeft size={20} />
             </button>
             <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 bg-zinc-900 rounded-lg border border-zinc-700 text-zinc-400 transition-colors hover:bg-zinc-800">
              <Menu size={20} />
             </button>
             <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 flex items-center gap-3 tracking-tight font-mono">
                <Terminal className="text-amber-500 w-8 h-8" />
                SyntaxSage
             </h1>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6 mb-8 flex-1 min-h-[500px]">
             
             {/* IDE Input Form */}
             <div className="flex-1 flex flex-col bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl overflow-hidden">
                <div className="bg-zinc-950 px-4 py-3 border-b border-zinc-800 flex justify-between items-center">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500"></div>
                    </div>
                    <select 
                        value={mode} 
                        onChange={e => setMode(e.target.value)}
                        className="bg-zinc-800 text-zinc-300 text-xs font-mono font-bold py-1 px-3 rounded outline-none border border-zinc-700 hover:border-zinc-600 transition-colors"
                    >
                        {MODES.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>
                
                <textarea
                    className="flex-1 w-full bg-zinc-900 text-amber-50/90 font-mono p-4 outline-none resize-none text-sm leading-relaxed custom-scrollbar placeholder:text-zinc-600 focus:bg-zinc-900/80 transition-colors"
                    placeholder="// Paste your code snippet here..."
                    spellCheck="false"
                    value={codeSnippet}
                    onChange={e => setCodeSnippet(e.target.value)}
                ></textarea>
                
                <div className="bg-zinc-950 p-4 border-t border-zinc-800">
                    <div className="flex items-center gap-3 bg-zinc-900 rounded-lg p-1 border border-zinc-800 focus-within:border-amber-500/50 transition-colors">
                        <HelpCircle size={18} className="text-zinc-500 ml-3" />
                        <input 
                            className="flex-1 bg-transparent text-zinc-300 text-sm outline-none placeholder:text-zinc-600"
                            placeholder="Ask a specific question (or leave blank for a line-by-line explanation)"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && askCodeHelper()}
                        />
                        <Button 
                            onClick={askCodeHelper}
                            className="bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold px-6 rounded-md hover:scale-105 transition-all shadow-lg shadow-amber-900/30"
                        >
                            Analyze
                        </Button>
                    </div>
                </div>
             </div>
             
             {/* Response Area */}
             <div className="flex-1 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl overflow-hidden flex flex-col">
                <div className="bg-zinc-950 px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
                    <Code2 size={16} className="text-amber-500" />
                    <span className="text-xs font-mono text-zinc-400 font-semibold uppercase tracking-wider">Sage Output</span>
                </div>
                <div className="flex-1 overflow-y-auto p-6 focus-within:outline-none custom-scrollbar">
                    {!response ? (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-4 opacity-50">
                            <Terminal size={48} className="text-zinc-700" />
                            <p className="font-mono text-sm">Awaiting code analysis...</p>
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
      
      {/* Global styles specifically applied when this component mounts for sweet scrollbars */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #18181b; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #27272a; 
            border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #3f3f46; 
        }
      `}</style>
    </div>
  );
}
