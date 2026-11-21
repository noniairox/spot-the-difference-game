import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const KIT = new URL(
  '../../best-spot-the-difference-game-20261121-0451-kit/best-spot-the-difference-game-20261121-0451-kit/',
  import.meta.url,
).pathname;
const REPO = new URL('../', import.meta.url).pathname;

function fixtureRepo() {
  const dir = mkdtempSync(join(tmpdir(), 'spot-main-test-'));
  mkdirSync(join(dir, 'game', 'src'), { recursive: true });
  mkdirSync(join(dir, 'screenshots'), { recursive: true });
  writeFileSync(join(dir, 'game', 'index.html'), '<!doctype html><title>t</title>');
  writeFileSync(join(dir, 'game', 'src', 'a.js'), 'export const a = 1;\n');
  // 1x1 red PNG (valid, tiny)
  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    'base64',
  );
  writeFileSync(join(dir, 'screenshots', '1-a.png'), png);
  writeFileSync(join(dir, 'screenshots', '2-b.png'), png);
  return dir;
}

test('main.ts copies game and screenshots and writes a matching dossier, twice byte-identical', async (t) => {
  const repo = fixtureRepo();
  const out1 = join(repo, 'out1');
  const out2 = join(repo, 'out2');
  t.after(() => rmSync(repo, { recursive: true, force: true }));

  // vendor file is placed by the parent in the real repo; in the test fixture we
  // copy the kit's own vendor file into the scratch fixture only, and run a
  // scratch copy of main.ts from there so its relative import resolves.
  mkdirSync(join(repo, 'vendor'), { recursive: true });
  execFileSync('cp', [join(KIT, 'starter', 'vendor', 'makefun-game.ts'), join(repo, 'vendor', 'makefun-game.ts')]);
  execFileSync('cp', [join(REPO, 'main.ts'), join(repo, 'main.ts')]);

  const run = (out) =>
    execFileSync('node', [join(repo, 'main.ts')], {
      env: { ...process.env, MAKEFUN_OUTPUT_DIR: out },
      cwd: repo,
      encoding: 'utf8',
    });
  run(out1);
  run(out2);

  for (const out of [out1, out2]) {
    assert.ok(existsSync(join(out, 'game', 'index.html')));
    assert.ok(existsSync(join(out, 'game', 'src', 'a.js')));
    assert.ok(existsSync(join(out, 'screenshots', '1-a.png')));
    assert.ok(existsSync(join(out, 'dossier.json')));
    const dossier = JSON.parse(readFileSync(join(out, 'dossier.json'), 'utf8'));
    assert.equal(dossier.schema, 'makefun/dossier/v1');
  }
  // both runs write identical bytes
  assert.equal(
    readFileSync(join(out1, 'dossier.json'), 'utf8'),
    readFileSync(join(out2, 'dossier.json'), 'utf8'),
  );
  assert.equal(
    readFileSync(join(out1, 'game', 'index.html'), 'utf8'),
    readFileSync(join(out2, 'game', 'index.html'), 'utf8'),
  );
});
