import { createContext, useContext, useEffect, useState } from "react";

const AccessibilityContext = createContext();

// ─── NEW: Font metadata for all 5 languages ───────────────────────────────────
const DYSLEXIA_FONTS = {
  english: {
    label: "English",
    flag: "🇬🇧",
    googleFont:
      "https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600&display=swap",
    css: `
      body.dyslexia-mode[data-lang="english"],
      body.dyslexia-mode[data-lang="english"] * {
        font-family: 'Lexend', 'OpenDyslexic', Arial, sans-serif !important;
        letter-spacing: 0.06em !important;
        word-spacing: 0.18em !important;
        line-height: 1.9 !important;
      }
      body.dyslexia-mode[data-lang="english"] p,
      body.dyslexia-mode[data-lang="english"] li,
      body.dyslexia-mode[data-lang="english"] span {
        text-align: left !important;
        max-width: 70ch;
      }
    `,
  },
  tamil: {
    label: "தமிழ்",
    flag: "🇮🇳",
    googleFont:
      "https://fonts.googleapis.com/css2?family=Anek+Tamil:wght@300;400;500;600&display=swap",
    css: `
      body.dyslexia-mode[data-lang="tamil"],
      body.dyslexia-mode[data-lang="tamil"] * {
        font-family: 'Anek Tamil', 'Noto Sans Tamil', sans-serif !important;
        letter-spacing: 0.02em !important; /* keep small — Tamil vowel markers sit on consonants */
        word-spacing: 0.25em !important;
        line-height: 2.1 !important;
      }
      body.dyslexia-mode[data-lang="tamil"] p,
      body.dyslexia-mode[data-lang="tamil"] li,
      body.dyslexia-mode[data-lang="tamil"] span {
        text-align: left !important;
        max-width: 60ch;
      }
    `,
  },
  hindi: {
    label: "हिन्दी",
    flag: "🇮🇳",
    googleFont:
      "https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600&display=swap",
    css: `
      body.dyslexia-mode[data-lang="hindi"],
      body.dyslexia-mode[data-lang="hindi"] * {
        font-family: 'Baloo 2', 'Noto Sans Devanagari', sans-serif !important;
        letter-spacing: 0 !important; /* CRITICAL: must be 0 — spacing detaches matras from consonants */
        word-spacing: 0.22em !important;
        line-height: 2.2 !important;
      }
      body.dyslexia-mode[data-lang="hindi"] p,
      body.dyslexia-mode[data-lang="hindi"] li,
      body.dyslexia-mode[data-lang="hindi"] span {
        text-align: left !important;
        max-width: 60ch;
      }
    `,
  },
  telugu: {
    label: "తెలుగు",
    flag: "🇮🇳",
    googleFont:
      "https://fonts.googleapis.com/css2?family=Hind+Guntur:wght@300;400;500;600&display=swap",
    css: `
      body.dyslexia-mode[data-lang="telugu"],
      body.dyslexia-mode[data-lang="telugu"] * {
        font-family: 'Hind Guntur', 'Noto Sans Telugu', sans-serif !important;
        letter-spacing: 0.01em !important;
        word-spacing: 0.22em !important;
        line-height: 2.3 !important; /* tallest — Telugu stacked conjuncts are very tall */
      }
      body.dyslexia-mode[data-lang="telugu"] p,
      body.dyslexia-mode[data-lang="telugu"] li,
      body.dyslexia-mode[data-lang="telugu"] span {
        text-align: left !important;
        max-width: 58ch;
      }
    `,
  },
  malayalam: {
    label: "മലയാളം",
    flag: "🇮🇳",
    googleFont:
      "https://fonts.googleapis.com/css2?family=Noto+Sans+Malayalam:wght@300;400;500;600&display=swap",
    css: `
      body.dyslexia-mode[data-lang="malayalam"],
      body.dyslexia-mode[data-lang="malayalam"] * {
        font-family: 'Noto Sans Malayalam', sans-serif !important;
        letter-spacing: 0.01em !important;
        word-spacing: 0.22em !important;
        line-height: 2.0 !important;
      }
      body.dyslexia-mode[data-lang="malayalam"] p,
      body.dyslexia-mode[data-lang="malayalam"] li,
      body.dyslexia-mode[data-lang="malayalam"] span {
        text-align: left !important;
        max-width: 58ch;
      }
    `,
  },
};

// ─── NEW: Inject Google Fonts + all CSS rules once on page load ───────────────
const STYLE_ID = "dyslexia-lang-styles";

function injectDyslexiaAssets() {
  // Inject all 5 Google Font <link> tags (only once each)
  Object.values(DYSLEXIA_FONTS).forEach(({ googleFont }) => {
    if (!document.querySelector(`link[href="${googleFont}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = googleFont;
      document.head.appendChild(link);
    }
  });

  // Inject all CSS rules in one <style> tag (only once)
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = Object.values(DYSLEXIA_FONTS)
      .map((f) => f.css)
      .join("\n");
    document.head.appendChild(style);
  }
}

// ─────────────────────────────────────────────────────────────────────────────

export const AccessibilityProvider = ({ children }) => {
  // ─── EXISTING state (unchanged) ───────────────────────────────────────────
  const [dyslexiaMode, setDyslexiaMode] = useState(false);
  const [fontSize, setFontSize] = useState("base");
  const [highContrast, setHighContrast] = useState(false);

  // ─── NEW: language state ──────────────────────────────────────────────────
  const [language, setLanguage] = useState(
    () => localStorage.getItem("dx_lang") || "english"
  );

  // ─── NEW: inject fonts + CSS on first render ──────────────────────────────
  useEffect(() => {
    injectDyslexiaAssets();
  }, []);

  // ─── EXISTING effect — with two NEW lines added inside ────────────────────
  useEffect(() => {
    const root = document.documentElement;

    // 🔹 Dyslexia Mode (existing logic — unchanged)
    if (dyslexiaMode) {
      document.body.classList.add("dyslexia-mode");
    } else {
      document.body.classList.remove("dyslexia-mode");
    }

    // 🔹 Font Size (existing logic — unchanged)
    root.classList.remove("text-sm", "text-base", "text-lg", "text-xl");
    root.classList.add(`text-${fontSize}`);

    // 🔹 High Contrast (existing logic — unchanged)
    if (highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }

    // ─── NEW: apply selected language as data attribute on body ───────────
    document.body.setAttribute("data-lang", language);
    localStorage.setItem("dx_lang", language);
    // ──────────────────────────────────────────────────────────────────────

  }, [dyslexiaMode, fontSize, highContrast, language]); // ← added `language` here

  return (
    <AccessibilityContext.Provider
      value={{
        // ─── EXISTING values (unchanged) ────────────────────────────────
        dyslexiaMode,
        setDyslexiaMode,
        fontSize,
        setFontSize,
        highContrast,
        setHighContrast,
        // ─── NEW values ──────────────────────────────────────────────────
        language,
        setLanguage,
        DYSLEXIA_FONTS, // exposed so the panel can read labels/flags
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);