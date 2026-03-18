import { createContext, useContext, useEffect, useState } from "react";

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  const [dyslexiaMode, setDyslexiaMode] = useState(false);
  const [fontSize, setFontSize] = useState("base");
  const [highContrast, setHighContrast] = useState(false);

  
  useEffect(() => {
    const root = document.documentElement;

    // 🔹 Dyslexia Mode
    if (dyslexiaMode) {
      document.body.classList.add("dyslexia-mode");
    } else {
      document.body.classList.remove("dyslexia-mode");
    }

    // 🔹 Font Size
    root.classList.remove("text-sm", "text-base", "text-lg", "text-xl");
    root.classList.add(`text-${fontSize}`);

    // 🔹 High Contrast
    if (highContrast) {
      root.classList.toggle("high-contrast", highContrast);
    } else {
      root.classList.remove("high-contrast", highContrast);
    }

  }, [dyslexiaMode, fontSize, highContrast]);
  // 👆 Runs every time user changes a setting

  return (
    <AccessibilityContext.Provider
      value={{
        dyslexiaMode,
        setDyslexiaMode,
        fontSize,
        setFontSize,
        highContrast,
        setHighContrast,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);