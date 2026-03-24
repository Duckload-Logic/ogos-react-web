import React, { useState, useEffect, useCallback } from "react";
import { X, Settings as SettingsIcon, MousePointer2, Ear, AudioLines } from "lucide-react";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useUI } from "@/context/UIContext";

export const SpeechControl: React.FC = () => {
  const isMobile = useIsMobile();
  const { voices, speechRate, speechVoice } = useUI();
  const { speak, stop } = useSpeechSynthesis(voices);
  const [isVisible, setIsVisible] = useState(false);
  const [readerActive, setReaderActive] = useState(false);
  const [showTip, setShowTip] = useState(false);

  // Auto-show after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      const viewedTip = localStorage.getItem("speech_tip_viewed_v2");
      if (!viewedTip) setShowTip(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const dismissTip = () => {
    setShowTip(false);
    localStorage.setItem("speech_tip_viewed_v2", "true");
  };

  const handleToggle = () => {
    dismissTip();
    const newState = !readerActive;
    setReaderActive(newState);
    if (!newState) {
      stop();
      // Remove any leftover outlines
      document.querySelectorAll(".reader-highlight").forEach(el => {
        el.classList.remove("reader-highlight");
      });
    }
  };

  // Global Interaction Logic
  useEffect(() => {
    if (!readerActive) return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Filter out speech control UI and any portaled content (like dropdowns)
      if (target.closest('.speech-control-ui') ||
        target.closest('.speech-control-ignore') ||
        target.closest('[data-radix-portal]')) return;

      // Clean up previous
      document.querySelectorAll(".reader-highlight").forEach(el => {
        el.classList.remove("reader-highlight");
      });

      // Add highlight to current
      target.classList.add("reader-highlight");
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Filter out speech control UI and any portaled content (like dropdowns)
      if (target.closest('.speech-control-ui') ||
        target.closest('.speech-control-ignore') ||
        target.closest('[data-radix-portal]')) return;

      e.preventDefault();
      e.stopPropagation();

      const text = target.innerText || target.getAttribute('aria-label') || "";
      if (text.trim()) {
        const voice = voices.find(v => v.name === speechVoice || v.voiceURI === speechVoice);
        speak(text, { 
          rate: speechRate, 
          voiceName: voice?.name || speechVoice,
          voiceURI: voice?.voiceURI 
        });
      }
    };

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("click", handleClick, true);
      document.querySelectorAll(".reader-highlight").forEach(el => {
        el.classList.remove("reader-highlight");
      });
    };
  }, [readerActive, speak, speechRate, speechVoice]);

  if (!isVisible) return null;

  return (
    <div className={`speech-control-ui fixed z-50 flex flex-col items-end gap-3 transition-all duration-500 ${isMobile ? "bottom-24 right-4" : "bottom-6 right-6"}`}>
      {/* Quick Tip */}
      {showTip && !readerActive && (
        <div className="pointer-events-auto mb-2 mr-2 bg-primary text-primary-foreground p-4 rounded-2xl shadow-xl max-w-[220px] animate-in slide-in-from-right-4 fade-in duration-500 relative">
          <button onClick={dismissTip} className="absolute -top-1 -right-1 bg-slate-900 rounded-full p-1 border border-white/20"><X size={10} /></button>
          <p className="text-xs font-semibold flex items-center gap-1.5 mb-1"><Ear size={14} /> Interactive Reader</p>
          <p className="text-[10px] leading-tight opacity-90">Turn it on and click any part of the page to have it read aloud!</p>
        </div>
      )}

      {/* Reader Status Indicator */}
      {readerActive && (
        <div className="pointer-events-none flex flex-col items-end gap-2 mb-2 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest shadow-lg border border-white/20 animate-pulse">
            <MousePointer2 size={12} /> Live Reader
          </div>
        </div>
      )}

      {/* Main Toggle Bubble */}
      <div className="pointer-events-auto">
        <button
          onClick={handleToggle}
          className={`
            group relative flex items-center justify-center transition-all duration-500
            shadow-[0_12px_40px_-8px_rgb(0,0,0,0.15)] border
            h-16 w-16
            ${readerActive
              ? "rounded-full bg-primary border-primary text-primary-foreground"
              : "rounded-full bg-primary text-primary-foreground border-white/20 hover:scale-110 active:scale-95"}
          `}
        >
          {readerActive ? <Ear size={30} /> : <AudioLines size={30} />}

          {/* Status Label (Desktop) */}
          {!readerActive && !isMobile && (
            <span className="absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-200">
              Turn On Reader Mode
            </span>
          )}

          {/* Active Ping */}
          {readerActive && (
            <span className="absolute inset-0 rounded-full animate-ping bg-primary/20 -z-10" />
          )}
        </button>
      </div>
    </div>
  );
};
