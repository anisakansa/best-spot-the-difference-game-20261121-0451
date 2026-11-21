// Synthesised sound effects for Misteri Kampung Pelabuhan.
// One job: every beep, chime and jingle, made with WebAudio only — no audio files.

let audioCtx = null;
let muted = false;

export function setMuted(value) {
  muted = value;
}

export function isMuted() {
  return muted;
}

function ensureCtx() {
  if (audioCtx === null) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function tone(freq, startAt, duration, type, volume) {
  const ctx = ensureCtx();
  if (ctx === null || muted) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + startAt);
  gain.gain.setValueAtTime(0.0001, ctx.currentTime + startAt);
  gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startAt + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime + startAt);
  osc.stop(ctx.currentTime + startAt + duration + 0.05);
}

/** Two-note chime when a difference is found; pitch rises with the combo. */
export function playFound(combo) {
  const base = 520 + Math.min(combo, 5) * 40;
  tone(base, 0, 0.18, 'sine', 0.25);
  tone(base * 1.5, 0.09, 0.28, 'sine', 0.25);
}

/** Low buzz for a wrong click. */
export function playWrong() {
  tone(160, 0, 0.22, 'sawtooth', 0.15);
  tone(120, 0.05, 0.22, 'sawtooth', 0.12);
}

/** Soft blip when a hint fires. */
export function playHint() {
  tone(880, 0, 0.12, 'triangle', 0.2);
  tone(1174, 0.1, 0.18, 'triangle', 0.18);
}

/** Rising arpeggio when a level is cleared. */
export function playLevelClear() {
  [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.3, 'triangle', 0.22));
}

/** Long fanfare for finishing the whole story. */
export function playVictory() {
  [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.13, 0.35, 'triangle', 0.22));
}

/** Short tick when the timer is almost out. */
export function playTick() {
  tone(1000, 0, 0.06, 'square', 0.08);
}

/** Click for menu buttons. */
export function playClick() {
  tone(660, 0, 0.08, 'sine', 0.15);
}
