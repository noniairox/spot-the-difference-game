// Demo / screenshot parameters for Twin Lanterns. Reading ?scene=2&found=1,3
// &time=87 pre-populates a real game state, so screenshots are deterministic
// renders of the game's own code — never a mock. Ignored in normal play.
import { sceneById } from './scenes.js';

export function parseDemoParams(search) {
  const q = new URLSearchParams(search);
  const out = { sceneId: null, foundIndexes: [], timeLeft: null };
  let any = false;
  const scene = Number(q.get('scene'));
  if (Number.isInteger(scene) && sceneById(scene)) {
    out.sceneId = scene;
    any = true;
  }
  const found = q.get('found');
  if (found) {
    const idxs = found
      .split(',')
      .map((s) => Number(s))
      .filter((n) => Number.isInteger(n) && n >= 1 && n <= 7);
    if (idxs.length > 0) {
      out.foundIndexes = idxs;
      any = true;
    }
  }
  const time = Number(q.get('time'));
  if (Number.isFinite(time) && time >= 0 && time <= 300) {
    out.timeLeft = Math.round(time);
    any = true;
  }
  return any ? out : null;
}

export function applyDemo(game, params) {
  if (!params) return false;
  for (const idx of params.foundIndexes) {
    const d = game.scene.diffs[idx - 1];
    if (d) game.found.add(d.id);
  }
  if (params.timeLeft !== null) game.timeLeft = params.timeLeft;
  if (game.found.size === game.scene.diffs.length) {
    game.status = 'won';
    game.score = game.found.size * 100 + game.timeLeft * 5;
  } else {
    game.score = game.found.size * 100;
  }
  return true;
}
