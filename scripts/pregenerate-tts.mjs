import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { speciesKnowledge } from '../src/pages/home/dinosour/species-knowledge-data.js';
import { topics as trexTopics } from '../src/pages/home/dinosour/trex/knowledge.js';
import { oceanContent } from '../src/pages/home/ocean/ocean-knowledge.js';
import { marineKnowledge } from '../src/pages/home/ocean/marine-knowledge-data.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.resolve(root, 'assets/audio/tts');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const LARVOICE_KEY = process.env.LARVOICE_API_KEY || 'lv_EEeiLYEJJMCggRGakhxni2OA1xbifTdCnHDrlC27Gqj7HVeY';

// Collect all unique sentences
const items = new Map();

function add(text, meta) {
  if (!text || typeof text !== 'string') return;
  const clean = text.trim();
  if (!clean) return;
  const hash = crypto.createHash('md5').update(`vi:${clean}`).digest('hex');
  if (!items.has(hash)) {
    items.set(hash, { text: clean, meta: [meta] });
  } else {
    items.get(hash).meta.push(meta);
  }
}

// T-Rex
for (const [topic, data] of Object.entries(trexTopics)) {
  if (data.voice) add(data.voice, `trex/${topic}`);
}

// Other dinosaurs
for (const [sp, data] of Object.entries(speciesKnowledge)) {
  for (const [topic, t] of Object.entries(data.topics || {})) {
    if (t.voice) add(t.voice, `${sp}/${topic}`);
  }
}

// Ocean Content & Marine
for (const [sp, data] of Object.entries(oceanContent)) {
  for (const [topic, t] of Object.entries(data || {})) {
    if (t.voice) add(t.voice, `ocean/${sp}/${topic}`);
  }
}

for (const [sp, data] of Object.entries(marineKnowledge)) {
  for (const [topic, t] of Object.entries(data.topics || {})) {
    if (t.voice) add(t.voice, `marine/${sp}/${topic}`);
  }
}

console.log(`Found ${items.size} unique voice texts to process.`);

const manifest = {};
let generatedCount = 0;
let cachedCount = 0;
let failCount = 0;

for (const [hash, item] of items.entries()) {
  const filePath = path.join(outDir, `${hash}.wav`);
  manifest[hash] = {
    file: `/assets/audio/tts/${hash}.wav`,
    text: item.text,
    sources: item.meta
  };

  if (fs.existsSync(filePath)) {
    cachedCount++;
    console.log(`[CACHED] (${cachedCount + generatedCount}/${items.size}) ${hash.slice(0, 8)}: ${item.text.slice(0, 45)}...`);
    continue;
  }

  console.log(`[GENERATING via Larvoice] (${cachedCount + generatedCount + 1}/${items.size}) ${item.text.slice(0, 45)}...`);

  try {
    let buffer = null;
    let provider = 'Larvoice';
    try {
      const lvRes = await fetch('https://larvoice.com/api/v1/tts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LARVOICE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          voice_id: '89',
          voice_type: 'public',
          language: 'vi',
          post_speed: 1,
          post_volume: 0,
          post_pitch: 1,
          return_srt: false,
          sentence_pause_ms: 350,
          line_break_pause_ms: 350,
          ellipsis_pause_ms: 350,
          gen_text: item.text
        })
      });

      if (lvRes.ok) {
        const data = await lvRes.json();
        const url = data?.data?.output_url || data?.data?.download_url;
        if (url) {
          const audioRes = await fetch(url);
          if (audioRes.ok) {
            buffer = Buffer.from(await audioRes.arrayBuffer());
          }
        }
      }
    } catch (_) {}

    if (!buffer) {
      provider = 'Google TTS fallback';
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&oe=UTF-8&tl=vi&client=tw-ob&q=${encodeURIComponent(item.text)}`;
      const gRes = await fetch(ttsUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      if (gRes.ok) {
        buffer = Buffer.from(await gRes.arrayBuffer());
      }
    }

    if (buffer) {
      await fs.promises.writeFile(filePath, buffer);
      generatedCount++;
      console.log(` -> [${provider}] Saved ${buffer.length} bytes to ${hash}.wav`);
    } else {
      failCount++;
      console.error(` -> FAILED: All TTS providers failed`);
    }

    // Friendly delay between calls
    await new Promise(r => setTimeout(r, 200));
  } catch (err) {
    failCount++;
    console.error(` -> FAILED: ${err.message}`);
  }
}

fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf-8');
console.log('\n--- Summary ---');
console.log(`Total: ${items.size}`);
console.log(`Cached on disk: ${cachedCount}`);
console.log(`Newly generated: ${generatedCount}`);
console.log(`Failed: ${failCount}`);
console.log(`Manifest saved to ${path.join(outDir, 'manifest.json')}`);
