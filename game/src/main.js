// Twin Lanterns bootstrap: builds the game, wires input + HUD, runs the frame
// loop. The timer only ticks in real play, never in demo (?scene/&found) mode,
// so screenshots are stable.
import { SCENES, sceneById } from './scenes.js';
import { createGame, remaining, tick } from './state.js';
import { drawFrame, newUi, CANVAS_W, CANVAS_H } from './render.js';
import { bindInput } from './input.js';
import { playFind, playMiss, playHint, playWin, setMuted, isMuted } from './audio.js';
import { parseDemoParams, applyDemo } from './shots.js';

const $ = (id) => document.getElementById(id);
const canvas = $('board');
const ctx = canvas.getContext('2d');
canvas.width = CANVAS_W;
canvas.height = CANVAS_H;

let game = null;
let ui = newUi();
let demoMode = false;
let last = performance.now();
let detach = null;

function fmtTime(s) {
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${String(r).padStart(2, '0')}`;
}

function renderHud() {
  $('scene-name').textContent = `${game.scene.name} — ${game.scene.title}`;
  $('scene-sub').textContent = game.scene.sub;
  $('remaining').textContent = String(remaining(game));
  $('timer').textContent = fmtTime(game.timeLeft);
  $('timer').classList.toggle('low', game.timeLeft <= 20 && game.status === 'playing');
  $('score').textContent = String(game.score);
  $('hints').textContent = String(game.hints);
  $('mute-btn').textContent = isMuted() ? '🔇 Sound off' : '🔊 Sound on';
  const chips = game.scene.diffs
    .map((d) => `<span class="chip${game.found.has(d.id) ? ' found' : ''}">${d.label}</span>`)
    .join('');
  $('found-list').innerHTML = chips;
  $('win-overlay').classList.toggle('show', game.status === 'won');
  $('lose-overlay').classList.toggle('show', game.status === 'lost');
  if (game.status === 'won') $('win-score').textContent = String(game.score);
}

function startScene(id, demoParams) {
  if (detach) detach();
  const scene = sceneById(id) ?? SCENES[0];
  game = createGame(scene);
  ui = newUi();
  demoMode = applyDemo(game, demoParams);
  document.querySelectorAll('.scene-btn').forEach((b) => {
    b.classList.toggle('active', Number(b.dataset.scene) === scene.id);
  });
  renderHud();
  detach = bindInput(canvas, game, {
    onFind: (diff) => {
      playFind();
      if (game.status === 'won') playWin();
    },
    onAlready: () => {},
    onMiss: (x, y) => {
      playMiss();
      ui.misses.push({ x, y, at: performance.now() });
    },
    onHint: (diff) => {
      playHint();
      ui.hint = { diff, until: performance.now() + 2500 };
    },
    onMuteToggle: () => {
      setMuted(!isMuted());
      renderHud();
    },
    onRestart: () => startScene(game.scene.id, null),
    onScene: (id) => startScene(id, null),
    onNextScene: () => startScene((game.scene.id % SCENES.length) + 1, null),
    onState: renderHud,
  });
}

function frame(now) {
  if (!demoMode && game && game.status === 'playing') {
    tick(game, (now - last) / 1000);
    if (game.status !== 'playing') renderHud();
  }
  last = now;
  if (game) drawFrame(ctx, game, ui, now);
  requestAnimationFrame(frame);
}

$('hint-btn').addEventListener('click', () => {
  if (!game || game.status !== 'playing') return;
  import('./state.js').then(({ useHint }) => {
    const diff = useHint(game);
    if (diff) {
      playHint();
      ui.hint = { diff, until: performance.now() + 2500 };
    }
    renderHud();
  });
});
$('next-btn').addEventListener('click', () => startScene((game.scene.id % SCENES.length) + 1, null));
$('retry-btn').addEventListener('click', () => startScene(game.scene.id, null));
$('mute-btn').addEventListener('click', () => {
  setMuted(!isMuted());
  renderHud();
});
document.querySelectorAll('.scene-btn').forEach((b) => {
  b.addEventListener('click', () => startScene(Number(b.dataset.scene), null));
});

const demo = parseDemoParams(window.location.search);
startScene(demo?.sceneId ?? 1, demo);
requestAnimationFrame(frame);
