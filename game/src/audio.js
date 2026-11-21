// Tiny WebAudio chimes for Twin Lanterns. No audio files: every sound is
// synthesized, so the game stays fully offline and dependency-free.
let ctx = null;
let muted = false;

export function setMuted(value) {
  muted = value;
}
export function isMuted() {
  return muted;
}

function ac() {
  if (muted) return null;
  try {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq, start, dur, type = 'sine', vol = 0.12) {
  const audio = ac();
  if (!audio) return;
  try {
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, audio.currentTime + start);
    gain.gain.exponentialRampToValueAtTime(vol, audio.currentTime + start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + start + dur);
    osc.connect(gain).connect(audio.destination);
    osc.start(audio.currentTime + start);
    osc.stop(audio.currentTime + start + dur + 0.05);
  } catch {
    // audio is decoration; never break the game
  }
}

export function playFind() {
  tone(659.25, 0, 0.14);
  tone(880, 0.09, 0.2);
}
export function playMiss() {
  tone(110, 0, 0.16, 'sawtooth', 0.06);
}
export function playHint() {
  tone(1174.66, 0, 0.12, 'triangle', 0.08);
}
export function playWin() {
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.11, 0.22));
}
