[![Make.fun bounty](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![Rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/noniairox/spot-the-difference-game/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![Reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/noniairox/spot-the-difference-game/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

# Twin Lanterns — Spot the Difference

A complete, original spot-the-difference game that plays offline in a desktop
browser from static files. Two near-identical pictures side by side, seven
differences to hunt in each scene, red circles on every find, a counter of how
many remain, a 2-minute lantern timer, hints, combos, and synthesized sound —
no network, no assets, no libraries.

## How to play

Open `game/index.html` in a desktop browser (or serve `game/` with any static
server). Click a difference on either picture to circle it on both. A wrong
click costs 5 seconds. Find all 7 before the timer runs out.

- **Mouse:** click a difference to mark it.
- **H:** hint — pulses one difference you have not found yet (3 per scene).
- **R:** restart the scene. **1 / 2 / 3:** switch scene. **M:** mute.

## The three scenes

1. **Pasar Lampion — Night Market.** Lanterns over the evening stalls, a cat
   on the roof, a pagoda, fireflies. Differences: a lantern's colour, the cat,
   a bright star, the stall sign, a paper crane, a lit window, a moon crater.
2. **Taman Koi — Koi Pond Garden.** Morning at the lily pond, cherry blossom,
   a stone lantern, a wooden bridge. Differences: an extra koi, the lily
   flower's colour, the lantern flame, a bamboo stalk, fallen petals, a frog,
   a bridge plank.
3. **Observatorium Gunung — Mountain Observatory.** A clear night above the
   peaks, a dome, a telescope, a fox. Differences: a comet, the dome window's
   light, the telescope's angle, a pine tree, the fox, a fourth star, a
   satellite.

## Structure

- `main.ts` — the entrypoint: copies `game/` and `screenshots/` to the
  output directory and writes `dossier.json` with the kit's `buildDossier`.
- `game/index.html` — page shell and HUD (counter, timer, score, hints).
- `game/src/main.js` — bootstrap, HUD updates, frame loop.
- `game/src/scenes.js` — the three scenes: difference data and painters.
- `game/src/state.js` — pure game rules (finds, combos, hints, timer).
- `game/src/render.js` — canvas drawing: panels, markers, hint pulse.
- `game/src/input.js` — pointer and keyboard input.
- `game/src/audio.js` — synthesized WebAudio chimes, no audio files.
- `game/src/random.js` — seeded RNG so scenes render identically.
- `game/src/shots.js` — `?scene=&found=&time=` demo parameters used only to
  take the screenshots from the real game. Every screenshot in `screenshots/`
  is an unedited render of the game running in headless Chromium at 1280x800.
- `vendor/makefun-game.ts` — the kit's dossier library, copied unchanged.
- `screenshots/` — four real renders of the game in a browser.

## Tests

`node --test tests/*.test.mjs` — 20 tests: seeded RNG, scene geometry (7
differences per scene, in bounds, non-overlapping), game rules (finds, combos,
misses, hints, win, loss), and the entrypoint (copies files, writes a dossier,
byte-identical across two runs).

## License

MIT — see `LICENSE`.
