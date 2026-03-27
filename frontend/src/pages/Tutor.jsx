import { useState, useEffect, useRef, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { useTranslation } from "react-i18next";
import { User, History as HistoryIcon, Clock, Menu, X, ArrowLeft, Camera, Image as ImageIcon, Mic, MicOff, Volume2, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
    if (targetTopic) { setTopic(targetTopic); setTimeout(() => { askAI(targetTopic); }, 500); }
  }, [activeTopic, searchParams]);

  useEffect(() => { if (email) fetchHistory() }, [email, response])

  const fetchHistory = async () => {
    try {
      const res = await API.get(`/ai/history?email=${email}`)
      setHistory(res.data.history.filter(h => h.question.startsWith('Tutor: ')).reverse())
    } catch { console.error("Failed to fetch history") }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) { const reader = new FileReader(); reader.onloadend = () => setImage(reader.result); reader.readAsDataURL(file) }
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
      setImage(canvas.toDataURL('image/jpeg')); stopCamera()
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) videoRef.current.srcObject.getTracks().forEach(t => t.stop())
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
      setResponse(res.data.response); setTopic(currentTopic); setImage(null)
      toast.success(t('lesson_generated'), { id: tid }); fetchHistory()
    } catch { toast.error(t('failed_generate_lesson'), { id: tid }) }
  }

  const goToQuiz = () => nav(`/quiz?topic=${encodeURIComponent(topic)}&lang=${encodeURIComponent(language)}`)

  return (
    <div className="min-h-screen flex flex-col bg-fuchsia-50 dark:bg-gray-950">
      <Navbar />
      <div className="flex flex-1 overflow-hidden relative">
        {sidebarOpen && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

        {/* Sidebar */}
        <aside className={`fixed md:relative z-40 w-72 flex flex-col h-[calc(100vh-64px)] overflow-y-auto transition-transform duration-300 border-r ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} bg-purple-50 border-fuchsia-200 dark:bg-gray-900 dark:border-fuchsia-900/40`}>
          <div className="p-5 border-b border-fuchsia-200 dark:border-fuchsia-900/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br from-fuchsia-300 to-fuchsia-600 dark:from-fuchsia-600 dark:to-fuchsia-800">
                <User size={18} className="text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm truncate text-fuchsia-900 dark:text-fuchsia-50">{email}</p>
                <div className="flex gap-1.5 mt-1">
                  <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wide rounded-md bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-900/50 dark:text-fuchsia-400">{language}</span>
                  <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wide rounded-md bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400">{level}</span>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="md:hidden text-fuchsia-400 dark:text-fuchsia-600"><X size={18} /></button>
            </div>
          </div>

          <div className="p-4 border-b border-fuchsia-200 dark:border-fuchsia-900/40">
            <button onClick={() => { setTopic(""); setResponse(""); setImage(null); setSidebarOpen(false); }}
              className="w-full flex items-center justify-center gap-2 text-white py-2.5 rounded-xl font-bold text-sm shadow-lg bg-gradient-to-br from-fuchsia-300 to-fuchsia-600 hover:opacity-90 dark:from-fuchsia-600 dark:to-fuchsia-800 transition-opacity">
              <Plus size={16} /> {t('new_chat')}
            </button>
          </div>

          <div className="p-4 flex-1 overflow-y-auto">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest mb-3 text-fuchsia-400 dark:text-fuchsia-600">
              <HistoryIcon size={14} /> {t('history')}
            </div>
            {history.length === 0 ? (
              <p className="text-xs italic text-center py-6 text-fuchsia-400 dark:text-fuchsia-600">{t('no_history')}</p>
            ) : (
              <div className="space-y-2">
                {history.map((item, idx) => (
                  <button key={idx}
                    className="w-full text-left p-3 rounded-xl border transition-all group bg-fuchsia-100 border-fuchsia-200 hover:bg-fuchsia-200 dark:bg-fuchsia-900/20 dark:border-fuchsia-900/40 dark:hover:bg-fuchsia-900/40"
                    onClick={() => { setTopic(item.question.replace('Tutor: ', '')); setResponse(item.response); setSidebarOpen(false); }}>
                    <p className="text-sm font-semibold line-clamp-2 transition-colors text-fuchsia-900 dark:text-fuchsia-100">
                      {item.question.replace('Tutor: ', '')}
                    </p>
                    <div className="flex items-center gap-1 mt-1.5 text-[10px] uppercase tracking-wider text-fuchsia-500 dark:text-fuchsia-600">
                      <Clock size={10} /> {t('previously_asked')}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        <main className="flex-1 p-6 md:p-10 overflow-y-auto h-[calc(100vh-64px)] relative w-full">
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => nav(-1)}
              className="p-2.5 rounded-xl border transition-all shadow-sm bg-white border-fuchsia-200 text-fuchsia-500 hover:bg-fuchsia-50 dark:bg-gray-900 dark:border-fuchsia-900/40 dark:text-fuchsia-500 dark:hover:bg-gray-800">
              <ArrowLeft size={18} />
            </button>
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2.5 rounded-xl border shadow-sm bg-white border-fuchsia-200 dark:bg-gray-900 dark:border-fuchsia-900/40 text-fuchsia-500">
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-fuchsia-300 to-fuchsia-600 dark:from-fuchsia-600 dark:to-fuchsia-800">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-black tracking-tight text-fuchsia-900 dark:text-fuchsia-50">{t('luminatutor')}</h1>
            </div>
          </div>

          {/* Input Card */}
          <div className="rounded-3xl p-6 mb-6 shadow-sm max-w-4xl border bg-white border-fuchsia-200 dark:bg-gray-900 dark:border-fuchsia-900/50">
            <p className="text-sm font-black uppercase tracking-widest mb-4 text-fuchsia-400 dark:text-fuchsia-600">
              {t('what_to_learn') || "What would you like to learn?"}
            </p>

            {image && (
              <div className="relative w-24 h-24 mb-4 group">
                <img src={image} alt="Preview" className="w-full h-full object-cover rounded-xl border-2 shadow-lg border-fuchsia-300 dark:border-fuchsia-700" />
                <button onClick={() => setImage(null)} className="absolute -top-2 -right-2 bg-red-400 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <X size={12} />
                </button>
              </div>
            )}

            {showCamera && (
              <div className="relative mb-4 max-w-md rounded-2xl overflow-hidden border-2 shadow-xl border-fuchsia-300 dark:border-fuchsia-700">
                <video ref={videoRef} autoPlay playsInline className="w-full" />
                <canvas ref={canvasRef} className="hidden" />
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-3">
                  <button onClick={capturePhoto} className="px-4 h-10 rounded-xl text-white font-bold bg-fuchsia-600 hover:bg-fuchsia-700"><Camera size={18} /></button>
                  <button onClick={stopCamera} className="px-4 h-10 rounded-xl text-white font-bold bg-red-400 hover:bg-red-500"><X size={18} /></button>
                </div>
              </div>
            )}

            <div className="flex items-center rounded-2xl border transition-all overflow-hidden bg-fuchsia-50 border-fuchsia-200 focus-within:border-fuchsia-400 dark:bg-gray-950 dark:border-fuchsia-900/50 dark:focus-within:border-fuchsia-700">
              <input
                className="flex-1 px-5 py-4 outline-none text-base font-medium bg-transparent text-fuchsia-900 dark:text-fuchsia-50 placeholder-fuchsia-300 dark:placeholder-fuchsia-700"
                placeholder={t('enter_topic')}
                value={topic}
                onChange={e => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && askAI()}
              />
              <div className="flex items-center gap-1 px-2">
                <button onClick={toggleLocalSTT}
                  className={`p-2 rounded-lg transition-all ${isListening ? 'animate-pulse text-pink-500 bg-pink-100 dark:bg-pink-900/30 dark:text-pink-400' : 'text-fuchsia-400 dark:text-fuchsia-600'}`}>
                  {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                <button onClick={() => fileInputRef.current.click()} className="p-2 rounded-lg transition-all text-fuchsia-400 hover:bg-fuchsia-100 dark:text-fuchsia-600 dark:hover:bg-fuchsia-900/30">
                  <ImageIcon size={18} />
                </button>
                <button onClick={startCamera} className="p-2 rounded-lg transition-all text-fuchsia-400 hover:bg-fuchsia-100 dark:text-fuchsia-600 dark:hover:bg-fuchsia-900/30">
                  <Camera size={18} />
                </button>
              </div>
              <button
                onClick={() => askAI()}
                className="m-2 text-white px-6 h-10 rounded-xl font-bold shadow-lg text-sm bg-gradient-to-br from-fuchsia-400 to-fuchsia-600 hover:from-fuchsia-500 hover:to-fuchsia-700 dark:from-fuchsia-600 dark:to-fuchsia-800 transition-all">
                {t('ask_ai')}
              </button>
            </div>
          </div>

          {response && (
            <div className="max-w-4xl rounded-3xl p-8 shadow-sm border animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white border-fuchsia-200 dark:bg-gray-900 dark:border-fuchsia-900/50">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-fuchsia-200 dark:border-fuchsia-900/40">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br from-fuchsia-400 to-fuchsia-600 dark:from-fuchsia-600 dark:to-fuchsia-800">
                    <Sparkles size={16} className="text-white" />
                  </div>
                  <span className="font-black text-lg text-fuchsia-900 dark:text-fuchsia-50">{t('explanation')}</span>
                  <button onClick={() => speakResponse(response)}
                    className={`p-1.5 rounded-lg transition-all ${isSpeaking ? 'animate-pulse text-fuchsia-600 bg-fuchsia-100 dark:text-fuchsia-400 dark:bg-fuchsia-900/30' : 'text-fuchsia-400 dark:text-fuchsia-600 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/20'}`}>
                    {isSpeaking ? <MicOff size={16} /> : <Volume2 size={16} />}
                  </button>
                </div>
                <button onClick={goToQuiz}
                  className="text-white rounded-xl font-bold shadow-lg text-sm h-9 px-4 bg-gradient-to-br from-green-300 to-green-500 hover:from-green-400 hover:to-green-600 dark:from-green-600 dark:to-green-800 transition-all whitespace-nowrap">
                  {t('take_quiz') || "Take Quiz"} →
                </button>
              </div>
              <div className="prose max-w-none whitespace-pre-wrap leading-relaxed text-base text-gray-700 dark:text-gray-300">
                {response}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}