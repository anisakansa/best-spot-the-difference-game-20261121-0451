// Deterministic screenshot staging for Misteri Kampung Pelabuhan.
// One job: put the real game into the exact frame each screenshot shows —
// two panels side by side, some differences found (green markers), several
// still unfound, and the remaining counter readable — without any randomness,
// so the same shot always renders the same frame.

import { SCENES } from './scenes.js';
import { SCREEN_PLAY, startLevel } from './state.js';

// name -> { level, found indices, seconds left, lives, combo, score }
const SHOTS = {
  cover: { level: 6, found: [0, 1, 3, 5], timeLeft: 96, lives: 3, combo: 3, score: 450 },
  '2-pasar': { level: 1, found: [0, 2, 4], timeLeft: 118, lives: 3, combo: 2, score: 325 },
  '3-warung': { level: 4, found: [0, 1, 3, 5, 7], timeLeft: 74, lives: 2, combo: 4, score: 700 },
  '4-malam': { level: 9, found: [0, 2, 3, 5, 6, 8], timeLeft: 52, lives: 2, combo: 5, score: 1050 },
};

/**
 * Stage the named shot on a fresh state and return the screen to draw.
 * Any unknown name stages the cover.
 */
export function stageShot(name, state) {
  const shot = SHOTS[name] || SHOTS.cover;
  startLevel(state, shot.level);
  state.found = new Set(shot.found);
  state.foundOrder = [...shot.found];
  state.timeLeft = shot.timeLeft;
  state.lives = shot.lives;
  state.combo = shot.combo;
  state.bestCombo = shot.combo;
  state.score = shot.score;
  state.screen = SCREEN_PLAY;
  state.hintPulse = null;
  state.wrongFlash = null;
  state.foundFlash = null;
  // A hint ring on one more unfound difference shows the hint system working.
  const scene = SCENES[shot.level];
  for (let i = 0; i < scene.diffs.length; i += 1) {
    if (!state.found.has(i)) {
      state.hintPulse = { diffIndex: i, until: Number.POSITIVE_INFINITY };
      break;
    }
  }
  return { screen: SCREEN_PLAY };
}

export function shotNames() {
  return Object.keys(SHOTS);
}
