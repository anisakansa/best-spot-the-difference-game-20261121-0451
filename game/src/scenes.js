// The ten hand-drawn scenes of Misteri Kampung Pelabuhan.
// One job: for each level, paint the picture and name its hidden differences.
// paint(ctx, alt) draws the scene; `alt` is the set of difference indices applied
// to this copy (left panel: empty set, right panel: every difference). Each
// difference's x/y/r marks where the two panels disagree, so clicks can be tested.

import {
  anchor, barrel, boat, cat, circle, cloud, crate, ellipse, fish, flagPole,
  gull, house, lantern, lighthouse, line, moon, palm, person, poly, rect,
  ropeCoil, sea, skyGradient, starfish, stars, stall, sun,
} from './painters.js';

const has = (alt, i) => alt.has(i);

function sand(ctx, w, y, h) {
  rect(ctx, 0, y, w, h, '#e8c98f');
  ctx.fillStyle = '#d9b878';
  for (const [x, yy] of [[60, y + 18], [200, y + 30], [340, y + 14], [480, y + 34]]) circle(ctx, x, yy, 3, '#d9b878');
}

function pierPlanks(ctx, w, y, h) {
  rect(ctx, 0, y, w, h, '#8d6e63');
  ctx.strokeStyle = '#6d4c41';
  ctx.lineWidth = 2;
  for (let x = 0; x < w; x += 46) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + h);
    ctx.stroke();
  }
  line(ctx, 0, y + 4, w, y + 4, '#6d4c41', 3);
  for (const x of [30, 200, 380, 530]) rect(ctx, x, y + h - 4, 10, 22, '#5d4037');
}

function bucket(ctx, x, y, s, color) {
  poly(ctx, [[x - 12 * s, y], [x + 12 * s, y], [x + 9 * s, y + 20 * s], [x - 9 * s, y + 20 * s]], color);
  ctx.strokeStyle = '#5d4037';
  ctx.lineWidth = 2 * s;
  ctx.beginPath();
  ctx.arc(x, y, 12 * s, Math.PI, 0);
  ctx.stroke();
}

function signBoard(ctx, x, y, text, color) {
  rect(ctx, x, y, 74, 40, '#6d4c41');
  rect(ctx, x + 5, y + 5, 64, 30, '#fff8e1');
  ctx.fillStyle = color;
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + 37, y + 21);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
}

function firework(ctx, x, y, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  for (let i = 0; i < 10; i += 1) {
    const a = (i / 10) * Math.PI * 2;
    line(ctx, x + Math.cos(a) * 8, y + Math.sin(a) * 8, x + Math.cos(a) * 26, y + Math.sin(a) * 26, color, 2.5);
  }
  circle(ctx, x, y, 4, '#fffde7');
}

function rain(ctx, w, h, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  for (let i = 0; i < 26; i += 1) {
    const x = (i * 53) % w;
    const y = (i * 37) % h;
    line(ctx, x, y, x - 8, y + 18, color, 2);
  }
}

function stringLights(ctx, y, bulbs) {
  ctx.strokeStyle = '#4e342e';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, y - 18);
  ctx.quadraticCurveTo(280, y + 22, 560, y - 18);
  ctx.stroke();
  bulbs.forEach(([x, color, on], i) => {
    const yy = y - 18 + Math.sin((x / 560) * Math.PI) * 22;
    if (on) {
      circle(ctx, x, yy + 8, 7, color);
      circle(ctx, x, yy + 8, 3, '#fffde7');
    } else {
      circle(ctx, x, yy + 8, 7, '#616161');
    }
    line(ctx, x, yy, x, yy + 4, '#4e342e', 2);
  });
}

export const SCENES = [
  // ---- Bab 1 · Level 1 — Dermaga Pagi (7 differences) ----
  {
    diffs: [
      { x: 448, y: 54, r: 26, label: 'awan pagi' },
      { x: 185, y: 215, r: 30, label: 'warna layar perahu' },
      { x: 300, y: 268, r: 24, label: 'ikan melompat' },
      { x: 48, y: 170, r: 14, label: 'jendela rumah' },
      { x: 480, y: 322, r: 16, label: 'topi nelayan' },
      { x: 77, y: 258, r: 18, label: 'warna bendera' },
      { x: 350, y: 345, r: 18, label: 'ember di dermaga' },
    ],
    paint(ctx, alt) {
      skyGradient(ctx, 560, 400, '#ffd9a0', '#bfe3ff');
      sun(ctx, 70, 60, 28, '#ffca28', true);
      cloud(ctx, 200, 50, 1, '#ffffff');
      if (!has(alt, 0)) cloud(ctx, 430, 54, 0.9, '#ffffff');
      cloud(ctx, 300, 28, 0.6, '#ffffffee');
      gull(ctx, 330, 90, 1, '#37474f');
      gull(ctx, 380, 70, 0.8, '#37474f');
      sand(ctx, 560, 200, 34);
      house(ctx, 30, 148, 1, '#ffe0b2', '#d84315', { lit: !has(alt, 3), chimney: true, smoke: true });
      house(ctx, 420, 148, 0.9, '#c8e6c9', '#2e7d32', { lit: true });
      palm(ctx, 250, 215, 1, { coconuts: true });
      sea(ctx, 560, 234, 166, '#2a9d8f', '#b2dfdb', [260, 300, 350]);
      boat(ctx, 120, 250, 0.9, '#6d4c41', has(alt, 1) ? '#1565c0' : '#d32f2f', { flag: '#ff8f00', cargo: '#ffb300' });
      boat(ctx, 380, 300, 0.7, '#4e342e', '#f9a825', {});
      if (has(alt, 2)) fish(ctx, 300, 268, 1, '#ff7043', 1);
      fish(ctx, 500, 330, 0.8, '#eceff1', -1);
      pierPlanks(ctx, 560, 330, 70);
      flagPole(ctx, 60, 330, 80, has(alt, 5) ? '#2e7d32' : '#d32f2f');
      if (!has(alt, 6)) bucket(ctx, 350, 340, 1, '#e53935');
      person(ctx, 480, 360, 1, '#1565c0', '#37474f', { hat: has(alt, 4) ? null : '#ffb300' });
      ropeCoil(ctx, 150, 372, 1, '#d7ccc8');
    },
  },
  // ---- Bab 1 · Level 2 — Pasar Ikan (7 differences) ----
  {
    diffs: [
      { x: 80, y: 105, r: 28, label: 'warna tenda kiri' },
      { x: 380, y: 160, r: 20, label: 'jumlah ikan di keranjang' },
      { x: 500, y: 340, r: 24, label: 'kucing pasar' },
      { x: 360, y: 60, r: 20, label: 'lampion gantung' },
      { x: 287, y: 205, r: 18, label: 'harga di papan' },
      { x: 485, y: 285, r: 22, label: 'peti tambahan' },
      { x: 170, y: 300, r: 22, label: 'warna celemek pedagang' },
    ],
    paint(ctx, alt) {
      skyGradient(ctx, 560, 400, '#fff3c4', '#a5d6a7');
      sun(ctx, 500, 55, 24, '#ffca28', false);
      cloud(ctx, 120, 45, 0.9, '#ffffff');
      sand(ctx, 560, 250, 150);
      line(ctx, 60, 40, 500, 40, '#5d4037', 3);
      lantern(ctx, 150, 62, 0.9, '#e53935', true);
      lantern(ctx, 280, 62, 0.9, '#fdd835', true);
      if (!has(alt, 3)) lantern(ctx, 360, 62, 0.9, '#1e88e5', true);
      stall(ctx, 20, 120, 1, has(alt, 0) ? '#2e7d32' : '#d32f2f', {});
      stall(ctx, 320, 120, 1, '#00897b', {});
      fish(ctx, 60, 165, 0.9, '#90a4ae', 1);
      fish(ctx, 95, 168, 0.9, '#ef6c00', -1);
      fish(ctx, 360, 160, 0.9, '#90a4ae', 1);
      fish(ctx, 395, 163, 0.9, '#ef6c00', -1);
      if (!has(alt, 1)) fish(ctx, 430, 166, 0.9, '#7e57c2', 1);
      signBoard(ctx, 250, 185, has(alt, 4) ? '15K' : '10K', '#d32f2f');
      person(ctx, 170, 300, 1, '#f5f5f5', '#37474f', { hat: '#ffffff' });
      rect(ctx, 161, 282, 18, 22, has(alt, 6) ? '#ef6c00' : '#1565c0');
      crate(ctx, 240, 300, 1, '#a1887f');
      crate(ctx, 280, 330, 0.8, '#8d6e63');
      if (has(alt, 5)) crate(ctx, 470, 270, 1, '#a1887f');
      barrel(ctx, 520, 240, 0.9, '#8d6e63');
      if (!has(alt, 2)) cat(ctx, 500, 340, 1, '#ff8a65');
      person(ctx, 60, 330, 0.9, '#7e57c2', '#4e342e', { hat: '#4dd0e1' });
    },
  },
  // ---- Bab 1 · Level 3 — Kapal Nelayan (8 differences) ----
  {
    diffs: [
      { x: 300, y: 130, r: 22, label: 'tambalan layar' },
      { x: 200, y: 250, r: 20, label: 'jangkar kapal' },
      { x: 330, y: 190, r: 20, label: 'tong di geladak' },
      { x: 430, y: 60, r: 16, label: 'burung camar' },
      { x: 480, y: 165, r: 20, label: 'palem di pulau' },
      { x: 250, y: 215, r: 16, label: 'gulungan tali' },
      { x: 265, y: 105, r: 16, label: 'warna bendera kapal' },
      { x: 340, y: 215, r: 12, label: 'jendela kapal kedua' },
    ],
    paint(ctx, alt) {
      skyGradient(ctx, 560, 400, '#b3e5fc', '#e1f5fe');
      sun(ctx, 90, 60, 26, '#ffca28', true);
      cloud(ctx, 300, 45, 1, '#ffffff');
      gull(ctx, 150, 80, 1, '#37474f');
      gull(ctx, 220, 60, 0.8, '#37474f');
      if (!has(alt, 3)) gull(ctx, 430, 60, 1, '#37474f');
      // distant island
      ellipse(ctx, 480, 200, 70, 16, '#8bc34a');
      if (!has(alt, 4)) palm(ctx, 470, 195, 0.8, { coconuts: true });
      sea(ctx, 560, 210, 190, '#0277bd', '#b3e5fc', [240, 290, 340, 380]);
      boat(ctx, 120, 150, 1.6, '#5d4037', '#fffde7', { flag: has(alt, 6) ? '#fdd835' : '#d32f2f', cargo: '#ffb300', porthole: true });
      // sail patch + second porthole + deck details
      if (has(alt, 0)) poly(ctx, [[285, 120], [315, 120], [300, 145]], '#e53935');
      if (has(alt, 7)) circle(ctx, 340, 215, 6, '#bfe9ff');
      if (!has(alt, 1)) anchor(ctx, 200, 250, 1, '#37474f');
      if (has(alt, 2)) barrel(ctx, 330, 190, 0.9, '#a1887f');
      if (!has(alt, 5)) ropeCoil(ctx, 250, 215, 0.9, '#d7ccc8');
      person(ctx, 160, 175, 0.9, '#ef6c00', '#37474f', { hat: '#ffb300' });
      person(ctx, 420, 200, 0.9, '#1565c0', '#4e342e', { hat: null });
      fish(ctx, 90, 330, 1, '#eceff1', 1);
      fish(ctx, 480, 360, 0.9, '#ffcc80', -1);
      crate(ctx, 460, 250, 0.9, '#a1887f');
    },
  },
  // ---- Bab 2 · Level 4 — Mercusuar Senja (8 differences) ----
  {
    diffs: [
      { x: 250, y: 220, r: 30, label: 'sorot lampu mercusuar' },
      { x: 80, y: 222, r: 14, label: 'lampu mercusuar' },
      { x: 480, y: 360, r: 18, label: 'bintang laut di batu' },
      { x: 390, y: 260, r: 22, label: 'warna layar perahu' },
      { x: 420, y: 50, r: 22, label: 'awan senja' },
      { x: 200, y: 370, r: 14, label: 'batu di jalan setapak' },
      { x: 317, y: 326, r: 16, label: 'warna bendera batu' },
      { x: 300, y: 80, r: 14, label: 'burung camar' },
    ],
    paint(ctx, alt) {
      skyGradient(ctx, 560, 400, '#ff8a65', '#7e57c2');
      sun(ctx, 480, 120, 30, '#ff7043', false);
      cloud(ctx, 180, 55, 1, '#ffccbc');
      if (!has(alt, 4)) cloud(ctx, 420, 50, 0.8, '#ffccbc');
      gull(ctx, 200, 100, 1, '#263238');
      if (!has(alt, 7)) gull(ctx, 300, 80, 0.9, '#263238');
      sea(ctx, 560, 220, 180, '#5c6bc0', '#c5cae9', [250, 300, 350]);
      boat(ctx, 340, 250, 0.8, '#4e342e', has(alt, 3) ? '#26a69a' : '#e53935', {});
      // rocky shore
      ellipse(ctx, 120, 390, 170, 40, '#78909c');
      ellipse(ctx, 420, 395, 190, 36, '#607d8b');
      circle(ctx, 60, 360, 22, '#78909c');
      circle(ctx, 520, 355, 26, '#78909c');
      lighthouse(ctx, 80, 380, 1, { lit: !has(alt, 1), beam: !has(alt, 0) });
      if (!has(alt, 2)) starfish(ctx, 480, 360, 1, '#ff7043');
      starfish(ctx, 380, 375, 0.8, '#ffb74d');
      // stepping stones path
      ellipse(ctx, 160, 372, 14, 7, '#b0bec5');
      if (has(alt, 5)) ellipse(ctx, 200, 370, 14, 7, '#b0bec5');
      ellipse(ctx, 240, 372, 14, 7, '#b0bec5');
      flagPole(ctx, 300, 340, 55, has(alt, 6) ? '#fdd835' : '#e53935');
      fish(ctx, 300, 320, 0.8, '#eceff1', -1);
    },
  },
  // ---- Bab 2 · Level 5 — Warung Kopi Pelabuhan (9 differences) ----
  {
    diffs: [
      { x: 300, y: 90, r: 20, label: 'uap ketel kopi' },
      { x: 130, y: 175, r: 16, label: 'jumlah cangkir' },
      { x: 430, y: 115, r: 18, label: 'harga menu' },
      { x: 380, y: 52, r: 14, label: 'lampu gantung' },
      { x: 480, y: 330, r: 22, label: 'kucing di kursi' },
      { x: 220, y: 175, r: 16, label: 'warna stoples' },
      { x: 60, y: 330, r: 20, label: 'roda sepeda' },
      { x: 250, y: 60, r: 16, label: 'huruf papan KOPI' },
      { x: 330, y: 320, r: 20, label: 'kursi kosong' },
    ],
    paint(ctx, alt) {
      skyGradient(ctx, 560, 400, '#ffe0b2', '#ffcc80');
      rect(ctx, 0, 240, 560, 160, '#a1887f');
      // back wall + counter
      rect(ctx, 40, 80, 480, 160, '#d7ccc8');
      rect(ctx, 40, 80, 480, 10, '#8d6e63');
      signBoard(ctx, 210, 40, has(alt, 7) ? 'K0PI' : 'KOPI', '#4e342e');
      stringLights(ctx, 60, [[120, '#ff8a65', true], [250, '#fdd835', true], [380, '#4dd0e1', !has(alt, 3)]]);
      // menu board
      rect(ctx, 400, 95, 110, 60, '#5d4037');
      rect(ctx, 406, 101, 98, 48, '#fff8e1');
      ctx.fillStyle = '#4e342e';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText('KOPI ' + (has(alt, 2) ? '8K' : '5K'), 414, 120);
      ctx.fillText('TEH  4K', 414, 140);
      // kettle + steam
      poly(ctx, [[280, 120], [320, 120], [330, 150], [270, 150]], '#78909c');
      line(ctx, 320, 125, 340, 115, '#78909c', 5);
      if (!has(alt, 0)) {
        circle(ctx, 300, 92, 7, '#ffffffaa');
        circle(ctx, 306, 78, 9, '#ffffff77');
        circle(ctx, 298, 64, 6, '#ffffff44');
      }
      // cups on the counter
      rect(ctx, 110, 160, 26, 22, '#e53935');
      rect(ctx, 150, 160, 26, 22, '#1e88e5');
      if (!has(alt, 1)) rect(ctx, 190, 160, 26, 22, '#fdd835');
      // jars
      ellipse(ctx, 220, 175, 14, 18, has(alt, 5) ? '#ab47bc' : '#8d6e63');
      ellipse(ctx, 250, 175, 14, 18, '#6d4c41');
      // counter front
      rect(ctx, 40, 190, 480, 50, '#8d6e63');
      rect(ctx, 40, 190, 480, 8, '#6d4c41');
      // chairs + cat + bicycle
      rect(ctx, 320, 300, 44, 8, '#5d4037');
      rect(ctx, 324, 308, 6, 40, '#5d4037');
      rect(ctx, 354, 308, 6, 40, '#5d4037');
      if (has(alt, 8)) {
        rect(ctx, 400, 300, 44, 8, '#5d4037');
        rect(ctx, 404, 308, 6, 40, '#5d4037');
        rect(ctx, 434, 308, 6, 40, '#5d4037');
      }
      if (!has(alt, 4)) cat(ctx, 480, 330, 0.9, '#ffb74d');
      circle(ctx, 60, 330, 16, '#37474f');
      circle(ctx, 60, 330, 11, '#eceff1');
      circle(ctx, 60, 330, 4, '#37474f');
      if (has(alt, 6)) circle(ctx, 110, 330, 16, '#37474f');
      line(ctx, 60, 330, 110, 330, '#78909c', 4);
      line(ctx, 85, 330, 95, 300, '#78909c', 4);
      person(ctx, 500, 200, 0.9, '#e53935', '#37474f', { hat: '#ffffff' });
    },
  },
  // ---- Bab 2 · Level 6 — Gudang Rempah (9 differences) ----
  {
    diffs: [
      { x: 120, y: 120, r: 18, label: 'label karung' },
      { x: 300, y: 320, r: 22, label: 'warna tumpukan rempah' },
      { x: 430, y: 180, r: 18, label: 'timbangan' },
      { x: 520, y: 90, r: 18, label: 'herbal gantung' },
      { x: 60, y: 60, r: 18, label: 'cahaya jendela' },
      { x: 200, y: 330, r: 20, label: 'tong rempah' },
      { x: 380, y: 350, r: 16, label: 'gulungan tali' },
      { x: 500, y: 350, r: 20, label: 'kucing gudang' },
      { x: 90, y: 270, r: 20, label: 'peti rempah' },
    ],
    paint(ctx, alt) {
      skyGradient(ctx, 560, 400, '#d7ccc8', '#a1887f');
      rect(ctx, 0, 0, 560, 400, '#8d6e63');
      rect(ctx, 0, 300, 560, 100, '#6d4c41');
      // window with light
      rect(ctx, 40, 40, 60, 60, '#5d4037');
      rect(ctx, 46, 46, 48, 48, has(alt, 4) ? '#37474f' : '#fff176');
      line(ctx, 70, 46, 70, 94, '#5d4037', 3);
      line(ctx, 46, 70, 94, 70, '#5d4037', 3);
      // hanging herbs
      line(ctx, 480, 30, 480, 70, '#4e342e', 3);
      ellipse(ctx, 480, 85, 12, 20, '#43a047');
      if (!has(alt, 3)) {
        line(ctx, 520, 30, 520, 70, '#4e342e', 3);
        ellipse(ctx, 520, 85, 12, 20, '#7cb342');
      }
      // sacks
      ellipse(ctx, 120, 130, 42, 34, '#d7ccc8');
      ellipse(ctx, 120, 118, 42, 20, '#efebe9');
      ctx.fillStyle = '#4e342e';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(has(alt, 0) ? 'JAHE' : 'KAYU', 96, 128);
      ellipse(ctx, 220, 140, 40, 30, '#bcaaa4');
      // spice piles
      poly(ctx, [[260, 340], [300, 290], [340, 340]], has(alt, 1) ? '#8e24aa' : '#e53935');
      poly(ctx, [[340, 340], [380, 295], [420, 340]], '#fdd835');
      poly(ctx, [[180, 340], [215, 300], [250, 340]], '#ef6c00');
      // scales
      line(ctx, 430, 140, 430, 200, '#37474f', 4);
      line(ctx, 400, 150, 460, 150, '#37474f', 4);
      if (!has(alt, 2)) {
        line(ctx, 405, 150, 395, 180, '#37474f', 2);
        ellipse(ctx, 395, 182, 14, 4, '#b0bec5');
      }
      line(ctx, 455, 150, 465, 180, '#37474f', 2);
      ellipse(ctx, 465, 182, 14, 4, '#b0bec5');
      // crates + barrel + rope + cat
      crate(ctx, 60, 250, 1, '#a1887f');
      if (has(alt, 8)) crate(ctx, 100, 250, 0.9, '#8d6e63');
      if (!has(alt, 5)) barrel(ctx, 200, 330, 1, '#6d4c41');
      if (!has(alt, 6)) ropeCoil(ctx, 380, 350, 1, '#d7ccc8');
      if (!has(alt, 7)) cat(ctx, 500, 350, 1, '#90a4ae');
      person(ctx, 320, 240, 0.9, '#1565c0', '#37474f', { hat: '#ffb300' });
    },
  },
  // ---- Bab 3 · Level 7 — Festival Lampion (10 differences) ----
  {
    diffs: [
      { x: 200, y: 90, r: 20, label: 'warna lampion merah' },
      { x: 430, y: 70, r: 22, label: 'kembang api kanan' },
      { x: 90, y: 40, r: 12, label: 'bintang kecil' },
      { x: 300, y: 200, r: 20, label: 'tulisan spanduk' },
      { x: 470, y: 300, r: 18, label: 'lampion perahu' },
      { x: 150, y: 330, r: 20, label: 'topi penonton' },
      { x: 250, y: 52, r: 14, label: 'lampu senar' },
      { x: 520, y: 150, r: 18, label: 'bendera stan' },
      { x: 360, y: 330, r: 18, label: 'lampion ikan' },
      { x: 60, y: 260, r: 18, label: 'lampion stan kiri' },
    ],
    paint(ctx, alt) {
      skyGradient(ctx, 560, 400, '#1a237e', '#4a148c');
      stars(ctx, 560, 400, [[40, 30, 2], [120, 70, 2], [200, 30, 2], [280, 60, 2], [360, 25, 2], [480, 40, 2], [520, 90, 2]]);
      if (!has(alt, 2)) circle(ctx, 90, 40, 2.5, '#fff8d0');
      moon(ctx, 500, 60, 26, '#fffde7');
      firework(ctx, 120, 90, '#ff4081');
      if (!has(alt, 1)) firework(ctx, 430, 70, '#40c4ff');
      stringLights(ctx, 60, [[100, '#ff8a65', true], [250, '#fdd835', !has(alt, 6)], [400, '#4dd0e1', true]]);
      lantern(ctx, 100, 90, 1, '#e53935', true);
      lantern(ctx, 200, 90, 1, has(alt, 0) ? '#1e88e5' : '#e53935', true);
      lantern(ctx, 300, 90, 1, '#fdd835', true);
      lantern(ctx, 400, 90, 1, '#43a047', true);
      // banner
      rect(ctx, 220, 180, 160, 40, '#d32f2f');
      ctx.fillStyle = '#fff8e1';
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(has(alt, 3) ? 'FESTIVAL' : 'LAMPION', 300, 206);
      ctx.textAlign = 'left';
      // stalls + crowd
      stall(ctx, 20, 240, 0.9, '#e53935', {});
      if (!has(alt, 9)) lantern(ctx, 60, 262, 0.8, '#ff7043', true);
      stall(ctx, 420, 240, 0.9, '#1e88e5', {});
      flagPole(ctx, 520, 240, 50, has(alt, 7) ? '#fdd835' : '#e53935');
      // water + boats
      sea(ctx, 560, 330, 70, '#0d47a1', '#64b5f6', [350, 375]);
      boat(ctx, 200, 340, 0.7, '#4e342e', '#fffde7', {});
      if (!has(alt, 4)) lantern(ctx, 470, 300, 0.8, '#ff7043', true);
      boat(ctx, 420, 350, 0.6, '#3e2723', '#ffe082', {});
      // crowd silhouettes
      person(ctx, 150, 330, 0.9, '#263238', '#1a1a1a', { hat: has(alt, 5) ? null : '#fdd835' });
      person(ctx, 250, 335, 0.9, '#37474f', '#1a1a1a', { hat: null });
      if (has(alt, 8)) fish(ctx, 360, 330, 0.9, '#ff7043', 1);
      person(ctx, 330, 332, 0.85, '#4527a0', '#1a1a1a', { hat: '#e53935' });
    },
  },
  // ---- Bab 3 · Level 8 — Badai di Teluk (10 differences) ----
  {
    diffs: [
      { x: 150, y: 80, r: 24, label: 'petir badai' },
      { x: 480, y: 300, r: 18, label: 'warna pelampung' },
      { x: 300, y: 330, r: 22, label: 'ombak besar' },
      { x: 250, y: 140, r: 16, label: 'bendera perahu badai' },
      { x: 400, y: 50, r: 22, label: 'awan gelap' },
      { x: 90, y: 200, r: 20, label: 'hujan di kiri' },
      { x: 80, y: 222, r: 14, label: 'lampu mercusuar badai' },
      { x: 500, y: 370, r: 16, label: 'bintang laut di batu' },
      { x: 330, y: 90, r: 14, label: 'camar berlindung' },
      { x: 180, y: 360, r: 18, label: 'tong terapung' },
    ],
    paint(ctx, alt) {
      skyGradient(ctx, 560, 400, '#37474f', '#546e7a');
      cloud(ctx, 120, 55, 1.2, '#263238');
      cloud(ctx, 280, 40, 1, '#263238');
      if (!has(alt, 4)) cloud(ctx, 400, 50, 1, '#455a64');
      if (!has(alt, 0)) {
        poly(ctx, [[140, 60], [160, 60], [148, 100], [166, 100], [138, 150], [150, 108], [134, 108]], '#ffeb3b');
      }
      if (!has(alt, 8)) gull(ctx, 330, 90, 0.9, '#eceff1');
      sea(ctx, 560, 210, 190, '#01579b', '#4fc3f7', [240, 280, 320, 360]);
      if (has(alt, 2)) {
        ctx.strokeStyle = '#e1f5fe';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(300, 330, 40, Math.PI, 0);
        ctx.stroke();
      }
      // tilting boat
      ctx.save();
      ctx.translate(220, 180);
      ctx.rotate(0.18);
      boat(ctx, 0, 0, 1, '#5d4037', '#eceff1', { flag: has(alt, 3) ? '#fdd835' : '#d32f2f' });
      ctx.restore();
      lighthouse(ctx, 80, 380, 0.9, { lit: !has(alt, 6), beam: true });
      ellipse(ctx, 120, 390, 170, 40, '#546e7a');
      ellipse(ctx, 450, 395, 170, 36, '#455a64');
      // buoy
      poly(ctx, [[470, 290], [490, 290], [486, 312], [474, 312]], has(alt, 1) ? '#fdd835' : '#e53935');
      circle(ctx, 480, 286, 6, has(alt, 1) ? '#fdd835' : '#e53935');
      if (!has(alt, 7)) starfish(ctx, 500, 370, 0.9, '#ff7043');
      if (!has(alt, 9)) barrel(ctx, 180, 360, 0.9, '#a1887f');
      if (!has(alt, 5)) rain(ctx, 560, 210, 'rgba(224,242,254,0.7)');
      rain(ctx, 560, 400, 'rgba(224,242,254,0.35)');
    },
  },
  // ---- Bab 3 · Level 9 — Harta Karun Bajak Laut (10 differences) ----
  {
    diffs: [
      { x: 280, y: 300, r: 24, label: 'tumpukan koin emas' },
      { x: 380, y: 180, r: 18, label: 'warna burung beo' },
      { x: 120, y: 280, r: 20, label: 'peta harta karun' },
      { x: 480, y: 120, r: 16, label: 'api obor' },
      { x: 250, y: 250, r: 16, label: 'permata di peti' },
      { x: 420, y: 330, r: 18, label: 'tanda X di pasir' },
      { x: 520, y: 90, r: 16, label: 'warna bendera bajak laut' },
      { x: 90, y: 340, r: 18, label: 'tong bajak laut' },
      { x: 200, y: 60, r: 16, label: 'kelapa di palem' },
      { x: 340, y: 360, r: 16, label: 'kepiting pantai' },
    ],
    paint(ctx, alt) {
      skyGradient(ctx, 560, 400, '#ffe0b2', '#ffcc80');
      sun(ctx, 500, 55, 26, '#ffca28', true);
      cloud(ctx, 150, 45, 1, '#ffffff');
      sand(ctx, 560, 180, 220);
      // cave wall
      ellipse(ctx, 60, 180, 150, 90, '#8d6e63');
      ellipse(ctx, 500, 180, 140, 80, '#8d6e63');
      palm(ctx, 180, 200, 1.1, { coconuts: !has(alt, 8) });
      // torch
      line(ctx, 480, 120, 480, 160, '#5d4037', 5);
      if (!has(alt, 3)) {
        ellipse(ctx, 480, 105, 10, 16, '#ff7043');
        ellipse(ctx, 480, 108, 5, 9, '#ffeb3b');
      }
      flagPole(ctx, 520, 110, 55, has(alt, 6) ? '#7e57c2' : '#212121');
      // treasure chest
      rect(ctx, 200, 230, 110, 60, '#6d4c41');
      poly(ctx, [[200, 230], [310, 230], [290, 205], [220, 205]], '#8d6e63');
      rect(ctx, 245, 250, 20, 30, '#ffd54f');
      circle(ctx, 255, 265, 4, '#5d4037');
      // gold coins spilling
      for (const [cx, cy] of [[220, 295], [240, 300], [265, 292], [290, 300], [305, 292]]) circle(ctx, cx, cy, 8, '#ffd54f');
      if (has(alt, 0)) {
        for (const [cx, cy] of [[230, 280], [255, 278], [280, 282], [300, 278]]) circle(ctx, cx, cy, 8, '#ffd54f');
      }
      if (has(alt, 4)) {
        poly(ctx, [[245, 240], [252, 250], [245, 258], [238, 250]], '#40c4ff');
        poly(ctx, [[275, 238], [282, 248], [275, 256], [268, 248]], '#e040fb');
      }
      // parrot on the chest
      ellipse(ctx, 380, 180, 16, 22, has(alt, 1) ? '#43a047' : '#e53935');
      circle(ctx, 380, 152, 10, has(alt, 1) ? '#43a047' : '#e53935');
      poly(ctx, [[390, 152], [402, 156], [390, 160]], '#ff8f00');
      line(ctx, 380, 200, 372, 230, has(alt, 1) ? '#43a047' : '#e53935', 3);
      // map on the sand
      if (!has(alt, 2)) {
        rect(ctx, 95, 265, 50, 34, '#fff8e1');
        line(ctx, 105, 275, 135, 290, '#d32f2f', 2);
        circle(ctx, 135, 290, 4, '#d32f2f');
      }
      // X mark
      if (!has(alt, 5)) {
        line(ctx, 405, 315, 435, 345, '#d32f2f', 5);
        line(ctx, 435, 315, 405, 345, '#d32f2f', 5);
      }
      if (!has(alt, 7)) barrel(ctx, 90, 340, 0.9, '#6d4c41');
      crate(ctx, 440, 320, 0.9, '#a1887f');
      if (!has(alt, 9)) {
        ellipse(ctx, 340, 360, 14, 10, '#e53935');
        circle(ctx, 326, 354, 4, '#212121');
        circle(ctx, 354, 354, 4, '#212121');
      }
      fish(ctx, 520, 380, 0.8, '#eceff1', -1);
    },
  },
  // ---- Bab 3 · Level 10 — Kampung Pelabuhan Malam (10 differences) ----
  {
    diffs: [
      { x: 48, y: 170, r: 14, label: 'jendela rumah pertama' },
      { x: 300, y: 60, r: 12, label: 'bintang di langit' },
      { x: 500, y: 60, r: 22, label: 'bulan purnama' },
      { x: 370, y: 120, r: 16, label: 'kucing di atap' },
      { x: 200, y: 300, r: 16, label: 'lampion tiang' },
      { x: 420, y: 280, r: 22, label: 'perahu malam' },
      { x: 120, y: 330, r: 18, label: 'jala ikan' },
      { x: 300, y: 370, r: 16, label: 'ikan di air' },
      { x: 250, y: 100, r: 18, label: 'asap cerobong' },
      { x: 520, y: 200, r: 16, label: 'bendera dermaga' },
    ],
    paint(ctx, alt) {
      skyGradient(ctx, 560, 400, '#0d1b3e', '#1a237e');
      stars(ctx, 560, 400, [[60, 40, 2], [150, 70, 2], [220, 35, 2], [380, 50, 2], [450, 30, 2]]);
      if (!has(alt, 1)) circle(ctx, 300, 60, 2.5, '#fff8d0');
      if (!has(alt, 2)) moon(ctx, 500, 60, 26, '#fffde7');
      else circle(ctx, 500, 60, 20, '#fffde7');
      firework(ctx, 120, 90, '#ff4081');
      house(ctx, 30, 148, 1, '#5d4037', '#3e2723', { lit: !has(alt, 0), chimney: true, smoke: !has(alt, 8) });
      house(ctx, 220, 148, 0.9, '#6d4c41', '#4e342e', { lit: true });
      house(ctx, 400, 148, 0.95, '#795548', '#3e2723', { lit: false, chimney: true, smoke: true });
      if (!has(alt, 3)) cat(ctx, 370, 122, 0.8, '#212121');
      sand(ctx, 560, 212, 22);
      sea(ctx, 560, 234, 166, '#0d47a1', '#64b5f6', [260, 300, 350]);
      if (!has(alt, 5)) boat(ctx, 380, 270, 0.7, '#3e2723', '#fffde7', { flag: '#fdd835' });
      boat(ctx, 60, 300, 0.6, '#4e342e', '#ffe082', {});
      if (!has(alt, 7)) fish(ctx, 300, 370, 0.9, '#eceff1', 1);
      // lantern post + net on the pier
      pierPlanks(ctx, 560, 330, 70);
      line(ctx, 200, 330, 200, 280, '#5d4037', 4);
      if (!has(alt, 4)) lantern(ctx, 200, 296, 0.9, '#ff7043', true);
      if (!has(alt, 6)) {
        ctx.strokeStyle = '#d7ccc8';
        ctx.lineWidth = 2;
        for (let i = 0; i < 4; i += 1) {
          ctx.beginPath();
          ctx.arc(120, 330, 10 + i * 6, 0, Math.PI);
          ctx.stroke();
        }
      }
      flagPole(ctx, 520, 330, 60, has(alt, 9) ? '#40c4ff' : '#e53935');
      person(ctx, 480, 360, 0.9, '#1565c0', '#37474f', { hat: '#ffb300' });
    },
  },
];
