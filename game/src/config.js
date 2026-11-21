// Game-wide constants for Misteri Kampung Pelabuhan (spot the difference).
// One job: every number the other modules agree on lives here.

export const VIEW = { width: 1280, height: 720 };

// The two picture panels the judge must see side by side.
export const PANEL = { width: 560, height: 400, leftX: 40, rightX: 680, y: 150 };

export const CHAPTERS = [
  { id: 1, name: 'Bab 1 — Pagi di Dermaga', color: '#ff9a3d' },
  { id: 2, name: 'Bab 2 — Senja di Pelabuhan', color: '#e2607a' },
  { id: 3, name: 'Bab 3 — Malam Festival', color: '#7a5cff' },
];

// name, chapter, time limit in seconds, hints per level.
export const LEVELS = [
  { name: 'Dermaga Pagi', chapter: 1, time: 150, hints: 3 },
  { name: 'Pasar Ikan', chapter: 1, time: 150, hints: 3 },
  { name: 'Kapal Nelayan', chapter: 1, time: 150, hints: 3 },
  { name: 'Mercusuar Senja', chapter: 2, time: 140, hints: 3 },
  { name: 'Warung Kopi Pelabuhan', chapter: 2, time: 140, hints: 3 },
  { name: 'Gudang Rempah', chapter: 2, time: 140, hints: 3 },
  { name: 'Festival Lampion', chapter: 3, time: 130, hints: 3 },
  { name: 'Badai di Teluk', chapter: 3, time: 130, hints: 3 },
  { name: 'Harta Karun Bajak Laut', chapter: 3, time: 130, hints: 3 },
  { name: 'Kampung Pelabuhan Malam', chapter: 3, time: 120, hints: 3 },
];

export const SCORE = {
  basePerFind: 100,
  comboStep: 25,
  timeBonusPerSecond: 5,
  hintCost: 50,
  wrongPenalty: 25,
};

export const LIVES_PER_LEVEL = 3;
export const SAVE_KEY = 'misteri-kampung-pelabuhan-save-v1';
