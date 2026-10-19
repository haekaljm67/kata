// Soft sound effects for answers (Settings → Sound effects).
//
// The tones are made by the browser itself with the Web Audio API, so
// there are no sound files to download or license.

import { getSettings } from "./settings";

let context: AudioContext | null = null;

// Plays one soft note. "at" is a delay in seconds from now.
function note(frequency: number, at: number, length: number, type: OscillatorType) {
  if (!context) return;
  const start = context.currentTime + at;
  const oscillator = context.createOscillator();
  const volume = context.createGain();

  oscillator.type = type;
  oscillator.frequency.value = frequency;
  // Fade in quickly and out gently, so it sounds round, not clicky.
  volume.gain.setValueAtTime(0, start);
  volume.gain.linearRampToValueAtTime(0.07, start + 0.015);
  volume.gain.exponentialRampToValueAtTime(0.0001, start + length);

  oscillator.connect(volume).connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + length);
}

// A light rising chime for a right answer, a low soft tone for a
// wrong one. Does nothing if sound effects are off in Settings.
export function playAnswerSound(correct: boolean) {
  if (!getSettings().soundEffects || typeof window === "undefined") return;
  try {
    context ??= new AudioContext();
    if (correct) {
      note(659.25, 0, 0.22, "sine"); // E5
      note(880, 0.09, 0.32, "sine"); // A5
    } else {
      note(233.08, 0, 0.32, "triangle"); // B♭3
    }
  } catch {
    // Some browsers block audio until the page is tapped. Stay silent.
  }
}
