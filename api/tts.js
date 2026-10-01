import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const LARVOICE_KEY = process.env.LARVOICE_API_KEY || 'lv_EEeiLYEJJMCggRGakhxni2OA1xbifTdCnHDrlC27Gqj7HVeY';
const audioMemoryCache = new Map();

// Local persistent audio directories
const localTtsDir = path.resolve('assets/audio/tts');
const distTtsDir = path.resolve('dist/assets/audio/tts');

if (!fs.existsSync(localTtsDir)) {
  try { fs.mkdirSync(localTtsDir, { recursive: true }); } catch (_) {}
}

export default async function handler(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const text = (url.searchParams.get('text') || '').trim();
    const lang = url.searchParams.get('lang') || 'vi';

    if (!text) {
      res.writeHead(400, { 'Content-Type': 'text/plain' }).end('Missing text');
      return;
    }

    // 1. Calculate text hash for permanent file storage
    const hash = crypto.createHash('md5').update(`${lang}:${text}`).digest('hex');
    const diskFile = path.join(localTtsDir, `${hash}.wav`);
    const distFile = path.join(distTtsDir, `${hash}.wav`);

    // 2. Check in-memory cache first (< 1ms)
    if (audioMemoryCache.has(hash)) {
      const cached = audioMemoryCache.get(hash);
      res.writeHead(200, {
        'Content-Type': cached.contentType,
        'Content-Length': cached.buffer.length,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-TTS-Source': 'memory-cache',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(cached.buffer);
      return;
    }

    // 3. Check persistent disk file (saved from previous generation - 0 credits used)
    let fileBuffer = null;
    let contentType = 'audio/wav';

    if (fs.existsSync(diskFile)) {
      try {
        fileBuffer = await fs.promises.readFile(diskFile);
      } catch (_) {}
    } else if (fs.existsSync(distFile)) {
      try {
        fileBuffer = await fs.promises.readFile(distFile);
      } catch (_) {}
    }

    if (fileBuffer) {
      audioMemoryCache.set(hash, { buffer: fileBuffer, contentType });
      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': fileBuffer.length,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-TTS-Source': 'disk-cache',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(fileBuffer);
      return;
    }

    // 4. File does not exist yet: Call Larvoice API ONCE to generate
    let buffer = null;

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
          gen_text: text
        })
      });

      if (lvRes.ok) {
        const lvData = await lvRes.json();
        const audioUrl = lvData?.data?.output_url || lvData?.data?.download_url;
        if (audioUrl) {
          const audioFetch = await fetch(audioUrl);
          if (audioFetch.ok) {
            const arr = await audioFetch.arrayBuffer();
            buffer = Buffer.from(arr);
            contentType = audioFetch.headers.get('content-type') || 'audio/wav';
          }
        }
      } else {
        console.warn('Larvoice API returned status:', lvRes.status);
      }
    } catch (lvErr) {
      console.warn('Larvoice request error:', lvErr.message);
    }

    // 5. Fallback to Google TTS if Larvoice failed
    if (!buffer) {
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&oe=UTF-8&tl=${encodeURIComponent(lang)}&client=tw-ob&q=${encodeURIComponent(text)}`;
      const upstream = await fetch(ttsUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
      });

      if (!upstream.ok) {
        res.writeHead(upstream.status, { 'Content-Type': 'text/plain' }).end('TTS upstream error');
        return;
      }

      const arrayBuffer = await upstream.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      contentType = 'audio/mpeg';
    }

    // 6. Persist to disk so it NEVER calls API again
    try {
      if (!fs.existsSync(localTtsDir)) fs.mkdirSync(localTtsDir, { recursive: true });
      await fs.promises.writeFile(diskFile, buffer);

      if (fs.existsSync(distTtsDir)) {
        await fs.promises.writeFile(distFile, buffer);
      }
    } catch (writeErr) {
      console.warn('Failed to save TTS audio file to disk:', writeErr.message);
    }

    // 7. Save to memory cache (limit to 200 items)
    if (audioMemoryCache.size > 200) {
      const oldestKey = audioMemoryCache.keys().next().value;
      audioMemoryCache.delete(oldestKey);
    }
    audioMemoryCache.set(hash, { buffer, contentType });

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': buffer.length,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-TTS-Source': 'newly-generated',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(buffer);
  } catch (err) {
    console.error('TTS Proxy Error:', err);
    res.writeHead(500, { 'Content-Type': 'text/plain' }).end('Internal Server Error');
  }
}
