import { useState, useEffect } from "react";
import API from "../services/api";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ArrowLeft, CheckCircle, XCircle, Trophy, Target, Sparkles, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function Quiz() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialTopic = queryParams.get("topic") || "";
  const lang = queryParams.get("lang") || "English";
  const count = parseInt(queryParams.get("count") || "10", 10);
  const email = localStorage.getItem("email");

  const [topic, setTopic] = useState(initialTopic);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => { 
    if (initialTopic) {
      fetchQuiz(initialTopic);
    }
  }, []);

  const fetchQuiz = async (searchTopic = topic) => {
    if (!searchTopic.trim()) {
      toast.error(t('enter_topic') || "Please enter a topic");
      return;
    }
    setTopic(searchTopic);
    setLoading(true);
    setQuizFinished(false);
    setQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setShowAnswer(false);

    try {
      const tid = toast.loading(`${t('generating_questions')} ${searchTopic}...`);
      const res = await API.post("/ai/generate-quiz", { topic: searchTopic, language: lang, count });
      setQuestions(res.data.quiz);
      setLoading(false);
      toast.success(t('ready_begin'), { id: tid });
    } catch (err) {
      toast.error(t('send_error'));
      setLoading(false);
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 relative">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center animate-pulse shadow-2xl bg-gradient-to-br from-pink-400 to-pink-700 dark:from-pink-600 dark:to-pink-900">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-xl font-black text-pink-900 dark:text-pink-50">{t('brewing_quiz')}</h2>
          <p className="text-sm mt-2 font-medium text-pink-400 dark:text-pink-500">
            Crafting questions for <span className="font-bold text-pink-700 dark:text-pink-400">{topic}</span>...
          </p>
        </div>
      </div>
    );
  }

  const scorePercent = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const getScoreGrade = () => {
    if (scorePercent >= 90) return { label: 'Excellent!', colorClass: 'text-green-700 dark:text-green-400', gradientClass: 'bg-gradient-to-br from-green-300 to-green-700 dark:from-green-500 dark:to-green-800' };
    if (scorePercent >= 70) return { label: 'Great Job!', colorClass: 'text-sky-600 dark:text-sky-400', gradientClass: 'bg-gradient-to-br from-sky-300 to-sky-600 dark:from-sky-500 dark:to-sky-800' };
    if (scorePercent >= 50) return { label: 'Good Effort!', colorClass: 'text-orange-600 dark:text-orange-500', gradientClass: 'bg-gradient-to-br from-amber-300 to-orange-600 dark:from-orange-500 dark:to-orange-800' };
    return { label: 'Keep Practicing!', colorClass: 'text-pink-700 dark:text-pink-500', gradientClass: 'bg-gradient-to-br from-pink-400 to-pink-700 dark:from-pink-600 dark:to-pink-900' };
  };
  const grade = getScoreGrade();

  return (
    <div className="min-h-screen flex flex-col bg-pink-50 dark:bg-gray-950">
      <Navbar />

      <main className="flex-1 flex flex-col items-center px-6 py-10">
        <div className="w-full max-w-2xl">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => nav(-1)} className="p-2.5 rounded-xl border shadow-sm transition-all bg-white border-pink-300 text-pink-400 hover:bg-pink-50 dark:bg-gray-900 dark:border-pink-900/40 dark:text-pink-500 dark:hover:bg-gray-800">
              <ArrowLeft size={18} />
            </button>
            <div className="text-center">
              <h1 className="text-lg font-black tracking-tight text-pink-900 dark:text-pink-50">{topic || t('quiz')}</h1>
              <p className="text-xs font-bold uppercase tracking-widest text-pink-400 dark:text-pink-500">{t('mastery')}</p>
            </div>
            {questions.length > 0 ? (
              <div className="px-4 py-2 rounded-xl border bg-pink-100 border-pink-300 dark:bg-pink-900/30 dark:border-pink-900/50">
                <span className="font-black text-sm text-pink-900 dark:text-pink-100">{t('score')}: {score}</span>
              </div>
            ) : <div className="w-[74px]" />}
          </div>

          {/* Search bar when not taking a quiz */ }
          {!loading && !quizFinished && questions.length === 0 && (
            <div className="mb-10 bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-pink-200 dark:border-pink-900/50 flex flex-col md:flex-row gap-3">
               <input
                 className="flex-1 px-5 py-4 rounded-2xl border-2 outline-none transition-all text-base font-medium focus:ring-2 focus:border-pink-400 dark:focus:border-pink-600 bg-pink-50 border-pink-200 text-pink-900 dark:bg-gray-950 dark:border-pink-900/50 dark:text-pink-50 placeholder-pink-400 dark:placeholder-pink-700"
                 placeholder={t('enter_quiz_topic', 'Enter the topic')}
                 value={topic}
                 onChange={e => setTopic(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && fetchQuiz(topic)}
               />
               <button onClick={() => fetchQuiz(topic)}
                 className="text-white px-8 h-14 rounded-2xl font-bold shadow-lg transition-all text-base whitespace-nowrap bg-gradient-to-br from-pink-400 to-pink-700 hover:from-pink-500 hover:to-pink-800 dark:from-pink-600 dark:to-pink-900 flex items-center gap-2">
                 <Sparkles size={18} /> {t('generate_quiz', 'Generate Quiz')}
               </button>
            </div>
          )}

          {!quizFinished && questions.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-black uppercase tracking-widest text-pink-400 dark:text-pink-500">
                  {t('quiz')} {currentIndex + 1} / {questions.length}
                </span>
                <span className="text-xs font-black text-pink-700 dark:text-pink-400">{Math.round(progressPercent)}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden bg-pink-200 dark:bg-pink-950/50">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-pink-400 to-pink-700 dark:from-pink-600 dark:to-pink-800"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {quizFinished ? (
            <div className="rounded-3xl p-10 text-center shadow-xl animate-in zoom-in-95 duration-500 border bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-800">
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl ${grade.gradientClass}`}>
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-black mb-2 text-pink-900 dark:text-pink-50">{grade.label}</h2>
              <p className="mb-2 font-medium text-gray-500 dark:text-gray-400">{t('quiz_completed')}</p>
              <div className={`text-5xl font-black mb-1 ${grade.colorClass}`}>{scorePercent}%</div>
              <p className="text-sm font-medium mb-8 text-gray-500 dark:text-gray-400">
                {t('you_scored')} <span className="font-bold text-pink-900 dark:text-pink-50">{score}</span> {t('out_of')} {questions.length}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={() => nav("/tutor")}
                  className="text-white font-bold rounded-xl shadow-lg h-11 px-6 bg-gradient-to-br from-pink-400 to-pink-700 hover:from-pink-500 hover:to-pink-800 dark:from-pink-600 dark:to-pink-900 transition-all">
                  {t('return_to_tutor')}
                </button>
                <button onClick={fetchQuiz}
                  className="rounded-xl h-11 px-6 font-bold border transition-all hover:bg-pink-50 text-pink-700 border-pink-300 dark:border-pink-900/50 dark:text-pink-400 dark:hover:bg-pink-900/20">
                  Retry Quiz
                </button>
              </div>
            </div>
          ) : questions.length > 0 ? (
            <div className="rounded-3xl p-8 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500 border bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-800">
              <h2 className="text-xl font-bold mb-8 leading-relaxed text-pink-900 dark:text-pink-50">
                {questions[currentIndex]?.question}
              </h2>

              <div className="space-y-3 mb-8">
                {questions[currentIndex]?.options.map((opt, idx) => {
                  let styleClass = "";
                  let icon = null;
                  let baseClass = "w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between font-semibold text-base cursor-pointer";

                  if (!showAnswer) {
                    styleClass = "bg-pink-50 border-pink-100 text-pink-900 hover:bg-pink-100 hover:border-pink-300 dark:bg-pink-950/20 dark:border-pink-900/30 dark:text-pink-100 dark:hover:bg-pink-900/40 dark:hover:border-pink-900/60";
                  } else if (idx === questions[currentIndex].answer) {
                    styleClass = "bg-green-50 border-green-400 text-green-800 dark:bg-green-900/30 dark:border-green-600 dark:text-green-300";
                    icon = <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-500" />;
                  } else if (idx === selectedOption) {
                    styleClass = "bg-red-50 border-red-300 text-red-800 dark:bg-red-900/30 dark:border-red-600/50 dark:text-red-400";
                    icon = <XCircle className="w-5 h-5 text-red-600 dark:text-red-500" />;
                  } else {
                    styleClass = "bg-gray-50 border-gray-100 text-gray-400 opacity-50 cursor-default dark:bg-gray-800/50 dark:border-gray-800 dark:text-gray-500";
                  }

                  return (
                    <button key={idx} onClick={() => handleSelectOption(idx)} disabled={showAnswer}
                      className={`${baseClass} ${styleClass}`}>
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 bg-black/5 dark:bg-white/10 text-inherit">
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
                    className="text-white font-bold rounded-xl shadow-lg h-11 px-8 bg-gradient-to-br from-pink-400 to-pink-700 hover:from-pink-500 hover:to-pink-800 dark:from-pink-600 dark:to-pink-900 transition-all">
                    {currentIndex === questions.length - 1 ? t('finish_quiz') : t('next_question')} →
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center p-10 text-gray-500 dark:text-gray-400">No questions available.</div>
          )}
        </div>
      </main>
    </div>
  );
}