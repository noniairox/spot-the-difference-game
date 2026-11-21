// Scene data + painters for Twin Lanterns. Panel is 560x560. Each scene lists its
// 7 differences (single source of truth: painters draw elements at these coords)
// and a paint(ctx, right) that draws the base scene, or the right panel with the
// mutations applied. All art is procedural canvas — original, no assets.
import { mulberry32 } from './random.js';

export const PANEL = 560;

export function sceneById(id) {
  return SCENES.find((s) => s.id === id) ?? null;
}

export function findDiffAt(scene, x, y) {
  for (const d of scene.diffs) {
    if (Math.hypot(x - d.x, y - d.y) <= d.r) return d;
    if (d.x2 !== undefined && Math.hypot(x - d.x2, y - d.y2) <= d.r) return d;
  }
  return null;
}

// ---- small drawing helpers ----
function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}
function ellipse(ctx, x, y, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}
function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.fill();
}
function poly(ctx, pts) {
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
  ctx.fill();
}
function sparkle(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y);
  ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.fill();
}
function paperLantern(ctx, x, y, s, color) {
  ctx.fillStyle = color;
  ellipse(ctx, x, y, 16 * s, 20 * s);
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ellipse(ctx, x - 5 * s, y - 6 * s, 5 * s, 8 * s);
  ctx.fillStyle = '#8d5a2b';
  rr(ctx, x - 7 * s, y - 24 * s, 14 * s, 5 * s, 2);
  rr(ctx, x - 7 * s, y + 19 * s, 14 * s, 5 * s, 2);
  ctx.strokeStyle = '#d9a441';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x, y + 24 * s);
  ctx.lineTo(x, y + 34 * s);
  ctx.stroke();
  circle(ctx, x, y + 36 * s, 2.5 * s);
}
function koiFish(ctx, x, y, s, angle, body, belly) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = body;
  ellipse(ctx, 0, 0, 26 * s, 11 * s);
  ctx.fillStyle = belly;
  ellipse(ctx, -4 * s, 3 * s, 16 * s, 6 * s);
  poly(ctx, [[-24 * s, 0], [-38 * s, -10 * s], [-38 * s, 10 * s]]);
  ctx.fillStyle = '#1c1c1c';
  circle(ctx, 16 * s, -3 * s, 2 * s);
  ctx.restore();
}
function pine(ctx, x, y, s, color) {
  ctx.fillStyle = color;
  poly(ctx, [[x, y - 58 * s], [x - 26 * s, y], [x + 26 * s, y]]);
  poly(ctx, [[x, y - 84 * s], [x - 20 * s, y - 34 * s], [x + 20 * s, y - 34 * s]]);
  poly(ctx, [[x, y - 104 * s], [x - 13 * s, y - 62 * s], [x + 13 * s, y - 62 * s]]);
  ctx.fillStyle = '#5b3a29';
  ctx.fillRect(x - 4 * s, y, 8 * s, 12 * s);
}
function sittingCat(ctx, x, y, s, color) {
  ctx.fillStyle = color;
  ellipse(ctx, x, y - 14 * s, 13 * s, 18 * s);
  circle(ctx, x, y - 38 * s, 11 * s);
  poly(ctx, [[x - 10 * s, y - 44 * s], [x - 6 * s, y - 56 * s], [x - 2 * s, y - 46 * s]]);
  poly(ctx, [[x + 2 * s, y - 46 * s], [x + 6 * s, y - 56 * s], [x + 10 * s, y - 44 * s]]);
  ctx.strokeStyle = color;
  ctx.lineWidth = 4 * s;
  ctx.beginPath();
  ctx.moveTo(x + 12 * s, y - 4 * s);
  ctx.quadraticCurveTo(x + 26 * s, y - 2 * s, x + 22 * s, y - 20 * s);
  ctx.stroke();
}
function sittingFox(ctx, x, y, s) {
  ctx.fillStyle = '#d97b2f';
  ellipse(ctx, x, y - 12 * s, 14 * s, 17 * s);
  circle(ctx, x, y - 36 * s, 11 * s);
  poly(ctx, [[x - 10 * s, y - 42 * s], [x - 7 * s, y - 55 * s], [x - 1 * s, y - 44 * s]]);
  poly(ctx, [[x + 1 * s, y - 44 * s], [x + 7 * s, y - 55 * s], [x + 10 * s, y - 42 * s]]);
  ctx.fillStyle = '#fff3e0';
  ellipse(ctx, x, y - 8 * s, 7 * s, 11 * s);
  ctx.strokeStyle = '#d97b2f';
  ctx.lineWidth = 6 * s;
  ctx.beginPath();
  ctx.moveTo(x - 12 * s, y - 2 * s);
  ctx.quadraticCurveTo(x - 30 * s, y + 2 * s, x - 26 * s, y - 12 * s);
  ctx.stroke();
  ctx.fillStyle = '#fff3e0';
  circle(ctx, x - 26 * s, y - 12 * s, 4 * s);
}
function stoneLantern(ctx, x, y, s, flame) {
  ctx.fillStyle = '#7d838c';
  rr(ctx, x - 16 * s, y + 26 * s, 32 * s, 8 * s, 2);
  ctx.fillRect(x - 5 * s, y + 4 * s, 10 * s, 22 * s);
  rr(ctx, x - 14 * s, y - 12 * s, 28 * s, 16 * s, 3);
  poly(ctx, [[x - 18 * s, y - 12 * s], [x, y - 26 * s], [x + 18 * s, y - 12 * s]]);
  circle(ctx, x, y - 28 * s, 3 * s);
  if (flame) {
    ctx.fillStyle = '#ffb703';
    ellipse(ctx, x, y - 4 * s, 4 * s, 6 * s);
    ctx.fillStyle = '#fff3b0';
    ellipse(ctx, x, y - 3 * s, 2 * s, 3.5 * s);
  }
}
function frog(ctx, x, y, s) {
  ctx.fillStyle = '#4caf50';
  ellipse(ctx, x, y, 15 * s, 10 * s);
  circle(ctx, x - 7 * s, y - 9 * s, 5 * s);
  circle(ctx, x + 7 * s, y - 9 * s, 5 * s);
  ctx.fillStyle = '#1c1c1c';
  circle(ctx, x - 7 * s, y - 10 * s, 2 * s);
  circle(ctx, x + 7 * s, y - 10 * s, 2 * s);
  ctx.fillStyle = '#c8e6c9';
  ellipse(ctx, x, y + 4 * s, 8 * s, 4 * s);
}

// ---- Scene 1: Night Market ----
function paintMarket(ctx, right) {
  const sky = ctx.createLinearGradient(0, 0, 0, 340);
  sky.addColorStop(0, '#1b2340');
  sky.addColorStop(0.6, '#4a2b5a');
  sky.addColorStop(1, '#c96f3f');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, PANEL, 360);
  // stars (seeded, same both panels)
  const rnd = mulberry32(11);
  for (let i = 0; i < 26; i++) {
    const sx = 20 + rnd() * 520;
    const sy = 12 + rnd() * 130;
    ctx.fillStyle = `rgba(255,255,255,${0.35 + rnd() * 0.5})`;
    circle(ctx, sx, sy, 1 + rnd() * 1.6);
  }
  // the one bright star that can vanish
  if (!right) sparkle(ctx, 120, 60, 9, '#fff7c0');
  // moon
  ctx.fillStyle = '#ffe9a8';
  circle(ctx, 455, 70, 34);
  ctx.fillStyle = '#e8c87e';
  circle(ctx, 445, 60, 6);
  if (!right) circle(ctx, 465, 78, 5);
  // clouds
  ctx.fillStyle = 'rgba(255,220,200,0.16)';
  ellipse(ctx, 120, 110, 70, 14);
  ellipse(ctx, 380, 140, 80, 12);
  // rooftops
  ctx.fillStyle = '#141a2e';
  poly(ctx, [[0, 360], [0, 300], [90, 300], [130, 330], [180, 300], [260, 300], [260, 360]]);
  poly(ctx, [[300, 360], [330, 295], [420, 295], [460, 330], [560, 300], [560, 360]]);
  // house window: lit left, dark right
  ctx.fillStyle = right ? '#232c47' : '#ffd76a';
  rr(ctx, 201, 318, 18, 24, 2);
  ctx.fillStyle = '#232c47';
  rr(ctx, 321, 323, 18, 24, 2);
  ctx.strokeStyle = '#ffd76a';
  ctx.lineWidth = 1;
  ctx.strokeRect(321, 323, 18, 24);
  // cat on the right rooftop (vanishes on the right panel)
  if (!right) sittingCat(ctx, 430, 300, 1, '#0e1226');
  // lantern string
  ctx.strokeStyle = '#3a2c22';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(20, 150);
  ctx.quadraticCurveTo(280, 185, 540, 150);
  ctx.stroke();
  const lanterns = [
    [70, 172, '#e63946'],
    [150, 162, '#f4a261'],
    [230, 158, '#e9c46a'],
    [310, 158, '#e63946'],
    [390, 162, '#f4a261'],
    [470, 172, '#e9c46a'],
  ];
  for (const [lx, ly, col] of lanterns) {
    const c = right && lx === 310 ? '#2ec4b6' : col;
    paperLantern(ctx, lx, ly, 1, c);
  }
  // pagoda silhouette filling the middle of the street (same in both panels)
  ctx.fillStyle = '#1a2036';
  ctx.fillRect(240, 480, 90, 20);
  ctx.fillRect(250, 450, 70, 30);
  poly(ctx, [[240, 450], [330, 450], [320, 430], [250, 430]]);
  ctx.fillRect(263, 405, 44, 25);
  poly(ctx, [[255, 405], [315, 405], [307, 388], [263, 388]]);
  ctx.fillRect(273, 365, 24, 23);
  poly(ctx, [[267, 365], [303, 365], [297, 350], [273, 350]]);
  ctx.strokeStyle = '#1a2036';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(285, 350);
  ctx.lineTo(285, 336);
  ctx.stroke();
  circle(ctx, 285, 334, 3);
  ctx.fillStyle = '#ffd76a';
  ctx.fillRect(277, 460, 8, 12);
  ctx.fillRect(292, 460, 8, 12);
  ctx.fillRect(280, 412, 8, 10);
  // fireflies drifting over the street (seeded, same in both panels)
  const frnd = mulberry32(55);
  for (let i = 0; i < 14; i++) {
    const fx = 40 + frnd() * 480;
    const fy = 370 + frnd() * 120;
    ctx.fillStyle = 'rgba(255,215,106,0.25)';
    circle(ctx, fx, fy, 5);
    ctx.fillStyle = 'rgba(255,215,106,0.9)';
    circle(ctx, fx, fy, 1.8);
  }
  // ground
  ctx.fillStyle = '#2a2438';
  ctx.fillRect(0, 500, PANEL, 60);
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  for (let gx = 20; gx < 560; gx += 44) circle(ctx, gx, 522, 3);
  for (let gx = 42; gx < 560; gx += 44) circle(ctx, gx, 544, 3);
  // left stall: fruit
  ctx.fillStyle = '#7a3b2e';
  poly(ctx, [[70, 372], [210, 372], [200, 396], [80, 396]]);
  ctx.fillStyle = '#e8d8b0';
  for (let ax = 78; ax < 205; ax += 18) {
    ctx.fillRect(ax, 372, 9, 24);
  }
  ctx.fillStyle = '#5b2d22';
  ctx.fillRect(80, 396, 120, 74);
  ctx.fillStyle = '#f4a261';
  for (const [fx, fy] of [[100, 430], [125, 425], [150, 432], [112, 448], [138, 450], [163, 446]]) circle(ctx, fx, fy, 8);
  ctx.fillStyle = '#e63946';
  for (const [fx, fy] of [[105, 465], [130, 462], [155, 466]]) circle(ctx, fx, fy, 8);
  // stall sign: fish left, dumpling right
  ctx.fillStyle = '#f1e6c8';
  rr(ctx, 102, 386, 56, 30, 4);
  ctx.fillStyle = '#7a3b2e';
  if (!right) {
    ellipse(ctx, 130, 401, 14, 8);
    poly(ctx, [[144, 401], [156, 394], [156, 408]]);
    circle(ctx, 121, 399, 2.5);
  } else {
    ctx.beginPath();
    ctx.arc(130, 404, 12, Math.PI, 0);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(130, 404, 12, 0, Math.PI);
    ctx.fill();
  }
  // right stall: toys and kites
  ctx.fillStyle = '#2e5d7a';
  poly(ctx, [[360, 372], [510, 372], [500, 396], [370, 396]]);
  ctx.fillStyle = '#d8ecf3';
  for (let ax = 368; ax < 505; ax += 18) ctx.fillRect(ax, 372, 9, 24);
  ctx.fillStyle = '#234a63';
  ctx.fillRect(370, 396, 130, 74);
  const kite = (kx, ky, col) => {
    ctx.fillStyle = col;
    poly(ctx, [[kx, ky - 14], [kx + 11, ky], [kx, ky + 14], [kx - 11, ky]]);
    ctx.strokeStyle = '#d8ecf3';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(kx, ky + 14);
    ctx.lineTo(kx + 4, ky + 28);
    ctx.stroke();
  };
  kite(400, 425, '#e63946');
  kite(455, 420, '#2ec4b6');
  kite(490, 432, '#e9c46a');
  // paper crane on the counter (vanishes on the right panel)
  if (!right) {
    ctx.fillStyle = '#f8f4e8';
    poly(ctx, [[440, 420], [452, 408], [448, 424], [458, 414], [446, 428], [436, 430]]);
  }
}

// ---- Scene 2: Koi Pond Garden ----
function paintGarden(ctx, right) {
  const sky = ctx.createLinearGradient(0, 0, 0, 200);
  sky.addColorStop(0, '#bfe3d0');
  sky.addColorStop(1, '#eaf7e9');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, PANEL, 210);
  ctx.fillStyle = '#8fae94';
  ctx.fillRect(0, 200, PANEL, 360);
  // cherry tree
  ctx.strokeStyle = '#5b3a29';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(60, 210);
  ctx.quadraticCurveTo(70, 130, 110, 80);
  ctx.stroke();
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(95, 110);
  ctx.quadraticCurveTo(140, 90, 180, 70);
  ctx.stroke();
  const rnd = mulberry32(23);
  for (let i = 0; i < 34; i++) {
    const bx = 40 + rnd() * 190;
    const by = 30 + rnd() * 120;
    ctx.fillStyle = `rgba(244,${140 + Math.floor(rnd() * 60)},${170 + Math.floor(rnd() * 40)},0.9)`;
    circle(ctx, bx, by, 7 + rnd() * 9);
  }
  // pond
  const water = ctx.createLinearGradient(0, 210, 0, 550);
  water.addColorStop(0, '#2e8b8b');
  water.addColorStop(1, '#1f6f6f');
  ctx.fillStyle = water;
  ctx.beginPath();
  ctx.ellipse(280, 385, 262, 168, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth = 2;
  for (const [rx, ry, rr2] of [[200, 340, 30], [340, 430, 40], [430, 330, 26]]) {
    ctx.beginPath();
    ctx.ellipse(rx, ry, rr2, rr2 * 0.35, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  // bridge
  ctx.strokeStyle = '#7a4a2b';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(170, 250);
  ctx.quadraticCurveTo(280, 185, 390, 250);
  ctx.stroke();
  ctx.strokeStyle = '#a4713f';
  ctx.lineWidth = 8;
  for (let i = 0; i < 9; i++) {
    const t = i / 8;
    const bx = 170 + 220 * t;
    const by = 250 - 62 * Math.sin(Math.PI * t);
    if (right && i === 4) continue; // the missing plank
    ctx.beginPath();
    ctx.moveTo(bx - 4, by - 8);
    ctx.lineTo(bx + 4, by - 8);
    ctx.stroke();
  }
  // lily pads
  const pads = [[150, 380, 26], [260, 450, 30], [380, 470, 24], [450, 380, 28], [320, 300, 22]];
  for (const [px, py, pr] of pads) {
    ctx.fillStyle = '#2f7d32';
    circle(ctx, px, py, pr);
    ctx.fillStyle = '#3c9240';
    circle(ctx, px - 4, py - 4, pr - 6);
  }
  // lily flower: pink left, white right
  ctx.fillStyle = right ? '#ffffff' : '#f48fb1';
  for (let p = 0; p < 5; p++) {
    const a = (p / 5) * Math.PI * 2;
    ellipse(ctx, 145 + Math.cos(a) * 9, 372 + Math.sin(a) * 9, 7, 4);
  }
  ctx.fillStyle = '#ffd54f';
  circle(ctx, 145, 372, 4);
  // koi
  koiFish(ctx, 220, 360, 1, 0.4, '#e8722a', '#fff3e0');
  koiFish(ctx, 350, 420, 0.9, -2.6, '#f5f5f0', '#e8722a');
  koiFish(ctx, 420, 330, 0.8, 2.8, '#e8722a', '#fff3e0');
  if (!right) koiFish(ctx, 280, 520, 0.7, 0.9, '#f5f5f0', '#e8722a');
  // frog on its own pad (vanishes on the right panel)
  if (!right) {
    ctx.fillStyle = '#2f7d32';
    circle(ctx, 200, 420, 20);
    frog(ctx, 200, 416, 1);
  }
  // stone lantern
  stoneLantern(ctx, 450, 150, 1, !right);
  // bamboo: one stalk vanishes on the right panel
  ctx.strokeStyle = '#4a7c59';
  ctx.lineWidth = 7;
  for (const bx of [505, 525, 545]) {
    if (right && bx === 505) continue;
    ctx.beginPath();
    ctx.moveTo(bx, 330);
    ctx.lineTo(bx, 180);
    ctx.stroke();
  }
  ctx.fillStyle = '#6aa877';
  for (const [lx, ly] of [[500, 220], [520, 200], [540, 240], [512, 260]]) ellipse(ctx, lx, ly, 12, 5);
  // petals on the ground: 3 left, 6 right
  ctx.fillStyle = '#f48fb1';
  const petals = right
    ? [[80, 495], [95, 505], [108, 492], [85, 512], [102, 518], [115, 508]]
    : [[85, 498], [100, 508], [112, 496]];
  for (const [px, py] of petals) ellipse(ctx, px, py, 7, 4);
}

// ---- Scene 3: Mountain Observatory ----
function paintObservatory(ctx, right) {
  const sky = ctx.createLinearGradient(0, 0, 0, 360);
  sky.addColorStop(0, '#0d1530');
  sky.addColorStop(1, '#1c2b52');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, PANEL, 380);
  const rnd = mulberry32(37);
  for (let i = 0; i < 30; i++) {
    const sx = 15 + rnd() * 530;
    const sy = 12 + rnd() * 200;
    ctx.fillStyle = `rgba(255,255,255,${0.3 + rnd() * 0.6})`;
    circle(ctx, sx, sy, 1 + rnd() * 1.5);
  }
  // constellation: three stars always there, a fourth that can vanish
  ctx.fillStyle = '#ffffff';
  circle(ctx, 285, 95, 2.5);
  circle(ctx, 315, 95, 2.5);
  circle(ctx, 300, 125, 2.5);
  if (!right) circle(ctx, 300, 110, 2.5);
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(285, 95);
  ctx.lineTo(315, 95);
  ctx.lineTo(300, 125);
  ctx.closePath();
  ctx.stroke();
  // satellite (vanishes on the right panel)
  if (!right) {
    ctx.fillStyle = '#c8ccd4';
    rr(ctx, 244, 56, 12, 8, 2);
    ctx.fillStyle = '#2e5fa3';
    ctx.fillRect(232, 58, 10, 4);
    ctx.fillRect(258, 58, 10, 4);
  }
  // comet (vanishes on the right panel)
  if (!right) {
    const tail = ctx.createLinearGradient(120, 90, 60, 130);
    tail.addColorStop(0, 'rgba(255,240,180,0.9)');
    tail.addColorStop(1, 'rgba(255,240,180,0)');
    ctx.fillStyle = tail;
    poly(ctx, [[120, 90], [58, 128], [66, 138]]);
    ctx.fillStyle = '#fff3b0';
    circle(ctx, 122, 88, 7);
  }
  // mountains
  ctx.fillStyle = '#16224a';
  poly(ctx, [[0, 380], [0, 300], [90, 240], [170, 310], [260, 250], [340, 320], [430, 260], [560, 320], [560, 380]]);
  ctx.fillStyle = '#1e2f5e';
  poly(ctx, [[0, 380], [0, 340], [120, 300], [220, 350], [330, 305], [450, 350], [560, 315], [560, 380]]);
  // hill + observatory dome
  ctx.fillStyle = '#22402e';
  ctx.beginPath();
  ctx.ellipse(400, 420, 150, 90, 0, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = '#c8ccd4';
  ctx.beginPath();
  ctx.arc(400, 330, 55, Math.PI, 0);
  ctx.fill();
  ctx.fillRect(345, 330, 110, 30);  // dome slit + telescope
  ctx.fillStyle = '#1c2b52';
  poly(ctx, [[392, 278], [408, 278], [404, 330], [396, 330]]);
  ctx.strokeStyle = '#e8e8e8';
  ctx.lineWidth = 7;
  ctx.beginPath();
  if (!right) {
    ctx.moveTo(392, 285);
    ctx.lineTo(360, 210);
  } else {
    ctx.moveTo(408, 285);
    ctx.lineTo(430, 215);
  }
  ctx.stroke();
  ctx.fillStyle = '#8d99ae';
  circle(ctx, right ? 430 : 360, right ? 215 : 210, 6);
  // dome window light: warm left, cool right
  ctx.fillStyle = right ? '#7fd4ff' : '#ffd76a';
  circle(ctx, 400, 280, 8);
  // pines
  pine(ctx, 60, 500, 1, '#0e1f16');
  pine(ctx, 480, 520, 1.1, '#0e1f16');
  if (!right) pine(ctx, 520, 430, 0.9, '#0e1f16');
  // fox (vanishes on the right panel)
  if (!right) sittingFox(ctx, 180, 470, 1);
  // ground
  ctx.fillStyle = '#101c26';
  ctx.fillRect(0, 500, PANEL, 60);
  ctx.fillStyle = 'rgba(255,255,255,0.07)';
  for (let gx = 30; gx < 560; gx += 52) circle(ctx, gx, 530, 3);
}

export const SCENES = [
  {
    id: 1,
    name: 'Pasar Lampion',
    title: 'Night Market',
    sub: 'Lanterns over the evening stalls',
    diffs: [
      { id: 'lantern-color', label: 'Lantern colour', x: 310, y: 158, r: 30 },
      { id: 'cat', label: 'Cat on the roof', x: 430, y: 278, r: 34 },
      { id: 'star', label: 'Bright star', x: 120, y: 60, r: 22 },
      { id: 'sign', label: 'Stall sign', x: 130, y: 400, r: 30 },
      { id: 'crane', label: 'Paper crane', x: 440, y: 420, r: 28 },
      { id: 'window', label: 'Lit window', x: 210, y: 330, r: 26 },
      { id: 'moon-crater', label: 'Moon crater', x: 465, y: 78, r: 20 },
    ],
    paint: paintMarket,
  },
  {
    id: 2,
    name: 'Taman Koi',
    title: 'Koi Pond Garden',
    sub: 'Morning at the lily pond',
    diffs: [
      { id: 'koi', label: 'Extra koi', x: 280, y: 520, r: 30 },
      { id: 'flower', label: 'Lily flower', x: 145, y: 372, r: 26 },
      { id: 'lantern-flame', label: 'Stone lantern flame', x: 450, y: 150, r: 24 },
      { id: 'bamboo', label: 'Bamboo stalk', x: 510, y: 250, r: 24 },
      { id: 'petals', label: 'Fallen petals', x: 90, y: 500, r: 28 },
      { id: 'frog', label: 'Frog on the pad', x: 200, y: 420, r: 26 },
      { id: 'plank', label: 'Bridge plank', x: 280, y: 185, r: 26 },
    ],
    paint: paintGarden,
  },
  {
    id: 3,
    name: 'Observatorium Gunung',
    title: 'Mountain Observatory',
    sub: 'A clear night above the peaks',
    diffs: [
      { id: 'comet', label: 'Comet', x: 120, y: 90, r: 30 },
      { id: 'dome-light', label: 'Dome window light', x: 400, y: 280, r: 26 },
      { id: 'telescope', label: 'Telescope angle', x: 360, y: 210, r: 28, x2: 430, y2: 215 },
      { id: 'pine', label: 'Pine tree', x: 515, y: 385, r: 42 },
      { id: 'fox', label: 'Fox on the hill', x: 180, y: 450, r: 32 },
      { id: 'constellation', label: 'Fourth star', x: 300, y: 110, r: 22 },
      { id: 'satellite', label: 'Satellite', x: 250, y: 60, r: 22 },
    ],
    paint: paintObservatory,
  },
];
