import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, clickAt, useHint, tick, remaining } from '../game/src/state.js';
import { sceneById } from '../game/src/scenes.js';

test('new game starts with 7 remaining, 0 score, 120 seconds, 3 hints', () => {
  const g = createGame(sceneById(1));
  assert.equal(remaining(g), 7);
  assert.equal(g.score, 0);
  assert.equal(g.timeLeft, 120);
  assert.equal(g.hints, 3);
  assert.equal(g.status, 'playing');
});

test('clicking a difference marks it found, drops remaining, adds score', () => {
  const g = createGame(sceneById(1));
  const d = g.scene.diffs[0];
  const res = clickAt(g, d.x, d.y);
  assert.equal(res.hit, true);
  assert.equal(res.diff.id, d.id);
  assert.equal(remaining(g), 6);
  assert.ok(g.score >= 100);
  assert.ok(g.found.has(d.id));
});

test('clicking the same difference twice counts once', () => {
  const g = createGame(sceneById(1));
  const d = g.scene.diffs[1];
  clickAt(g, d.x, d.y);
  const scoreAfterFirst = g.score;
  const res = clickAt(g, d.x, d.y);
  assert.equal(res.hit, false);
  assert.equal(res.already, true);
  assert.equal(g.score, scoreAfterFirst);
  assert.equal(remaining(g), 6);
});

test('clicking empty space is a miss and costs 5 seconds', () => {
  const g = createGame(sceneById(1));
  const res = clickAt(g, 280, 500);
  assert.equal(res.hit, false);
  assert.equal(g.timeLeft, 115);
  assert.equal(remaining(g), 7);
});

test('a miss breaks the combo', () => {
  const g = createGame(sceneById(2));
  const d0 = g.scene.diffs[0];
  const d1 = g.scene.diffs[1];
  clickAt(g, d0.x, d0.y);
  const comboScore = g.score;
  clickAt(g, 60, 300); // miss: empty grass, no difference there
  clickAt(g, d1.x, d1.y);
  // second find after a miss earns the base 100, not a combo bonus
  assert.equal(g.score - comboScore, 100);
});

test('finding all 7 differences wins the scene with a time bonus', () => {
  const g = createGame(sceneById(1));
  for (const d of g.scene.diffs) clickAt(g, d.x, d.y);
  assert.equal(g.status, 'won');
  assert.equal(remaining(g), 0);
  assert.ok(g.score > 700, `win score ${g.score} should include time bonus`);
});

test('hint reveals an unfound difference and spends one hint', () => {
  const g = createGame(sceneById(3));
  const d = g.scene.diffs[0];
  clickAt(g, d.x, d.y);
  const hint = useHint(g);
  assert.ok(hint !== null);
  assert.ok(!g.found.has(hint.id));
  assert.equal(g.hints, 2);
});

test('hint with no hints left returns null', () => {
  const g = createGame(sceneById(1));
  useHint(g);
  useHint(g);
  useHint(g);
  assert.equal(useHint(g), null);
  assert.equal(g.hints, 0);
});

test('timer expiry loses the game', () => {
  const g = createGame(sceneById(1));
  tick(g, 119.5);
  assert.equal(g.status, 'playing');
  tick(g, 1);
  assert.equal(g.status, 'lost');
  assert.equal(g.timeLeft, 0);
});

test('clicks after the game ends do nothing', () => {
  const g = createGame(sceneById(1));
  tick(g, 120);
  const res = clickAt(g, g.scene.diffs[0].x, g.scene.diffs[0].y);
  assert.equal(res.hit, false);
  assert.equal(remaining(g), 7);
});
