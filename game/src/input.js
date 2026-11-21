// Input for Misteri Kampung Pelabuhan.
// One job: turn mouse clicks, taps and keys into game actions — find a difference,
// spend a hint, toggle the lens, pause, or press a menu button.

import { PANEL, VIEW } from './config.js';
import { SCENES } from './scenes.js';
import { buttons, panelAt } from './render.js';
import {
  SCREEN_CLEAR, SCREEN_LEVELS, SCREEN_OVER, SCREEN_PAUSE, SCREEN_PLAY,
  SCREEN_TITLE, SCREEN_WIN, diffRemaining, finishLevel, registerFind,
  registerMiss, startLevel, useHint,
} from './state.js';
import { isMuted, playClick, playFound, playHint, playLevelClear, playVictory, playWrong, setMuted } from './audio.js';

function buttonAt(x, y) {
  for (let i = buttons.length - 1; i >= 0; i -= 1) {
    const b = buttons[i];
    if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) return b;
  }
  return null;
}

/** Click inside a panel: a hit marks the difference, a miss costs a life. */
function clickPanel(state, hit, now) {
  const scene = SCENES[state.levelIndex];
  for (let i = 0; i < scene.diffs.length; i += 1) {
    if (state.found.has(i)) continue;
    const d = scene.diffs[i];
    const dx = hit.sx - d.x;
    const dy = hit.sy - d.y;
    if (dx * dx + dy * dy <= (d.r + 8) * (d.r + 8)) {
      const complete = registerFind(state, i, now);
      playFound(state.combo);
      if (complete) {
        const result = finishLevel(state);
        if (state.levelIndex === 9) {
          playVictory();
          state.screen = SCREEN_WIN;
        } else {
          playLevelClear();
          state.screen = SCREEN_CLEAR;
        }
        state.lastResult = result;
      }
      return;
    }
  }
  const gameOver = registerMiss(state, hit.sx, hit.sy, hit.panel, now);
  playWrong();
  if (gameOver) state.screen = SCREEN_OVER;
}

function pressButton(state, id, now) {
  playClick();
  switch (id) {
    case 'play':
      startLevel(state, state.unlocked);
      break;
    case 'levels':
    case 'quit-levels':
      state.screen = SCREEN_LEVELS;
      break;
    case 'back-title':
      state.screen = SCREEN_TITLE;
      break;
    case 'hint': {
      const diff = useHint(state, now);
      if (diff) {
        playHint();
        state.message = `Petunjuk: cari di sekitar ${diff.label}!`;
        state.messageUntil = now + 2000;
      }
      break;
    }
    case 'lens':
      state.lensOn = !state.lensOn;
      break;
    case 'sound':
      setMuted(!isMuted());
      state.message = isMuted() ? 'Suara dimatikan.' : 'Suara dinyalakan.';
      state.messageUntil = now + 1500;
      break;
    case 'pause':
      if (state.screen === SCREEN_PLAY) state.screen = SCREEN_PAUSE;
      break;
    case 'resume':
      state.screen = SCREEN_PLAY;
      break;
    case 'restart':
    case 'retry':
      startLevel(state, state.levelIndex);
      break;
    case 'replay':
      startLevel(state, state.levelIndex);
      break;
    case 'next':
      startLevel(state, state.levelIndex + 1);
      break;
    case 'win':
      state.screen = SCREEN_WIN;
      break;
    case 'play-again':
      startLevel(state, 0);
      break;
    default:
      if (id.startsWith('level-')) {
        const index = Number(id.slice('level-'.length));
        if (index <= state.unlocked) startLevel(state, index);
      }
      break;
  }
}

/** A click/tap at logical canvas coordinates. */
export function handleClick(state, x, y, now) {
  const button = buttonAt(x, y);
  if (button) {
    pressButton(state, button.id, now);
    return;
  }
  if (state.screen === SCREEN_PLAY) {
    const hit = panelAt(x, y);
    if (hit) clickPanel(state, hit, now);
  }
}

/** Keyboard shortcuts: H hint, M lens, P/Esc pause, Enter start. */
export function handleKey(state, key, now) {
  const k = key.toLowerCase();
  if (k === 'h' && state.screen === SCREEN_PLAY) {
    const diff = useHint(state, now);
    if (diff) {
      playHint();
      state.message = `Petunjuk: cari di sekitar ${diff.label}!`;
      state.messageUntil = now + 2000;
    }
  } else if (k === 'm' && state.screen === SCREEN_PLAY) {
    state.lensOn = !state.lensOn;
  } else if ((k === 'p' || k === 'escape') && state.screen === SCREEN_PLAY) {
    state.screen = SCREEN_PAUSE;
  } else if ((k === 'p' || k === 'escape') && state.screen === SCREEN_PAUSE) {
    state.screen = SCREEN_PLAY;
  } else if (k === 'enter' && state.screen === SCREEN_TITLE) {
    startLevel(state, state.unlocked);
  }
}

/** Convert a pointer event's client coordinates to logical canvas coordinates. */
export function toLogical(canvas, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((clientX - rect.left) / rect.width) * VIEW.width,
    y: ((clientY - rect.top) / rect.height) * VIEW.height,
  };
}

export { PANEL, diffRemaining };
