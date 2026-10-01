// Auto-generated page module for dinosour/mosa/diet
import { getLoading3DHtml, attachLoading3DToVideo } from '../../../../components/loading-3d.js';

export const pageInfo = {
  map: "dinosour",
  animal: "mosa",
  animalName: "Mosasaurus",
  tab: "diet",
  title: "Thức ăn",
  voice: "Mosasaurus ăn những động vật biển khác. Hàm và răng giúp nó bắt con mồi.",
  note: "Thức ăn thay đổi giữa các loài mosasaur; không dựng một khẩu phần cố định.",
  video: null,
  art: "/assets/heroes/mosa.png",
  points: [{"box":[5,20,60,47],"label":"Mosasaurus","voice":"Hàm và răng giúp Mosasaurus bắt động vật biển."},{"box":[75,35,22,29],"label":"Đàn cá","voice":"Đàn cá là ví dụ về con mồi. Khẩu phần có thể khác nhau giữa các loài."}],
  source: {"name":"Natural History Museum","url":"https://www.nhm.ac.uk/discover/what-is-a-mosasaur.html"},
  path: "/animal/mosa/topics/diet"
};

export function render(container, context = {}) {
  const { speak } = context;
  const isVideo = false;
  const videoSrc = null;
  const artSrc = "/assets/heroes/mosa.png";
  const title = "Thức ăn";
  const animalName = "Mosasaurus";

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
