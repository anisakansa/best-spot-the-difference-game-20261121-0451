// All drawing for Misteri Kampung Pelabuhan.
// One job: turn the state into one 1280x720 frame — HUD, the two picture panels,
// found markers, hint pulse, magnifier lens, and every menu screen.
// Buttons are rebuilt every frame into `buttons` so input.js can hit-test them.

import { LEVELS, PANEL, VIEW, CHAPTERS } from './config.js';
import { SCENES } from './scenes.js';
import { diffRemaining, diffTotal, SCREEN_CLEAR, SCREEN_LEVELS, SCREEN_OVER, SCREEN_PAUSE, SCREEN_PLAY, SCREEN_TITLE, SCREEN_WIN } from './state.js';

export const buttons = [];

function clearButtons() {
  buttons.length = 0;
}

function addButton(id, x, y, w, h, label) {
  buttons.push({ id, x, y, w, h, label });
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawButton(ctx, id, x, y, w, h, label, opts = {}) {
  const disabled = opts.disabled === true;
  ctx.fillStyle = disabled ? '#455a64' : (opts.color || '#ff8f00');
  roundRect(ctx, x, y, w, h, 10);
  ctx.fill();
  ctx.fillStyle = disabled ? '#b0bec5' : '#ffffff';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, x + w / 2, y + h / 2 + 1);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  addButton(id, x, y, w, h, label);
}

function text(ctx, str, x, y, size, color, weight = 'normal', align = 'left') {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px sans-serif`;
  ctx.textAlign = align;
  ctx.fillText(str, x, y);
  ctx.textAlign = 'left';
}

function starRow(ctx, x, y, earned, size = 26) {
  ctx.font = `${size}px sans-serif`;
  ctx.textAlign = 'left';
  for (let i = 0; i < 3; i += 1) {
    ctx.fillStyle = i < earned ? '#ffd54f' : '#546e7a';
    ctx.fillText('★', x + i * (size + 2), y);
  }
}

/** Which panel (if any) a logical point is over, and its scene coordinates. */
export function panelAt(x, y) {
  if (y < PANEL.y || y > PANEL.y + PANEL.height) return null;
  if (x >= PANEL.leftX && x <= PANEL.leftX + PANEL.width) {
    return { panel: 'left', sx: x - PANEL.leftX, sy: y - PANEL.y };
  }
  if (x >= PANEL.rightX && x <= PANEL.rightX + PANEL.width) {
    return { panel: 'right', sx: x - PANEL.rightX, sy: y - PANEL.y };
  }
  return null;
}

/** Paint one panel: the scene, then the found markers on top of it. */
function drawPanel(ctx, state, panelX, alt, now) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(panelX, PANEL.y, PANEL.width, PANEL.height);
  ctx.clip();
  ctx.translate(panelX, PANEL.y);
  SCENES[state.levelIndex].paint(ctx, alt);
  ctx.restore();

  // Gold frame + tag above the panel, so it never covers the picture
  ctx.strokeStyle = '#ffd54f';
  ctx.lineWidth = 4;
  ctx.strokeRect(panelX, PANEL.y, PANEL.width, PANEL.height);
  ctx.fillStyle = '#10233d';
  roundRect(ctx, panelX, PANEL.y - 30, 118, 26, 8);
  ctx.fill();
  text(ctx, panelX === PANEL.leftX ? 'GAMBAR A' : 'GAMBAR B', panelX + 10, PANEL.y - 11, 15, '#ffd54f', 'bold');

  // Found-difference markers (same spot on both panels)
  const scene = SCENES[state.levelIndex];
  for (const i of state.found) {
    const d = scene.diffs[i];
    const cx = panelX + d.x;
    const cy = PANEL.y + d.y;
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, d.r + 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx - 7, cy);
    ctx.lineTo(cx - 2, cy + 6);
    ctx.lineTo(cx + 8, cy - 6);
    ctx.stroke();
  }

  // Hint pulse: a throbbing yellow ring on the unfound difference
  if (state.hintPulse && now < state.hintPulse.until) {
    const d = scene.diffs[state.hintPulse.diffIndex];
    const pulse = 6 + Math.sin(now / 120) * 4;
    ctx.strokeStyle = '#ffeb3b';
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 6]);
    ctx.beginPath();
    ctx.arc(panelX + d.x, PANEL.y + d.y, d.r + pulse, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Wrong-click flash: a red X where the player clicked
  if (state.wrongFlash && now < state.wrongFlash.until && state.wrongFlash.panel === (panelX === PANEL.leftX ? 'left' : 'right')) {
    const fx = panelX + state.wrongFlash.x;
    const fy = PANEL.y + state.wrongFlash.y;
    ctx.strokeStyle = '#ef5350';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(fx - 12, fy - 12);
    ctx.lineTo(fx + 12, fy + 12);
    ctx.moveTo(fx + 12, fy - 12);
    ctx.lineTo(fx - 12, fy + 12);
    ctx.stroke();
  }

  // Found flash: an expanding green ring right after a find
  if (state.foundFlash && now < state.foundFlash.until) {
    const d = scene.diffs[state.foundFlash.diffIndex];
    const progress = 1 - (state.foundFlash.until - now) / 900;
    ctx.strokeStyle = `rgba(34,197,94,${1 - progress})`;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(panelX + d.x, PANEL.y + d.y, d.r + 4 + progress * 22, 0, Math.PI * 2);
    ctx.stroke();
  }
}

/** Magnifier lens: a 2x zoomed circle following the mouse over a panel. */
function drawLens(ctx, state, now) {
  if (!state.lensOn || !state.mouse.inside) return;
  const hit = panelAt(state.mouse.x, state.mouse.y);
  if (!hit) return;
  const mx = state.mouse.x;
  const my = state.mouse.y;
  const alt = hit.panel === 'left' ? new Set() : new Set(SCENES[state.levelIndex].diffs.map((_, i) => i));
  ctx.save();
  ctx.beginPath();
  ctx.arc(mx, my, 90, 0, Math.PI * 2);
  ctx.clip();
  ctx.translate(mx, my);
  ctx.scale(2, 2);
  ctx.translate(-hit.sx, -hit.sy);
  SCENES[state.levelIndex].paint(ctx, alt);
  ctx.restore();
  ctx.strokeStyle = '#ffd54f';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(mx, my, 90, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255,213,79,0.7)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(mx - 12, my);
  ctx.lineTo(mx + 12, my);
  ctx.moveTo(mx, my - 12);
  ctx.lineTo(mx, my + 12);
  ctx.stroke();
}

function drawHud(ctx, state, now) {
  const level = LEVELS[state.levelIndex];
  const chapter = CHAPTERS[level.chapter - 1];
  text(ctx, 'MISTERI KAMPUNG PELABUHAN', 40, 36, 22, '#ffd54f', 'bold');
  text(ctx, `${chapter.name}  ·  Level ${state.levelIndex + 1}/10 — ${level.name}`, 40, 62, 16, '#b0bec5');

  // Remaining counter pill
  const remaining = diffRemaining(state);
  const total = diffTotal(state);
  ctx.fillStyle = remaining === 0 ? '#2e7d32' : '#1a3a5c';
  roundRect(ctx, 500, 16, 280, 52, 12);
  ctx.fill();
  ctx.strokeStyle = '#ffd54f';
  ctx.lineWidth = 2;
  roundRect(ctx, 500, 16, 280, 52, 12);
  ctx.stroke();
  text(ctx, `SISA  ${remaining} / ${total}`, 640, 50, 26, remaining === 0 ? '#a5d6a7' : '#ffffff', 'bold', 'center');

  // Score + combo + lives
  text(ctx, `SKOR ${state.score}`, 1060, 36, 20, '#ffffff', 'bold', 'right');
  const comboText = state.combo >= 2 ? `KOMBO x${state.combo}` : 'KOMBO —';
  text(ctx, comboText, 1060, 62, 16, state.combo >= 2 ? '#ffab40' : '#90a4ae', 'bold', 'right');
  let hearts = '';
  for (let i = 0; i < 3; i += 1) hearts += i < state.lives ? '♥' : '♡';
  text(ctx, hearts, 1240, 36, 22, '#ef5350', 'bold', 'right');

  // Timer bar
  const frac = Math.max(0, state.timeLeft / level.time);
  const low = state.timeLeft <= 10;
  ctx.fillStyle = '#263238';
  roundRect(ctx, 40, 92, 1200, 22, 8);
  ctx.fill();
  ctx.fillStyle = low ? (Math.floor(now / 250) % 2 === 0 ? '#ef5350' : '#b71c1c') : frac > 0.5 ? '#43a047' : frac > 0.25 ? '#fb8c00' : '#ef5350';
  if (frac > 0) {
    roundRect(ctx, 40, 92, 1200 * frac, 22, 8);
    ctx.fill();
  }
  text(ctx, `${Math.ceil(state.timeLeft)} dtk`, 1240, 84, 16, low ? '#ef5350' : '#eceff1', 'bold', 'right');
}

function drawBottomBar(ctx, state) {
  text(ctx, 'Klik perbedaan di salah satu gambar.  H = petunjuk   M = lensa pembesar   P = jeda', 40, 600, 15, '#90a4ae');
  drawButton(ctx, 'hint', 40, 620, 200, 56, `PETUNJUK (${state.hintsLeft})`, { color: '#7b1fa2', disabled: state.hintsLeft <= 0 });
  drawButton(ctx, 'lens', 260, 620, 200, 56, state.lensOn ? 'LENSA: ON (M)' : 'LENSA (M)', { color: state.lensOn ? '#00897b' : '#546e7a' });
  drawButton(ctx, 'pause', 480, 620, 150, 56, 'JEDA (P)', { color: '#546e7a' });
  drawButton(ctx, 'sound', 650, 620, 150, 56, 'SUARA', { color: '#546e7a' });
  text(ctx, `Total skor: ${state.totalScore}`, 1240, 652, 16, '#b0bec5', 'bold', 'right');
  if (state.message && performance.now() < state.messageUntil) {
    text(ctx, state.message, 640, 600, 18, '#ffeb3b', 'bold', 'center');
  }
}

function drawPlay(ctx, state, now) {
  drawHud(ctx, state, now);
  const all = new Set(SCENES[state.levelIndex].diffs.map((_, i) => i));
  drawPanel(ctx, state, PANEL.leftX, new Set(), now);
  drawPanel(ctx, state, PANEL.rightX, all, now);
  drawLens(ctx, state, now);
  drawBottomBar(ctx, state);
}

function overlay(ctx, title, titleColor) {
  ctx.fillStyle = 'rgba(8,20,38,0.82)';
  ctx.fillRect(0, 0, VIEW.width, VIEW.height);
  text(ctx, title, 640, 180, 52, titleColor, 'bold', 'center');
}

function drawTitle(ctx, state) {
  ctx.fillStyle = '#0d1b3e';
  ctx.fillRect(0, 0, VIEW.width, VIEW.height);
  // decorative harbour strip at the bottom
  ctx.fillStyle = '#0d47a1';
  ctx.fillRect(0, 600, VIEW.width, 120);
  ctx.fillStyle = '#ffca28';
  ctx.beginPath();
  ctx.arc(1080, 130, 46, 0, Math.PI * 2);
  ctx.fill();
  text(ctx, 'MISTERI', 640, 170, 84, '#ffd54f', 'bold', 'center');
  text(ctx, 'KAMPUNG PELABUHAN', 640, 250, 84, '#ffffff', 'bold', 'center');
  text(ctx, 'Cari perbedaan di dua gambar pelabuhan — sebelum waktu habis!', 640, 310, 22, '#b0bec5', 'normal', 'center');
  text(ctx, '10 level  ·  3 bab  ·  7–10 perbedaan tersembunyi di setiap level', 640, 345, 18, '#90a4ae', 'normal', 'center');
  text(ctx, 'Timer, nyawa, petunjuk, kombo, lensa pembesar & bintang menantimu.', 640, 375, 18, '#90a4ae', 'normal', 'center');
  drawButton(ctx, 'play', 440, 430, 400, 64, state.unlocked > 0 || state.totalScore > 0 ? 'LANJUTKAN PETUALANGAN' : 'MULAI BERMAIN', { color: '#ff8f00' });
  drawButton(ctx, 'levels', 440, 510, 400, 56, 'PILIH LEVEL', { color: '#1565c0' });
  if (state.totalScore > 0) text(ctx, `Skor total sejauh ini: ${state.totalScore}`, 640, 600, 18, '#ffd54f', 'bold', 'center');
  text(ctx, 'Game orisinal — semua gambar digambar prosedural di kanvas.', 640, 690, 14, '#546e7a', 'normal', 'center');
}

function drawLevels(ctx, state) {
  ctx.fillStyle = '#0d1b3e';
  ctx.fillRect(0, 0, VIEW.width, VIEW.height);
  text(ctx, 'PILIH LEVEL', 640, 70, 44, '#ffd54f', 'bold', 'center');
  text(ctx, 'Selesaikan satu level untuk membuka level berikutnya.', 640, 105, 17, '#b0bec5', 'normal', 'center');
  for (let i = 0; i < 10; i += 1) {
    const col = i % 5;
    const row = Math.floor(i / 5);
    const x = 40 + col * 244;
    const y = 140 + row * 220;
    const locked = i > state.unlocked;
    const level = LEVELS[i];
    ctx.fillStyle = locked ? '#263238' : '#1a3a5c';
    roundRect(ctx, x, y, 224, 190, 14);
    ctx.fill();
    ctx.strokeStyle = locked ? '#455a64' : CHAPTERS[level.chapter - 1].color;
    ctx.lineWidth = 2;
    roundRect(ctx, x, y, 224, 190, 14);
    ctx.stroke();
    text(ctx, `LEVEL ${i + 1}`, x + 16, y + 34, 16, '#90a4ae', 'bold');
    text(ctx, level.name, x + 16, y + 62, 18, locked ? '#78909c' : '#ffffff', 'bold');
    text(ctx, `${SCENES[i].diffs.length} perbedaan · ${level.time} dtk`, x + 16, y + 90, 14, '#90a4ae');
    if (locked) {
      text(ctx, 'TERKUNCI', x + 16, y + 140, 18, '#78909c', 'bold');
    } else {
      starRow(ctx, x + 16, y + 150, state.stars[i] || 0, 26);
      addButton(`level-${i}`, x, y, 224, 190, '');
    }
  }
  drawButton(ctx, 'back-title', 440, 600, 400, 56, 'KEMBALI', { color: '#546e7a' });
}

function drawPause(ctx, state, now) {
  drawPlay(ctx, state, now);
  overlay(ctx, 'JEDA', '#ffd54f');
  text(ctx, 'Istirahat dulu, kapten. Perbedaan-perbedaan itu menunggu.', 640, 230, 20, '#eceff1', 'normal', 'center');
  drawButton(ctx, 'resume', 440, 300, 400, 60, 'LANJUTKAN', { color: '#43a047' });
  drawButton(ctx, 'restart', 440, 380, 400, 56, 'ULANGI LEVEL', { color: '#fb8c00' });
  drawButton(ctx, 'quit-levels', 440, 452, 400, 56, 'PILIH LEVEL', { color: '#546e7a' });
}

function drawClear(ctx, state) {
  const level = LEVELS[state.levelIndex];
  const stars = state.stars[state.levelIndex] || 0;
  overlay(ctx, 'LEVEL SELESAI!', '#a5d6a7');
  starRow(ctx, 640 - 42, 250, stars, 44);
  text(ctx, `${level.name} — semua ${SCENES[state.levelIndex].diffs.length} perbedaan ketemu!`, 640, 300, 22, '#eceff1', 'normal', 'center');
  text(ctx, `Skor level ini: ${state.score}   ·   Kombo terbaik: x${state.bestCombo}   ·   Total skor: ${state.totalScore}`, 640, 340, 18, '#ffd54f', 'bold', 'center');
  if (state.levelIndex < 9) {
    drawButton(ctx, 'next', 440, 400, 400, 60, 'LEVEL BERIKUTNYA →', { color: '#ff8f00' });
  } else {
    drawButton(ctx, 'win', 440, 400, 400, 60, 'LIHAT AKHIR CERITA →', { color: '#ff8f00' });
  }
  drawButton(ctx, 'replay', 440, 476, 400, 56, 'ULANGI LEVEL', { color: '#fb8c00' });
  drawButton(ctx, 'quit-levels', 440, 544, 400, 56, 'PILIH LEVEL', { color: '#546e7a' });
}

function drawOver(ctx, state) {
  const reason = state.lives <= 0 ? 'Nyawamu habis — tiga kali klik meleset.' : 'Waktu habis — perbedaan masih bersembunyi.';
  overlay(ctx, 'BELUM BERHASIL', '#ef5350');
  text(ctx, reason, 640, 230, 20, '#eceff1', 'normal', 'center');
  text(ctx, `Kamu menemukan ${state.found.size} dari ${diffTotal(state)} perbedaan di ${LEVELS[state.levelIndex].name}.`, 640, 265, 18, '#b0bec5', 'normal', 'center');
  drawButton(ctx, 'retry', 440, 330, 400, 60, 'COBA LAGI', { color: '#43a047' });
  drawButton(ctx, 'quit-levels', 440, 406, 400, 56, 'PILIH LEVEL', { color: '#546e7a' });
}

function drawWin(ctx, state) {
  overlay(ctx, 'KAMPUNG TERSELAMATKAN!', '#ffd54f');
  text(ctx, 'Semua 10 misteri pelabuhan terpecahkan. Nelayan, pedagang, dan', 640, 230, 20, '#eceff1', 'normal', 'center');
  text(ctx, 'para penjaga mercusuar berterima kasih padamu, Detektif!', 640, 260, 20, '#eceff1', 'normal', 'center');
  text(ctx, `Skor total akhir: ${state.totalScore}`, 640, 320, 26, '#ffd54f', 'bold', 'center');
  drawButton(ctx, 'play-again', 440, 390, 400, 60, 'MAIN LAGI DARI AWAL', { color: '#ff8f00' });
  drawButton(ctx, 'quit-levels', 440, 466, 400, 56, 'PILIH LEVEL', { color: '#546e7a' });
}

/** Draw one frame for the current screen. */
export function drawFrame(ctx, state, now) {
  clearButtons();
  ctx.fillStyle = '#10233d';
  ctx.fillRect(0, 0, VIEW.width, VIEW.height);
  if (state.screen === SCREEN_TITLE) drawTitle(ctx, state);
  else if (state.screen === SCREEN_LEVELS) drawLevels(ctx, state);
  else if (state.screen === SCREEN_PLAY) drawPlay(ctx, state, now);
  else if (state.screen === SCREEN_PAUSE) drawPause(ctx, state, now);
  else if (state.screen === SCREEN_CLEAR) drawClear(ctx, state);
  else if (state.screen === SCREEN_OVER) drawOver(ctx, state);
  else if (state.screen === SCREEN_WIN) drawWin(ctx, state);
}
