// Auto-generated page module for dinosour/ptero/habitat
import { getLoading3DHtml, attachLoading3DToVideo } from '../../../components/loading-3d.js';

export const pageInfo = {
  map: "dinosour",
  animal: "ptero",
  animalName: "Pterosaur",
  tab: "habitat",
  title: "Môi trường sống",
  voice: "Bò sát bay có thể bay chủ động. Những loài khác nhau sống trong những môi trường khác nhau.",
  note: "",
  video: null,
  art: "/assets/heroes/ptero.png",
  points: [{"box":[3,32,16,37],"label":"Vách đá ven biển","voice":"Đây là một môi trường ven biển minh họa. Không phải mọi bò sát bay đều sống ở đây."},{"box":[21,13,57,48],"label":"Bò sát bay","voice":"Bò sát bay có khả năng bay chủ động. Chúng không phải chim hay khủng long."},{"box":[81,45,17,25],"label":"Mặt biển","voice":"Một số loài tìm thức ăn gần mặt nước."}],
  source: {"name":"Natural History Museum","url":"https://www.nhm.ac.uk/discover/the-truth-about-pterosaurs.html"},
  path: "/animal/ptero/topics/habitat"
};

export function render(container, context = {}) {
  const { speak } = context;
  const isVideo = false;
  const videoSrc = null;
  const artSrc = "/assets/heroes/ptero.png";
  const title = "Môi trường sống";
  const animalName = "Pterosaur";

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
