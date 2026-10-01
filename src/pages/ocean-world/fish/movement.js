// Auto-generated page module for ocean/fish/movement
import { getLoading3DHtml, attachLoading3DToVideo } from '../../../components/loading-3d.js';

export const pageInfo = {
  map: "ocean",
  animal: "fish",
  animalName: "Cá biển",
  tab: "movement",
  title: "Cách di chuyển",
  voice: "Hãy quan sát vây và đuôi của model cá. Đó là những bộ phận giúp cá di chuyển.",
  note: "Quan sát giải phẫu; không khẳng định animation là cách bơi chính xác của loài tham chiếu.",
  video: null,
  art: "/assets/knowledge/ocean/fish/movement.png",
  points: [{"box":[58,30,16,26],"label":"Đuôi","voice":"Đuôi giúp cá tạo lực và điều chỉnh chuyển động."},{"box":[34,34,18,29],"label":"Vây","voice":"Các vây giúp cá giữ thăng bằng và đổi hướng trong rạn."}],
  source: {"name":"Australian Museum","url":"https://australian.museum/learn/animals/fishes/longfin-bannerfish-heniochus-acuminatus-linnaeus-1758/"},
  path: "/animal/fish/topics/movement"
};

export function render(container, context = {}) {
  const { speak } = context;
  const isVideo = false;
  const videoSrc = null;
  const artSrc = "/assets/knowledge/ocean/fish/movement.png";
  const title = "Cách di chuyển";
  const animalName = "Cá biển";

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
