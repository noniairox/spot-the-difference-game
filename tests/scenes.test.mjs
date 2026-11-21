import test from 'node:test';
import assert from 'node:assert/strict';
import { SCENES, sceneById, findDiffAt } from '../game/src/scenes.js';

const PANEL = 560;

test('there are exactly 3 scenes with unique ids and names', () => {
  assert.equal(SCENES.length, 3);
  const ids = new Set(SCENES.map((s) => s.id));
  assert.equal(ids.size, 3);
  for (const s of SCENES) {
    assert.ok(typeof s.name === 'string' && s.name.length > 0);
    assert.ok(typeof s.title === 'string' && s.title.length > 0);
  }
});

test('sceneById returns the scene or null', () => {
  assert.equal(sceneById(1).id, 1);
  assert.equal(sceneById(3).id, 3);
  assert.equal(sceneById(99), null);
});

test('every scene has 7 differences inside the panel', () => {
  for (const s of SCENES) {
    assert.equal(s.diffs.length, 7, `scene ${s.id} must have 7 diffs`);
    const ids = new Set();
    for (const d of s.diffs) {
      assert.ok(!ids.has(d.id), `duplicate diff id ${d.id} in scene ${s.id}`);
      ids.add(d.id);
      assert.ok(typeof d.label === 'string' && d.label.length > 0);
      assert.ok(d.r >= 18 && d.r <= 48, `diff ${d.id} radius ${d.r} out of range`);
      assert.ok(d.x - d.r >= 0 && d.x + d.r <= PANEL, `diff ${d.id} x out of bounds`);
      assert.ok(d.y - d.r >= 0 && d.y + d.r <= PANEL, `diff ${d.id} y out of bounds`);
      if (d.x2 !== undefined) {
        assert.ok(d.x2 - d.r >= 0 && d.x2 + d.r <= PANEL, `diff ${d.id} x2 out of bounds`);
        assert.ok(d.y2 - d.r >= 0 && d.y2 + d.r <= PANEL, `diff ${d.id} y2 out of bounds`);
      }
    }
  }
});

test('no two differences in a scene overlap', () => {
  for (const s of SCENES) {
    for (let i = 0; i < s.diffs.length; i++) {
      for (let j = i + 1; j < s.diffs.length; j++) {
        const a = s.diffs[i];
        const b = s.diffs[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        assert.ok(
          dist > a.r + b.r + 8,
          `scene ${s.id}: diffs ${a.id} and ${b.id} overlap (dist ${dist.toFixed(1)})`,
        );
      }
    }
  }
});

test('findDiffAt hits inside a radius and misses outside', () => {
  const scene = sceneById(1);
  const d = scene.diffs[0];
  assert.equal(findDiffAt(scene, d.x, d.y).id, d.id);
  assert.equal(findDiffAt(scene, d.x + d.r - 2, d.y).id, d.id);
  assert.equal(findDiffAt(scene, d.x + d.r + 30, d.y), null);
  assert.equal(findDiffAt(scene, -10, -10), null);
});
