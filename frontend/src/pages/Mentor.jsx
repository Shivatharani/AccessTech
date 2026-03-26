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

  useEffect(() => { if (email !== "User") fetchHistory(); }, [email]);
  useEffect(() => {
    if (goal) {
      const savedProgress = localStorage.getItem(`pathpilot_progress_${email}_${goal}`);
      if (savedProgress) { try { setProgress(JSON.parse(savedProgress)); } catch (e) { console.error(e); } }
      else setProgress({});
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
      toast.success(t('roadmap_success'), { id: tid }); fetchHistory();
    } catch (err) { toast.error(t('send_error'), { id: tid }); }
  };

  const renderSectionIcon = (title) => {
    const tLower = title.toLowerCase();
    if (tLower.includes('youtube') || tLower.includes('video')) return <PlayCircle className="w-4 h-4" style={{ color: '#e53935' }} />;
    if (tLower.includes('book')) return <BookOpen className="w-4 h-4" style={{ color: '#f57f17' }} />;
    if (tLower.includes('practice')) return <Code className="w-4 h-4" style={{ color: '#2e7d32' }} />;
    return <Star className="w-4 h-4" style={{ color: '#0288d1' }} />;
  };

  const totalItems = parsedData ? (parsedData.roadmap.length + parsedData.projects.length) : 0;
  const completedItems = totalItems > 0 ? Object.keys(progress).filter(k => (k.startsWith('step_') || k.startsWith('proj_')) && progress[k]).length : 0;
  const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const getBadgeInfo = () => {
    if (progressPercent === 0) return { title: t('apprentice'), icon: <Shield className="w-7 h-7" style={{ color: '#9e9e9e' }} />, bg: '#fafafa', border: '#e0e0e0', color: '#616161' };
    if (progressPercent < 50) return { title: t('bronze_scholar'), icon: <Medal className="w-7 h-7" style={{ color: '#bf8040' }} />, bg: '#fff8e1', border: '#ffe0b2', color: '#6d4c00' };
    if (progressPercent < 90) return { title: t('silver_specialist'), icon: <Award className="w-7 h-7" style={{ color: '#607d8b' }} />, bg: '#eceff1', border: '#cfd8dc', color: '#37474f' };
    if (progressPercent < 100) return { title: t('gold_expert'), icon: <Trophy className="w-7 h-7" style={{ color: '#fbc02d' }} />, bg: '#fffde7', border: '#fff9c4', color: '#f57f17' };
    return { title: t('domain_master'), icon: <Crown className="w-7 h-7" style={{ color: '#6a1b9a' }} />, bg: '#f3e5f5', border: '#e1bee7', color: '#4a148c' };
  };

  const accent = '#0288d1';
  const accentLight = '#e1f5fe';
  const border = '#b3e5fc';
  const text = '#01579b';
  const bg = '#f0fbff';

  const card = { backgroundColor: 'white', border: '1px solid #e0e0e0', borderRadius: '1.5rem' };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#e1f5fe' }}>
      <Navbar />
      <div className="flex flex-1 overflow-hidden relative">
        {sidebarOpen && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

        {/* Sidebar */}
        <aside className={`fixed md:relative z-50 w-72 flex flex-col h-[calc(100vh-64px)] overflow-y-auto transition-transform duration-300 border-r ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
          style={{ backgroundColor: bg, borderColor: border }}>
          <div className="p-5 border-b" style={{ borderColor: border }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ background: 'linear-gradient(135deg, #81d4fa, #0288d1)' }}>
                <Target size={18} className="text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm truncate" style={{ color: text }}>{email}</p>
                <div className="flex gap-1.5 mt-1">
                  <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wide rounded-md" style={{ backgroundColor: accentLight, color: accent }}>{lang}</span>
                  <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wide rounded-md" style={{ backgroundColor: '#fff8e1', color: '#f57f17' }}>{lvl}</span>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="md:hidden" style={{ color: '#81d4fa' }}><X size={18} /></button>
            </div>
          </div>

          <div className="p-4 border-b" style={{ borderColor: border }}>
            <button onClick={() => { setGoal(""); setRawResponse(null); setParsedData(null); setSidebarOpen(false); }}
              className="w-full flex items-center justify-center gap-2 text-white py-2.5 rounded-xl font-bold text-sm shadow-lg"
              style={{ background: 'linear-gradient(135deg, #81d4fa, #0288d1)' }}>
              <Plus size={16} /> {t('new_chat')}
            </button>
          </div>

          <div className="p-4 flex-1 overflow-y-auto">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#81d4fa' }}>
              <HistoryIcon size={14} /> {t('mentor_history')}
            </div>
            {history.length === 0 ? (
              <p className="text-xs italic text-center py-6" style={{ color: '#81d4fa' }}>{t('no_paths')}</p>
            ) : history.map((item, idx) => (
              <button key={idx}
                className="w-full text-left p-3 rounded-xl border transition-all mb-2"
                style={{ backgroundColor: accentLight, borderColor: border }}
                onClick={() => { setGoal(item.question.replace('Mentor: ', '')); processResponse(item.response); setSidebarOpen(false); }}>
                <p className="text-sm font-semibold line-clamp-2" style={{ color: text }}>
                  {item.question.replace('Mentor: ', '')}
                </p>
                <div className="flex items-center gap-1 mt-1.5 text-[10px] uppercase tracking-wider" style={{ color: '#81d4fa' }}>
                  <Clock size={10} /> {t('past_session')}
                </div>
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-1 p-6 md:p-10 overflow-y-auto h-[calc(100vh-64px)] w-full">
          <div className="flex items-center gap-4 mb-8 max-w-5xl mx-auto">
            <button onClick={() => nav(-1)} className="p-2.5 rounded-xl border shadow-sm transition-all"
              style={{ backgroundColor: 'white', borderColor: border, color: '#81d4fa' }}>
              <ArrowLeft size={18} />
            </button>
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2.5 rounded-xl border shadow-sm"
              style={{ backgroundColor: 'white', borderColor: border }}>
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                style={{ background: 'linear-gradient(135deg, #81d4fa, #0288d1)' }}>
                <Map className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-black tracking-tight" style={{ color: text }}>{t('pathpilot')}</h1>
            </div>
          </div>

          {/* Goal Input */}
          <div className="p-7 mb-8 max-w-5xl mx-auto rounded-3xl border shadow-sm" style={{ backgroundColor: 'white', borderColor: '#e0e0e0' }}>
            <p className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: '#81d4fa' }}>
              <Briefcase size={14} /> {t('career_goal_prompt')}
            </p>
            <div className="flex gap-3 flex-col sm:flex-row">
              <input
                className="flex-1 px-5 py-4 rounded-2xl border-2 outline-none transition-all text-base font-medium focus:ring-2"
                style={{ borderColor: border, backgroundColor: accentLight, color: text }}
                placeholder={t('career_goal_placeholder')}
                value={goal}
                onChange={e => setGoal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && askMentor()}
              />
              <button onClick={askMentor}
                className="text-white px-8 h-14 rounded-2xl font-bold shadow-lg transition-all text-base whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg, #81d4fa, #0288d1)' }}>
                {t('map_path')}
              </button>
            </div>
          </div>

          {rawResponse && !parsedData && (
            <div className="p-8 max-w-5xl mx-auto rounded-3xl border shadow-sm" style={{ backgroundColor: 'white', borderColor: '#e0e0e0' }}>
              <h2 className="font-black text-xl mb-4 flex items-center gap-2" style={{ color: text }}>
                <Target style={{ color: accent }} /> {t('custom_roadmap')}
              </h2>
              <div className="prose max-w-none whitespace-pre-wrap leading-relaxed" style={{ color: '#424242' }}>
                {rawResponse}
              </div>
            </div>
          )}

          {parsedData && (
            <div className="max-w-5xl mx-auto space-y-7 animate-in fade-in slide-in-from-bottom-8 duration-700">

              {/* Progress Card */}
              <div className="p-7 flex flex-col md:flex-row items-center gap-7 rounded-3xl border shadow-sm" style={{ backgroundColor: 'white', borderColor: '#e0e0e0' }}>
                <div className="flex-1 w-full">
                  <h3 className="text-lg font-black mb-3 flex items-center gap-2" style={{ color: text }}>
                    <Target style={{ color: accent }} size={20} />
                    {t('overall_completion')}: <span style={{ color: accent }}>{progressPercent}%</span>
                  </h3>
                  <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: accentLight }}>
                    <div className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${progressPercent}%`, background: 'linear-gradient(90deg, #81d4fa, #0288d1)' }} />
                  </div>
                  <p className="mt-2 text-sm font-semibold" style={{ color: '#81d4fa' }}>
                    {completedItems} {t('of')} {totalItems} {t('milestones_achieved')}
                  </p>
                </div>
                <div className="p-5 rounded-2xl border-2 flex flex-col items-center justify-center min-w-[180px]"
                  style={{ backgroundColor: getBadgeInfo().bg, borderColor: getBadgeInfo().border }}>
                  <div className="mb-2 p-3 rounded-xl bg-white/60">{getBadgeInfo().icon}</div>
                  <span className="font-black text-xs tracking-wider uppercase text-center" style={{ color: getBadgeInfo().color }}>{getBadgeInfo().title}</span>
                </div>
              </div>

              {/* Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="md:col-span-2 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #81d4fa, #0288d1)' }}>
                  <div className="absolute -right-10 -top-10 opacity-10"><Target size={200} /></div>
                  <h2 className="text-3xl font-black mb-3 relative z-10">{parsedData.overview.role}</h2>
                  <p className="text-sky-100 mb-6 relative z-10 font-medium leading-relaxed">{parsedData.overview.daily_tasks}</p>
                  <div className="grid grid-cols-2 gap-3 relative z-10">
                    <div className="bg-white/15 p-4 rounded-2xl border border-white/20">
                      <div className="text-sky-200 text-xs font-black uppercase tracking-wider mb-1 flex items-center gap-1"><TrendingUp size={12} /> {t('salary_range')}</div>
                      <div className="font-bold">{parsedData.overview.salary_range}</div>
                    </div>
                    <div className="bg-white/15 p-4 rounded-2xl border border-white/20">
                      <div className="text-sky-200 text-xs font-black uppercase tracking-wider mb-1 flex items-center gap-1"><Star size={12} /> {t('future_demand')}</div>
                      <div className="font-bold">{parsedData.overview.future_demand}</div>
                    </div>
                  </div>
                </div>
                <div className="p-7 flex flex-col justify-center rounded-3xl border shadow-sm" style={{ backgroundColor: 'white', borderColor: '#e0e0e0' }}>
                  <h3 className="font-bold mb-4 flex items-center gap-2 text-sm" style={{ color: '#9e9e9e' }}>
                    <ThumbsUp style={{ color: accent }} size={18} /> {t('message_for_you')}
                  </h3>
                  <p className="italic font-medium leading-relaxed text-sm border-l-4 pl-4" style={{ color: '#616161', borderColor: border }}>"{parsedData.motivation}"</p>
                </div>
              </div>

              {/* Skills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { title: t('technical_skills'), data: parsedData.skills.technical, color: '#0288d1', bg: '#e1f5fe', Icon: Code },
                  { title: t('soft_skills'), data: parsedData.skills.soft, color: '#7b1fa2', bg: '#f3e5f5', Icon: User },
                ].map(({ title, data, color, bg: skillBg, Icon }) => (
                  <div key={title} className="p-7 rounded-3xl border shadow-sm" style={{ backgroundColor: 'white', borderColor: '#e0e0e0' }}>
                    <h3 className="text-base font-black mb-5 pb-3 border-b flex items-center gap-2" style={{ color: text, borderColor: '#f5f5f5' }}>
                      <Icon style={{ color }} size={18} /> {title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {data.map((s, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-xl text-sm font-bold border hover:scale-105 transition-transform cursor-default"
                          style={{ backgroundColor: skillBg, color, border: `1px solid ${color}30` }}>{s}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Roadmap */}
              <div className="p-8 rounded-3xl border shadow-sm" style={{ backgroundColor: 'white', borderColor: '#e0e0e0' }}>
                <h3 className="text-2xl font-black mb-8 flex items-center gap-3" style={{ color: text }}>
                  <Map style={{ color: accent }} size={28} /> {t('step_by_step_roadmap')}
                </h3>
                <div className="relative ml-5 space-y-8" style={{ borderLeft: '4px solid #e1f5fe' }}>
                  {parsedData.roadmap.map((step, idx) => {
                    const isDone = progress[`step_${idx}`];
                    return (
                      <div key={idx} className="relative pl-10">
                        <div className="absolute -left-[22px] top-1 w-10 h-10 rounded-full border-4 border-white flex items-center justify-center transition-all duration-300 cursor-pointer shadow-lg"
                          style={{ backgroundColor: isDone ? '#43a047' : accentLight, color: isDone ? 'white' : accent }}
                          onClick={() => toggleStepProgress(idx)}>
                          {isDone ? <CheckCircle2 size={18} /> : <span className="font-black text-sm">{idx + 1}</span>}
                        </div>
                        <div className="p-6 rounded-2xl border transition-all duration-300"
                          style={{ backgroundColor: isDone ? '#f1f8e9' : '#fafafa', borderColor: isDone ? '#c8e6c9' : '#f0f0f0' }}>
                          <div className="flex justify-between items-start flex-wrap gap-3 mb-3">
                            <h4 className="text-lg font-black" style={{ color: isDone ? '#2e7d32' : text }}>{step.phase}</h4>
                            <span className="px-3 py-1 text-xs font-bold rounded-xl border flex items-center gap-1.5"
                              style={{ backgroundColor: 'white', color: '#616161', borderColor: '#e0e0e0' }}>
                              <Clock size={12} style={{ color: accent }} /> {step.time_estimate}
                            </span>
                          </div>
                          <p className="leading-relaxed mb-4 text-sm" style={{ color: '#757575' }}>{step.description}</p>
                          <button onClick={() => toggleStepProgress(idx)}
                            className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl border transition-all"
                            style={{ color: isDone ? '#2e7d32' : '#9e9e9e', backgroundColor: isDone ? '#e8f5e9' : 'white', borderColor: isDone ? '#c8e6c9' : '#e0e0e0' }}>
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
              <div className="p-8 rounded-3xl border shadow-sm" style={{ backgroundColor: 'white', borderColor: '#e0e0e0' }}>
                <h3 className="text-2xl font-black mb-6 flex items-center gap-3" style={{ color: text }}>
                  <Briefcase style={{ color: accent }} size={28} /> {t('projects_to_build')}
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  {parsedData.projects.map((proj, idx) => {
                    const isDone = progress[`proj_${idx}`];
                    return (
                      <div key={idx} className="p-6 rounded-2xl border transition-all duration-300 flex flex-col"
                        style={{ backgroundColor: isDone ? '#f1f8e9' : '#fafafa', borderColor: isDone ? '#c8e6c9' : '#f0f0f0' }}>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg"
                            style={{
                              backgroundColor: proj.level?.toLowerCase().includes('begin') ? '#e8f5e9' : proj.level?.toLowerCase().includes('inter') ? '#fff8e1' : '#ffebee',
                              color: proj.level?.toLowerCase().includes('begin') ? '#2e7d32' : proj.level?.toLowerCase().includes('inter') ? '#f57f17' : '#c62828'
                            }}>
                            {proj.level}
                          </span>
                          <button onClick={() => toggleProgress(`proj_${idx}`)}
                            className="transition-all hover:scale-110"
                            style={{ color: isDone ? '#43a047' : '#e0e0e0' }}>
                            {isDone ? <CheckCircle2 size={28} /> : <Circle size={28} />}
                          </button>
                        </div>
                        <h4 className="font-black text-lg mb-2" style={{ color: text }}>{proj.name}</h4>
                        <p className="text-sm leading-relaxed flex-1" style={{ color: '#757575' }}>{proj.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Resources */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                <div className="p-8 rounded-3xl border shadow-sm" style={{ backgroundColor: 'white', borderColor: '#e0e0e0' }}>
                  <h3 className="text-xl font-black mb-6 flex items-center gap-2" style={{ color: text }}>
                    <BookOpen style={{ color: accent }} size={22} /> {t('learning_resources')}
                  </h3>
                  <div className="space-y-6">
                    {Object.entries(parsedData.learning_resources).map(([catKey, items]) => {
                      if (!items?.length) return null;
                      return (
                        <div key={catKey}>
                          <h4 className="font-black capitalize mb-3 flex items-center gap-2 text-sm pb-2 border-b" style={{ color: '#616161', borderColor: '#f0f0f0' }}>
                            {renderSectionIcon(catKey)} {catKey.replace('_', ' ')}
                          </h4>
                          <ul className="space-y-2">
                            {items.map((item, i) => {
                              const isStr = typeof item === 'string'; const name = isStr ? item : item.name; const link = isStr ? null : item.link;
                              return (
                                <li key={i} className="flex items-center gap-2 group">
                                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#81d4fa' }} />
                                  {!link ? <span className="text-sm font-medium" style={{ color: '#616161' }}>{name}</span> : (
                                    <a href={link} target="_blank" rel="noopener noreferrer"
                                      className="text-sm font-semibold flex items-center gap-1 transition-colors hover:underline"
                                      style={{ color: text }}>
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
                  <div className="p-7 rounded-3xl border shadow-sm" style={{ backgroundColor: 'white', borderColor: '#e0e0e0' }}>
                    <h3 className="text-xl font-black mb-5 flex items-center gap-2" style={{ color: text }}>
                      <Award style={{ color: '#f57f17' }} size={22} /> {t('certifications')}
                    </h3>
                    <ul className="space-y-3">
                      {parsedData.certifications.map((cert, i) => {
                        const isStr = typeof cert === 'string'; const name = isStr ? cert : cert.name; const link = isStr ? null : cert.link;
                        return (
                          <li key={i} className="flex items-center gap-3 p-3 rounded-xl border hover:border-amber-200 transition-all group"
                            style={{ backgroundColor: '#fffde7', borderColor: '#fff9c4' }}>
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0"
                              style={{ backgroundColor: '#fff8e1' }}>
                              <Award style={{ color: '#f57f17' }} size={16} />
                            </div>
                            {!link ? <span className="font-bold text-sm flex-1 truncate" style={{ color: '#6d4c00' }}>{name}</span> : (
                              <a href={link} target="_blank" rel="noopener noreferrer"
                                className="font-bold text-sm hover:underline flex-1 truncate transition-colors"
                                style={{ color: '#6d4c00' }}>{name}</a>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <div className="rounded-3xl p-7 text-white relative overflow-hidden border"
                    style={{ background: 'linear-gradient(135deg, #81d4fa, #0288d1)', borderColor: '#81d4fa' }}>
                    <div className="absolute right-0 bottom-0 opacity-10"><TrendingUp size={120} /></div>
                    <h3 className="text-lg font-black mb-5 flex items-center gap-2 relative z-10">
                      <Star className="text-yellow-300" size={20} /> {t('industry_trends')}
                    </h3>
                    <div className="space-y-4 relative z-10">
                      <div>
                        <h4 className="text-sky-200 font-black text-[10px] uppercase tracking-widest mb-2">{t('trending_tools')}</h4>
                        <div className="flex flex-wrap gap-2">
                          {parsedData.industry_trends.trending_tools.map((t, i) => <span key={i} className="bg-white/15 border border-white/20 px-3 py-1 rounded-lg text-xs font-medium">{t}</span>)}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sky-200 font-black text-[10px] uppercase tracking-widest mb-2">{t('new_technologies')}</h4>
                        <div className="flex flex-wrap gap-2">
                          {parsedData.industry_trends.new_technologies.map((t, i) => <span key={i} className="bg-white/15 border border-white/20 px-3 py-1 rounded-lg text-xs font-medium">{t}</span>)}
                        </div>
                      </div>
                      <div className="bg-white/10 border border-white/20 p-4 rounded-xl">
                        <h4 className="text-sky-200 font-black text-[10px] uppercase tracking-widest mb-1">{t('market_demand')}</h4>
                        <p className="text-sm leading-relaxed text-white/80">{parsedData.industry_trends.market_demand}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Master CTA */}
              <div className="rounded-3xl p-10 text-white text-center relative overflow-hidden border"
                style={{ background: 'linear-gradient(135deg, #e1f5fe, #b3e5fc)', borderColor: border }}>
                <Crown style={{ color: '#f57f17' }} className="w-10 h-10 mx-auto mb-4" />
                <h3 className="text-3xl font-black mb-3" style={{ color: text }}>{t('complete_domain')}</h3>
                <p className="mb-8 max-w-xl mx-auto font-medium leading-relaxed" style={{ color: '#546e7a' }}>{t('mastery_desc')}</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button onClick={toggleMaster}
                    className="flex items-center gap-2 px-7 py-4 rounded-2xl font-bold text-sm text-white transition-all"
                    style={{ background: progressPercent === 100 ? '#90a4ae' : 'linear-gradient(135deg, #66bb6a, #2e7d32)' }}>
                    {progressPercent === 100 ? <Square size={18} /> : <CheckSquare size={18} />}
                    {progressPercent === 100 ? t('unmaster_all') : t('master_all')}
                  </button>
                  <button onClick={() => nav('/tutor')}
                    className="flex items-center gap-2 px-7 py-4 rounded-2xl font-black text-sm transition-all hover:scale-105 shadow-xl"
                    style={{ backgroundColor: 'white', color: text }}>
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