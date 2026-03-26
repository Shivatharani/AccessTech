import { useState, useEffect } from "react";
import API from "../services/api";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ArrowLeft, CheckCircle, XCircle, Trophy, Target, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function Quiz() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const topic = queryParams.get("topic") || "General";
  const lang = queryParams.get("lang") || "English";
  const email = localStorage.getItem("email");

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => { fetchQuiz(); }, []);

  const fetchQuiz = async () => {
    try {
      const tid = toast.loading(`${t('generating_questions')} ${topic}...`);
      const res = await API.post("/ai/generate-quiz", { topic, language: lang });
      setQuestions(res.data.quiz);
      setLoading(false);
      toast.success(t('ready_begin'), { id: tid });
    } catch (err) {
      toast.error(t('send_error'));
      nav(-1);
    }
  };

  const handleSelectOption = (index) => {
    if (showAnswer) return;
    setSelectedOption(index);
    setShowAnswer(true);
    if (index === questions[currentIndex].answer) {
      setScore(s => s + 1);
      toast.success(t('correct'));
    } else {
      toast.error(t('incorrect'));
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedOption(null);
      setShowAnswer(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setQuizFinished(true);
    try {
      await API.post("/ai/submit-quiz", { email, topic, score });
      toast.success(t('submit_quiz'));
    } catch (err) {
      toast.error(t('send_error'));
    }
  };

  const progressPercent = questions.length > 0 ? ((currentIndex + (showAnswer ? 1 : 0)) / questions.length) * 100 : 0;

  const accent = '#c2185b';
  const accentLight = '#fce4ec';
  const accentMid = '#e91e63';
  const border = '#f48fb1';
  const text = '#880e4f';

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#fce4ec' }}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 relative">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center animate-pulse shadow-2xl"
              style={{ background: 'linear-gradient(135deg, #f48fb1, #c2185b)' }}>
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-xl font-black" style={{ color: text }}>{t('brewing_quiz')}</h2>
          <p className="text-sm mt-2 font-medium" style={{ color: border }}>
            Crafting questions for <span className="font-bold" style={{ color: accent }}>{topic}</span>...
          </p>
        </div>
      </div>
    );
  }

  const scorePercent = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const getScoreGrade = () => {
    if (scorePercent >= 90) return { label: 'Excellent!', color: '#2e7d32', gradient: 'linear-gradient(135deg, #a5d6a7, #2e7d32)' };
    if (scorePercent >= 70) return { label: 'Great Job!', color: '#0288d1', gradient: 'linear-gradient(135deg, #81d4fa, #0288d1)' };
    if (scorePercent >= 50) return { label: 'Good Effort!', color: '#e65100', gradient: 'linear-gradient(135deg, #ffcc80, #e65100)' };
    return { label: 'Keep Practicing!', color: '#c2185b', gradient: 'linear-gradient(135deg, #f48fb1, #c2185b)' };
  };
  const grade = getScoreGrade();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fce4ec' }}>
      <Navbar />

      <main className="flex-1 flex flex-col items-center px-6 py-10">
        <div className="w-full max-w-2xl">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => nav(-1)} className="p-2.5 rounded-xl border shadow-sm transition-all"
              style={{ backgroundColor: 'white', borderColor: border, color: '#f48fb1' }}>
              <ArrowLeft size={18} />
            </button>
            <div className="text-center">
              <h1 className="text-lg font-black tracking-tight" style={{ color: text }}>{topic}</h1>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#f48fb1' }}>{t('mastery')}</p>
            </div>
            <div className="px-4 py-2 rounded-xl border" style={{ backgroundColor: accentLight, borderColor: border }}>
              <span className="font-black text-sm" style={{ color: text }}>{t('score')}: {score}</span>
            </div>
          </div>

          {!quizFinished && questions.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#f48fb1' }}>
                  {t('quiz')} {currentIndex + 1} / {questions.length}
                </span>
                <span className="text-xs font-black" style={{ color: accent }}>{Math.round(progressPercent)}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: accentLight }}>
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progressPercent}%`, background: 'linear-gradient(90deg, #f48fb1, #c2185b)' }}
                />
              </div>
            </div>
          )}

          {quizFinished ? (
            <div className="rounded-3xl p-10 text-center shadow-xl animate-in zoom-in-95 duration-500 border"
              style={{ backgroundColor: 'white', borderColor: '#e0e0e0' }}>
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl"
                style={{ background: grade.gradient }}>
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-black mb-2" style={{ color: text }}>{grade.label}</h2>
              <p className="mb-2 font-medium" style={{ color: '#9e9e9e' }}>{t('quiz_completed')}</p>
              <div className="text-5xl font-black mb-1" style={{ color: grade.color }}>{scorePercent}%</div>
              <p className="text-sm font-medium mb-8" style={{ color: '#9e9e9e' }}>
                {t('you_scored')} <span className="font-bold" style={{ color: text }}>{score}</span> {t('out_of')} {questions.length}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={() => nav("/tutor")}
                  className="text-white font-bold rounded-xl shadow-lg h-11 px-6"
                  style={{ background: 'linear-gradient(135deg, #f48fb1, #c2185b)' }}>
                  {t('return_to_tutor')}
                </button>
                <button onClick={fetchQuiz}
                  className="rounded-xl h-11 px-6 font-bold border transition-all hover:bg-pink-50"
                  style={{ borderColor: border, color: accent }}>
                  Retry Quiz
                </button>
              </div>
            </div>
          ) : questions.length > 0 ? (
            <div className="rounded-3xl p-8 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500 border"
              style={{ backgroundColor: 'white', borderColor: '#e0e0e0' }}>
              <h2 className="text-xl font-bold mb-8 leading-relaxed" style={{ color: text }}>
                {questions[currentIndex]?.question}
              </h2>

              <div className="space-y-3 mb-8">
                {questions[currentIndex]?.options.map((opt, idx) => {
                  let style = {};
                  let icon = null;
                  let className = "w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between font-semibold text-base cursor-pointer";

                  if (!showAnswer) {
                    style = { backgroundColor: accentLight, borderColor: '#fce4ec', color: text };
                  } else if (idx === questions[currentIndex].answer) {
                    style = { backgroundColor: '#e8f5e9', borderColor: '#66bb6a', color: '#1b5e20' };
                    icon = <CheckCircle className="w-5 h-5" style={{ color: '#43a047' }} />;
                  } else if (idx === selectedOption) {
                    style = { backgroundColor: '#ffebee', borderColor: '#ef9a9a', color: '#c62828' };
                    icon = <XCircle className="w-5 h-5" style={{ color: '#e53935' }} />;
                  } else {
                    style = { backgroundColor: '#fafafa', borderColor: '#f0f0f0', color: '#9e9e9e', opacity: 0.5, cursor: 'default' };
                  }

                  return (
                    <button key={idx} onClick={() => handleSelectOption(idx)} disabled={showAnswer}
                      className={className} style={style}>
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0"
                          style={{ backgroundColor: 'rgba(0,0,0,0.05)', color: 'inherit' }}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        {opt}
                      </div>
                      {icon}
                    </button>
                  );
                })}
              </div>

              {showAnswer && (
                <div className="flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <button onClick={handleNext}
                    className="text-white font-bold rounded-xl shadow-lg h-11 px-8"
                    style={{ background: 'linear-gradient(135deg, #f48fb1, #c2185b)' }}>
                    {currentIndex === questions.length - 1 ? t('finish_quiz') : t('next_question')} →
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center p-10" style={{ color: '#9e9e9e' }}>No questions available.</div>
          )}
        </div>
      </main>
    </div>
  );
}