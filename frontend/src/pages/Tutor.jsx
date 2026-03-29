import { useState, useEffect, useRef, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { useTranslation } from "react-i18next";
import { User, History as HistoryIcon, Clock, Menu, X, ArrowLeft, Camera, Image as ImageIcon, Mic, MicOff, Volume2, Plus, Sparkles, FileDown, Send, Bot, Target } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useAssistant } from "../context/AssistantContext";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Tutor() {
  const { t } = useTranslation()
  const nav = useNavigate()
  const [searchParams] = useSearchParams()
  const { user: email, username, token, language, level } = useContext(AuthContext)
  const { activeTopic } = useAssistant()

  const [topic, setTopic] = useState("")
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [image, setImage] = useState(null)
  const [showCamera, setShowCamera] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const fileInputRef = useRef(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const chatEndRef = useRef(null)

  // Initial setup from URL or assistant context
  useEffect(() => {
    const urlTopic = searchParams.get("topic");
    const targetTopic = urlTopic || activeTopic;
    
    // Only auto-initialize if it hasn't been done yet in this mounting cycle
    if (targetTopic && messages.length === 0 && !loading) {
      const initialMessage = { role: 'user', content: targetTopic };
      setMessages([initialMessage]);
      setTopic(""); // Clear immediately for ChatGPT flow
      
      // Small delay to ensure state is ready if needed, then ask AI
      setTimeout(() => {
        askAI(targetTopic, [initialMessage]);
      }, 100);

      // Clean the URL so it doesn't persistently re-trigger
      if (urlTopic) {
        searchParams.delete('topic');
        nav({ search: searchParams.toString() }, { replace: true });
      }
    }
  }, [activeTopic, searchParams, messages.length, loading, nav]);

  useEffect(() => { if (email) fetchHistory() }, [email, messages])

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const fetchHistory = async () => {
    try {
      const res = await API.get(`/ai/history?email=${email}`)
      // Only include history starting with 'Tutor: '
      const tutorHistory = res.data.history
        .filter(h => h.question && h.question.startsWith('Tutor: '))
        .reverse();
      setHistory(tutorHistory);
    } catch { console.error("Failed to fetch history") }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
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
      setImage(canvas.toDataURL('image/jpeg')); stopCamera()
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) videoRef.current.srcObject.getTracks().forEach(t => t.stop())
    setShowCamera(false)
  }

  const getLangCode = () => {
    switch (language) {
      case "Tamil": return "ta-IN";
      case "Hindi": return "hi-IN";
      case "Malayalam": return "ml-IN";
      case "Telugu": return "te-IN";
      default: return "en-US";
    }
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
    if (!text || !window.speechSynthesis) return;

    // Toggle off if already speaking
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const startSpeech = () => {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*#_`~]/g, "").trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      const langCode = getLangCode();
      const voices = window.speechSynthesis.getVoices();

      // Multi-Browser Targeted Search
      let selected = voices.find(v => v.lang.replace('_', '-').toLowerCase() === langCode.toLowerCase()) ||
        voices.find(v => v.name.toLowerCase().includes(language.toLowerCase())) ||
        voices.find(v => v.lang.includes("-IN") || v.lang.includes("_IN"));

      if (selected) utterance.voice = selected;
      utterance.lang = langCode;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    };

    // Chrome/Edge Async Voice Loading Fix
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = startSpeech;
    } else {
      startSpeech();
    }
  };

  const askAI = async (overrideTopic = null, overrideHistory = null) => {
    const currentTopic = overrideTopic || topic;
    if (!currentTopic) return;

    const currentHistory = overrideHistory || [...messages, { role: 'user', content: currentTopic }];

    if (!overrideHistory) {
      setMessages(currentHistory);
      setTopic("");
    }

    setLoading(true);
    try {
      const res = await API.post("/ai/ask", {
        email: email || "User",
        topic: currentTopic,
        image: image || null,
        language,
        level,
        history: currentHistory
      });

      const aiMessage = { role: 'assistant', content: res.data.response };
      setMessages(prev => [...prev, aiMessage]);
      setImage(null);
    } catch {
      toast.error(t('failed_generate_lesson'));
    } finally {
      setLoading(false);
    }
  }

  const handleDownloadPDF = async (content, topicName) => {
    const tid = toast.loading(t('generating_pdf'));
    try {
      const res = await API.post("/ai/download-pdf", {
        email: email || "User",
        topic: topicName,
        language,
        level,
        content
      }, { responseType: 'blob' });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `AccessTech_Lesson_${topicName.replace(/\s+/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(t('pdf_downloaded'), { id: tid });
    } catch {
      toast.error(t('failed_download_pdf'), { id: tid });
    }
  }

  return (
    <div className="h-screen flex flex-col bg-fuchsia-100/50 dark:bg-gray-950">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

        {/* Sidebar */}
        <aside className={`fixed md:relative z-40 w-72 flex flex-col h-[calc(100vh-64px)] overflow-y-auto transition-transform duration-300 border-r ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} bg-white border-fuchsia-200 dark:bg-gray-900 dark:border-fuchsia-900/40 shadow-xl`}>
          <div className="p-5 border-b border-fuchsia-100 dark:border-fuchsia-900/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br from-fuchsia-400 to-fuchsia-600">
                <User size={18} className="text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm truncate text-fuchsia-900 dark:text-fuchsia-50">{username}</p>
                <div className="flex gap-1.5 mt-1">
                  <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wide rounded-md bg-fuchsia-100 text-fuchsia-600">{language}</span>
                  <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wide rounded-md bg-purple-100 text-purple-700">{level}</span>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="md:hidden text-fuchsia-400"><X size={18} /></button>
            </div>
          </div>

          <div className="p-4">
            <button onClick={() => { setMessages([]); setTopic(""); setSidebarOpen(false); }}
              className="w-full flex items-center justify-center gap-2 text-white py-3 rounded-xl font-bold text-sm shadow-lg bg-gradient-to-br from-fuchsia-400 to-fuchsia-600 hover:scale-[1.02] active:scale-[0.98] transition-all">
              <Plus size={16} /> {t('new_chat')}
            </button>
          </div>

          <div className="px-4 pb-4 flex-1 overflow-y-auto">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-fuchsia-400 dark:text-fuchsia-600">
              <HistoryIcon size={12} /> {t('history')}
            </div>
            {history.length === 0 ? (
              <p className="text-xs italic text-center py-6 text-fuchsia-400">{t('no_history')}</p>
            ) : (
              <div className="space-y-2">
                {history.map((item, idx) => {
                  const displayQuestion = item.question ? item.question.replace('Tutor: ', '') : "Chat";
                  
                  // Universal Brute-Force Parser for deeply nested stringification
                  const parseRobustly = (content) => {
                    if (!content) return "";
                    let current = content;
                    // Max 3 passes to avoid infinite loops but catch double-stringified data
                    for (let i = 0; i < 3; i++) {
                      if (typeof current !== 'string') break;
                      try {
                        const parsed = JSON.parse(current);
                        // If it parsed into something different, continue to check next level
                        if (parsed === current) break;
                        current = parsed;
                      } catch { break; }
                    }
                    return current;
                  };

                  return (
                    <button key={idx}
                      className="w-full text-left p-3 rounded-xl border transition-all group bg-fuchsia-50/50 border-fuchsia-100 hover:border-fuchsia-300 dark:bg-fuchsia-900/10 dark:border-fuchsia-900/20"
                      onClick={() => {
                        const parsedObj = parseRobustly(item.response);
                        // CRITICAL: React will crash if we pass an object to ReactMarkdown
                        const finalResponse = typeof parsedObj === 'string' 
                          ? parsedObj 
                          : JSON.stringify(parsedObj, null, 2);

                        // Force a clean React state cycle by briefly clearing messages
                        setMessages([]);
                        setTopic(""); // Keep input clear like ChatGPT
                        setSidebarOpen(false);

                        // Injection with a small delay to force repaint
                        setTimeout(() => {
                          setMessages([
                            { role: 'user', content: displayQuestion },
                            { role: 'assistant', content: finalResponse }
                          ]);
                        }, 50);
                      }}>
                      <p className="text-sm font-semibold line-clamp-2 text-fuchsia-900 dark:text-fuchsia-100">{displayQuestion}</p>
                      <div className="flex items-center gap-1 mt-2 text-[10px] text-fuchsia-400">
                        <Clock size={10} /> {t('previously_asked')}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        {/* Main Area */}
        <main className="flex-1 flex flex-col h-[calc(100vh-64px)] bg-transparent relative overflow-hidden">
          {/* Header */}
          <header className="p-4 flex items-center justify-between border-b bg-white/80 backdrop-blur-md border-fuchsia-100 dark:bg-gray-950/80 dark:border-fuchsia-900/30 z-10">
            <div className="flex items-center gap-3">
              <button onClick={() => nav(-1)} className="p-2 rounded-lg text-fuchsia-400 hover:text-fuchsia-600 transition-colors">
                <ArrowLeft size={20} />
              </button>
              <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-lg text-fuchsia-500 hover:bg-fuchsia-50">
                <Menu size={20} />
              </button>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md bg-gradient-to-br from-fuchsia-400 to-fuchsia-600">
                <Sparkles size={18} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight text-fuchsia-900 dark:text-fuchsia-50">{t('luminatutor')}</h1>
                <p className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-widest">{t('ai_powered_teacher')}</p>
              </div>
            </div>
          </header>

          <div className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto space-y-6">
            {/* Chat History Flow */}
            <div className="w-full max-w-4xl mx-auto space-y-8 pb-10 flex-1">
              {messages.length === 0 ? (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-700">
                  <div className="relative">
                    <div className="absolute inset-0 bg-fuchsia-400/20 blur-2xl rounded-full scale-125 animate-pulse" />
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl flex items-center justify-center shadow-xl bg-white dark:bg-gray-900 border border-fuchsia-100 dark:border-fuchsia-800 relative z-10 animate-bounce">
                      <Bot size={40} className="text-fuchsia-500" />
                    </div>
                  </div>
                  <div className="relative z-10">
                    <p className="text-[10px] md:text-xs font-black text-fuchsia-400 uppercase tracking-[0.4em] opacity-80 animate-pulse">
                      GET STARTED
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                    <div className={`max-w-[92%] md:max-w-[80%] rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border ${msg.role === 'user'
                        ? 'bg-fuchsia-600 text-white border-fuchsia-500 rounded-tr-none'
                        : 'bg-white dark:bg-gray-900 border-fuchsia-100 dark:border-fuchsia-900/30 text-gray-800 dark:text-gray-200 rounded-tl-none'
                      }`}>
                      <div className="flex items-center gap-2 mb-3 text-[10px] font-black uppercase tracking-widest opacity-80">
                        {msg.role === 'user' ? <User size={12} /> : <Sparkles size={12} />}
                        {msg.role === 'user' ? t('you') : t('luminatutor')}
                      </div>

                      {msg.role === 'assistant' ? (
                        <div className="prose prose-fuchsia dark:prose-invert max-w-none text-sm md:text-base leading-relaxed space-y-4 
                          [&>h3]:text-lg [&>h3]:font-black [&>h3]:text-fuchsia-900 dark:[&>h3]:text-fuchsia-100 [&>h3]:mt-6 [&>h3]:mb-2
                          [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-5 [&>li]:mb-2 [&>code]:bg-fuchsia-50 dark:[&>code]:bg-fuchsia-900/30 
                          [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded-md [&>code]:text-fuchsia-600 dark:[&>code]:text-fuchsia-400">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.content}
                          </ReactMarkdown>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-4 sm:mt-6 pt-4 border-t border-fuchsia-50 dark:border-fuchsia-900/20">
                            <button onClick={() => speakResponse(msg.content)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-xs shadow-sm ${isSpeaking
                                  ? 'bg-red-100 text-red-500 animate-pulse'
                                  : 'bg-fuchsia-100/50 dark:bg-fuchsia-900/20 text-fuchsia-600 hover:scale-105'
                                }`}>
                              {isSpeaking ? <MicOff size={14} /> : <Volume2 size={14} />}
                              {isSpeaking ? "Speaker ON" : "Speaker OFF"}
                            </button>
                            <button onClick={() => handleDownloadPDF(msg.content, "Lesson")}
                              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-100/50 dark:bg-blue-900/20 text-blue-600 hover:scale-105 transition-all font-bold text-xs shadow-sm">
                              <FileDown size={14} />
                              PDF Download
                            </button>
                            <button onClick={() => nav(`/quiz?topic=${encodeURIComponent(topic || "Lesson")}&from=tutor`)}
                              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-100/50 dark:bg-pink-900/20 text-pink-600 hover:scale-105 transition-all font-bold text-xs shadow-sm">
                              <Target size={14} />
                              Take Quiz
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm md:text-base font-bold leading-tight">{msg.content}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="flex justify-start animate-pulse">
                  <div className="bg-white dark:bg-gray-900 border border-fuchsia-100 dark:border-fuchsia-900/30 rounded-3xl rounded-tl-none p-6 flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-fuchsia-300 animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-fuchsia-400 animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 rounded-full bg-fuchsia-500 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </div>

          {/* Input Area (Restoration to bottom) */}
          <div className="p-4 md:p-8 flex justify-center bg-gradient-to-t from-fuchsia-50/80 to-transparent dark:from-gray-950/80 z-10">
            <div className="w-full max-w-4xl space-y-4">
              {image && (
                <div className="relative w-20 h-20 group ml-4 animate-in zoom-in duration-200">
                  <img src={image} alt="Preview" className="w-full h-full object-cover rounded-2xl border-2 border-fuchsia-300 shadow-xl" />
                  <button onClick={() => setImage(null)} className="absolute -top-2 -right-2 bg-red-400 text-white p-1 rounded-full shadow-lg">
                    <X size={12} />
                  </button>
                </div>
              )}

              {showCamera && (
                <div className="relative mb-4 max-w-xs rounded-2xl overflow-hidden border-2 shadow-2xl border-fuchsia-300 ml-2 sm:ml-4">
                  <video ref={videoRef} autoPlay playsInline className="w-full" />
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
                    <button onClick={capturePhoto} className="p-2 rounded-lg bg-fuchsia-600 text-white"><Camera size={16} /></button>
                    <button onClick={stopCamera} className="p-2 rounded-lg bg-red-400 text-white"><X size={16} /></button>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 bg-white dark:bg-gray-900 p-2 rounded-3xl shadow-xl border border-fuchsia-100 dark:border-fuchsia-900/30">
                <div className="flex items-center justify-between sm:justify-start gap-1 px-1 sm:px-0 sm:pl-2">
                  <button onClick={toggleLocalSTT}
                    className={`p-2 rounded-2xl transition-all ${isListening ? 'bg-red-100 text-red-500 animate-pulse' : 'text-fuchsia-400 hover:bg-fuchsia-50'}`}>
                    <Mic size={20} />
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                  <button onClick={() => fileInputRef.current.click()} className="p-2 rounded-2xl text-fuchsia-400 hover:bg-fuchsia-50">
                    <ImageIcon size={20} />
                  </button>
                  <button onClick={startCamera} className="p-2 rounded-2xl text-fuchsia-400 hover:bg-fuchsia-50">
                    <Camera size={20} />
                  </button>
                </div>
                <div className="flex items-center flex-1 gap-2 bg-fuchsia-50/50 dark:bg-gray-950/50 rounded-2xl pr-1 pl-3 py-1 border border-transparent focus-within:border-fuchsia-200 dark:focus-within:border-fuchsia-900/50">
                  <input
                    className="flex-1 w-full py-2 outline-none text-sm md:text-base bg-transparent text-gray-800 dark:text-gray-100 font-semibold placeholder-gray-400"
                    placeholder="Ask Lumina Tutor..."
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && askAI()}
                  />
                  <button
                    disabled={loading || (!topic.trim() && !image)}
                    onClick={() => askAI()}
                    className="bg-fuchsia-600 text-white p-2.5 sm:p-3 rounded-xl shadow-md hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all shrink-0">
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}