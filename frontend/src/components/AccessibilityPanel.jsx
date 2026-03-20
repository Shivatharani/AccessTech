import { useState } from "react";
import { useAccessibility } from "../context/AccessibilityContext";

export default function AccessibilityPanel() {
  const {
    dyslexiaMode,
    setDyslexiaMode,
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast,

  } = useAccessibility();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button — UNCHANGED */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Accessibility Settings"
        className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition"
      >
        ⚙️
      </button>

      {/* Panel — UNCHANGED wrapper */}
      {isOpen && (
        <div
          className="fixed bottom-20 right-6 z-50 w-72 p-4 rounded-xl shadow-xl 
                     bg-white dark:bg-gray-900 border dark:border-gray-700 space-y-4
                     max-h-[85vh] overflow-y-auto"
          role="dialog"
          aria-label="Accessibility Settings Panel"
        >
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Accessibility
          </h2>

          {/* 🔹 Dyslexia Mode — UNCHANGED */}
          <div className="flex items-center justify-between">
            <label className="text-gray-700 dark:text-gray-300">
              Dyslexia Mode
            </label>
            <input
              type="checkbox"
              checked={dyslexiaMode}
              onChange={() => setDyslexiaMode(!dyslexiaMode)}
              aria-label="Toggle Dyslexia Mode"
            />
          </div>


          {/* 🔹 Font Size — UNCHANGED */}
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              Font Size
            </label>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="w-full p-2 rounded border dark:bg-gray-800 dark:text-white"
              aria-label="Select Font Size"
            >
              <option value="sm">Small</option>
              <option value="base">Default</option>
              <option value="lg">Large</option>
              <option value="xl">Extra Large</option>
            </select>
          </div>

          {/* 🔹 High Contrast — UNCHANGED */}
          <div className="flex items-center justify-between">
            <label className="text-gray-700 dark:text-gray-300">
              High Contrast
            </label>
            <input
              type="checkbox"
              checked={highContrast}
              onChange={() => setHighContrast(!highContrast)}
              aria-label="Toggle High Contrast Mode"
            />
          </div>

          {/* Close Button — UNCHANGED */}
          <button
            onClick={() => setIsOpen(false)}
            className="w-full mt-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 rounded hover:opacity-90"
          >
            Close
          </button>
        </div>
      )}
    </>
  );
}