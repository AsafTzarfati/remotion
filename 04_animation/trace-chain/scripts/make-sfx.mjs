// Generates small synthetic sound effects (no downloads needed).
import {writeFileSync} from 'fs';
const RATE = 48000;
const wav = (samples) => {
  const buf = Buffer.alloc(44 + samples.length * 2);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + samples.length * 2, 4); buf.write('WAVE', 8);
  buf.write('fmt ', 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(RATE, 24); buf.writeUInt32LE(RATE * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34);
  buf.write('data', 36); buf.writeUInt32LE(samples.length * 2, 40);
  samples.forEach((s, i) => buf.writeInt16LE(Math.max(-1, Math.min(1, s)) * 32767, 44 + i * 2));
  return buf;
};
let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
const click = (out, at, gain) => {
  let lp = 0;
  for (let i = 0; i < RATE * 0.03; i++) {
    const t = i / RATE; const env = Math.exp(-t * 260);
    lp += 0.35 * (rnd() - lp);
    out[at + i] = (out[at + i] || 0) + (lp * 0.8 + Math.sin(2 * Math.PI * 2400 * t) * 0.2) * env * gain;
  }
};
// Typing loop: 4 seconds, irregular clicks around 12 per second.
const typing = new Array(RATE * 4).fill(0);
for (let t = 0.01; t < 3.95; t += 0.065 + Math.abs(rnd()) * 0.035) click(typing, Math.floor(t * RATE), 0.35 + Math.abs(rnd()) * 0.2);
writeFileSync('public/sfx/typing.wav', wav(typing));
// Tick: short bright tone.
const tick = []; for (let i = 0; i < RATE * 0.09; i++) { const t = i / RATE; tick.push((Math.sin(2 * Math.PI * 1760 * t) + 0.4 * Math.sin(2 * Math.PI * 3520 * t)) * Math.exp(-t * 55) * 0.35); }
writeFileSync('public/sfx/tick.wav', wav(tick));
// Whoosh: filtered noise swell for camera moves.
const whoosh = []; let lp = 0;
for (let i = 0; i < RATE * 0.5; i++) { const t = i / RATE; const env = Math.sin(Math.PI * t / 0.5) ** 2; const k = 0.02 + 0.15 * env; lp += k * (rnd() - lp); whoosh.push(lp * env * 0.9); }
writeFileSync('public/sfx/whoosh.wav', wav(whoosh));
console.log('sfx ready');
