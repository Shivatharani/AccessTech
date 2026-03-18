import os

NEW_CODE = """
  const speakResponse = (text) => {
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
"""

file_path = r"c:\Users\shiva\OneDrive\Desktop\accesstech\frontend\src\pages\Tutor.jsx"
with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

# The speakResponse function starts around line 141 and ends around line 190
# Let's find the actual lines
start_idx = -1
end_idx = -1
for i, line in enumerate(lines):
    if "const speakResponse = (text) => {" in line:
        start_idx = i
    if start_idx != -1 and "  };" in line and i > start_idx + 30: # Look for the end of the function
        end_idx = i
        break

if start_idx != -1 and end_idx != -1:
    new_lines = lines[:start_idx] + [NEW_CODE] + lines[end_idx+1:]
    with open(file_path, "w", encoding="utf-8") as f:
        f.writelines(new_lines)
    print("Successfully updated Tutor.jsx")
else:
    print(f"Failed to find speakResponse block. Start: {start_idx}, End: {end_idx}")
