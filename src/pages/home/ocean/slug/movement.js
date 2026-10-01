// Auto-generated page module for ocean/slug/movement
import { getLoading3DHtml, attachLoading3DToVideo } from '../../../../components/loading-3d.js';

export const pageInfo = {
  map: "ocean",
  animal: "slug",
  animalName: "Sên biển",
  tab: "movement",
  title: "Cách di chuyển",
  voice: "Sên biển di chuyển trên nền đáy bằng phần chân mềm ở mặt dưới.",
  note: "Giới thiệu giải phẫu của nhóm sên biển, không suy ra tốc độ từ animation.",
  video: null,
  art: "/assets/knowledge/ocean/slug/movement.png",
  points: [{"box":[25,41,58,20],"label":"Chân bụng","voice":"Phần chân mềm ở mặt dưới giúp sên biển bò trên nền đá."},{"box":[26,12,14,29],"label":"Phía đầu","voice":"Hai phần nhô lên trên đầu giúp sên biển cảm nhận môi trường, không phải chân."}],
  source: {"name":"Australian Museum · How sea slugs crawl","url":"https://www.seaslugforum.net/find/locomotion"},
  path: "/animal/slug/topics/movement"
};

export function render(container, context = {}) {
  const { speak } = context;
  const isVideo = false;
  const videoSrc = null;
  const artSrc = "/assets/knowledge/ocean/slug/movement.png";
  const title = "Cách di chuyển";
  const animalName = "Sên biển";

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
