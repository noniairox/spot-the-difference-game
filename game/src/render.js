// Canvas rendering for Twin Lanterns: two panels, found markers, hint pulse,
// miss flashes. Panel geometry is the single source of truth here.
import { PANEL } from './scenes.js';

export const CANVAS_W = 1200;
export const CANVAS_H = 600;
export const LEFT_X = 20;
export const RIGHT_X = 620;
export const PANEL_Y = 20;

export function panelAt(canvasX, canvasY) {
  if (canvasY < PANEL_Y || canvasY > PANEL_Y + PANEL) return null;
  if (canvasX >= LEFT_X && canvasX <= LEFT_X + PANEL) {
    return { side: 'left', x: canvasX - LEFT_X, y: canvasY - PANEL_Y };
  }
  if (canvasX >= RIGHT_X && canvasX <= RIGHT_X + PANEL) {
    return { side: 'right', x: canvasX - RIGHT_X, y: canvasY - PANEL_Y };
  }
  return null;
}

function drawPanel(ctx, game, right, ui, now) {
  const ox = right ? RIGHT_X : LEFT_X;
  ctx.save();
  ctx.beginPath();
  ctx.rect(ox, PANEL_Y, PANEL, PANEL);
  ctx.clip();
  ctx.translate(ox, PANEL_Y);
  game.scene.paint(ctx, right);
  ctx.restore();
  // frame
  ctx.strokeStyle = '#e8dcc0';
  ctx.lineWidth = 3;
  ctx.strokeRect(ox, PANEL_Y, PANEL, PANEL);
  // panel tag
  ctx.fillStyle = 'rgba(20,20,40,0.75)';
  ctx.fillRect(ox + 8, PANEL_Y + 8, 34, 26);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 16px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(right ? 'B' : 'A', ox + 25, PANEL_Y + 22);
  // found markers on this panel
  for (const id of game.found) {
    const d = game.scene.diffs.find((x) => x.id === id);
    const mx = ox + (right && d.x2 !== undefined ? d.x2 : d.x);
    const my = PANEL_Y + (right && d.y2 !== undefined ? d.y2 : d.y);
    ctx.strokeStyle = '#ff3b30';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(mx, my, d.r + 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(mx, my, d.r + 8, 0, Math.PI * 2);
    ctx.stroke();
  }
  // hint pulse on this panel
  if (ui.hint && now < ui.hint.until) {
    const d = ui.hint.diff;
    const hx = ox + (right && d.x2 !== undefined ? d.x2 : d.x);
    const hy = PANEL_Y + (right && d.y2 !== undefined ? d.y2 : d.y);
    const pulse = 1 + 0.18 * Math.sin(now / 130);
    ctx.strokeStyle = '#ffd60a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(hx, hy, (d.r + 6) * pulse, 0, Math.PI * 2);
    ctx.stroke();
  }
}

export function drawFrame(ctx, game, ui, now) {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = '#12101f';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  drawPanel(ctx, game, false, ui, now);
  drawPanel(ctx, game, true, ui, now);
  // miss flashes
  ui.misses = ui.misses.filter((m) => now - m.at < 450);
  for (const m of ui.misses) {
    const a = 1 - (now - m.at) / 450;
    ctx.strokeStyle = `rgba(255,59,48,${a})`;
    ctx.lineWidth = 4;
    const s = 10;
    ctx.beginPath();
    ctx.moveTo(m.x - s, m.y - s);
    ctx.lineTo(m.x + s, m.y + s);
    ctx.moveTo(m.x + s, m.y - s);
    ctx.lineTo(m.x - s, m.y + s);
    ctx.stroke();
  }
}

export function newUi() {
  return { misses: [], hint: null };
}
