// Speaks words aloud with the browser's built-in text-to-speech.
//
// Which voices exist depends on the visitor's device and browser.
// Some have no voice for a language at all (for example, many Windows
// computers have no Indonesian voice), so we always check first.

import { useEffect, useState } from "react";

// Waits for the browser's list of voices. Some browsers fill it in a
// moment after the page loads, so we wait briefly if it's empty.
function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return Promise.resolve([]);
  }
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) return Promise.resolve(voices);

  return new Promise((resolve) => {
    const done = () => resolve(window.speechSynthesis.getVoices());
    window.speechSynthesis.addEventListener("voiceschanged", done, { once: true });
    setTimeout(done, 1500); // give up waiting after 1.5 seconds
  });
}

// Finds a voice for a language code like "ja-JP": the exact match
// first, then any voice for the same language ("ja").
function findVoice(voices: SpeechSynthesisVoice[], lang: string) {
  const wanted = lang.toLowerCase();
  const base = wanted.split("-")[0];
  const tidy = (v: SpeechSynthesisVoice) => v.lang.toLowerCase().replace("_", "-");
  return (
    voices.find((v) => tidy(v) === wanted) ??
    voices.find((v) => tidy(v).split("-")[0] === base) ??
    null
  );
}

export type VoiceCheck =
  | { status: "checking" }
  | { status: "ready"; voice: SpeechSynthesisVoice }
  | { status: "missing" };

// Use in a component: tells you whether this device can speak the
// language, and gives you the voice to use.
export function useVoice(lang: string): VoiceCheck {
  const [result, setResult] = useState<{ lang: string; check: VoiceCheck }>({
    lang,
    check: { status: "checking" },
  });

  useEffect(() => {
    let cancelled = false;
    loadVoices().then((voices) => {
      if (cancelled) return;
      const voice = findVoice(voices, lang);
      setResult({ lang, check: voice ? { status: "ready", voice } : { status: "missing" } });
    });
    return () => {
      cancelled = true;
    };
  }, [lang]);

  // While a new language is being checked, don't report the old one.
  return result.lang === lang ? result.check : { status: "checking" };
}

// Says the text out loud. rate 1 is normal speed; lower is slower.
export function speak(text: string, voice: SpeechSynthesisVoice, rate = 0.9) {
  window.speechSynthesis.cancel(); // stop anything still playing
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = voice;
  utterance.lang = voice.lang;
  utterance.rate = rate;
  window.speechSynthesis.speak(utterance);
}
