// Auto-generated page module for ocean/seal/range
import { getLoading3DHtml, attachLoading3DToVideo } from '../../../../components/loading-3d.js';

export const pageInfo = {
  map: "ocean",
  animal: "seal",
  animalName: "Hải cẩu",
  tab: "range",
  title: "Phân bố",
  voice: "Hải cẩu cảng sống ở vùng ven biển phía bắc Đại Tây Dương và Thái Bình Dương.",
  note: "Bản đồ minh họa định hướng, không phải ranh giới phân bố chính xác. Chạm hình con vật để nghe về vùng biển.",
  video: null,
  art: "/assets/knowledge/ocean/seal/range.png",
  points: [{"box":[14,18,13,22],"label":"Bắc Thái Bình Dương","voice":"Hải cẩu cảng sống ở nhiều vùng ven bờ phía bắc Thái Bình Dương.","portrait":true},{"box":[40,16,13,22],"label":"Bắc Đại Tây Dương","voice":"Hải cẩu cảng cũng sống dọc các bờ biển phía bắc Đại Tây Dương.","portrait":true}],
  source: {"name":"NOAA Fisheries","url":"https://www.fisheries.noaa.gov/species/harbor-seal"},
  path: "/animal/seal/topics/range"
};

export function render(container, context = {}) {
  const { speak } = context;
  const isVideo = false;
  const videoSrc = null;
  const artSrc = "/assets/knowledge/ocean/seal/range.png";
  const title = "Phân bố";
  const animalName = "Hải cẩu";

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
