// Auto-generated page module for dinosour/trice/movement
import { getLoading3DHtml, attachLoading3DToVideo } from '../../../components/loading-3d.js';

export const pageInfo = {
  map: "dinosour",
  animal: "trice",
  animalName: "Triceratops",
  tab: "movement",
  title: "Cách di chuyển",
  voice: "Triceratops bước đi bằng bốn chân. Hãy tìm hai chân trước và hai chân sau.",
  note: "Minh họa giải phẫu nhóm ceratopsian: bàn chân trước có năm ngón, chân sau có bốn ngón. Không phải bản chụp dấu chân Triceratops đã định danh; dấu in thực tế phụ thuộc nền đất và tư thế.",
  video: null,
  art: "/assets/heroes/trice.png",
  points: [{"box":[20,56,22,29],"label":"Chân trước","voice":"Chân trước có năm ngón. Không phải ngón nào cũng để lại dấu rõ trong bùn."},{"box":[50,47,30,38],"label":"Chân sau","voice":"Chân sau có bốn ngón. Triceratops khác Stegosaurus ở số ngón chân sau."}],
  source: {"name":"Natural History Museum","url":"https://www.nhm.ac.uk/discover/dino-directory/triceratops.html"},
  path: "/animal/trice/topics/footprints"
};

export function render(container, context = {}) {
  const { speak } = context;
  const isVideo = false;
  const videoSrc = null;
  const artSrc = "/assets/heroes/trice.png";
  const title = "Cách di chuyển";
  const animalName = "Triceratops";

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
