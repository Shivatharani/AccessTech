import os

NEW_CODE = """
  const speakText = useCallback((text) => {
    if (!text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const langCode = getLangCode();
    utterance.lang = langCode;
    
    const startSpeaking = () => {
      const voices = window.speechSynthesis.getVoices();
      const targetLang = langCode.split('-')[0];
      let bestVoice = voices.find(v => v.lang === langCode) || 
                      voices.find(v => v.lang.startsWith(targetLang)) ||
                      voices.find(v => v.name.toLowerCase().includes(targetLang === 'hi' ? 'hindi' : targetLang === 'ta' ? 'tamil' : 'english'));
      
      if (bestVoice) utterance.voice = bestVoice;
      window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = startSpeaking;
    } else {
      startSpeaking();
    }
  }, [getLangCode]);

  const processCommand = useCallback(async (transcript) => {
    const text = transcript.toLowerCase().trim();
    console.log(`Processing command: ${text}`);
    
    try {
      const res = await fetch('http://localhost:5000/ai/voice-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentLang || "User", transcript: text })
      });
      const data = await res.json();
      
      if (data.feedback) {
        toast.info(data.feedback);
        speakText(data.feedback);
      }

      const { intent, params } = data;
      
      switch (intent) {
        case 'navigate': nav(params.path); break;
        case 'toggle_theme': setTheme(params.mode); break;
        case 'toggle_dyslexia': setDyslexiaMode(!dyslexiaMode); break;
        case 'toggle_contrast': setHighContrast(!highContrast); break;
        case 'adjust_font': setFontSize(params.size); break;
        case 'logout': logout(); nav("/login"); break;
        case 'submit': triggerCommand("submit"); break;
        case 'ask_ai': 
          if (params.query) {
            triggerCommand("ask_ai");
            if (window.location.pathname !== '/tutor') nav('/tutor');
          }
          break;
        default:
          toast.error(`${t('command_not_recognized')}: "${text}"`);
      }
    } catch (err) {
      console.error("NLU Error:", err);
      toast.error(t('error_recognizing'));
    }
  }, [nav, triggerCommand, t, currentLang, logout, setTheme, dyslexiaMode, setDyslexiaMode, highContrast, setHighContrast, setFontSize, speakText]);
"""

file_path = r"c:\Users\shiva\OneDrive\Desktop\accesstech\frontend\src\components\VoiceAssistant.jsx"
with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

# The block to replace is roughly lines 27 to 113 (1-indexed)
# In 0-indexed: lines[26] to lines[112]
new_lines = lines[:26] + [NEW_CODE] + lines[113:]

with open(file_path, "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print("Successfully updated VoiceAssistant.jsx")
