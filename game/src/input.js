// Pointer + keyboard input for Twin Lanterns. Pure mapping of canvas pixels to
// panel coordinates; the rules live in state.js.
import { panelAt, CANVAS_W, CANVAS_H } from './render.js';
import { clickAt, useHint } from './state.js';

export function bindInput(canvas, game, fx) {
  const onClick = (event) => {
    const rect = canvas.getBoundingClientRect();
    const cx = ((event.clientX - rect.left) / rect.width) * CANVAS_W;
    const cy = ((event.clientY - rect.top) / rect.height) * CANVAS_H;
    const hit = panelAt(cx, cy);
    if (!hit) return;
    const res = clickAt(game, hit.x, hit.y);
    if (res.hit) fx.onFind(res.diff);
    else if (res.already) fx.onAlready();
    else {
      fx.onMiss(cx, cy);
    }
    fx.onState();
  };
  canvas.addEventListener('click', onClick);

  const onKey = (event) => {
    const k = event.key.toLowerCase();
    if (k === 'h') {
      const diff = useHint(game);
      if (diff) fx.onHint(diff);
      fx.onState();
    } else if (k === 'm') {
      fx.onMuteToggle();
    } else if (k === 'r') {
      fx.onRestart();
    } else if (k === '1' || k === '2' || k === '3') {
      fx.onScene(Number(k));
    } else if (k === 'n' && game.status === 'won') {
      fx.onNextScene();
    }
  };
  window.addEventListener('keydown', onKey);
  return () => {
    canvas.removeEventListener('click', onClick);
    window.removeEventListener('keydown', onKey);
  };
}
