// Procedural 2D painters for Misteri Kampung Pelabuhan.
// One job: small reusable drawing helpers every scene is built from.
// Everything is canvas primitives — no external art, no network, deterministic.

export function circle(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

export function rect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

export function ellipse(ctx, x, y, rx, ry, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

export function poly(ctx, points, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fill();
}

export function line(ctx, x1, y1, x2, y2, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

export function skyGradient(ctx, w, h, top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

export function sun(ctx, x, y, r, color, rays) {
  if (rays) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    for (let i = 0; i < 8; i += 1) {
      const a = (i / 8) * Math.PI * 2;
      line(ctx, x + Math.cos(a) * (r + 6), y + Math.sin(a) * (r + 6), x + Math.cos(a) * (r + 18), y + Math.sin(a) * (r + 18), color, 4);
    }
  }
  circle(ctx, x, y, r, color);
}

export function moon(ctx, x, y, r, color) {
  circle(ctx, x, y, r, color);
  circle(ctx, x - r * 0.3, y - r * 0.2, r * 0.18, 'rgba(0,0,0,0.12)');
  circle(ctx, x + r * 0.25, y + r * 0.3, r * 0.13, 'rgba(0,0,0,0.12)');
  circle(ctx, x + r * 0.35, y - r * 0.35, r * 0.1, 'rgba(0,0,0,0.10)');
}

export function cloud(ctx, x, y, s, color) {
  circle(ctx, x, y, 16 * s, color);
  circle(ctx, x + 18 * s, y - 6 * s, 20 * s, color);
  circle(ctx, x + 38 * s, y, 16 * s, color);
  ellipse(ctx, x + 18 * s, y + 8 * s, 34 * s, 12 * s, color);
}

export function stars(ctx, w, h, list) {
  ctx.fillStyle = '#fff8d0';
  for (const [x, y, r] of list) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function sea(ctx, w, y, h, color, waveColor, waveYs) {
  rect(ctx, 0, y, w, h, color);
  ctx.strokeStyle = waveColor;
  ctx.lineWidth = 3;
  for (const wy of waveYs) {
    ctx.beginPath();
    for (let x = 0; x <= w; x += 14) {
      const yy = wy + Math.sin((x / w) * Math.PI * 4 + wy) * 4;
      if (x === 0) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }
    ctx.stroke();
  }
}

export function gull(ctx, x, y, s, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5 * s;
  ctx.beginPath();
  ctx.moveTo(x - 10 * s, y);
  ctx.quadraticCurveTo(x - 4 * s, y - 8 * s, x, y);
  ctx.quadraticCurveTo(x + 4 * s, y - 8 * s, x + 10 * s, y);
  ctx.stroke();
}

export function house(ctx, x, y, s, wall, roof, opts = {}) {
  rect(ctx, x, y, 90 * s, 62 * s, wall);
  poly(ctx, [[x - 8 * s, y], [x + 45 * s, y - 34 * s], [x + 98 * s, y]], roof);
  rect(ctx, x + 36 * s, y + 26 * s, 18 * s, 36 * s, opts.door || '#6b4226');
  circle(ctx, x + 58 * s, y + 44 * s, 2 * s, '#ffd76a');
  const win = opts.lit ? '#ffd76a' : '#2c3e50';
  rect(ctx, x + 10 * s, y + 12 * s, 16 * s, 16 * s, win);
  rect(ctx, x + 64 * s, y + 12 * s, 16 * s, 16 * s, win);
  line(ctx, x + 18 * s, y + 12 * s, x + 18 * s, y + 28 * s, '#ffffff88', 1.5);
  line(ctx, x + 72 * s, y + 12 * s, x + 72 * s, y + 28 * s, '#ffffff88', 1.5);
  if (opts.chimney) {
    rect(ctx, x + 68 * s, y - 26 * s, 12 * s, 26 * s, '#8d6e63');
    if (opts.smoke) {
      circle(ctx, x + 74 * s, y - 34 * s, 6 * s, '#ffffffaa');
      circle(ctx, x + 80 * s, y - 44 * s, 8 * s, '#ffffff77');
      circle(ctx, x + 88 * s, y - 54 * s, 10 * s, '#ffffff44');
    }
  }
}

export function boat(ctx, x, y, s, hull, sail, opts = {}) {
  // Hull
  poly(ctx, [[x, y], [x + 110 * s, y], [x + 92 * s, y + 26 * s], [x + 18 * s, y + 26 * s]], hull);
  rect(ctx, x + 6 * s, y - 4 * s, 98 * s, 6 * s, '#5d4037');
  // Mast + sail
  line(ctx, x + 55 * s, y, x + 55 * s, y - 72 * s, '#5d4037', 4 * s);
  if (sail !== null) poly(ctx, [[x + 58 * s, y - 68 * s], [x + 58 * s, y - 6 * s], [x + 100 * s, y - 6 * s]], sail);
  if (opts.flag) {
    poly(ctx, [[x + 55 * s, y - 72 * s], [x + 78 * s, y - 66 * s], [x + 55 * s, y - 60 * s]], opts.flag);
  }
  if (opts.cargo) {
    rect(ctx, x + 18 * s, y - 18 * s, 16 * s, 14 * s, opts.cargo);
    rect(ctx, x + 38 * s, y - 18 * s, 16 * s, 14 * s, opts.cargo);
  }
  if (opts.porthole) {
    circle(ctx, x + 30 * s, y + 12 * s, 5 * s, '#bfe9ff');
    circle(ctx, x + 80 * s, y + 12 * s, 5 * s, '#bfe9ff');
  }
}

export function person(ctx, x, y, s, shirt, pants, opts = {}) {
  circle(ctx, x, y - 34 * s, 9 * s, '#f2c89b'); // head
  if (opts.hat) {
    poly(ctx, [[x - 12 * s, y - 40 * s], [x + 12 * s, y - 40 * s], [x, y - 54 * s]], opts.hat);
    rect(ctx, x - 13 * s, y - 41 * s, 26 * s, 4 * s, opts.hat);
  } else {
    ellipse(ctx, x, y - 40 * s, 10 * s, 5 * s, '#3e2723'); // hair
  }
  rect(ctx, x - 9 * s, y - 26 * s, 18 * s, 24 * s, shirt); // torso
  line(ctx, x - 9 * s, y - 24 * s, x - 20 * s, y - 6 * s, shirt, 5 * s); // arms
  line(ctx, x + 9 * s, y - 24 * s, x + 20 * s, y - 6 * s, shirt, 5 * s);
  line(ctx, x - 5 * s, y - 2 * s, x - 6 * s, y + 18 * s, pants, 6 * s); // legs
  line(ctx, x + 5 * s, y - 2 * s, x + 6 * s, y + 18 * s, pants, 6 * s);
}

export function palm(ctx, x, y, s, opts = {}) {
  line(ctx, x, y, x + 6 * s, y - 52 * s, '#8d6e63', 7 * s);
  ctx.strokeStyle = '#2e7d32';
  ctx.lineWidth = 5 * s;
  for (const [dx, dy, ex, ey] of [[-26, -58, -34, -40], [-14, -66, -22, -48], [0, -70, -2, -50], [14, -66, 24, -48], [26, -58, 36, -40]]) {
    ctx.beginPath();
    ctx.moveTo(x + 6 * s, y - 52 * s);
    ctx.quadraticCurveTo(x + (dx + ex) / 2 * s, y + (dy + ey) / 2 * s - 6, x + ex * s, y + ey * s);
    ctx.stroke();
  }
  if (opts.coconuts) {
    circle(ctx, x + 2 * s, y - 48 * s, 5 * s, '#6d4c41');
    circle(ctx, x + 12 * s, y - 46 * s, 5 * s, '#6d4c41');
  }
}

export function fish(ctx, x, y, s, color, dir = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(dir * s, s);
  ellipse(ctx, 0, 0, 16, 9, color);
  poly(ctx, [[14, 0], [24, -8], [24, 8]], color);
  circle(ctx, -8, -2, 2, '#1a1a1a');
  ctx.restore();
}

export function lantern(ctx, x, y, s, color, lit) {
  line(ctx, x, y - 26 * s, x, y - 14 * s, '#4e342e', 2 * s);
  ellipse(ctx, x, y, 12 * s, 16 * s, color);
  rect(ctx, x - 8 * s, y - 18 * s, 16 * s, 4 * s, '#ffd54f');
  rect(ctx, x - 8 * s, y + 14 * s, 16 * s, 4 * s, '#ffd54f');
  if (lit) {
    circle(ctx, x, y, 5 * s, '#fff176');
    ctx.strokeStyle = '#fff17688';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 24 * s, 0, Math.PI * 2);
    ctx.stroke();
  }
}

export function barrel(ctx, x, y, s, color) {
  ellipse(ctx, x, y, 14 * s, 18 * s, color);
  rect(ctx, x - 14 * s, y - 18 * s, 28 * s, 36 * s, color);
  line(ctx, x - 14 * s, y - 8 * s, x + 14 * s, y - 8 * s, '#3e2723', 2 * s);
  line(ctx, x - 14 * s, y + 8 * s, x + 14 * s, y + 8 * s, '#3e2723', 2 * s);
}

export function crate(ctx, x, y, s, color) {
  rect(ctx, x, y, 30 * s, 30 * s, color);
  line(ctx, x, y, x + 30 * s, y + 30 * s, '#00000033', 3 * s);
  line(ctx, x + 30 * s, y, x, y + 30 * s, '#00000033', 3 * s);
  ctx.strokeStyle = '#00000044';
  ctx.lineWidth = 2 * s;
  ctx.strokeRect(x, y, 30 * s, 30 * s);
}

export function stall(ctx, x, y, s, awning, opts = {}) {
  // counter + posts + striped awning
  rect(ctx, x, y + 30 * s, 120 * s, 34 * s, '#8d6e63');
  rect(ctx, x + 6 * s, y + 36 * s, 108 * s, 22 * s, opts.counter || '#a1887f');
  line(ctx, x + 4 * s, y, x + 4 * s, y + 30 * s, '#5d4037', 4 * s);
  line(ctx, x + 116 * s, y, x + 116 * s, y + 30 * s, '#5d4037', 4 * s);
  for (let i = 0; i < 6; i += 1) {
    poly(ctx, [[x - 6 * s + i * 22 * s, y - 18 * s], [x + 16 * s + i * 22 * s, y - 18 * s], [x + 11 * s + i * 22 * s, y], [x - 1 * s + i * 22 * s, y]], i % 2 === 0 ? awning : '#fff8e1');
  }
  rect(ctx, x - 6 * s, y - 22 * s, 132 * s, 5 * s, awning);
}

export function cat(ctx, x, y, s, color) {
  ellipse(ctx, x, y, 18 * s, 10 * s, color);
  circle(ctx, x + 16 * s, y - 6 * s, 8 * s, color);
  poly(ctx, [[x + 11 * s, y - 12 * s], [x + 13 * s, y - 20 * s], [x + 16 * s, y - 12 * s]], color);
  poly(ctx, [[x + 17 * s, y - 12 * s], [x + 19 * s, y - 20 * s], [x + 22 * s, y - 12 * s]], color);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3 * s;
  ctx.beginPath();
  ctx.moveTo(x - 16 * s, y);
  ctx.quadraticCurveTo(x - 26 * s, y - 10 * s, x - 20 * s, y - 16 * s);
  ctx.stroke();
}

export function lighthouse(ctx, x, y, s, opts = {}) {
  // x,y = base centre; tower rises up
  poly(ctx, [[x - 26 * s, y], [x - 18 * s, y - 150 * s], [x + 18 * s, y - 150 * s], [x + 26 * s, y]], '#eceff1');
  rect(ctx, x - 24 * s, y - 110 * s, 48 * s, 22 * s, '#e53935');
  rect(ctx, x - 21 * s, y - 60 * s, 42 * s, 22 * s, '#e53935');
  rect(ctx, x - 20 * s, y - 168 * s, 40 * s, 20 * s, '#37474f');
  circle(ctx, x, y - 158 * s, 7 * s, opts.lit ? '#ffeb3b' : '#78909c');
  if (opts.beam) {
    ctx.fillStyle = 'rgba(255,235,59,0.25)';
    poly(ctx, [[x, y - 158 * s], [x + 190 * s, y - 190 * s], [x + 190 * s, y - 128 * s]], 'rgba(255,235,59,0.25)');
  }
  rect(ctx, x - 26 * s, y - 178 * s, 52 * s, 10 * s, '#37474f');
}

export function starfish(ctx, x, y, s, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 5; i += 1) {
    const a = -Math.PI / 2 + (i / 5) * Math.PI * 2;
    const a2 = a + Math.PI / 5;
    ctx.lineTo(x + Math.cos(a) * 12 * s, y + Math.sin(a) * 12 * s);
    ctx.lineTo(x + Math.cos(a2) * 5 * s, y + Math.sin(a2) * 5 * s);
  }
  ctx.closePath();
  ctx.fill();
}

export function flagPole(ctx, x, y, h, color) {
  line(ctx, x, y, x, y - h, '#5d4037', 4);
  poly(ctx, [[x, y - h], [x + 34, y - h + 9], [x, y - h + 18]], color);
}

export function ropeCoil(ctx, x, y, s, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 3 * s;
  for (let i = 0; i < 3; i += 1) {
    ctx.beginPath();
    ctx.arc(x, y, (14 - i * 4) * s, 0, Math.PI * 2);
    ctx.stroke();
  }
}

export function anchor(ctx, x, y, s, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 4 * s;
  ctx.beginPath();
  ctx.arc(x, y - 8 * s, 7 * s, 0, Math.PI * 2);
  ctx.stroke();
  line(ctx, x, y, x, y + 26 * s, color, 4 * s);
  line(ctx, x - 16 * s, y + 6 * s, x + 16 * s, y + 6 * s, color, 4 * s);
  ctx.beginPath();
  ctx.arc(x - 12 * s, y + 12 * s, 10 * s, Math.PI * 0.15, Math.PI * 0.85);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x + 12 * s, y + 12 * s, 10 * s, Math.PI * 0.15, Math.PI * 0.85);
  ctx.stroke();
}
