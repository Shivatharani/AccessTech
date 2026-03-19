import { useState, useEffect, useRef, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { useTranslation } from "react-i18next";
import { User, History as HistoryIcon, Clock, LogOut, Menu, X, ArrowLeft, Camera, Image as ImageIcon, Trash2, Mic, MicOff, Volume2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";
import { useAssistant } from "../context/AssistantContext";

export default function Tutor(){

  const { t } = useTranslation()
  const nav = useNavigate()
  const [searchParams] = useSearchParams()
  const { user: email, token, language, level } = useContext(AuthContext)
  
  const { activeTopic } = useAssistant()
  
  const [topic,setTopic]=useState("")
  const [response,setResponse]=useState("")
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
      // Automatically trigger askAI after a short delay to allow UI to update
      setTimeout(() => {
        askAI(targetTopic);
      }, 500);
    }
  }, [activeTopic, searchParams]);

  useEffect(() => {
    if (email) {
      fetchHistory()
    }
  }, [email, response]) // Refetch history when a new response is generated

  const fetchHistory = async () => {
    try {
      const res = await API.get(`/ai/history?email=${email}`)
      const tutorHistory = res.data.history.filter(h => h.question.startsWith('Tutor: ')).reverse()
      setHistory(tutorHistory)
    } catch {
      console.error("Failed to fetch history")
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const startCamera = async () => {
    setShowCamera(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch {
      toast.error(t('camera_error'))
      setShowCamera(false)
    }
  }

  const capturePhoto = () => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (canvas && video) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      canvas.getContext('2d').drawImage(video, 0, 0)
      const dataUrl = canvas.toDataURL('image/jpeg')
      setImage(dataUrl)
      stopCamera()
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks()
      tracks.forEach(track => track.stop())
    }
    setShowCamera(false)
  }

  const getLangCode = () => {
    if (language === "Tamil") return "ta-IN";
    if (language === "Hindi") return "hi-IN";
    return "en-US";
  }

  const toggleLocalSTT = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error(t('speech_not_supported'));
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = getLangCode();
    recognition.interimResults = true;
    
    recognition.onstart = () => {
      setIsListening(true);
      toast.info(t('listening'));
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setTopic(transcript);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };


  const speakResponse = (text) => {
    if (!text) return;
    
    // Stop speaking if already speaking
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      toast.info(t('speech_stopped') || "Speech stopped");
      return;
    }

    window.speechSynthesis.cancel();
    
    // Clean text to avoid breaking TTS with markdown symbols
    const cleanText = text.replace(/[*#_`~]/g, " ").trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const langCode = getLangCode();
    utterance.lang = langCode;
    
    const startSpeaking = () => {
      const voices = window.speechSynthesis.getVoices();
      const targetLang = langCode.split('-')[0];
      
      // Specifically target high quality OS or Google voices
      let bestVoice = voices.find(v => v.lang === langCode && (v.name.includes('Google') || v.name.includes('Microsoft'))) || 
                      voices.find(v => v.lang === langCode) || 
                      voices.find(v => v.lang.startsWith(targetLang)) ||
                      voices.find(v => v.name.toLowerCase().includes(targetLang === 'hi' ? 'hindi' : targetLang === 'ta' ? 'tamil' : 'english'));
      
      if (bestVoice) {
        utterance.voice = bestVoice;
        console.log(`Selected TTS voice: ${bestVoice.name} (${bestVoice.lang})`);
      }

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (err) => {
        console.error("TTS Error:", err);
        setIsSpeaking(false);
      };
      
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
      toast.info(t('playing_audio'));
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = startSpeaking;
    } else {
      startSpeaking();
    }
  };

  const askAI=async(overrideTopic = null)=>{
    const currentTopic = overrideTopic || topic;
    if (!currentTopic) {
      toast.error(t('enter_topic'));
      return;
    }

    const tid = toast.loading(t('generating_lesson'));

    try {
     const res=await API.post("/ai/ask",{
      email: email || "User",
      topic: currentTopic,
      image: image || null,
      language, 
      level
     })
   
     setResponse(res.data.response)
     setTopic(currentTopic)
     setImage(null) // Clear image after successful ask
     toast.success(t('lesson_generated'), { id: tid })
     fetchHistory()
    } catch {
      toast.error(t('failed_generate_lesson'), { id: tid })
    }
  }

  const goToQuiz = () => {
    nav(`/quiz?topic=${encodeURIComponent(topic)}&lang=${encodeURIComponent(language)}`)
  }

  return(
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-300">
      <Navbar/>
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 md:hidden transition-colors duration-300" 
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`fixed md:relative z-40 w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-[calc(100vh-64px)] overflow-y-auto transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-indigo-50/50 dark:bg-indigo-950/20 flex justify-between items-start transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center font-bold text-xl transition-colors">
                <User size={24} />
              </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate w-40 transition-colors" title={email}>{email}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full font-medium transition-colors">{language}</span>
                    <span className="text-xs bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full font-medium transition-colors">{level}</span>
                  </div>
                </div>
            </div>
             <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <div className="p-6 border-b border-gray-100 dark:border-gray-800">
            <button
              onClick={() => {
                setTopic("");
                setResponse("");
                setImage(null);
                setSidebarOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold shadow-md transition-all active:scale-95"
            >
              <Plus size={18} />
              {t('new_chat')}
            </button>
          </div>
          
          <div className="p-6 flex-1">
            <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200 font-bold mb-4 transition-colors">
              <HistoryIcon size={18} className="text-indigo-600 dark:text-indigo-400" />
              {t('history')}
            </div>
            {history.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic transition-colors">{t('no_history')}</p>
            ) : (
              <div className="space-y-4">
                {history.map((item, idx) => (
                  <div key={idx} className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                    onClick={() => {
                      setTopic(item.question.replace('Tutor: ', ''));
                      setResponse(item.response);
                      setSidebarOpen(false);
                    }}>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 line-clamp-2 transition-colors">{item.question.replace('Tutor: ', '')}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-400 dark:text-gray-500 transition-colors">
                      <Clock size={12} />
                      <span>{t('previously_asked')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto h-[calc(100vh-64px)] relative w-full">
          <div className="flex items-center gap-4 mb-10 border-b pb-4 border-indigo-100 dark:border-indigo-900/30">
            <button onClick={() => nav(-1)} className="p-2 bg-white dark:bg-gray-900 rounded-full shadow-sm border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 transition-colors">
              <ArrowLeft size={20} />
            </button>
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 bg-white dark:bg-gray-900 rounded-md shadow-sm border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
              <Menu size={20} />
            </button>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-500 transition-colors flex items-center gap-3 tracking-tight">
              <span className="text-indigo-500 text-5xl leading-none -mt-2">✨</span>
              {t('luminatutor')}
            </h1>
          </div>

          <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-indigo-100 dark:border-indigo-900/30 mb-8 max-w-4xl transition-all">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
              {t('what_to_learn') || t('tutor_question') || "What would you like to learn today?"}
            </h2>
            
            {/* Image Preview */}
            {image && (
              <div className="relative w-32 h-32 mb-4 group">
                <img src={image} alt="Preview" className="w-full h-full object-cover rounded-lg border-2 border-indigo-500 shadow-md" />
                <button 
                  onClick={() => setImage(null)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Camera View */}
            {showCamera && (
              <div className="relative mb-4 max-w-md bg-black rounded-lg overflow-hidden border-2 border-indigo-500 shadow-lg">
                <video ref={videoRef} autoPlay playsInline className="w-full h-auto" />
                <canvas ref={canvasRef} className="hidden" />
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                  <Button onClick={capturePhoto} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-3 h-auto"><Camera size={24} /></Button>
                  <Button onClick={stopCamera} className="bg-red-600 hover:bg-red-700 text-white rounded-full p-3 h-auto"><X size={24} /></Button>
                </div>
              </div>
            )}

            <div className="flex items-center bg-gray-50 dark:bg-gray-950 p-2 rounded-xl border border-gray-200 dark:border-gray-800 focus-within:ring-2 focus-within:ring-indigo-400 dark:focus-within:ring-indigo-500 transition-all">
              <input
                className="flex-1 px-4 py-3 outline-none text-gray-800 dark:text-gray-100 bg-transparent text-lg transition-colors"
                placeholder={t('enter_topic')}
                value={topic}
                onChange={e=>setTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && askAI()}
              />

              <button 
                onClick={toggleLocalSTT}
                className={`p-2 transition-colors mr-2 ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-400 hover:text-indigo-600'}`}
                title={t('voice_input')}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
              
              <div className="flex items-center gap-2 px-2 border-l border-gray-200 dark:border-gray-800 ml-2">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept="image/*"
                />
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                  title={t('upload_image')}
                >
                  <ImageIcon size={20} />
                </button>
                <button 
                  onClick={startCamera}
                  className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                  title={t('capture_camera')}
                >
                  <Camera size={20} />
                </button>
              </div>

              <Button
                onClick={() => askAI()}
                className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-8 h-12 rounded-lg font-bold shadow-md ml-2 transition-colors text-md"
              >
                {t('ask_ai')}
              </Button>
            </div>
          </div>

          {response && (
            <div className="mt-8 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500 transition-colors relative group">
              <h2 className="font-bold border-b border-gray-100 dark:border-gray-800 pb-4 text-xl mb-4 text-gray-800 dark:text-gray-100 flex items-center justify-between gap-2 transition-colors">
                <div className="flex items-center gap-2">
                  <span>{t('explanation')}</span>
                  <button 
                    onClick={() => speakResponse(response)}
                    className={`p-1.5 rounded-full transition-all ${isSpeaking ? 'bg-indigo-100 text-indigo-700 animate-pulse' : 'text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30'}`}
                    title={isSpeaking ? t('stop_speaking') : t('read_aloud')}
                  >
                    {isSpeaking ? <MicOff size={20} /> : <Volume2 size={20} />}
                  </button>
                </div>
                <Button onClick={goToQuiz} className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all">
                  {t('take_quiz') || "Take Interactive Quiz"}
                </Button>
              </h2>
              <div className="prose prose-indigo dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed transition-colors">
                {response}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}