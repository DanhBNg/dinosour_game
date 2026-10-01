// Auto-generated page module for ocean/tuna/movement
import { getLoading3DHtml, attachLoading3DToVideo } from '../../../../components/loading-3d.js';

export const pageInfo = {
  map: "ocean",
  animal: "tuna",
  animalName: "Cá ngừ",
  tab: "movement",
  title: "Cách di chuyển",
  voice: "Cá ngừ vây vàng có thể bơi qua cả một đại dương.",
  note: "",
  video: "/assets/knowledge/ocean/tuna/motion.mp4",
  art: "/assets/knowledge/ocean/tuna/movement.png",
  points: [{"box":[71,23,22,42],"label":"Đuôi","voice":"Cá ngừ quẫy đuôi sang hai bên để đẩy mình về phía trước."},{"box":[24,25,44,35],"label":"Thân thuôn","voice":"Thân thuôn giúp cá đi qua nước. Cá ngừ vây vàng có thể di chuyển rất xa."}],
  source: {"name":"NOAA Fisheries","url":"https://www.fisheries.noaa.gov/species/atlantic-yellowfin-tuna"},
  path: "/animal/tuna/topics/movement"
};

export function render(container, context = {}) {
  const { speak } = context;
  const isVideo = true;
  const videoSrc = "/assets/knowledge/ocean/tuna/motion.mp4";
  const artSrc = "/assets/knowledge/ocean/tuna/movement.png";
  const title = "Cách di chuyển";
  const animalName = "Cá ngừ";

  const loaderTag = isVideo ? getLoading3DHtml('AI đang tạo mô hình 3d, vui lòng đợi') : '';
  const backdropTag = isVideo
    ? `<div class="ocean-topic-backdrop"><video class="ocean-backdrop-video" src="${videoSrc}" autoplay loop muted playsinline></video></div>`
    : `<div class="ocean-topic-backdrop" style="background-image:url('${artSrc}')"></div>`;

  const sceneTag = isVideo
    ? `<video class="ocean-scene ocean-video" src="${videoSrc}" autoplay loop muted playsinline preload="auto" aria-label="${title} — ${animalName}"></video>`
    : `<img class="ocean-scene" src="${artSrc}" alt="${title} — ${animalName}, hình minh họa">`;

  const overlay = container.querySelector('#knowledge-overlay') || container;
  overlay.innerHTML = `${backdropTag}<div class="ocean-board ${isVideo ? 'has-video' : ''}">${sceneTag}</div>${loaderTag}`;

  if (isVideo) {
    const artVideo = overlay.querySelector('video.ocean-scene');
    const bgVid = overlay.querySelector('video.ocean-backdrop-video');
    const loader = overlay.querySelector('.video-loading-screen');
    if (artVideo) {
      artVideo.muted = true; artVideo.defaultMuted = true; artVideo.playsInline = true;
      if (bgVid) { bgVid.muted = true; bgVid.defaultMuted = true; bgVid.playsInline = true; }
      if (loader) attachLoading3DToVideo(loader, artVideo);
      artVideo.play?.().catch(() => {});
      bgVid?.play?.().catch(() => {});
    }
  }

  const explanation = document.getElementById('topic-explanation');
  if (explanation) explanation.textContent = pageInfo.note || pageInfo.voice;

  if (speak && context.autoNarrate) {
    speak(pageInfo.voice, 'vi-VN');
  }

  return pageInfo;
}

export function narrate(context = {}) {
  const { speak } = context;
  if (speak) speak(pageInfo.voice, 'vi-VN');
}

export default { pageInfo, render, narrate };
