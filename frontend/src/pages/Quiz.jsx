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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#080810] flex flex-col items-center justify-center transition-colors duration-500">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center animate-pulse shadow-2xl shadow-violet-500/30">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white">{t('brewing_quiz')}</h2>
          <p className="text-gray-400 text-sm mt-2 font-medium">Crafting questions for <span className="text-violet-600 dark:text-violet-400 font-bold">{topic}</span>...</p>
        </div>
      </div>
    );
  }

  const scorePercent = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const getScoreGrade = () => {
    if (scorePercent >= 90) return { label: 'Excellent!', color: 'text-emerald-500', bg: 'from-emerald-500 to-teal-600' };
    if (scorePercent >= 70) return { label: 'Great Job!', color: 'text-sky-500', bg: 'from-sky-500 to-blue-600' };
    if (scorePercent >= 50) return { label: 'Good Effort!', color: 'text-amber-500', bg: 'from-amber-500 to-orange-600' };
    return { label: 'Keep Practicing!', color: 'text-rose-500', bg: 'from-rose-500 to-pink-600' };
  };
  const grade = getScoreGrade();

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#080810] flex flex-col transition-colors duration-500">
      <Navbar />

      <main className="flex-1 flex flex-col items-center px-6 py-10">
        <div className="w-full max-w-2xl">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => nav(-1)} className="p-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-500 hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-300 dark:hover:border-violet-700 transition-all shadow-sm">
              <ArrowLeft size={18} />
            </button>
            <div className="text-center">
              <h1 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">{topic}</h1>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{t('mastery')}</p>
            </div>
            <div className="px-4 py-2 bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 border border-violet-200 dark:border-violet-800/50 rounded-xl">
              <span className="text-violet-700 dark:text-violet-300 font-black text-sm">{t('score')}: {score}</span>
            </div>
          </div>

          {!quizFinished && questions.length > 0 && (
            <>
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                    {t('quiz')} {currentIndex + 1} / {questions.length}
                  </span>
                  <span className="text-xs font-black text-violet-600 dark:text-violet-400">{Math.round(progressPercent)}%</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </>
          )}

          {quizFinished ? (
            <div className="bg-white dark:bg-[#0d0d1a] border border-gray-100 dark:border-white/5 rounded-3xl p-10 text-center shadow-xl animate-in zoom-in-95 duration-500">
              <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${grade.bg} flex items-center justify-center mx-auto mb-6 shadow-2xl`}>
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">{grade.label}</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-2 font-medium">{t('quiz_completed')}</p>
              <div className={`text-5xl font-black ${grade.color} mb-1`}>{scorePercent}%</div>
              <p className="text-gray-400 text-sm font-medium mb-8">
                {t('you_scored')} <span className="font-bold text-gray-900 dark:text-white">{score}</span> {t('out_of')} {questions.length}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => nav("/tutor")} className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-violet-500/20 h-11">
                  {t('return_to_tutor')}
                </Button>
                <Button variant="outline" onClick={fetchQuiz} className="border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-xl h-11 font-bold hover:border-violet-400 dark:hover:border-violet-600">
                  Retry Quiz
                </Button>
              </div>
            </div>
          ) : questions.length > 0 ? (
            <div className="bg-white dark:bg-[#0d0d1a] border border-gray-100 dark:border-white/5 rounded-3xl p-8 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-8 leading-relaxed">
                {questions[currentIndex]?.question}
              </h2>

              <div className="space-y-3 mb-8">
                {questions[currentIndex]?.options.map((opt, idx) => {
                  let style = "bg-gray-50 dark:bg-white/3 border-gray-200 dark:border-white/8 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:border-violet-300 dark:hover:border-violet-700/50 text-gray-700 dark:text-gray-300 cursor-pointer";
                  let icon = null;

                  if (showAnswer) {
                    if (idx === questions[currentIndex].answer) {
                      style = "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-400 dark:border-emerald-600/50 text-emerald-800 dark:text-emerald-300";
                      icon = <CheckCircle className="w-5 h-5 text-emerald-500" />;
                    } else if (idx === selectedOption) {
                      style = "bg-red-50 dark:bg-red-900/20 border-red-400 dark:border-red-600/50 text-red-800 dark:text-red-300";
                      icon = <XCircle className="w-5 h-5 text-red-500" />;
                    } else {
                      style = "bg-gray-50 dark:bg-white/3 border-gray-100 dark:border-white/5 text-gray-400 dark:text-gray-600 opacity-50 cursor-default";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={showAnswer}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between font-semibold text-base ${style}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-xs font-black text-gray-500 dark:text-gray-400 flex-shrink-0">
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
                  <Button
                    onClick={handleNext}
                    className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-violet-500/20 h-11 px-8"
                  >
                    {currentIndex === questions.length - 1 ? t('finish_quiz') : t('next_question')} →
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500 p-10">No questions available.</div>
          )}
        </div>
      </main>
    </div>
  );
}