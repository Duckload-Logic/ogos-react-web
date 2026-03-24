import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Settings,
  LogOut,
  Gavel,
  ShieldCheck,
  Type,
  Palette,
  X,
  Volume2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUI } from "@/context/UIContext";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { Slider } from "@/components/ui/slider";
import Dropdown from "@/components/form/Dropdown";

interface ProfileMenuProps {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  roleLabel: string;
  section?: string;
  studentNumber?: string;
  profilePath: string;
  onLogout: () => void;
  grayscale: boolean;
  setGrayscale: (value: boolean) => void;
  isDyslexic: boolean;
  setDyslexic: (value: boolean) => void;
}

export default function ProfileMenu({
  firstName,
  middleName,
  lastName,
  roleLabel,
  section,
  studentNumber,
  profilePath,
  onLogout,
  grayscale,
  setGrayscale,
  isDyslexic,
  setDyslexic,
}: ProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [appliedFontScale, setAppliedFontScale] = useState(100);
  const [draftFontScale, setDraftFontScale] = useState(100);
  const [appliedGrayscale, setAppliedGrayscale] = useState(grayscale);
  const [draftGrayscale, setDraftGrayscale] = useState(grayscale);
  const [appliedDyslexic, setAppliedDyslexic] = useState(isDyslexic);
  const [draftDyslexic, setDraftDyslexic] = useState(isDyslexic);

  const {
    voices,
    speechRate,
    setSpeechRate,
    speechVoice,
    setSpeechVoice,
  } = useUI();
  const [draftSpeechRate, setDraftSpeechRate] = useState(speechRate);
  const [draftSpeechVoice, setDraftSpeechVoice] = useState(speechVoice);

  const fontSteps = [80, 90, 100, 110, 120];

  const menuRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const hasPendingChanges =
    draftFontScale !== appliedFontScale ||

    draftGrayscale !== appliedGrayscale ||
    draftDyslexic !== appliedDyslexic ||
    draftSpeechRate !== speechRate ||
    draftSpeechVoice !== speechVoice;

  const persistFont = (value: number) => {
    const safeValue = Math.max(80, Math.min(120, value));
    localStorage.setItem("fontScale", String(safeValue));
    setAppliedFontScale(safeValue);
  };

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
    persistFont(draftFontScale);

    setAppliedGrayscale(draftGrayscale);
    setGrayscale(draftGrayscale);

    setAppliedDyslexic(draftDyslexic);
    setDyslexic(draftDyslexic);

    setSpeechRate(draftSpeechRate);
    setSpeechVoice(draftSpeechVoice);
    setSettingsOpen(false);
  };

  const handleCancelSettings = () => {
    setDraftFontScale(appliedFontScale);
    setDraftGrayscale(appliedGrayscale);
    setDraftDyslexic(appliedDyslexic);

    document.documentElement.style.fontSize = `${appliedFontScale}%`;
    setGrayscale(appliedGrayscale);
    setDyslexic(appliedDyslexic);

    setDraftSpeechRate(speechRate);
    setDraftSpeechVoice(speechVoice);
    setSettingsOpen(false);
  };

  useEffect(() => {
    setMounted(true);

    const savedFontScale = Number(localStorage.getItem("fontScale"));
    const initialFontScale =
      !Number.isNaN(savedFontScale) &&
        savedFontScale >= 80 &&
        savedFontScale <= 120
        ? savedFontScale
        : 100;

    setAppliedFontScale(initialFontScale);
    setDraftFontScale(initialFontScale);
    setAppliedGrayscale(grayscale);
    setDraftGrayscale(grayscale);
    setAppliedDyslexic(isDyslexic);
    setDraftDyslexic(isDyslexic);
    setDraftSpeechRate(speechRate);
    setDraftSpeechVoice(speechVoice);
    document.documentElement.style.fontSize = `${initialFontScale}%`;

    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!settingsOpen) {
      setAppliedGrayscale(grayscale);
      setDraftGrayscale(grayscale);
    }
  }, [grayscale, settingsOpen]);

  useEffect(() => {
    if (settingsOpen) {
      setDyslexic(draftDyslexic);
    }
  }, [draftDyslexic, settingsOpen, setDyslexic]);

  useEffect(() => {
    if (settingsOpen) {
      document.documentElement.style.fontSize = `${draftFontScale}%`;
    }
  }, [draftFontScale, settingsOpen]);

  useEffect(() => {
    if (settingsOpen) {
      setGrayscale(draftGrayscale);
    }
  }, [draftGrayscale, settingsOpen, setGrayscale]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Ignore clicks inside portals (like our voice dropdown) or elements marked for exclusion
      if (
        target.closest("[data-radix-portal]") ||
        target.closest(".speech-control-ignore")
      ) {
        return;
      }

      if (open && menuRef.current && !menuRef.current.contains(target)) {
        setOpen(false);
      }

      if (
        settingsOpen &&
        modalRef.current &&
        !modalRef.current.contains(target)
      ) {
        handleCancelSettings();
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, settingsOpen, appliedFontScale, appliedGrayscale, appliedDyslexic]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (settingsOpen) {
          handleCancelSettings();
          return;
        }
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [settingsOpen, appliedFontScale, appliedGrayscale]);

  useEffect(() => {
    if (settingsOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [settingsOpen]);

  const settingsModal =
    mounted && settingsOpen
      ? createPortal(
        <div className="fixed inset-0 z-[10000]">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px] dark:bg-black/24" />

          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-10 top-6 h-44 w-44 rounded-full bg-rose-200/25 blur-3xl dark:hidden" />
            <div className="absolute bottom-6 right-20 h-48 w-48 rounded-full bg-amber-100/18 blur-3xl dark:hidden" />
            <div className="absolute right-24 top-14 h-40 w-40 rounded-full bg-white/50 blur-3xl dark:hidden" />

            <div className="absolute -left-8 top-8 hidden h-44 w-44 rounded-full bg-rose-300/10 blur-3xl dark:block" />
            <div className="absolute bottom-8 right-20 hidden h-48 w-48 rounded-full bg-amber-200/8 blur-3xl dark:block" />
            <div className="absolute right-24 top-16 hidden h-40 w-40 rounded-full bg-sky-200/6 blur-3xl dark:block" />
          </div>

          <div className="relative flex min-h-screen items-center justify-center p-4">
            <div
              ref={modalRef}
              className="w-full max-w-2xl overflow-hidden rounded-[32px] border border-slate-300/90 bg-[rgb(246,247,249)] text-slate-800 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.18),inset_0_1px_0_rgba(255,255,255,0.75)] max-h-[90vh] overflow-y-auto dark:border-white/10 dark:bg-[#35383d] dark:text-white dark:shadow-[0_24px_70px_-24px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.05)]"
            >
              <div className="border-b border-slate-300/90 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(241,243,246,0.98))] px-7 py-6 dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                      Settings
                    </h2>
                    <p className="mt-1 text-sm text-slate-600 dark:text-white/60">
                      Customize your viewing preferences
                    </p>
                  </div>

                  <button
                    onClick={handleCancelSettings}
                    className="rounded-full p-2 text-slate-500 transition hover:bg-white hover:text-slate-800 hover:scale-105 active:scale-95 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
                  >
                    <X size={22} />
                  </button>
                </div>
              </div>

              <div className="space-y-5 px-7 py-6">
                {/* Grayscale Section */}
                <div className="rounded-3xl border border-slate-300 bg-[rgb(241,243,246)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] dark:border-white/10 dark:bg-white/[0.045] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                  <div className="mb-4 flex items-center gap-2">
                    <Palette size={18} className="text-primary" />
                    <p className="text-lg font-medium text-slate-900 dark:text-white">
                      Grayscale
                    </p>
                  </div>

                  <button
                    onClick={() => setDraftGrayscale(!draftGrayscale)}
                    className="flex w-full items-center justify-between rounded-2xl border border-slate-300 bg-[rgb(249,250,251)] px-5 py-4 text-base text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition hover:bg-white hover:shadow-md active:scale-[0.99] dark:border-white/10 dark:bg-white/[0.05] dark:text-white dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] dark:hover:bg-white/[0.08]"
                  >
                    <span className="font-medium">
                      {draftGrayscale ? "Enabled" : "Disabled"}
                    </span>

                    <span
                      className={`relative h-7 w-14 rounded-full transition ${draftGrayscale
                        ? "bg-primary/45"
                        : "bg-slate-300 dark:bg-white/20"
                        }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 block h-6 w-6 rounded-full bg-white shadow-md transition ${draftGrayscale ? "translate-x-7" : "translate-x-0"
                          }`}
                      />
                    </span>
                  </button>

                  <div className="rounded-3xl border border-slate-300 bg-[rgb(241,243,246)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] dark:border-white/10 dark:bg-white/[0.045] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                    <div className="mb-4 flex items-center gap-2">
                      <Type size={18} className="text-primary" />
                      <p className="text-lg font-medium text-slate-900 dark:text-white">
                        Dyslexia
                      </p>
                    </div>

                    <button
                      onClick={() => setDraftDyslexic(!draftDyslexic)}
                      className="flex w-full items-center justify-between rounded-2xl border border-slate-300 bg-[rgb(249,250,251)] px-5 py-4 text-base text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition hover:bg-white hover:shadow-md active:scale-[0.99] dark:border-white/10 dark:bg-white/[0.05] dark:text-white dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] dark:hover:bg-white/[0.08]"
                    >
                      <span className="font-medium">
                        {draftDyslexic ? "Enabled" : "Disabled"}
                      </span>

                      <span
                        className={`relative h-7 w-14 rounded-full transition ${draftDyslexic
                            ? "bg-primary/45"
                            : "bg-slate-300 dark:bg-white/20"
                          }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 block h-6 w-6 rounded-full bg-white shadow-md transition ${draftDyslexic ? "translate-x-7" : "translate-x-0"
                            }`}
                        />
                      </span>
                    </button>
                  </div>
                </div>

                {/* Font Size Section */}
                <div className="rounded-3xl border border-slate-300 bg-[rgb(241,243,246)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] dark:border-white/10 dark:bg-white/[0.045] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                  <div className="mb-4 flex items-center gap-2">
                    <Type size={18} className="text-primary" />
                    <p className="text-lg font-medium text-slate-900 dark:text-white">
                      Font Size
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-2 px-2">
                    <span className="text-2xl font-medium text-slate-900 dark:text-white">
                      A
                    </span>

                    <div className="flex flex-[0.8] items-center justify-between px-2">
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
                                className={`relative h-4 w-4 rounded-full border transition ${isActive
                                  ? "scale-125 border-primary bg-primary shadow-[0_0_0_6px_rgba(128,0,0,0.18)]"
                                  : "border-slate-300 bg-white hover:scale-110 hover:border-primary/50 hover:bg-primary/15 dark:border-white/15 dark:bg-white/80"
                                  }`}
                              />
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    <span className="text-5xl font-medium leading-none text-slate-900 dark:text-white">
                      A
                    </span>
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

                {/* Voice Accessibility Section */}
                <div className="rounded-3xl border border-slate-300 bg-[rgb(241,243,246)] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] dark:border-white/10 dark:bg-white/[0.045] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                  <div className="mb-5 flex items-center gap-2">
                    <Volume2 size={18} className="text-primary" />
                    <p className="text-lg font-medium text-slate-900 dark:text-white">
                      Voice Accessibility
                    </p>
                  </div>

                  <div className="space-y-6 px-1">
                    {/* Reading Speed */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm font-medium text-slate-600 dark:text-white/60">
                        <span>Reading Speed</span>
                        <span className="text-primary font-bold">{draftSpeechRate}x</span>
                      </div>
                      <Slider
                        value={[draftSpeechRate]}
                        min={0.5}
                        max={2}
                        step={0.1}
                        onValueChange={([v]: number[]) => setDraftSpeechRate(v)}
                        className="py-2"
                      />
                    </div>

                    {/* Voice Selection */}
                    {/* <div className="space-y-3">
                      <p className="text-sm font-medium text-slate-600 dark:text-white/60">Voice Preference</p>
                      <Dropdown
                        label="Voice"
                        identifier="uri"
                        get="uri"
                        options={(() => {
                          const enVoices = voices.filter(v => v.lang.startsWith("en"));
                          const displayVoices = enVoices.length > 0 ? enVoices : voices;
                          return displayVoices.map(v => ({ uri: v.voiceURI, name: v.name }));
                        })()}
                        value={voices.find(v => v.name === draftSpeechVoice)?.voiceURI || draftSpeechVoice}
                        onChange={(uri) => {
                          const voice = voices.find(v => v.voiceURI === uri);
                          if (voice) setDraftSpeechVoice(voice.name);
                        }}
                        loading={voices.length === 0}
                        formStyle
                      />
                      {voices.length === 0 && (
                        <p className="text-[10px] text-primary/70 animate-pulse ml-1 italic">
                          Waking up voice engine...
                        </p>
                      )}
                    </div> */}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-300/90 bg-white/40 px-7 py-5 dark:border-white/10 dark:bg-white/[0.02]">
                {!hasPendingChanges && (
                  <p className="mr-auto text-xs font-medium text-slate-500 dark:text-white/40">
                    All settings up to date
                  </p>
                )}
                <button
                  onClick={handleCancelSettings}
                  className="rounded-2xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplySettings}
                  disabled={!hasPendingChanges}
                  className={`rounded-2xl border px-6 py-2.5 text-sm font-bold shadow-md transition active:scale-95 ${hasPendingChanges
                    ? "border-primary bg-primary text-white shadow-primary/20 hover:bg-primary/90"
                    : "cursor-not-allowed border-slate-300 bg-slate-100 text-slate-400 dark:border-white/10 dark:bg-white/5 dark:text-white/20"
                    }`}
                >
                  {hasPendingChanges ? "Apply Changes" : "No Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )
      : null;

  return (
    <>
      <div className="relative z-[9999]" ref={menuRef}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 p-2 rounded hover:bg-muted/30 transition text-foreground"
        >
          <Avatar className="h-7 w-7">
            <AvatarFallback className="text-xs font-semibold text-primary-foreground">
              {firstName?.charAt(0)}
              {lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm hidden md:block text-primary-foreground">
            {roleLabel}
          </span>
        </button>

        {open && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 mt-2 w-72 bg-card text-card-foreground border border-border rounded-xl shadow-xl z-[9999] overflow-hidden animate-in fade-in zoom-in-95 isolate"
          >
            <button
              onClick={() => {
                navigate(profilePath);
                setOpen(false);
              }}
              className="w-full text-left p-4 border-b border-border hover:bg-muted transition"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="font-semibold">
                    {firstName?.charAt(0)}
                    {lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">
                    {firstName} {middleName ? middleName[0] + "." : ""}{" "}
                    {lastName}
                  </p>

                  {section && studentNumber ? (
                    <p className="text-xs text-muted-foreground">
                      {section} • {studentNumber}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">{roleLabel}</p>
                  )}
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                setOpen(false);
                setSettingsOpen(true);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition text-left"
            >
              <Settings size={16} />
              <span>Settings</span>
            </button>

            <a
              href="https://www.pup.edu.ph/terms/"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition"
            >
              <Gavel size={16} />
              <span>Terms of Service</span>
            </a>

            <a
              href="https://www.pup.edu.ph/privacy/"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition"
            >
              <ShieldCheck size={16} />
              <span>Privacy Policy</span>
            </a>

            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 transition border-t border-border"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>

      {settingsModal}
    </>
  );
}