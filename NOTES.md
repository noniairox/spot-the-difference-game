# Twin Lanterns — Spot the Difference: build notes

## What was built

`~/workspace/makefun/spot-difference/` — a complete, original spot-the-difference
game for best-spot-the-difference-game-20261121-0451 ($50 escrowed, ends Sat 21 Nov
23:51 WIB). Three procedurally drawn canvas scenes (Night Market, Koi Pond Garden,
Mountain Observatory), 7 differences each, two panels side by side, red-circle
markers on finds, counter of remaining, 120 s timer, hints (H), combos, synthesized
WebAudio chimes. No network, no assets, no libraries.

## TDD evidence (tdd-workflow)

- Tests written FIRST: `tests/random.test.mjs` (4), `tests/scenes.test.mjs` (5),
  `tests/state.test.mjs` (10), `tests/main.test.mjs` (1).
- RED confirmed: first run failed MODULE_NOT_FOUND (modules did not exist yet).
- GREEN: `node --test tests/*.test.mjs` → **20/20 PASS**, 0 fail.
- Two real REDs caught during the build:
  1. Scene geometry: pine diff at x=520 r=42 reached 562 > 560 panel edge →
     moved to x=515.
  2. Combo test used (280,500) as a "miss" point, but the extra-koi diff had
     moved to (280,520) — the click actually hit it → miss point changed to
     (60,300).
- Visual fixes from real screenshots (not mocks): extra koi overlapped another
  fish → moved to (280,520); scene 1 middle band was empty → pagoda + fireflies
  added; stall sign enlarged; demo score made consistent.

## Verification loop (verification-loop)

```
Build:     PASS — main.ts runs on Node 24.22.1; two runs byte-identical
           (diff -r IDENTICAL) in /tmp/spot-verify scratch
Types:     PASS — node --check on all 9 JS/TS files, 0 errors
Lint:      n/a — no linter configured; syntax + grep checks substituted
Tests:     PASS — 20/20, see above
Security:  PASS — no secrets, no console.log, no network refs in game/
           (only a relative dynamic import('./state.js')); no http(s) URLs
Diff:      18 files, 468,374 bytes total (see tree below)
Overall:   READY for parent (repo + vendor + bundle + submit)
```

- Dossier: `dossier.json` (594,481 bytes, < 1.5 MiB cap) written by main.ts
  matches a fresh `buildDossier` call byte for byte; 9 source files
  (37,217 bytes), 4 images, cover 0, schema makefun/dossier/v1.
- Screenshots (real headless-Chromium renders, 1280x800 PNG, all < 256 KiB):
  1-cover.png 97,238 B (scene 1, 3 found, 4 remaining); 2-garden.png 118,285 B
  (scene 2, 3 found); 3-observatory.png 88,298 B (scene 3, 2 found);
  4-win.png 112,267 B (scene 1, all 7 found, win overlay).
- Game verified by eye in all 4 shots: panels A/B, markers, counter, timer,
  score, hint button, found-list chips all render; differences are visible
  (lantern colour, star, crane, flower colour, frog, bamboo, comet, pine,
  dome light, telescope angle, fox).
- README.md written then edited once (thinking_revised); LICENSE MIT with
  SPDX first line; owner.json + .makefun/owner.json with the payout wallet.

## For the parent (NOT done here — parent's job)

1. **vendor/makefun-game.ts is NOT in the repo yet.** I deliberately did not
   copy it (per the hard rule + past practice). Copy it from the kit and
   verify sha256 `dc67187521b24025ff952f8c231485a6eb92d6d71d29edd2a08154ffb4376129`
   (kit file, 56,282 B, 1203 lines).
2. **Repo name assumed: `noniairox/spot-the-difference-game`.** README badges
   use that name; create the repo with exactly that name (or update the badge
   URLs + README before committing).
3. Static server still running on port 8123 serving the work dir
   (`python3 -m http.server 8123`) if re-screenshots are needed.
4. Kit used: `~/workspace/makefun/best-spot-the-difference-game-20261121-0451-kit/best-spot-the-difference-game-20261121-0451-kit/`
   (kit.json bundle sha256 3aff18a4…). Re-download before bundling/submitting
   per the standing rule — kit level moves fast.

## File tree

- main.ts (1,075 B), README.md (3,515 B), LICENSE (1,096 B), owner.json (57 B),
  .makefun/owner.json (57 B)
- game/index.html (4,745 B), game/src/: random.js (349), state.js (1,553),
  scenes.js (19,060), render.js (3,091), input.js (1,413), audio.js (1,540),
  shots.js (1,498), main.js (3,968)
- screenshots/: 1-cover.png, 2-garden.png, 3-observatory.png, 4-win.png
- tests/: random, scenes, state, main (20 tests total)
- NOTES.md (this file)
