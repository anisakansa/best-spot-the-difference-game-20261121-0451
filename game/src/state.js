// Game state for Misteri Kampung Pelabuhan.
// One job: the single source of truth — screen, level progress, score, timer,
// lives, hints, combo, stars — plus save/load in localStorage.

import { LEVELS, LIVES_PER_LEVEL, SAVE_KEY, SCORE } from './config.js';
import { SCENES } from './scenes.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_LEVELS = 'levels';
export const SCREEN_PLAY = 'play';
export const SCREEN_PAUSE = 'pause';
export const SCREEN_CLEAR = 'clear';
export const SCREEN_OVER = 'over';
export const SCREEN_WIN = 'win';

export function starsForLevel(misses, livesLeft) {
  if (misses === 0 && livesLeft >= 2) return 3;
  if (misses <= 2) return 2;
  return 1;
}

export function createState() {
  return {
    screen: SCREEN_TITLE,
    levelIndex: 0,
    found: new Set(),
    foundOrder: [],
    timeLeft: LEVELS[0].time,
    lives: LIVES_PER_LEVEL,
    hintsLeft: LEVELS[0].hints,
    combo: 0,
    bestCombo: 0,
    score: 0,
    misses: 0,
    stars: loadSave().stars,
    unlocked: loadSave().unlocked,
    totalScore: loadSave().totalScore,
    hintPulse: null, // { diffIndex, until }
    wrongFlash: null, // { x, y, panel, until }
    foundFlash: null, // { x, y, panel, until }
    lensOn: false,
    mouse: { x: -1, y: -1, inside: false },
    lastTickSecond: -1,
    message: '',
    messageUntil: 0,
  };
}

export function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return { stars: {}, unlocked: 0, totalScore: 0 };
    const parsed = JSON.parse(raw);
    return {
      stars: parsed.stars || {},
      unlocked: typeof parsed.unlocked === 'number' ? parsed.unlocked : 0,
      totalScore: typeof parsed.totalScore === 'number' ? parsed.totalScore : 0,
    };
  } catch {
    return { stars: {}, unlocked: 0, totalScore: 0 };
  }
}

export function persistSave(state) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      stars: state.stars,
      unlocked: state.unlocked,
      totalScore: state.totalScore,
    }));
  } catch {
    // storage unavailable (private mode): the game still plays.
  }
}

/** Start (or restart) a level: fresh timer, lives, hints and found set. */
export function startLevel(state, levelIndex) {
  state.levelIndex = levelIndex;
  state.found = new Set();
  state.foundOrder = [];
  state.timeLeft = LEVELS[levelIndex].time;
  state.lives = LIVES_PER_LEVEL;
  state.hintsLeft = LEVELS[levelIndex].hints;
  state.combo = 0;
  state.bestCombo = 0;
  state.misses = 0;
  state.hintPulse = null;
  state.wrongFlash = null;
  state.foundFlash = null;
  state.screen = SCREEN_PLAY;
  state.lastTickSecond = -1;
  state.message = '';
}

/** How many differences this level hides, and how many are still unfound. */
export function diffTotal(state) {
  return SCENES[state.levelIndex].diffs.length;
}

export function diffRemaining(state) {
  return diffTotal(state) - state.found.size;
}

/**
 * Register a found difference: score grows with the combo, a flash marks the spot.
 * Returns true when the level is now complete.
 */
export function registerFind(state, diffIndex, now) {
  state.found.add(diffIndex);
  state.foundOrder.push(diffIndex);
  state.combo += 1;
  state.bestCombo = Math.max(state.bestCombo, state.combo);
  const gained = SCORE.basePerFind + (state.combo - 1) * SCORE.comboStep;
  state.score += gained;
  state.foundFlash = { diffIndex, until: now + 900 };
  return state.found.size === diffTotal(state);
}

/** Register a wrong click: combo breaks, a life is lost, a red X flashes. */
export function registerMiss(state, x, y, panel, now) {
  state.combo = 0;
  state.misses += 1;
  state.lives -= 1;
  state.score = Math.max(0, state.score - SCORE.wrongPenalty);
  state.wrongFlash = { x, y, panel, until: now + 700 };
  return state.lives <= 0;
}

/** Spend one hint: pulse the first unfound difference for two seconds. */
export function useHint(state, now) {
  if (state.hintsLeft <= 0) return null;
  const scene = SCENES[state.levelIndex];
  for (let i = 0; i < scene.diffs.length; i += 1) {
    if (!state.found.has(i)) {
      state.hintsLeft -= 1;
      state.score = Math.max(0, state.score - SCORE.hintCost);
      state.hintPulse = { diffIndex: i, until: now + 2000 };
      return scene.diffs[i];
    }
  }
  return null;
}

/** Finish a level: time bonus, stars, unlock the next level, persist. */
export function finishLevel(state) {
  const timeBonus = Math.round(state.timeLeft) * SCORE.timeBonusPerSecond;
  state.score += timeBonus;
  state.totalScore += state.score;
  const stars = starsForLevel(state.misses, state.lives);
  const prev = state.stars[state.levelIndex] || 0;
  state.stars[state.levelIndex] = Math.max(prev, stars);
  state.unlocked = Math.max(state.unlocked, Math.min(state.levelIndex + 1, LEVELS.length - 1));
  persistSave(state);
  return { timeBonus, stars };
}
