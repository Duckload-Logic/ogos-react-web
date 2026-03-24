import { useAuth } from "@/context/AuthContext";
import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";

export interface PageMetadata {
  title: string;
  description?: string;
  badgeText?: string;
  badgeIcon?: React.ReactNode;
  headerActions?: React.ReactNode;
  headerStats?: React.ReactNode;
  showDate?: boolean;
  isLoading?: boolean;
}

interface UIContextType {
  sidebarPinned: boolean;
  setSidebarPinned: (value: boolean | ((prev: boolean) => boolean)) => void;
  toggleSidebarPinned: () => void;
  sidebarHovered: boolean;
  setSidebarHovered: (value: boolean) => void;
  pageMetadata: PageMetadata;
  setPageMetadata: React.Dispatch<React.SetStateAction<PageMetadata>>;
  // UI Preferences
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  grayscale: boolean;
  setGrayscale: (value: boolean) => void;
  dyslexiaMode: boolean;
  setDyslexiaMode: (value: boolean) => void;
  fontScale: number;
  setFontScale: (value: number) => void;
  // Speech Settings
  voices: SpeechSynthesisVoice[];
  speechRate: number;
  setSpeechRate: (rate: number) => void;
  speechVoice: string;
  setSpeechVoice: (voice: string) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SIDEBAR_EXPANDED: "sidebar_expanded",
  DARK_MODE: "theme",
  GRAYSCALE: "grayscale",
  DYSLEXIA: "dyslexia",
  FONT_SCALE: "fontScale",
  SPEECH_RATE: "speech_rate",
  SPEECH_VOICE: "speech_voice",
};

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isLoading } = useAuth();
  const userId = user?.id;

  const [sidebarPinned, setSidebarPinnedInternal] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [darkMode, setDarkModeInternal] = useState(false);
  const [grayscale, setGrayscaleInternal] = useState(false);
  const [dyslexiaMode, setDyslexiaModeInternal] = useState(false);
  const [fontScale, setFontScaleInternal] = useState(100);
  const [speechRate, setSpeechRateState] = useState(1);
  const [speechVoice, setSpeechVoiceState] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const updateVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v && v.length > 0) {
        setVoices(v);
        return true;
      }
      return false;
    };

    // Use addEventListener for better compatibility and to avoid overwriting
    window.speechSynthesis.addEventListener("voiceschanged", updateVoices);

    // Initial check
    const ready = updateVoices();

    // Fallback polling for browsers that are slow to load voices
    let attempts = 0;
    const retryInterval = setInterval(() => {
      attempts++;
      const success = updateVoices();
      if (success || attempts > 20) { // Stop after success or 10 seconds (20 * 500ms)
        clearInterval(retryInterval);
      }
    }, 500);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", updateVoices);
      clearInterval(retryInterval);
    };
  }, []);

  const [pageMetadata, setPageMetadata] = useState<PageMetadata>({
    title: "",
  });

  // Re-initialize state whenever user changes
  useEffect(() => {
    if (!isLoading && userId) {
      const getPref = (key: string, def: string) => localStorage.getItem(`${key}-${userId}`) || localStorage.getItem(key) || def;

      setSidebarPinnedInternal(getPref(STORAGE_KEYS.SIDEBAR_EXPANDED, "false") === "true");
      setDarkModeInternal(getPref(STORAGE_KEYS.DARK_MODE, "light") === "dark");
      setGrayscaleInternal(getPref(STORAGE_KEYS.GRAYSCALE, "false") === "true");
      setDyslexiaModeInternal(getPref(STORAGE_KEYS.DYSLEXIA, "false") === "true");
      setFontScaleInternal(parseInt(getPref(STORAGE_KEYS.FONT_SCALE, "100"), 10));
      setSpeechRateState(parseFloat(getPref(STORAGE_KEYS.SPEECH_RATE, "1")));
      setSpeechVoiceState(getPref(STORAGE_KEYS.SPEECH_VOICE, ""));
    } else if (!isLoading && !userId) {
      // Reset to defaults on logout
      setSidebarPinnedInternal(false);
      setDarkModeInternal(false);
      setGrayscaleInternal(false);
      setDyslexiaModeInternal(false);
      setFontScaleInternal(100);
      setSpeechRateState(1);
      setSpeechVoiceState("");
    }
  }, [isLoading, userId]);

  const setSidebarPinned = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    setSidebarPinnedInternal((prev) => {
      const next = typeof value === "function" ? value(prev) : value;
      if (userId) {
        localStorage.setItem(`${STORAGE_KEYS.SIDEBAR_EXPANDED}-${userId}`, String(next));
      }
      return next;
    });
  }, [userId]);

  const setDarkMode = useCallback((value: boolean) => {
    setDarkModeInternal(value);
    if (userId) {
      localStorage.setItem(`${STORAGE_KEYS.DARK_MODE}-${userId}`, value ? "dark" : "light");
    }
  }, [userId]);

  const setGrayscale = useCallback((value: boolean) => {
    setGrayscaleInternal(value);
    if (userId) {
      localStorage.setItem(`${STORAGE_KEYS.GRAYSCALE}-${userId}`, String(value));
    }
  }, [userId]);

  const setDyslexiaMode = useCallback((value: boolean) => {
    setDyslexiaModeInternal(value);
    if (userId) {
      localStorage.setItem(`${STORAGE_KEYS.DYSLEXIA}-${userId}`, String(value));
    }
  }, [userId]);

  const setFontScale = useCallback((value: number) => {
    setFontScaleInternal(value);
    if (userId) {
      localStorage.setItem(`${STORAGE_KEYS.FONT_SCALE}-${userId}`, String(value));
    }
  }, [userId]);

  const setSpeechRate = useCallback((rate: number) => {
    setSpeechRateState(rate);
    if (userId) {
      localStorage.setItem(`${STORAGE_KEYS.SPEECH_RATE}-${userId}`, String(rate));
    }
  }, [userId]);

  const setSpeechVoice = useCallback((voice: string) => {
    setSpeechVoiceState(voice);
    if (userId) {
      localStorage.setItem(`${STORAGE_KEYS.SPEECH_VOICE}-${userId}`, voice);
    }
  }, [userId]);

  const toggleSidebarPinned = useCallback(() => {
    setSidebarPinned((prev) => !prev);
  }, [setSidebarPinned]);

  return (
    <UIContext.Provider
      value={{
        sidebarPinned,
        setSidebarPinned,
        toggleSidebarPinned,
        sidebarHovered,
        setSidebarHovered,
        darkMode,
        setDarkMode,
        grayscale,
        setGrayscale,
        dyslexiaMode,
        setDyslexiaMode,
        fontScale,
        setFontScale,
        pageMetadata,
        setPageMetadata,
        voices,
        speechRate,
        setSpeechRate,
        speechVoice,
        setSpeechVoice,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
};
