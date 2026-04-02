import React, { useState, useEffect, useRef } from "react";
import {
  ResponsiveModal,
  ResponsiveModalContent,
} from "@/components/ui/responsive-modal";
import {
  X,
  Palette,
  Type,
  Volume2,
  Leaf,
  Zap,
} from "lucide-react";
import { useUI } from "@/context";
import { Slider } from "@/components/ui/slider";

interface UISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UISettingsModal: React.FC<UISettingsModalProps> = ({ isOpen, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const {
    grayscale,
    setGrayscale,
    dyslexiaMode,
    setDyslexiaMode,
    fontScale,
    setFontScale,
    speechRate,
    setSpeechRate,
    speechVoice,
    setSpeechVoice,
    performanceMode,
    setPerformanceMode,
  } = useUI();

  // Draft states for pending changes
  const [draftFontScale, setDraftFontScale] = useState(fontScale);
  const [draftGrayscale, setDraftGrayscale] = useState(grayscale);
  const [draftDyslexic, setDraftDyslexic] = useState(dyslexiaMode);
  const [draftQualityMode, setDraftQualityMode] = useState(performanceMode);
  const [draftSpeechRate, setDraftSpeechRate] = useState(speechRate);
  const [draftSpeechVoice, setDraftSpeechVoice] = useState(speechVoice);

  const fontSteps = [80, 90, 100, 110, 120];

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Sync draft state with global state when modal opens
  useEffect(() => {
    if (isOpen) {
      setDraftFontScale(fontScale);
      setDraftGrayscale(grayscale);
      setDraftDyslexic(dyslexiaMode);
      setDraftQualityMode(performanceMode);
      setDraftSpeechRate(speechRate);
      setDraftSpeechVoice(speechVoice);
    }
  }, [isOpen, fontScale, grayscale, dyslexiaMode, performanceMode, speechRate, speechVoice]);

  const hasPendingChanges =
    draftFontScale !== fontScale ||
    draftGrayscale !== grayscale ||
    draftDyslexic !== dyslexiaMode ||
    draftQualityMode !== performanceMode ||
    draftSpeechRate !== speechRate ||
    draftSpeechVoice !== speechVoice;

  const increaseFont = () => {
    const currentIndex = fontSteps.indexOf(draftFontScale);
    if (currentIndex < fontSteps.length - 1) {
      setDraftFontScale(fontSteps[currentIndex + 1]);
    }
  };

  const decreaseFont = () => {
    const currentIndex = fontSteps.indexOf(draftFontScale);
    if (currentIndex > 0) {
      setDraftFontScale(fontSteps[currentIndex - 1]);
    }
  };

  const handleApplySettings = () => {
    setFontScale(draftFontScale);
    setGrayscale(draftGrayscale);
    setDyslexiaMode(draftDyslexic);
    setPerformanceMode(draftQualityMode);
    setSpeechRate(draftSpeechRate);
    setSpeechVoice(draftSpeechVoice);
    onClose();
  };

  const handleCancelSettings = () => {
    onClose();
  };

  // Preview logic: Apply draft settings to the document root while open
  useEffect(() => {
    if (!isOpen) return;

    const root = document.documentElement;

    // Apply Grayscale Preview
    if (draftGrayscale) {
      root.style.filter = "grayscale(100%)";
    } else {
      root.style.filter = "";
    }

    // Apply Dyslexia Preview
    if (draftDyslexic) {
      root.classList.add("dyslexic-mode");
    } else {
      root.classList.remove("dyslexic-mode");
    }

    // Apply Performance Preview
    if (!draftQualityMode) {
      root.classList.add("perf-mode");
    } else {
      root.classList.remove("perf-mode");
    }

    // Apply Font Scale Preview
    root.style.fontSize = `${(draftFontScale / 100) * 16}px`;

    return () => { };
  }, [isOpen, draftGrayscale, draftDyslexic, draftQualityMode, draftFontScale]);

  // Revert preview on cancel/close
  useEffect(() => {
    if (!isOpen && mounted) {
      const root = document.documentElement;
      // Revert to global state values
      if (grayscale) {
        root.style.filter = "grayscale(100%)";
      } else {
        root.style.filter = "";
      }

      if (dyslexiaMode) {
        root.classList.add("dyslexic-mode");
      } else {
        root.classList.remove("dyslexic-mode");
      }

      if (performanceMode) {
        root.classList.add("perf-mode");
      } else {
        root.classList.remove("perf-mode");
      }

      root.style.fontSize = `${(fontScale / 100) * 16}px`;
    }
  }, [isOpen, grayscale, dyslexiaMode, performanceMode, fontScale, mounted]);

  return (
    <ResponsiveModal open={isOpen} onOpenChange={handleCancelSettings}>
      <ResponsiveModalContent className="flex flex-col w-full h-[95dvh] sm:h-auto sm:max-h-[85vh] sm:max-w-2xl overflow-hidden p-0 border-t sm:border border-slate-300/90 bg-[rgb(246,247,249)] text-slate-800 shadow-2xl dark:border-white/10 dark:bg-[#1a1c1e] dark:text-white">
        {/* Header */}
        <div className="border-b border-slate-300/90 bg-white/50 px-5 py-4 sm:px-7 sm:py-6 dark:border-white/10 dark:bg-white/5 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Display & Accessibility
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-white/60">
                Customize your viewing and reading experience
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 sm:space-y-6 px-4 py-6 sm:px-7 sm:py-8 overflow-y-auto overflow-x-hidden flex-1">
          {/* Grayscale */}
          <div className="rounded-3xl border border-slate-200 bg-white/40 p-5 dark:border-white/5 dark:bg-white/[0.02]">
            <div className="mb-4 flex items-center gap-2">
              <Palette size={18} className="text-primary" />
              <p className="text-lg font-thin text-slate-900 dark:text-white">Grayscale Mode</p>
            </div>
            <button
              onClick={() => setDraftGrayscale(!draftGrayscale)}
              className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 transition hover:border-primary/50 dark:border-white/10 dark:bg-white/5"
            >
              <span className="font-medium">{draftGrayscale ? "On" : "Off"}</span>
              <div className={`relative h-6 w-11 rounded-full p-1 transition-colors ${draftGrayscale ? 'bg-primary' : 'bg-slate-300 dark:bg-white/20'}`}>
                <div className={`h-4 w-4 rounded-full bg-white transition-transform ${draftGrayscale ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
            </button>
          </div>

          {/* Dyslexia Friendly */}
          <div className="rounded-3xl border border-slate-200 bg-white/40 p-5 dark:border-white/5 dark:bg-white/[0.02]">
            <div className="mb-4 flex items-center gap-2">
              <Type size={18} className="text-primary" />
              <p className="text-lg font-thin text-slate-900 dark:text-white">Dyslexia Friendly Font</p>
            </div>
            <button
              onClick={() => setDraftDyslexic(!draftDyslexic)}
              className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 transition hover:border-primary/50 dark:border-white/10 dark:bg-white/5"
            >
              <span className="font-medium">{draftDyslexic ? "On" : "Off"}</span>
              <div className={`relative h-6 w-11 rounded-full p-1 transition-colors ${draftDyslexic ? 'bg-primary' : 'bg-slate-300 dark:bg-white/20'}`}>
                <div className={`h-4 w-4 rounded-full bg-white transition-transform ${draftDyslexic ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
            </button>
          </div>

          {/* Performance Mode */}
          <div className="rounded-3xl border border-slate-200 bg-white/40 p-5 dark:border-white/5 dark:bg-white/[0.02]">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {draftQualityMode ? <Zap size={18} className="text-amber-500 shrink-0" /> : <Leaf size={18} className="text-emerald-500 shrink-0" />}
                <p className="text-[17px] sm:text-lg font-thin text-slate-900 dark:text-white leading-tight">Graphics Quality</p>
              </div>
            </div>
            <button
              onClick={() => setDraftQualityMode(!draftQualityMode)}
              className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 transition hover:border-amber-500/50 dark:border-white/10 dark:bg-white/5"
            >
              <span className="font-medium">{draftQualityMode ? "High Quality" : "Performance"}</span>
              <div className={`relative h-6 w-11 rounded-full p-1 transition-colors ${draftQualityMode ? 'bg-amber-500' : 'bg-emerald-500'}`}>
                <div className={`h-4 w-4 rounded-full bg-white transition-transform ${draftQualityMode ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
            </button>
          </div>

          {/* Font Size Section */}
          <div className="rounded-3xl border border-slate-300 bg-[rgb(241,243,246)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] dark:border-white/10 dark:bg-white/[0.045] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <div className="mb-4 flex items-center gap-2">
              <Type size={18} className="text-primary" />
              <p className="text-lg font-medium text-slate-900 dark:text-white">
                Font Size
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 px-2 md:px-6 w-full max-w-sm mx-auto min-h-[60px]">
              {/* Desktop Font Scale Slider */}
              <span className="hidden md:block text-xl font-medium text-slate-900 dark:text-white shrink-0">
                A
              </span>

              <div className="hidden md:flex flex-1 items-center justify-between px-1">
                {fontSteps.map((step, index) => {
                  const isActive = step === draftFontScale;

                  return (
                    <div
                      key={step}
                      className="relative flex flex-1 items-center justify-center"
                    >
                      {index < fontSteps.length - 1 && (
                        <span className="absolute left-1/2 top-1/2 h-1 w-full -translate-y-1/2 bg-slate-300 dark:bg-white/12" />
                      )}

                      <button
                        type="button"
                        onClick={() => setDraftFontScale(step)}
                        className="group relative z-10 flex items-center justify-center"
                        aria-label={`Set font size to ${step}%`}
                      >
                        <span
                          className={`relative h-2 w-2 rounded-full border transition ${isActive
                            ? "scale-125 border-primary bg-primary shadow-[0_0_0_6px_rgba(128,0,0,0.18)]"
                            : "border-slate-300 bg-white hover:scale-110 hover:border-primary/50 hover:bg-primary/15 dark:border-white/15 dark:bg-white/80"
                            }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>

              <span className="hidden md:block text-5xl font-medium leading-none text-slate-900 dark:text-white shrink-0">
                A
              </span>

              {/* Mobile Text Preview */}
              <div className="md:hidden flex items-center justify-center h-16 w-full rounded-2xl bg-white/50 border border-slate-200 dark:bg-black/20 dark:border-white/10 shadow-inner">
                <span
                  className="font-medium text-slate-900 dark:text-white transition-all duration-300"
                  style={{ fontSize: `${(draftFontScale / 100) * 1.5}rem` }}
                >
                  Aa
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={decreaseFont}
                disabled={draftFontScale <= 80}
                className="rounded-xl border border-slate-300 bg-[rgb(249,250,251)] px-3 py-1.5 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-white hover:border-primary/25 hover:text-primary hover:shadow-md hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/[0.05] dark:text-white dark:hover:bg-white/[0.08]"
              >
                −
              </button>

              <p className="min-w-[72px] text-center text-sm font-medium text-slate-600 dark:text-white/60">
                {draftFontScale}%
              </p>

              <button
                onClick={increaseFont}
                disabled={draftFontScale >= 120}
                className="rounded-xl border border-slate-300 bg-[rgb(249,250,251)] px-3 py-1.5 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-white hover:border-primary/25 hover:text-primary hover:shadow-md hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/[0.05] dark:text-white dark:hover:bg-white/[0.08]"
              >
                +
              </button>
            </div>
          </div>

          {/* Voice Speed */}
          <div className="rounded-3xl border border-slate-200 bg-white/40 p-5 dark:border-white/5 dark:bg-white/[0.02]">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 size={18} className="text-primary" />
                <p className="text-lg font-thin text-slate-900 dark:text-white">Reading Speed</p>
              </div>
              <span className="text-sm font-bold text-primary px-3 py-1 bg-primary/10 rounded-full">{draftSpeechRate}x</span>
            </div>
            <div className="px-2">
              <Slider
                value={[draftSpeechRate]}
                min={0.5}
                max={2}
                step={0.1}
                onValueChange={([v]) => setDraftSpeechRate(v)}
                className="py-4"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-300/90 bg-white/50 p-4 sm:px-7 sm:py-5 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 dark:border-white/10 dark:bg-white/5 shrink-0 pb-6 sm:pb-5">
          {!hasPendingChanges && (
            <p className="hidden sm:block mr-auto text-xs font-medium text-slate-500 dark:text-white/40">
              Settings are up to date
            </p>
          )}
          <button
            onClick={handleCancelSettings}
            className="rounded-2xl border border-slate-300 bg-white px-6 py-3.5 sm:py-2.5 text-sm font-medium transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 w-full sm:w-auto"
          >
            Cancel
          </button>
          <button
            onClick={handleApplySettings}
            disabled={!hasPendingChanges}
            className={`rounded-2xl px-8 py-3.5 sm:py-2.5 text-sm font-bold transition shadow-lg w-full sm:w-auto ${hasPendingChanges
              ? 'bg-primary text-white hover:bg-primary/90'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-white/5 dark:text-white/20'
              }`}
          >
            Apply Changes
          </button>
        </div>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};
