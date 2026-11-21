// Bootstrap + game loop for Misteri Kampung Pelabuhan.
// One job: own the canvas, the clock and the event wiring; everything else
// (state, drawing, input, sound, scenes) lives in its own module.
// ?shot=<name> stages a deterministic screenshot scene instead of the title.

import { VIEW } from './config.js';
import { createState, SCREEN_OVER, SCREEN_PLAY, diffRemaining, diffTotal, startLevel } from './state.js';
import { SCENES } from './scenes.js';
import { drawFrame } from './render.js';
import { handleClick, handleKey, toLogical } from './input.js';
import { stageShot } from './shots.js';
import { playTick } from './audio.js';

const canvas = document.getElementById('game');
const statusEl = document.getElementById('status');
const ctx = canvas.getContext('2d');

const state = createState();

// Test hook: lets the local playtest drive every level through real clicks.
// Harmless in normal play — a single-player game with no server.
window.__game = { state, startLevel, stageShot, SCENES, diffRemaining, diffTotal };

function fitCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = VIEW.width * dpr;
  canvas.height = VIEW.height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

fitCanvas();
window.addEventListener('resize', fitCanvas);

const params = new URLSearchParams(window.location.search);
const shotName = params.get('shot');
let shotMode = false;
if (shotName) {
  stageShot(shotName, state);
  shotMode = true;
}

canvas.addEventListener('pointermove', (event) => {
  const pos = toLogical(canvas, event.clientX, event.clientY);
  state.mouse.x = pos.x;
  state.mouse.y = pos.y;
  state.mouse.inside = true;
});
canvas.addEventListener('pointerleave', () => {
  state.mouse.inside = false;
});
canvas.addEventListener('pointerdown', (event) => {
  const pos = toLogical(canvas, event.clientX, event.clientY);
  state.mouse.x = pos.x;
  state.mouse.y = pos.y;
  state.mouse.inside = true;
  handleClick(state, pos.x, pos.y, performance.now());
});
window.addEventListener('keydown', (event) => {
  if (event.key === ' ' && state.screen === SCREEN_PLAY) event.preventDefault();
  handleKey(state, event.key, performance.now());
});

let lastTime = performance.now();

function frame(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;

  if (!shotMode && state.screen === SCREEN_PLAY) {
    state.timeLeft -= dt;
    const whole = Math.ceil(state.timeLeft);
    if (state.timeLeft <= 10 && whole !== state.lastTickSecond && state.timeLeft > 0) {
      state.lastTickSecond = whole;
      playTick();
    }
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      state.screen = SCREEN_OVER;
    }
  }

  drawFrame(ctx, state, now);

  if (statusEl) {
    if (state.screen === SCREEN_PLAY) {
      statusEl.textContent = `Level ${state.levelIndex + 1}: ${diffRemaining(state)} dari ${diffTotal(state)} perbedaan tersisa, ${Math.ceil(state.timeLeft)} detik, ${state.lives} nyawa.`;
    } else {
      statusEl.textContent = 'Misteri Kampung Pelabuhan — game cari perbedaan.';
    }
  }

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
