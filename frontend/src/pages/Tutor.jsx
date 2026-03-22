import { useState, useEffect, useRef, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { useTranslation } from "react-i18next";
import { User, History as HistoryIcon, Clock, Menu, X, ArrowLeft, Camera, Image as ImageIcon, Trash2, Mic, MicOff, Volume2, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useAssistant } from "../context/AssistantContext";

export default function Tutor() {
  const { t } = useTranslation()
  const nav = useNavigate()
  const [searchParams] = useSearchParams()
  const { user: email, token, language, level } = useContext(AuthContext)
  const { activeTopic } = useAssistant()

  const [topic, setTopic] = useState("")
  const [response, setResponse] = useState("")
  const [history, setHistory] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [image, setImage] = useState(null)
  const [showCamera, setShowCamera] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const fileInputRef = useRef(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const urlTopic = searchParams.get("topic");
    const targetTopic = urlTopic || activeTopic;
    if (targetTopic) {
      setTopic(targetTopic);
      setTimeout(() => { askAI(targetTopic); }, 500);
    }
  }, [activeTopic, searchParams]);

  useEffect(() => {
    if (email) fetchHistory()
  }, [email, response])

  const fetchHistory = async () => {
    try {
      const res = await API.get(`/ai/history?email=${email}`)
      const tutorHistory = res.data.history.filter(h => h.question.startsWith('Tutor: ')).reverse()
      setHistory(tutorHistory)
    } catch { console.error("Failed to fetch history") }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => { setImage(reader.result) }
      reader.readAsDataURL(file)
    }
  }

  const startCamera = async () => {
    setShowCamera(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) videoRef.current.srcObject = stream
    } catch { toast.error(t('camera_error')); setShowCamera(false) }
  }

  const capturePhoto = () => {
    const canvas = canvasRef.current, video = videoRef.current
    if (canvas && video) {
      canvas.width = video.videoWidth; canvas.height = video.videoHeight
      canvas.getContext('2d').drawImage(video, 0, 0)
      setImage(canvas.toDataURL('image/jpeg'))
      stopCamera()
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop())
    }
    setShowCamera(false)
  }

  const getLangCode = () => {
    if (language === "Tamil") return "ta-IN";
    if (language === "Hindi") return "hi-IN";
    return "en-US";
  }

  const toggleLocalSTT = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { toast.error(t('speech_not_supported')); return; }
    if (isListening) { setIsListening(false); return; }
    const recognition = new SR();
    recognition.lang = getLangCode(); recognition.interimResults = true;
    recognition.onstart = () => { setIsListening(true); toast.info(t('listening')); };
    recognition.onresult = (e) => setTopic(e.results[0][0].transcript);
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const speakResponse = (text) => {
    if (!text) return;
    if (isSpeaking) { window.speechSynthesis.cancel(); setIsSpeaking(false); return; }
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`~]/g, " ").trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const langCode = getLangCode(); utterance.lang = langCode;
    const startSpeaking = () => {
      const voices = window.speechSynthesis.getVoices();
      const targetLang = langCode.split('-')[0];
      let bestVoice = voices.find(v => v.lang === langCode && (v.name.includes('Google') || v.name.includes('Microsoft'))) ||
        voices.find(v => v.lang === langCode) || voices.find(v => v.lang.startsWith(targetLang));
      if (bestVoice) utterance.voice = bestVoice;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
      toast.info(t('playing_audio'));
    };
    if (window.speechSynthesis.getVoices().length === 0) window.speechSynthesis.onvoiceschanged = startSpeaking;
    else startSpeaking();
  };

  const askAI = async (overrideTopic = null) => {
    const currentTopic = overrideTopic || topic;
    if (!currentTopic) { toast.error(t('enter_topic')); return; }
    const tid = toast.loading(t('generating_lesson'));
    try {
      const res = await API.post("/ai/ask", { email: email || "User", topic: currentTopic, image: image || null, language, level })
      setResponse(res.data.response)
      setTopic(currentTopic)
      setImage(null)
      toast.success(t('lesson_generated'), { id: tid })
      fetchHistory()
    } catch { toast.error(t('failed_generate_lesson'), { id: tid }) }
  }

  const goToQuiz = () => nav(`/quiz?topic=${encodeURIComponent(topic)}&lang=${encodeURIComponent(language)}`)

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#080810] flex flex-col transition-colors duration-500">
      <Navbar />
      <div className="flex flex-1 overflow-hidden relative">
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`fixed md:relative z-40 w-72 bg-white dark:bg-[#0d0d1a] border-r border-gray-100 dark:border-white/5 flex flex-col h-[calc(100vh-64px)] overflow-y-auto transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>

          {/* User info */}
          <div className="p-5 border-b border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <User size={18} className="text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{email}</p>
                <div className="flex gap-1.5 mt-1">
                  <span className="px-2 py-0.5 bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-[10px] font-black uppercase tracking-wide rounded-md">{language}</span>
                  <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-[10px] font-black uppercase tracking-wide rounded-md">{level}</span>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="p-4 border-b border-gray-100 dark:border-white/5">
            <button
              onClick={() => { setTopic(""); setResponse(""); setImage(null); setSidebarOpen(false); }}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-all active:scale-95"
            >
              <Plus size={16} /> {t('new_chat')}
            </button>
          </div>

          <div className="p-4 flex-1 overflow-y-auto">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
              <HistoryIcon size={14} /> {t('history')}
            </div>
            {history.length === 0 ? (
              <p className="text-xs text-gray-400 dark:text-gray-600 italic text-center py-6">{t('no_history')}</p>
            ) : (
              <div className="space-y-2">
                {history.map((item, idx) => (
                  <button key={idx}
                    className="w-full text-left p-3 rounded-xl bg-gray-50 dark:bg-white/3 border border-gray-100 dark:border-white/5 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:border-violet-200 dark:hover:border-violet-800/30 transition-all group"
                    onClick={() => { setTopic(item.question.replace('Tutor: ', '')); setResponse(item.response); setSidebarOpen(false); }}
                  >
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 line-clamp-2 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
                      {item.question.replace('Tutor: ', '')}
                    </p>
                    <div className="flex items-center gap-1 mt-1.5 text-[10px] text-gray-400 uppercase tracking-wider">
                      <Clock size={10} /> {t('previously_asked')}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto h-[calc(100vh-64px)] relative w-full">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => nav(-1)} className="p-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-300 dark:hover:border-violet-700 transition-all shadow-sm">
              <ArrowLeft size={18} />
            </button>
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-500 dark:text-gray-400 shadow-sm">
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                {t('luminatutor')}
              </h1>
            </div>
          </div>

          {/* Input Card */}
          <div className="bg-white dark:bg-[#0d0d1a] border border-gray-100 dark:border-white/5 rounded-3xl p-6 mb-6 shadow-sm max-w-4xl">
            <p className="text-sm font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
              {t('what_to_learn') || "What would you like to learn?"}
            </p>

            {image && (
              <div className="relative w-24 h-24 mb-4 group">
                <img src={image} alt="Preview" className="w-full h-full object-cover rounded-xl border-2 border-violet-400 shadow-lg" />
                <button onClick={() => setImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <X size={12} />
                </button>
              </div>
            )}

            {showCamera && (
              <div className="relative mb-4 max-w-md rounded-2xl overflow-hidden border-2 border-violet-400 shadow-xl">
                <video ref={videoRef} autoPlay playsInline className="w-full" />
                <canvas ref={canvasRef} className="hidden" />
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-3">
                  <Button onClick={capturePhoto} className="bg-violet-600 text-white rounded-xl h-10 px-4"><Camera size={18} /></Button>
                  <Button onClick={stopCamera} className="bg-red-600 text-white rounded-xl h-10 px-4"><X size={18} /></Button>
                </div>
              </div>
            )}

            <div className="flex items-center bg-gray-50 dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-white/8 focus-within:ring-2 focus-within:ring-violet-500/50 focus-within:border-violet-400 dark:focus-within:border-violet-600 transition-all overflow-hidden">
              <input
                className="flex-1 px-5 py-4 outline-none text-gray-800 dark:text-gray-100 bg-transparent text-base font-medium"
                placeholder={t('enter_topic')}
                value={topic}
                onChange={e => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && askAI()}
              />

              <div className="flex items-center gap-1 px-2">
                <button onClick={toggleLocalSTT} className={`p-2 rounded-lg transition-all ${isListening ? 'text-red-500 bg-red-50 dark:bg-red-900/20 animate-pulse' : 'text-gray-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20'}`}>
                  {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                <button onClick={() => fileInputRef.current.click()} className="p-2 rounded-lg text-gray-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all">
                  <ImageIcon size={18} />
                </button>
                <button onClick={startCamera} className="p-2 rounded-lg text-gray-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all">
                  <Camera size={18} />
                </button>
              </div>

              <Button
                onClick={() => askAI()}
                className="m-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-6 h-10 rounded-xl font-bold shadow-lg shadow-violet-500/20 transition-all text-sm"
              >
                {t('ask_ai')}
              </Button>
            </div>
          </div>

          {response && (
            <div className="max-w-4xl bg-white dark:bg-[#0d0d1a] border border-gray-100 dark:border-white/5 rounded-3xl p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                    <Sparkles size={16} className="text-white" />
                  </div>
                  <span className="font-black text-gray-900 dark:text-white text-lg">{t('explanation')}</span>
                  <button
                    onClick={() => speakResponse(response)}
                    className={`p-1.5 rounded-lg transition-all ${isSpeaking ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 animate-pulse' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-violet-600 dark:hover:text-violet-400'}`}
                  >
                    {isSpeaking ? <MicOff size={16} /> : <Volume2 size={16} />}
                  </button>
                </div>
                <Button
                  onClick={goToQuiz}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 text-sm h-9 px-4"
                >
                  {t('take_quiz') || "Take Quiz"} →
                </Button>
              </div>
              <div className="prose prose-gray dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed text-base">
                {response}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}