// Mobile-friendly Speech & Audio Engine
// Solves:
// 1. Mobile browser autoplay restrictions (auto-unlock on first user interaction without permission prompts).
// 2. iOS hardware silent switch (routes audio via HTML5 Audio Media channel so it plays even when muted).
// 3. Missing Vietnamese voice data on iOS/Android devices (uses Google TTS audio stream with native VN pronunciation).
// 4. Offline/Fallback via Web Speech API with WebKit/Chrome mobile bug fixes.

let audioCtx = null;
let currentAudio = null;
let unlockAttempted = false;

// Split long text into chunks <= maxLen at sentence boundaries
function splitTextIntoChunks(text, maxLen = 170) {
  if (!text || text.length <= maxLen) return [text];
  const sentences = text.match(/[^.!?;\n]+[.!?;\n]*/g) || [text];
  const chunks = [];
  let cur = '';
  for (const s of sentences) {
    if ((cur + s).length <= maxLen) {
      cur += s;
    } else {
      if (cur.trim()) chunks.push(cur.trim());
      cur = s;
    }
  }
  if (cur.trim()) chunks.push(cur.trim());
  return chunks.length ? chunks : [text];
}

// 1. Silent audio unlocker: unlocks Web Audio & HTML5 Audio on user interaction
export function unlockAudio() {
  if (unlockAttempted && audioCtx && audioCtx.state === 'running') return;
  unlockAttempted = true;

  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      if (!audioCtx) audioCtx = new AudioContextClass();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }
      if (audioCtx.state === 'running') {
        const buffer = audioCtx.createBuffer(1, 1, 22050);
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.start(0);
      }
    }
  } catch (e) {
    console.debug('AudioContext unlock skipped:', e);
  }

  try {
    const synth = window.speechSynthesis || window.parent?.speechSynthesis;
    if (synth && synth.paused) {
      synth.resume();
    }
  } catch (e) {
    console.debug('SpeechSynthesis resume skipped:', e);
  }
}

// Automatically listen for first user gesture to unlock audio
if (typeof window !== 'undefined') {
  const unlockEvents = ['touchstart', 'touchend', 'pointerdown', 'click', 'keydown'];
  const handleInteraction = () => {
    unlockAudio();
    unlockEvents.forEach(evt => window.removeEventListener(evt, handleInteraction, true));
  };
  unlockEvents.forEach(evt => window.addEventListener(evt, handleInteraction, { once: true, passive: true, capture: true }));
}

export function stopSpeech() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio.src = '';
    currentAudio = null;
  }
  try {
    const synth = window.speechSynthesis || window.parent?.speechSynthesis;
    if (synth) synth.cancel();
  } catch (e) {}

  const sayNameBtn = document.getElementById('say-name');
  if (sayNameBtn) sayNameBtn.classList.remove('is-speaking');
}

export function isSpeaking() {
  if (currentAudio && !currentAudio.paused) return true;
  try {
    const synth = window.speechSynthesis || window.parent?.speechSynthesis;
    return !!synth?.speaking;
  } catch (e) {
    return false;
  }
}

let cachedViVoice = null;
function getVietnameseVoice(synth) {
  if (cachedViVoice) return cachedViVoice;
  if (!synth) return null;
  const voices = synth.getVoices?.() || [];
  let match = voices.find(v => v.lang === 'vi-VN' || v.lang === 'vi_VN' || v.lang.toLowerCase() === 'vi');
  if (!match) match = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('vi'));
  if (!match) match = voices.find(v => /vietnam|tiếng việt|hoaimy|namminh|linh|mai|an/i.test(v.name));
  if (match) cachedViVoice = match;
  return match || null;
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedViVoice = null;
    getVietnameseVoice(window.speechSynthesis);
  };
}

function cleanSpeechText(str) {
  if (!str) return '';
  if (typeof document !== 'undefined') {
    const d = document.createElement('div');
    d.innerHTML = str;
    return (d.textContent || d.innerText || str).trim();
  }
  return str.replace(/<[^>]*>/g, '').trim();
}

// Fallback using Web Speech API with mobile bug workarounds
function speakViaSpeechSynthesis(text, lang = 'vi-VN', onFinish) {
  const synth = window.speechSynthesis || window.parent?.speechSynthesis;
  if (!synth) {
    if (onFinish) onFinish();
    return;
  }

  try {
    if (synth.paused) synth.resume();
    if (synth.speaking || synth.pending) {
      synth.cancel();
    }
  } catch (e) {}

  setTimeout(() => {
    try {
      const isVi = !lang || lang.startsWith('vi');
      const viVoice = isVi ? getVietnameseVoice(synth) : null;

      // CRITICAL: Never let a foreign (English/other) voice read Vietnamese text!
      if (isVi && !viVoice) {
        console.warn('Thiết bị không có sẵn giọng đọc tiếng Việt offline trong Web Speech API');
        if (onFinish) onFinish();
        return;
      }

      const u = new SpeechSynthesisUtterance(text);
      u.lang = isVi ? 'vi-VN' : lang;
      u.rate = 0.95;
      if (viVoice) u.voice = viVoice;

      u.onend = () => {
        window.__activeUtterance = null;
        if (onFinish) onFinish();
      };
      u.onerror = (err) => {
        console.warn('SpeechSynthesis error:', err);
        window.__activeUtterance = null;
        if (onFinish) onFinish();
      };

      window.__activeUtterance = u;
      synth.resume();
      synth.speak(u);
    } catch (e) {
      console.warn('SpeechSynthesis failed:', e);
      if (onFinish) onFinish();
    }
  }, 30);
}

const clientAudioUrlCache = new Map();

// Sequential playback of chunks via HTML5 Audio (Native Vietnamese TTS)
function playAudioChunks(chunks, lang, onFinish, onError) {
  let index = 0;

  function playNext() {
    if (index >= chunks.length) {
      currentAudio = null;
      if (onFinish) onFinish();
      return;
    }

    const chunk = chunks[index++];
    const tl = (lang && lang.startsWith('en')) ? 'en' : 'vi';

    // Primary: Same-origin /api/tts proxy (works on Vercel and local dev, zero CORS or referer blocks)
    // Secondary: Direct translate.google.com without referer
    const candidates = clientAudioUrlCache.has(chunk)
      ? [clientAudioUrlCache.get(chunk)]
      : [
          `/api/tts?lang=${tl}&text=${encodeURIComponent(chunk)}`,
          `https://translate.google.com/translate_tts?ie=UTF-8&oe=UTF-8&tl=${tl}&client=tw-ob&q=${encodeURIComponent(chunk)}`
        ];

    let candidateIdx = 0;

    function tryCandidate() {
      if (candidateIdx >= candidates.length) {
        if (onError) onError();
        return;
      }

      const url = candidates[candidateIdx++];
      const audio = new Audio();
      currentAudio = audio;
      audio.autoplay = true;
      audio.playsInline = true;
      audio.preload = 'auto';
      audio.referrerPolicy = 'no-referrer';

      let timedOut = false;
      const timer = setTimeout(() => {
        timedOut = true;
        audio.pause();
        tryCandidate();
      }, 4500);

      audio.oncanplay = () => {
        clearTimeout(timer);
        clientAudioUrlCache.set(chunk, url);
        audio.play().catch(() => {
          tryCandidate();
        });
      };

      audio.onended = () => {
        clearTimeout(timer);
        playNext();
      };

      audio.onerror = () => {
        clearTimeout(timer);
        if (!timedOut) tryCandidate();
      };

      audio.src = url;
      audio.load();
      audio.play().catch(() => {});
    }

    tryCandidate();
  }

  playNext();
}

/**
 * Main speak function:
 * - Unlocks audio instantly
 * - Updates button state (.is-speaking)
 * - Toggles off if already speaking
 * - Plays high-quality Vietnamese audio via HTML5 Audio (Media Playback - works with silent switch ON)
 * - Gracefully falls back to Web Speech API
 */
export function speak(text, lang = 'vi-VN', onFinish = null) {
  if (!text) return;
  const clean = cleanSpeechText(text);
  if (!clean) return;

  unlockAudio();

  // If already speaking, stop (toggle behavior)
  if (isSpeaking()) {
    stopSpeech();
    return;
  }

  stopSpeech();

  const sayNameBtn = document.getElementById('say-name');
  if (sayNameBtn) sayNameBtn.classList.add('is-speaking');

  const onAllFinished = () => {
    if (sayNameBtn) sayNameBtn.classList.remove('is-speaking');
    currentAudio = null;
    if (typeof onFinish === 'function') onFinish();
  };

  const chunks = splitTextIntoChunks(clean, 170);

  playAudioChunks(
    chunks,
    lang,
    onAllFinished,
    () => {
      speakViaSpeechSynthesis(clean, lang, onAllFinished);
    }
  );
}

export default { speak, stopSpeech, isSpeaking, unlockAudio };
