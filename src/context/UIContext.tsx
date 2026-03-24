import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

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
  sidebarExpanded: boolean;
  setSidebarExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
  pageMetadata: PageMetadata;
  setPageMetadata: React.Dispatch<React.SetStateAction<PageMetadata>>;
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
  SPEECH_RATE: "speech_rate",
  SPEECH_VOICE: "speech_voice",
};

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sidebarExpanded, setSidebarExpandedInternal] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.SIDEBAR_EXPANDED) === "true";
  });
  
  const [speechRate, setSpeechRateState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SPEECH_RATE);
    return saved ? parseFloat(saved) : 1;
  });

  const [speechVoice, setSpeechVoiceState] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.SPEECH_VOICE) || "";
  });

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

  const setSidebarExpanded = useCallback((value: React.SetStateAction<boolean>) => {
    setSidebarExpandedInternal((prev) => {
      const next = typeof value === "function" ? value(prev) : value;
      localStorage.setItem(STORAGE_KEYS.SIDEBAR_EXPANDED, String(next));
      return next;
    });
  }, []);

  const setSpeechRate = useCallback((rate: number) => {
    setSpeechRateState(rate);
    localStorage.setItem(STORAGE_KEYS.SPEECH_RATE, String(rate));
  }, []);

  const setSpeechVoice = useCallback((voice: string) => {
    setSpeechVoiceState(voice);
    localStorage.setItem(STORAGE_KEYS.SPEECH_VOICE, voice);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarExpanded((prev) => !prev);
  }, [setSidebarExpanded]);

  return (
    <UIContext.Provider
      value={{
        sidebarExpanded,
        setSidebarExpanded,
        toggleSidebar,
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
