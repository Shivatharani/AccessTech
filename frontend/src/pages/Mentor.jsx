import { useState, useEffect, useContext } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { useTranslation } from "react-i18next";
import {
  User, History as HistoryIcon, Clock, Menu, X, ArrowLeft, Map, Target, TrendingUp,
  Star, Code, ThumbsUp, ChevronRight, CheckCircle2, PlayCircle, BookOpen, ExternalLink,
  Award, Sparkles, Brain, Rocket, Lightbulb, Shield, Medal, Trophy, Crown, CheckSquare,
  Square, Plus, Briefcase, Circle, ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Mentor() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [goal, setGoal] = useState("");
  const [rawResponse, setRawResponse] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [history, setHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [progress, setProgress] = useState({});
  const { user: email, language: lang, level: lvl } = useContext(AuthContext);

  useEffect(() => {
    if (email !== "User") fetchHistory();
  }, [email]);

  useEffect(() => {
    if (goal) {
      const savedProgress = localStorage.getItem(`pathpilot_progress_${email}_${goal}`);
      if (savedProgress) {
        try { setProgress(JSON.parse(savedProgress)); } catch (e) { console.error(e); }
      } else setProgress({});
    }
  }, [goal, parsedData, email]);

  const toggleProgress = (key) => {
    const newProg = { ...progress, [key]: !progress[key] };
    setProgress(newProg);
    localStorage.setItem(`pathpilot_progress_${email}_${goal}`, JSON.stringify(newProg));
  };

  const toggleStepProgress = (idx) => {
    if (!progress[`step_${idx}`]) {
      if (idx > 0 && !progress[`step_${idx - 1}`]) { toast.error(t('complete_phase_error', { idx })); return; }
    } else {
      if (idx < parsedData.roadmap.length - 1 && progress[`step_${idx + 1}`]) { toast.error(t('uncheck_phase_error', { idx: idx + 2 })); return; }
    }
    toggleProgress(`step_${idx}`);
  };

  const toggleMaster = () => {
    const isMastered = progressPercent === 100;
    const newProg = { ...progress };
    if (parsedData) {
      parsedData.roadmap.forEach((_, i) => newProg[`step_${i}`] = !isMastered);
      parsedData.projects.forEach((_, i) => newProg[`proj_${i}`] = !isMastered);
    }
    setProgress(newProg);
    localStorage.setItem(`pathpilot_progress_${email}_${goal}`, JSON.stringify(newProg));
    if (!isMastered) toast.success(t('domain_mastered'));
  };

  const fetchHistory = async () => {
    try {
      const res = await API.get(`/ai/history?email=${email}`);
      setHistory(res.data.history.filter(h => h.question.startsWith('Mentor: ')).reverse());
    } catch (err) { console.error("Failed to fetch history", err); }
  };

  const processResponse = (respText) => {
    setRawResponse(respText);
    try {
      let jsonStr = respText;
      if (respText.includes('```json')) jsonStr = respText.split('```json')[1].split('```')[0];
      else if (respText.includes('```')) jsonStr = respText.split('```')[1].split('```')[0];
      setParsedData(JSON.parse(jsonStr.trim()));
    } catch { setParsedData(null); }
  };

  const askMentor = async () => {
    if (!goal) { toast.error(t('career_goal_prompt')); return; }
    const tid = toast.loading(t('generating_roadmap'));
    try {
      const res = await API.post("/ai/mentor", { email, goal, language: lang, level: lvl });
      if (res.data.error) { toast.error(res.data.error, { id: tid }); return; }
      processResponse(res.data.response);
      toast.success(t('roadmap_success'), { id: tid });
      fetchHistory();
    } catch (err) { toast.error(t('send_error'), { id: tid }); }
  };

  const renderSectionIcon = (title) => {
    const tLower = title.toLowerCase();
    if (tLower.includes('youtube') || tLower.includes('video')) return <PlayCircle className="w-4 h-4 text-red-500" />;
    if (tLower.includes('book')) return <BookOpen className="w-4 h-4 text-amber-500" />;
    if (tLower.includes('practice')) return <Code className="w-4 h-4 text-emerald-500" />;
    return <Star className="w-4 h-4 text-sky-500" />;
  };

  const totalItems = parsedData ? (parsedData.roadmap.length + parsedData.projects.length) : 0;
  const completedItems = totalItems > 0 ? Object.keys(progress).filter(k => (k.startsWith('step_') || k.startsWith('proj_')) && progress[k]).length : 0;
  const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const getBadgeInfo = () => {
    if (progressPercent === 0) return { title: t('apprentice'), icon: <Shield className="w-7 h-7 text-gray-400" />, style: "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300" };
    if (progressPercent < 50) return { title: t('bronze_scholar'), icon: <Medal className="w-7 h-7 text-amber-600" />, style: "bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-300" };
    if (progressPercent < 90) return { title: t('silver_specialist'), icon: <Award className="w-7 h-7 text-slate-500" />, style: "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300" };
    if (progressPercent < 100) return { title: t('gold_expert'), icon: <Trophy className="w-7 h-7 text-yellow-500" />, style: "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700 text-yellow-800 dark:text-yellow-300" };
    return { title: t('domain_master'), icon: <Crown className="w-7 h-7 text-violet-500" />, style: "bg-violet-50 dark:bg-violet-900/30 border-violet-200 dark:border-violet-700 text-violet-800 dark:text-violet-300" };
  };

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
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-sky-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
                <Target size={18} className="text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{email}</p>
                <div className="flex gap-1.5 mt-1">
                  <span className="px-2 py-0.5 bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 text-[10px] font-black uppercase tracking-wide rounded-md">{lang}</span>
                  <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-[10px] font-black uppercase tracking-wide rounded-md">{lvl}</span>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
          </div>

          <div className="p-4 border-b border-gray-100 dark:border-white/5">
            <button
              onClick={() => { setGoal(""); setRawResponse(null); setParsedData(null); setSidebarOpen(false); }}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-sky-600 text-white py-2.5 rounded-xl font-bold text-sm shadow-lg active:scale-95"
            >
              <Plus size={16} /> {t('new_chat')}
            </button>
          </div>

          <div className="p-4 flex-1 overflow-y-auto">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
              <HistoryIcon size={14} /> {t('mentor_history')}
            </div>
            {history.length === 0 ? (
              <p className="text-xs text-gray-400 dark:text-gray-600 italic text-center py-6">{t('no_paths')}</p>
            ) : history.map((item, idx) => (
              <button key={idx}
                className="w-full text-left p-3 rounded-xl bg-gray-50 dark:bg-white/3 border border-gray-100 dark:border-white/5 hover:bg-sky-50 dark:hover:bg-sky-900/20 hover:border-sky-200 dark:hover:border-sky-800 transition-all mb-2 group"
                onClick={() => { setGoal(item.question.replace('Mentor: ', '')); processResponse(item.response); setSidebarOpen(false); }}
              >
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 line-clamp-2 group-hover:text-sky-700 dark:group-hover:text-sky-300 transition-colors">
                  {item.question.replace('Mentor: ', '')}
                </p>
                <div className="flex items-center gap-1 mt-1.5 text-[10px] text-gray-400 uppercase tracking-wider">
                  <Clock size={10} /> {t('past_session')}
                </div>
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-1 p-6 md:p-10 overflow-y-auto h-[calc(100vh-64px)] w-full">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8 max-w-5xl mx-auto">
            <button onClick={() => nav(-1)} className="p-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-500 hover:text-sky-600 dark:hover:text-sky-400 hover:border-sky-300 dark:hover:border-sky-700 transition-all shadow-sm">
              <ArrowLeft size={18} />
            </button>
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-500 shadow-sm">
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-600 flex items-center justify-center shadow-lg shadow-sky-500/25">
                <Map className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{t('pathpilot')}</h1>
            </div>
          </div>

          {/* Goal Input */}
          <div className={`${card} p-7 mb-8 max-w-5xl mx-auto`}>
            <p className="text-sm font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4 flex items-center gap-2">
              <Briefcase size={14} /> {t('career_goal_prompt')}
            </p>
            <div className="flex gap-3 flex-col sm:flex-row">
              <input
                className="flex-1 px-5 py-4 rounded-2xl border-2 border-gray-200 dark:border-white/8 bg-gray-50 dark:bg-white/3 text-gray-900 dark:text-white outline-none focus:border-sky-400 dark:focus:border-sky-600 focus:ring-2 focus:ring-sky-400/20 dark:focus:ring-sky-600/20 transition-all text-base font-medium"
                placeholder={t('career_goal_placeholder')}
                value={goal}
                onChange={e => setGoal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && askMentor()}
              />
              <Button
                onClick={askMentor}
                className="bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-600 hover:to-sky-700 text-white px-8 h-14 rounded-2xl font-bold shadow-lg shadow-sky-500/25 transition-all text-base whitespace-nowrap"
              >
                {t('map_path')}
              </Button>
            </div>
          </div>

          {rawResponse && !parsedData && (
            <div className={`${card} p-8 max-w-5xl mx-auto`}>
              <h2 className="font-black text-xl mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                <Target className="text-sky-500" /> {t('custom_roadmap')}
              </h2>
              <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                {rawResponse}
              </div>
            </div>
          )}

          {parsedData && (
            <div className="max-w-5xl mx-auto space-y-7 animate-in fade-in slide-in-from-bottom-8 duration-700">

              {/* Progress Card */}
              <div className={`${card} p-7 flex flex-col md:flex-row items-center gap-7`}>
                <div className="flex-1 w-full">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Target className="text-sky-500" size={20} />
                    {t('overall_completion')}: <span className="text-sky-600 dark:text-sky-400">{progressPercent}%</span>
                  </h3>
                  <div className="w-full h-3 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-sky-600 transition-all duration-1000 ease-out rounded-full" style={{ width: `${progressPercent}%` }} />
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-semibold">
                    {completedItems} {t('of')} {totalItems} {t('milestones_achieved')}
                  </p>
                </div>
                <div className={`p-5 rounded-2xl border-2 flex flex-col items-center justify-center min-w-[180px] ${getBadgeInfo().style}`}>
                  <div className="mb-2 p-3 rounded-xl bg-white/50 dark:bg-black/20">{getBadgeInfo().icon}</div>
                  <span className="font-black text-xs tracking-wider uppercase text-center">{getBadgeInfo().title}</span>
                </div>
              </div>

              {/* Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="md:col-span-2 bg-gradient-to-br from-cyan-500 to-sky-600 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
                  <div className="absolute -right-10 -top-10 opacity-10"><Target size={200} /></div>
                  <h2 className="text-3xl font-black mb-3 relative z-10">{parsedData.overview.role}</h2>
                  <p className="text-sky-100 mb-6 relative z-10 font-medium leading-relaxed">{parsedData.overview.daily_tasks}</p>
                  <div className="grid grid-cols-2 gap-3 relative z-10">
                    <div className="bg-white/15 p-4 rounded-2xl backdrop-blur-sm border border-white/20">
                      <div className="text-sky-200 text-xs font-black uppercase tracking-wider mb-1 flex items-center gap-1"><TrendingUp size={12} /> {t('salary_range')}</div>
                      <div className="font-bold">{parsedData.overview.salary_range}</div>
                    </div>
                    <div className="bg-white/15 p-4 rounded-2xl backdrop-blur-sm border border-white/20">
                      <div className="text-sky-200 text-xs font-black uppercase tracking-wider mb-1 flex items-center gap-1"><Star size={12} /> {t('future_demand')}</div>
                      <div className="font-bold">{parsedData.overview.future_demand}</div>
                    </div>
                  </div>
                </div>
                <div className={`${card} p-7 flex flex-col justify-center`}>
                  <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2 text-sm">
                    <ThumbsUp className="text-sky-500" size={18} /> {t('message_for_you')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 italic font-medium leading-relaxed text-sm">"{parsedData.motivation}"</p>
                </div>
              </div>

              {/* Skills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { title: t('technical_skills'), data: parsedData.skills.technical, color: "sky", Icon: Code },
                  { title: t('soft_skills'), data: parsedData.skills.soft, color: "violet", Icon: User },
                ].map(({ title, data, color, Icon }) => (
                  <div key={title} className={`${card} p-7`}>
                    <h3 className={`text-base font-black text-gray-900 dark:text-white mb-5 border-b border-gray-100 dark:border-white/5 pb-3 flex items-center gap-2`}>
                      <Icon className={`text-${color}-500`} size={18} /> {title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {data.map((s, i) => (
                        <span key={i} className={`px-3 py-1.5 bg-${color}-50 dark:bg-${color}-900/30 text-${color}-700 dark:text-${color}-300 rounded-xl text-sm font-bold border border-${color}-100 dark:border-${color}-800 hover:scale-105 transition-transform cursor-default`}>{s}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Roadmap */}
              <div className={`${card} p-8`}>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                  <Map className="text-sky-500" size={28} /> {t('step_by_step_roadmap')}
                </h3>
                <div className="relative border-l-4 border-sky-100 dark:border-sky-900/30 ml-5 space-y-8">
                  {parsedData.roadmap.map((step, idx) => {
                    const isDone = progress[`step_${idx}`];
                    return (
                      <div key={idx} className="relative pl-10">
                        <div
                          className={`absolute -left-[22px] top-1 w-10 h-10 rounded-full border-4 border-white dark:border-[#0d0d1a] flex items-center justify-center transition-all duration-300 cursor-pointer shadow-lg ${isDone ? 'bg-emerald-500 text-white scale-110 shadow-emerald-500/30' : 'bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400 hover:bg-sky-200 dark:hover:bg-sky-800 hover:scale-110'}`}
                          onClick={() => toggleStepProgress(idx)}
                        >
                          {isDone ? <CheckCircle2 size={18} /> : <span className="font-black text-sm">{idx + 1}</span>}
                        </div>
                        <div className={`p-6 rounded-2xl border transition-all duration-300 ${isDone ? 'border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/50 dark:bg-emerald-900/10' : 'bg-gray-50 dark:bg-white/3 border-gray-200 dark:border-white/8 hover:border-sky-300 dark:hover:border-sky-700/40'}`}>
                          <div className="flex justify-between items-start flex-wrap gap-3 mb-3">
                            <h4 className={`text-lg font-black ${isDone ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>{step.phase}</h4>
                            <span className="px-3 py-1 bg-white dark:bg-black/20 text-gray-600 dark:text-gray-300 text-xs font-bold rounded-xl border border-gray-200 dark:border-white/10 flex items-center gap-1.5">
                              <Clock size={12} className="text-sky-500" /> {step.time_estimate}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4 text-sm">{step.description}</p>
                          <button
                            onClick={() => toggleStepProgress(idx)}
                            className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl border transition-all ${isDone ? 'text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30' : 'text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 hover:text-sky-600 hover:border-sky-300 dark:hover:border-sky-700'}`}
                          >
                            {isDone ? <CheckSquare size={16} /> : <Square size={16} />}
                            {isDone ? t('marked_completed') : t('mark_completed')}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Projects */}
              <div className={`${card} p-8`}>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <Briefcase className="text-sky-500" size={28} /> {t('projects_to_build')}
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  {parsedData.projects.map((proj, idx) => {
                    const isDone = progress[`proj_${idx}`];
                    return (
                      <div key={idx} className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col ${isDone ? 'border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/40 dark:bg-emerald-900/10' : 'bg-gray-50 dark:bg-white/3 border-gray-200 dark:border-white/8 hover:border-sky-300 dark:hover:border-sky-700/40 hover:shadow-lg'}`}>
                        <div className="flex justify-between items-center mb-4">
                          <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg ${proj.level?.toLowerCase().includes('begin') ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : proj.level?.toLowerCase().includes('inter') ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'}`}>
                            {proj.level}
                          </span>
                          <button onClick={() => toggleProgress(`proj_${idx}`)} className={`transition-all hover:scale-110 ${isDone ? 'text-emerald-500' : 'text-gray-300 dark:text-gray-600 hover:text-sky-500'}`}>
                            {isDone ? <CheckCircle2 size={28} /> : <Circle size={28} />}
                          </button>
                        </div>
                        <h4 className="font-black text-lg text-gray-900 dark:text-white mb-2">{proj.name}</h4>
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed flex-1">{proj.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Resources */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                <div className={`${card} p-8`}>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <BookOpen className="text-sky-500" size={22} /> {t('learning_resources')}
                  </h3>
                  <div className="space-y-6">
                    {Object.entries(parsedData.learning_resources).map(([catKey, items]) => {
                      if (!items?.length) return null;
                      return (
                        <div key={catKey}>
                          <h4 className="font-black text-gray-700 dark:text-gray-300 capitalize mb-3 flex items-center gap-2 text-sm border-b border-gray-100 dark:border-white/5 pb-2">
                            {renderSectionIcon(catKey)} {catKey.replace('_', ' ')}
                          </h4>
                          <ul className="space-y-2">
                            {items.map((item, i) => {
                              const isStr = typeof item === 'string';
                              const name = isStr ? item : item.name;
                              const link = isStr ? null : item.link;
                              return (
                                <li key={i} className="flex items-center gap-2 group">
                                  <div className="w-1.5 h-1.5 rounded-full bg-sky-400 flex-shrink-0" />
                                  {!link ? <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">{name}</span> : (
                                    <a href={link} target="_blank" rel="noopener noreferrer" className="text-gray-700 dark:text-gray-300 text-sm font-semibold hover:text-sky-600 dark:hover:text-sky-400 flex items-center gap-1 transition-colors">
                                      {name} <ExternalLink size={12} className="opacity-50 group-hover:opacity-100" />
                                    </a>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Certifications */}
                  <div className={`${card} p-7`}>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                      <Award className="text-amber-500" size={22} /> {t('certifications')}
                    </h3>
                    <ul className="space-y-3">
                      {parsedData.certifications.map((cert, i) => {
                        const isStr = typeof cert === 'string'; const name = isStr ? cert : cert.name; const link = isStr ? null : cert.link;
                        return (
                          <li key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/3 border border-gray-100 dark:border-white/5 hover:border-amber-200 dark:hover:border-amber-800 transition-all group">
                            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                              <Award className="text-amber-500" size={16} />
                            </div>
                            {!link ? <span className="text-gray-700 dark:text-gray-300 font-bold text-sm flex-1 truncate">{name}</span> : (
                              <a href={link} target="_blank" rel="noopener noreferrer" className="text-gray-700 dark:text-gray-300 font-bold text-sm hover:text-amber-600 dark:hover:text-amber-400 flex-1 truncate transition-colors">
                                {name}
                              </a>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Industry Trends */}
                  <div className="bg-gray-900 dark:bg-[#0a0a14] border border-white/5 rounded-3xl p-7 text-white relative overflow-hidden">
                    <div className="absolute right-0 bottom-0 opacity-10"><TrendingUp size={120} /></div>
                    <h3 className="text-lg font-black mb-5 flex items-center gap-2 relative z-10">
                      <Star className="text-amber-400" size={20} /> {t('industry_trends')}
                    </h3>
                    <div className="space-y-4 relative z-10">
                      <div>
                        <h4 className="text-gray-500 font-black text-[10px] uppercase tracking-widest mb-2">{t('trending_tools')}</h4>
                        <div className="flex flex-wrap gap-2">
                          {parsedData.industry_trends.trending_tools.map((t, i) => <span key={i} className="bg-white/8 border border-white/10 px-3 py-1 rounded-lg text-xs font-medium">{t}</span>)}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-gray-500 font-black text-[10px] uppercase tracking-widest mb-2">{t('new_technologies')}</h4>
                        <div className="flex flex-wrap gap-2">
                          {parsedData.industry_trends.new_technologies.map((t, i) => <span key={i} className="bg-white/8 border border-white/10 px-3 py-1 rounded-lg text-xs font-medium">{t}</span>)}
                        </div>
                      </div>
                      <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                        <h4 className="text-sky-400 font-black text-[10px] uppercase tracking-widest mb-1">{t('market_demand')}</h4>
                        <p className="text-sm leading-relaxed text-gray-300">{parsedData.industry_trends.market_demand}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Master CTA */}
              <div className="bg-gray-900 dark:bg-[#0a0a14] border border-white/5 rounded-3xl p-10 text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03]"><Crown size={400} /></div>
                <Crown className="text-amber-400 w-10 h-10 mx-auto mb-4" />
                <h3 className="text-3xl font-black mb-3">{t('complete_domain')}</h3>
                <p className="text-gray-400 mb-8 max-w-xl mx-auto font-medium leading-relaxed">{t('mastery_desc')}</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={toggleMaster}
                    className={`flex items-center gap-2 px-7 py-4 rounded-2xl font-bold text-sm transition-all ${progressPercent === 100 ? 'bg-white/10 hover:bg-white/15 border border-white/10' : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/20'}`}
                  >
                    {progressPercent === 100 ? <Square size={18} /> : <CheckSquare size={18} />}
                    {progressPercent === 100 ? t('unmaster_all') : t('master_all')}
                  </button>
                  <button
                    onClick={() => nav('/tutor')}
                    className="flex items-center gap-2 px-7 py-4 rounded-2xl font-black text-sm bg-white text-gray-900 hover:bg-gray-100 transition-all shadow-xl hover:scale-105"
                  >
                    {t('start_learning_tutor')} <ArrowRight size={18} />
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