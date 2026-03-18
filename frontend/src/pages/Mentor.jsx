import { useState, useEffect } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { useTranslation } from "react-i18next";
import { 
  User, History as HistoryIcon, Clock, Menu, X, ArrowLeft, 
  Briefcase, Map, Target, CheckCircle2, Circle, PlayCircle, 
  BookOpen, Award, TrendingUp, ThumbsUp, ExternalLink, 
  Code, Star, CheckSquare, Square, Shield, Medal, Trophy, Crown, ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Mentor() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [goal, setGoal] = useState("");
  const [rawResponse, setRawResponse] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [history, setHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Progress tracking state
  const [progress, setProgress] = useState({});

  const email = localStorage.getItem("email") || "User";
  const lang = localStorage.getItem("language") || "English";
  const lvl = localStorage.getItem("level") || "Beginner";

  useEffect(() => {
    if (email !== "User") {
      fetchHistory();
    }
  }, [email]);

  useEffect(() => {
    if (goal) {
      const savedProgress = localStorage.getItem(`pathpilot_progress_${email}_${goal}`);
      if (savedProgress) {
        try {
          setProgress(JSON.parse(savedProgress));
        } catch(e) {
          console.error("Failed to parse progress", e);
        }
      } else {
        setProgress({});
      }
    }
  }, [goal, parsedData, email]);

  const toggleProgress = (key) => {
    const newProg = { ...progress, [key]: !progress[key] };
    setProgress(newProg);
    localStorage.setItem(`pathpilot_progress_${email}_${goal}`, JSON.stringify(newProg));
  };

  const toggleStepProgress = (idx) => {
    if (!progress[`step_${idx}`]) {
      // User is trying to mark as completed
      if (idx > 0 && !progress[`step_${idx - 1}`]) {
        toast.error(`Warning: Please mark Phase ${idx} as completed first!`);
        return;
      }
    } else {
      // User is trying to unmark
      if (idx < parsedData.roadmap.length - 1 && progress[`step_${idx + 1}`]) {
        toast.error(`Warning: Please uncheck Phase ${idx + 2} first!`);
        return;
      }
    }
    toggleProgress(`step_${idx}`);
  };

  const toggleMaster = () => {
    const isMastered = progressPercent === 100;
    const newProg = { ...progress };
    
    // Toggle all features
    if (parsedData) {
      parsedData.roadmap.forEach((_, i) => newProg[`step_${i}`] = !isMastered);
      parsedData.projects.forEach((_, i) => newProg[`proj_${i}`] = !isMastered);
    }
    
    setProgress(newProg);
    localStorage.setItem(`pathpilot_progress_${email}_${goal}`, JSON.stringify(newProg));
    if (!isMastered) toast.success("Domain Mastered! Congratulations! 🎉");
  };

  const fetchHistory = async () => {
    try {
      const res = await API.get(`/ai/history?email=${email}`);
      const mentorHistory = res.data.history.filter(h => h.question.startsWith('Career Goal:')).reverse();
      setHistory(mentorHistory);
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
  };

  const processResponse = (respText) => {
    setRawResponse(respText);
    try {
      let jsonStr = respText;
      if (respText.includes('```json')) {
        jsonStr = respText.split('```json')[1].split('```')[0];
      } else if (respText.includes('```')) {
        jsonStr = respText.split('```')[1].split('```')[0];
      }
      const data = JSON.parse(jsonStr.trim());
      setParsedData(data);
    } catch (e) {
      setParsedData(null);
    }
  };

  const askMentor = async () => {
    if (!goal) {
      toast.error(t('career_goal_prompt'));
      return;
    }

    const tid = toast.loading("Charting your career path... This may take a moment.");

    try {
      const res = await API.post("/ai/mentor", { email, goal });
      processResponse(res.data.response);
      toast.success("Career roadmap generated!", { id: tid });
      fetchHistory();
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate career roadmap.", { id: tid });
    }
  };

  const renderSectionIcon = (title) => {
    const tLower = title.toLowerCase();
    if (tLower.includes('youtube') || tLower.includes('video')) return <PlayCircle className="w-5 h-5 text-red-500" />;
    if (tLower.includes('book')) return <BookOpen className="w-5 h-5 text-amber-500" />;
    if (tLower.includes('practice')) return <Code className="w-5 h-5 text-emerald-500" />;
    return <Star className="w-5 h-5 text-sky-500" />;
  };

  const totalItems = parsedData ? (parsedData.roadmap.length + parsedData.projects.length) : 0;
  const completedItems = totalItems > 0 ? (
    Object.keys(progress).filter(k => (k.startsWith('step_') || k.startsWith('proj_')) && progress[k]).length
  ) : 0;
  const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const getBadgeInfo = () => {
    if (progressPercent === 0) return { title: "Apprentice", icon: <Shield className="w-8 h-8 text-neutral-400" />, color: "bg-neutral-100 text-neutral-600 border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300" };
    if (progressPercent < 50) return { title: "Bronze Scholar", icon: <Medal className="w-8 h-8 text-amber-600 dark:text-amber-500" />, color: "bg-amber-100 text-amber-800 border-amber-300 shadow-md shadow-amber-500/10 dark:bg-amber-900/40 dark:border-amber-700 dark:text-amber-300" };
    if (progressPercent < 90) return { title: "Silver Specialist", icon: <Award className="w-8 h-8 text-slate-500 dark:text-slate-400" />, color: "bg-slate-100 text-slate-700 border-slate-300 shadow-md shadow-slate-500/10 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300" };
    if (progressPercent < 100) return { title: "Gold Expert", icon: <Trophy className="w-8 h-8 text-yellow-500" />, color: "bg-yellow-100 text-yellow-800 border-yellow-300 shadow-lg shadow-yellow-500/20 dark:bg-yellow-900/40 dark:border-yellow-700 dark:text-yellow-300" };
    return { title: "Domain Master", icon: <Crown className="w-8 h-8 text-fuchsia-500" />, color: "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300 shadow-xl shadow-fuchsia-500/30 dark:bg-fuchsia-900/40 dark:border-fuchsia-700 dark:text-fuchsia-300" };
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col transition-colors duration-300">
      <Navbar />
      <div className="flex flex-1 overflow-hidden relative">
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 md:hidden transition-colors duration-300"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <aside className={`fixed md:relative z-50 w-80 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col h-[calc(100vh-64px)] overflow-y-auto transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 bg-sky-50/50 dark:bg-sky-950/20 flex justify-between items-start transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400 rounded-full flex items-center justify-center font-bold text-xl transition-colors">
                <Target size={24} />
              </div>
              <div>
                <h3 className="font-bold text-neutral-900 dark:text-neutral-100 truncate w-40 transition-colors" title={email}>{email}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 px-2 py-0.5 rounded-full font-medium transition-colors">{lang}</span>
                  <span className="text-xs bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-medium transition-colors">{lvl}</span>
                </div>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="p-6 flex-1">
            <div className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200 font-bold mb-4 transition-colors">
              <HistoryIcon size={18} className="text-sky-600 dark:text-sky-400" />
              {t('mentor_history')}
            </div>
            {history.length === 0 ? (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 italic transition-colors">{t('no_paths')}</p>
            ) : (
              <div className="space-y-4">
                {history.map((item, idx) => (
                  <div key={idx} className="bg-neutral-50 dark:bg-neutral-800/50 p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 shadow-sm cursor-pointer hover:bg-sky-50 dark:hover:bg-sky-900/30 transition-colors"
                    onClick={() => {
                      setGoal(item.question.replace('Career Goal: ', ''));
                      processResponse(item.response);
                      setSidebarOpen(false);
                    }}>
                    <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 line-clamp-2 transition-colors">{item.question.replace('Career Goal: ', '')}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-neutral-400 dark:text-neutral-500 transition-colors">
                      <Clock size={12} />
                      <span>{t('past_session')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
        
        <main className="flex-1 p-6 md:p-10 overflow-y-auto h-[calc(100vh-64px)] relative w-full bg-neutral-50/50 dark:bg-neutral-950/50">
          <div className="flex items-center gap-4 mb-10 border-b pb-6 border-neutral-200 dark:border-neutral-800 max-w-5xl mx-auto">
            <button onClick={() => nav(-1)} className="p-2.5 bg-white dark:bg-neutral-900 rounded-full shadow-sm border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/50 transition-colors">
              <ArrowLeft size={20} />
            </button>
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2.5 bg-white dark:bg-neutral-900 rounded-md shadow-sm border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800">
              <Menu size={20} />
            </button>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-600 dark:from-sky-400 dark:to-indigo-500 transition-colors flex items-center gap-3">
              <Map className="text-sky-500 w-10 h-10" />
              {t('pathpilot')}
            </h1>
          </div>
          
          <div className="bg-white dark:bg-neutral-900 p-8 rounded-3xl shadow-sm border border-neutral-200 dark:border-neutral-800 mb-10 max-w-5xl mx-auto transition-all">
             <h2 className="text-xl font-bold mb-6 text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                 <Briefcase className="text-sky-500" />
                 {t('career_goal_prompt')}
             </h2>
             <div className="flex gap-4 flex-col sm:flex-row">
                 <input
                  className="flex-1 px-6 py-4 rounded-2xl border-2 border-neutral-200 dark:border-neutral-800 outline-none text-neutral-800 dark:text-neutral-100 bg-neutral-50 dark:bg-neutral-950 focus:border-sky-400 dark:focus:border-sky-500 transition-colors text-lg"
                  placeholder="e.g. Become a Full Stack Developer, Learn AI..."
                 value={goal}
                 onChange={e => setGoal(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && askMentor()}
                 />
                 <Button
                 onClick={askMentor}
                 className="bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white px-10 h-14 sm:h-[64px] rounded-2xl font-bold shadow-lg shadow-sky-500/30 transition-all text-lg whitespace-nowrap"
                 >
                 {t('map_path')}
                 </Button>
             </div>
          </div>

          {rawResponse && !parsedData && (
            <div className="mt-8 bg-white dark:bg-neutral-900 p-10 rounded-3xl shadow-lg border border-neutral-100 dark:border-neutral-800 max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-500 transition-colors">
              <h2 className="font-extrabold pb-6 text-2xl mb-6 text-neutral-800 dark:text-neutral-100 border-b-2 border-sky-100 dark:border-sky-900/30 flex items-center gap-3 transition-colors">
                  <Target className="text-sky-500 w-8 h-8" />
                  {t('custom_roadmap')}
              </h2>
              <div className="prose prose-sky dark:prose-invert max-w-none text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap leading-loose text-lg transition-colors">
                {rawResponse}
              </div>
            </div>
          )}

          {parsedData && (
            <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">

              <div className="bg-white dark:bg-neutral-900 p-8 rounded-3xl shadow-sm border border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row items-center gap-8 justify-between">
                <div className="flex-1 w-full">
                  <h3 className="text-2xl font-black mb-4 flex items-center gap-3 text-neutral-800 dark:text-neutral-200">
                    <Target className="text-sky-500 w-8 h-8" />
                    Overall Completion: {progressPercent}%
                  </h3>
                  <div className="w-full h-5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden border border-neutral-200 dark:border-neutral-700 shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 transition-all duration-1000 ease-out" 
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400 font-bold">
                    {completedItems} of {totalItems} milestones achieved
                  </p>
                </div>
                
                <div className={`p-8 rounded-3xl border-2 flex flex-col items-center justify-center min-w-[220px] transition-all duration-500 ${getBadgeInfo().color}`}>
                  <div className="mb-3 bg-white/50 dark:bg-black/20 p-4 rounded-full shadow-sm backdrop-blur-sm">{getBadgeInfo().icon}</div>
                  <span className="font-black tracking-wider uppercase text-sm text-center">{getBadgeInfo().title}</span>
                </div>
              </div>
              
              {/* Overview & Motivation */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-gradient-to-br from-indigo-500 to-sky-600 p-10 rounded-3xl shadow-xl text-white relative overflow-hidden">
                  <div className="absolute -right-10 -top-10 opacity-10"><Target size={250}/></div>
                  <h2 className="text-4xl font-black mb-4 relative z-10">{parsedData.overview.role}</h2>
                  <p className="text-sky-100 text-lg mb-8 relative z-10 font-medium leading-relaxed">{parsedData.overview.daily_tasks}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                    <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-md border border-white/20">
                      <div className="text-sky-200 text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                        <TrendingUp size={16} /> Salary Range
                      </div>
                      <div className="font-bold text-xl">{parsedData.overview.salary_range}</div>
                    </div>
                    <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-md border border-white/20">
                      <div className="text-sky-200 text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Star size={16} /> Future Demand
                      </div>
                      <div className="font-bold text-xl">{parsedData.overview.future_demand}</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-neutral-900 p-8 rounded-3xl shadow-md border border-neutral-200 dark:border-neutral-800 flex flex-col justify-center relative overflow-hidden group">
                  <div className="absolute top-4 right-4 text-amber-400 opacity-10 group-hover:scale-110 transition-transform duration-500"><Award size={100}/></div>
                  <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-6 flex items-center gap-2">
                    <ThumbsUp className="text-sky-500" size={24}/>
                    Message for You
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 italic font-medium leading-relaxed relative z-10 text-lg">
                    "{parsedData.motivation}"
                  </p>
                </div>
              </div>

              {/* Skills Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-neutral-900 p-8 rounded-3xl shadow-sm border border-neutral-200 dark:border-neutral-800">
                  <h3 className="text-xl font-black text-neutral-800 dark:text-neutral-200 mb-6 border-b border-neutral-100 dark:border-neutral-800 pb-4 flex items-center gap-3">
                     <Code className="text-sky-500 w-6 h-6" /> Technical Skills
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {parsedData.skills.technical.map((s, i) => (
                      <span key={i} className="px-4 py-2 bg-sky-50 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 rounded-xl text-sm font-bold border border-sky-100 dark:border-sky-800 shadow-sm transition-transform hover:scale-105 cursor-default hover:bg-sky-100 dark:hover:bg-sky-900/60">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="bg-white dark:bg-neutral-900 p-8 rounded-3xl shadow-sm border border-neutral-200 dark:border-neutral-800">
                  <h3 className="text-xl font-black text-neutral-800 dark:text-neutral-200 mb-6 border-b border-neutral-100 dark:border-neutral-800 pb-4 flex items-center gap-3">
                     <User className="text-indigo-500 w-6 h-6" /> Soft Skills
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {parsedData.skills.soft.map((s, i) => (
                      <span key={i} className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-xl text-sm font-bold border border-indigo-100 dark:border-indigo-800 shadow-sm transition-transform hover:scale-105 cursor-default hover:bg-indigo-100 dark:hover:bg-indigo-900/60">{s}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* ROADMAP TIMELINE */}
              <div className="bg-white dark:bg-neutral-900 p-10 rounded-3xl shadow-sm border border-neutral-200 dark:border-neutral-800">
                <h3 className="text-3xl font-black text-neutral-800 dark:text-neutral-100 mb-10 flex items-center gap-3">
                  <Map className="text-sky-500 w-10 h-10" />
                  Your Step-by-Step Roadmap
                </h3>
                
                <div className="relative border-l-4 border-sky-100 dark:border-sky-900/50 ml-4 md:ml-8 space-y-12">
                  {parsedData.roadmap.map((step, idx) => {
                    const isDone = progress[`step_${idx}`];
                    return (
                      <div key={idx} className="relative pl-12 group">
                        <div 
                          className={`absolute -left-[22px] top-1 w-10 h-10 rounded-full border-4 border-white dark:border-neutral-900 flex items-center justify-center transition-all duration-300 cursor-pointer shadow-lg
                            ${isDone ? 'bg-emerald-500 text-white scale-110' : 'bg-sky-100 dark:bg-sky-800 text-sky-600 dark:text-sky-300 hover:bg-sky-200 dark:hover:bg-sky-700 hover:scale-110'}`}
                          onClick={() => toggleStepProgress(idx)}
                        >
                          {isDone ? <CheckCircle2 size={20} /> : <span className="font-bold">{idx + 1}</span>}
                        </div>
                        <div className={`p-8 rounded-3xl border transition-all duration-300 shadow-sm ${isDone ? 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-900/20 shadow-emerald-100 dark:shadow-none' : 'bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 hover:border-sky-300 dark:hover:border-sky-700 hover:shadow-sky-100 dark:hover:shadow-none'}`}>
                          <div className="flex justify-between items-start flex-col sm:flex-row sm:items-center gap-4 mb-4">
                            <h4 className={`text-2xl font-black ${isDone ? 'text-emerald-700 dark:text-emerald-400' : 'text-neutral-800 dark:text-neutral-200'}`}>
                              {step.phase}
                            </h4>
                            <span className="px-4 py-1.5 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 text-sm font-bold rounded-full shadow-sm border border-neutral-200 dark:border-neutral-700 flex items-center gap-2">
                              <Clock size={16} className="text-sky-500" /> {step.time_estimate}
                            </span>
                          </div>
                          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-lg mb-6">
                            {step.description}
                          </p>
                          <button 
                            onClick={() => toggleStepProgress(idx)}
                            className={`flex items-center gap-2 text-sm font-black transition-colors px-4 py-2 rounded-xl bg-white dark:bg-neutral-900 border shadow-sm ${isDone ? 'text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/40' : 'text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:text-sky-600 hover:border-sky-200 hover:bg-sky-50 dark:hover:border-sky-800 dark:hover:bg-sky-900/40'}`}
                          >
                            {isDone ? <CheckSquare size={18} /> : <Square size={18} />}
                            {isDone ? 'Marked as Completed' : 'Mark as Completed'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Projects */}
              <div className="bg-white dark:bg-neutral-900 p-10 rounded-3xl shadow-sm border border-neutral-200 dark:border-neutral-800">
                <h3 className="text-3xl font-black text-neutral-800 dark:text-neutral-100 mb-8 flex items-center gap-3">
                  <Briefcase className="text-sky-500 w-10 h-10" />
                  Projects to Build
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {parsedData.projects.map((proj, idx) => {
                    const isDone = progress[`proj_${idx}`];
                    return (
                      <div key={idx} className={`p-8 rounded-3xl border transition-all duration-300 flex flex-col h-full bg-neutral-50 dark:bg-neutral-800/50 relative overflow-hidden group ${isDone ? 'border-emerald-300 dark:border-emerald-800 shadow-lg shadow-emerald-100 dark:shadow-none bg-emerald-50/50 dark:bg-emerald-900/20' : 'border-neutral-200 dark:border-neutral-700 hover:border-sky-300 hover:shadow-xl hover:shadow-sky-100 dark:hover:shadow-none'}`}>
                        {isDone && <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500 rounded-bl-full opacity-10 blur-xl"></div>}
                        <div className="flex justify-between items-center mb-6 relative z-10">
                          <span className={`text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-sm ${
                            proj.level.toLowerCase().includes('begin') ? 'bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-300 border border-green-200 dark:border-green-800' :
                            proj.level.toLowerCase().includes('inter') ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800' :
                            'bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300 border border-red-200 dark:border-red-800'
                          }`}>
                            {proj.level}
                          </span>
                          <button onClick={() => toggleProgress(`proj_${idx}`)} className={`transition-all duration-300 hover:scale-110 ${isDone ? 'text-emerald-500' : 'text-neutral-300 dark:text-neutral-600 hover:text-sky-500'}`}>
                            {isDone ? <CheckCircle2 size={32} /> : <Circle size={32} />}
                          </button>
                        </div>
                        <h4 className="font-black text-xl text-neutral-800 dark:text-neutral-100 mb-4 relative z-10">{proj.name}</h4>
                        <p className="text-neutral-600 dark:text-neutral-400 text-base leading-relaxed flex-1 relative z-10">{proj.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Resources & Links */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-neutral-900 p-10 rounded-3xl shadow-sm border border-neutral-200 dark:border-neutral-800">
                  <h3 className="text-3xl font-black text-neutral-800 dark:text-neutral-100 mb-8 flex items-center gap-3">
                    <BookOpen className="text-sky-500 w-10 h-10" />
                    Learning Resources
                  </h3>
                  <div className="space-y-8">
                    {Object.entries(parsedData.learning_resources).map(([catKey, items]) => {
                      if (!items || items.length === 0) return null;
                      return (
                        <div key={catKey}>
                          <h4 className="font-bold text-neutral-800 dark:text-neutral-200 capitalize mb-4 flex items-center gap-3 border-b-2 border-neutral-100 dark:border-neutral-800 pb-2 text-lg">
                             <span className="bg-neutral-100 dark:bg-neutral-800 p-2 rounded-lg">{renderSectionIcon(catKey)}</span> {catKey.replace('_', ' ')}
                          </h4>
                          <ul className="space-y-3">
                            {items.map((item, i) => {
                              const isStr = typeof item === 'string';
                              const name = isStr ? item : item.name;
                              const link = isStr ? null : item.link;
                              return (
                                <li key={i} className="flex items-center gap-3 group">
                                  <div className="w-2 h-2 rounded-full bg-sky-400 flex-shrink-0 transition-transform group-hover:scale-150"></div>
                                  {!link ? (
                                    <span className="text-neutral-600 dark:text-neutral-400 font-medium">{name}</span>
                                  ) : (
                                    <a href={link} target="_blank" rel="noopener noreferrer" className="text-neutral-700 dark:text-neutral-300 font-semibold hover:text-sky-600 dark:hover:text-sky-400 hover:underline flex items-center gap-1 transition-colors">
                                      {name} <ExternalLink size={14} className="opacity-50 group-hover:opacity-100" />
                                    </a>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Certifications */}
                  <div className="bg-white dark:bg-neutral-900 p-10 rounded-3xl shadow-sm border border-neutral-200 dark:border-neutral-800">
                    <h3 className="text-3xl font-black text-neutral-800 dark:text-neutral-100 mb-6 flex items-center gap-3">
                      <Award className="text-amber-500 w-10 h-10" />
                      Certifications
                    </h3>
                    <ul className="space-y-4">
                      {parsedData.certifications.map((cert, i) => {
                        const isStr = typeof cert === 'string';
                        const name = isStr ? cert : cert.name;
                        const link = isStr ? null : cert.link;
                        return (
                          <li key={i} className="flex items-center gap-4 bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-700 hover:border-amber-300 dark:hover:border-amber-700 transition-all hover:shadow-md group">
                             <div className="bg-white dark:bg-neutral-900 p-2 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-800 group-hover:scale-110 transition-transform">
                               <Award className="text-amber-500 flex-shrink-0" size={24} />
                             </div>
                             {!link ? (
                                <span className="text-neutral-700 dark:text-neutral-300 font-bold flex-1 truncate">
                                  {name}
                                </span>
                             ) : (
                                <a href={link} target="_blank" rel="noopener noreferrer" className="text-neutral-700 dark:text-neutral-300 font-bold hover:text-amber-600 dark:hover:text-amber-400 flex-1 truncate transition-colors flex items-center justify-between">
                                  {name}
                                  <ExternalLink size={18} className="text-neutral-400 group-hover:text-amber-500 transition-colors" />
                                </a>
                             )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Job Prep */}
                  <div className="bg-white dark:bg-neutral-900 p-10 rounded-3xl shadow-sm border border-neutral-200 dark:border-neutral-800">
                    <h3 className="text-3xl font-black text-neutral-800 dark:text-neutral-100 mb-6 flex items-center gap-3">
                      <TrendingUp className="text-sky-500 w-10 h-10" />
                      Job Preparation
                    </h3>
                    <div className="space-y-6">
                      {Object.entries(parsedData.job_preparation).map(([key, tips]) => (
                        <div key={key} className="bg-neutral-50 dark:bg-neutral-800/50 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-700">
                          <h4 className="font-black text-neutral-800 dark:text-neutral-200 capitalize text-lg mb-3 flex items-center gap-2">
                             <div className="w-1.5 h-6 bg-sky-500 rounded-full"></div> {key.replace('_', ' ')}
                          </h4>
                          <ul className="list-disc list-inside space-y-2 text-base text-neutral-600 dark:text-neutral-400 font-medium">
                            {tips.map((tip, i) => <li key={i}>{tip}</li>)}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Industry Trends */}
                  <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 dark:from-neutral-950 dark:to-neutral-900 p-10 rounded-3xl shadow-xl border border-neutral-800 dark:border-neutral-800 text-white relative overflow-hidden">
                    <div className="absolute right-0 bottom-0 opacity-10"><TrendingUp size={150} /></div>
                    <h3 className="text-3xl font-black mb-6 flex items-center gap-3 relative z-10">
                      <Star className="text-amber-400 w-8 h-8" />
                      Industry Trends
                    </h3>
                    
                    <div className="space-y-6 relative z-10">
                      <div>
                        <h4 className="text-neutral-400 font-bold uppercase tracking-wider text-sm mb-2">Trending Tools</h4>
                        <div className="flex flex-wrap gap-2">
                          {parsedData.industry_trends.trending_tools.map((t, i) => <span key={i} className="bg-white/10 px-3 py-1 rounded-lg text-sm">{t}</span>)}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-neutral-400 font-bold uppercase tracking-wider text-sm mb-2">New Technologies</h4>
                        <div className="flex flex-wrap gap-2">
                          {parsedData.industry_trends.new_technologies.map((t, i) => <span key={i} className="bg-white/10 px-3 py-1 rounded-lg text-sm font-medium">{t}</span>)}
                        </div>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <h4 className="text-sky-300 font-bold uppercase tracking-wider text-xs mb-1">Market Demand</h4>
                        <p className="text-sm leading-relaxed">{parsedData.industry_trends.market_demand}</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Master Completion & CTA */}
              <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 dark:from-neutral-950 dark:to-neutral-900 p-12 rounded-3xl shadow-2xl text-white text-center relative overflow-hidden mt-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5"><Crown size={400} /></div>
                
                <h3 className="text-4xl font-black mb-6 relative z-10 flex items-center justify-center gap-4">
                  <Crown className="text-amber-400 w-12 h-12" /> Complete This Domain
                </h3>
                
                <p className="text-neutral-300 text-xl mb-10 max-w-2xl mx-auto relative z-10 leading-relaxed font-medium">
                  Ready to claim mastery over this entire learning path? By clicking below, you mark all roadmap phases and projects as successfully completed.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
                  <button 
                    onClick={toggleMaster}
                    className={`flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-bold transition-all duration-300 text-lg shadow-lg w-full sm:w-auto ${progressPercent === 100 ? 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 hover:border-neutral-600' : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white border-none shadow-emerald-500/20'}`}
                  >
                    {progressPercent === 100 ? <Square size={24} /> : <CheckSquare size={24} />}
                    {progressPercent === 100 ? "Unmaster All Topics" : "Master All Topics"}
                  </button>

                  <button 
                    onClick={() => nav('/tutor')}
                    className="flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-black bg-white text-indigo-600 hover:bg-neutral-100 transition-all duration-300 text-lg shadow-xl shadow-white/10 w-full sm:w-auto hover:scale-105"
                  >
                    Start Learning with LuminaTutor <ArrowRight size={24} />
                  </button>
                </div>
              </div>

            </div>
          )}
        </main>
      </div>
    </div>
  );
}
