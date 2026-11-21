// Pure game rules for Twin Lanterns: no DOM, no canvas, fully testable.
import { findDiffAt } from './scenes.js';

export function createGame(scene, opts = {}) {
  return {
    scene,
    found: new Set(),
    score: 0,
    combo: 0,
    timeLeft: opts.timeLimit ?? 120,
    hints: opts.hints ?? 3,
    status: 'playing', // 'playing' | 'won' | 'lost'
  };
}

export function remaining(game) {
  return game.scene.diffs.length - game.found.size;
}

export function clickAt(game, x, y) {
  if (game.status !== 'playing') return { hit: false };
  const diff = findDiffAt(game.scene, x, y);
  if (!diff) {
    game.combo = 0;
    game.timeLeft = Math.max(0, game.timeLeft - 5);
    if (game.timeLeft === 0) game.status = 'lost';
    return { hit: false };
  }
  if (game.found.has(diff.id)) return { hit: false, already: true };
  game.found.add(diff.id);
  game.combo += 1;
  game.score += 100 + 25 * (game.combo - 1);
  if (game.found.size === game.scene.diffs.length) {
    game.status = 'won';
    game.score += Math.round(game.timeLeft) * 5;
  }
  return { hit: true, diff };
}

export function useHint(game) {
  if (game.status !== 'playing' || game.hints <= 0) return null;
  const unfound = game.scene.diffs.filter((d) => !game.found.has(d.id));
  if (unfound.length === 0) return null;
  game.hints -= 1;
  return unfound[Math.floor(Math.random() * unfound.length)];
}

export function tick(game, dt) {
  if (game.status !== 'playing') return;
  game.timeLeft = Math.max(0, game.timeLeft - dt);
  if (game.timeLeft === 0) game.status = 'lost';
}
