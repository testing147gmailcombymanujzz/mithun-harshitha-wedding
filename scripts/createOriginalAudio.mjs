import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = resolve(projectRoot, 'public/audio/original-tanpura-drone.wav');
const sampleRate = 22_050;
const durationSeconds = 12;
const sampleCount = sampleRate * durationSeconds;
const headerSize = 44;
const buffer = Buffer.alloc(headerSize + sampleCount * 2);
const loopSafeTones = [130.833333, 196, 261.583333];

buffer.write('RIFF', 0);
buffer.writeUInt32LE(buffer.length - 8, 4);
buffer.write('WAVE', 8);
buffer.write('fmt ', 12);
buffer.writeUInt32LE(16, 16);
buffer.writeUInt16LE(1, 20);
buffer.writeUInt16LE(1, 22);
buffer.writeUInt32LE(sampleRate, 24);
buffer.writeUInt32LE(sampleRate * 2, 28);
buffer.writeUInt16LE(2, 32);
buffer.writeUInt16LE(16, 34);
buffer.write('data', 36);
buffer.writeUInt32LE(sampleCount * 2, 40);

for (let index = 0; index < sampleCount; index += 1) {
  const time = index / sampleRate;
  let sample = 0;

  loopSafeTones.forEach((frequency, voiceIndex) => {
    const voiceLevel = [0.24, 0.18, 0.12][voiceIndex];
    for (let harmonic = 1; harmonic <= 6; harmonic += 1) {
      const harmonicLevel = voiceLevel / (harmonic ** 1.45);
      const slowBreath = 0.96 + 0.04 * Math.sin((Math.PI * 2 * time) / durationSeconds);
      sample += Math.sin(Math.PI * 2 * frequency * harmonic * time) * harmonicLevel * slowBreath;
    }
  });

  const edge = Math.min(1, index / 440, (sampleCount - index - 1) / 440);
  const softLimited = Math.tanh(sample * 0.68) * edge;
  buffer.writeInt16LE(Math.round(softLimited * 32_767), headerSize + index * 2);
}

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, buffer);
console.log(`Created original looping tanpura-inspired drone: ${outputPath}`);
