import { useState } from "react";

export const useSpeechSynthesis = (voices: SpeechSynthesisVoice[] = []) => {
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);

  const speak = (
    text: string,
    options: {
      voiceName?: string;
      voiceURI?: string;
      rate?: number;
      pitch?: number;
    } = {},
  ) => {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    if (options.voiceURI) {
      const selectedVoice = voices.find((v) => v.voiceURI === options.voiceURI);
      if (selectedVoice) utterance.voice = selectedVoice;
    } else if (options.voiceName) {
      const selectedVoice = voices.find((v) => v.name === options.voiceName);
      if (selectedVoice) utterance.voice = selectedVoice;
    }

    if (options.rate) utterance.rate = options.rate;
    if (options.pitch) utterance.pitch = options.pitch;

    utterance.onstart = () => {
      setSpeaking(true);
      setPaused(false);
    };
    utterance.onend = () => {
      setSpeaking(false);
      setPaused(false);
    };
    utterance.onerror = () => {
      setSpeaking(false);
      setPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
  };

  const pause = () => {
    window.speechSynthesis.pause();
    setPaused(true);
  };

  const resume = () => {
    window.speechSynthesis.resume();
    setPaused(false);
  };

  return { speak, stop, pause, resume, speaking, paused };
};
