import test from 'node:test';
import assert from 'node:assert/strict';
import { mulberry32 } from '../game/src/random.js';

test('same seed gives the same sequence', () => {
  const a = mulberry32(42);
  const b = mulberry32(42);
  for (let i = 0; i < 50; i++) assert.equal(a(), b());
});

test('different seeds give different sequences', () => {
  const a = mulberry32(1);
  const b = mulberry32(2);
  let same = 0;
  for (let i = 0; i < 50; i++) if (a() === b()) same++;
  assert.ok(same < 5, `expected mostly different values, got ${same} equal`);
});

test('values stay in [0, 1)', () => {
  const r = mulberry32(7);
  for (let i = 0; i < 1000; i++) {
    const v = r();
    assert.ok(v >= 0 && v < 1, `out of range: ${v}`);
  }
});

test('seed 0 is usable', () => {
  const r = mulberry32(0);
  const v = r();
  assert.ok(Number.isFinite(v) && v >= 0 && v < 1);
});
