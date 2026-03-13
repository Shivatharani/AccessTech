import {useState, useEffect} from "react";
import API from "../services/api";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
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

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    try {
      const tid = toast.loading(`Generating 10 questions on ${topic}...`);
      const res = await API.post("/ai/generate-quiz", {
        topic: topic,
        language: lang
      });
      setQuestions(res.data.quiz);
      setLoading(false);
      toast.success("Ready to begin!", { id: tid });
    } catch (err) {
      toast.error("Failed to load quiz. Please try again later.");
      nav(-1);
    }
  };

  const handleSelectOption = (index) => {
    if (showAnswer) return; // Prevent changing answer after submission
    setSelectedOption(index);
    setShowAnswer(true);

    const isCorrect = index === questions[currentIndex].answer;
    if (isCorrect) {
      setScore(s => s + 1);
      toast.success("Correct!");
    } else {
      toast.error("Incorrect!");
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
      await API.post("/ai/submit-quiz", {
        email,
        topic,
        score
      });
      toast.success("Quiz score submitted to Dashboard!");
    } catch (err) {
      toast.error("Failed to submit score, but you completed the quiz!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center transition-colors duration-300">
        <div className="flex flex-col items-center animate-pulse">
          <div className="w-16 h-16 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 dark:border-t-indigo-500 rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 transition-colors">Brewing your custom quiz...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center transition-colors duration-300">
      <Navbar />

      <main className="w-full max-w-4xl p-6 md:p-10 flex flex-col items-center flex-1">
        
        <div className="flex items-center justify-between w-full mb-8">
          <button onClick={() => nav(-1)} className="p-2 bg-white dark:bg-gray-900 rounded-full shadow-sm border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 transition-colors">
            {topic} Mastery
          </h1>
          <div className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full font-bold text-sm transition-colors">
            {t('score') || 'Score'}: {score}
          </div>
        </div>

        {quizFinished ? (
          <div className="bg-white dark:bg-gray-900 p-10 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 text-center w-full animate-in zoom-in duration-500 transition-colors">
            <h2 className="text-4xl font-black mb-4 dark:text-gray-100">Quiz Completed!</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 transition-colors">You scored <span className="font-bold text-indigo-600 dark:text-indigo-400">{score} out of {questions.length}</span>.</p>
            <Button size="lg" onClick={() => nav("/tutor")} className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl transition-colors">
              Return to Tutor
            </Button>
          </div>
        ) : questions.length > 0 ? (
          <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 transition-colors cursor-default">
            <div className="mb-6 flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-4 transition-colors">
              <span className="text-sm font-semibold text-gray-400 dark:text-gray-500 tracking-wider uppercase">Question {currentIndex + 1} of {questions.length}</span>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-8 leading-relaxed transition-colors">
              {questions[currentIndex]?.question}
            </h2>

            <div className="space-y-4 mb-8">
              {questions[currentIndex]?.options.map((opt, idx) => {
                let btnStyle = "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:border-indigo-300 dark:hover:border-indigo-700 text-gray-700 dark:text-gray-300";
                let icon = null;

                if (showAnswer) {
                  if (idx === questions[currentIndex].answer) {
                    btnStyle = "bg-green-50 dark:bg-green-900/30 border-green-500 dark:border-green-600 text-green-800 dark:text-green-300";
                    icon = <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
                  } else if (idx === selectedOption) {
                    btnStyle = "bg-red-50 dark:bg-red-900/30 border-red-500 dark:border-red-600 text-red-800 dark:text-red-300";
                    icon = <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
                  } else {
                    btnStyle = "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-50";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={showAnswer}
                    className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-300 flex items-center justify-between font-medium text-lg shadow-sm ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {icon}
                  </button>
                );
              })}
            </div>

            {showAnswer && (
              <div className="flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Button onClick={handleNext} size="lg" className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl font-bold px-8 transition-colors">
                  {currentIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 w-full text-center transition-colors">
            <h2 className="text-xl text-gray-600 dark:text-gray-400">No questions available. Please try again later.</h2>
          </div>
        )}

      </main>
    </div>
  );
}