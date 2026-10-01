// Auto-generated page module for ocean/shark/movement
import { getLoading3DHtml, attachLoading3DToVideo } from '../../../../components/loading-3d.js';

export const pageInfo = {
  map: "ocean",
  animal: "shark",
  animalName: "Cá mập trắng",
  tab: "movement",
  title: "Cách di chuyển",
  voice: "Cá mập trắng bơi và có thể di chuyển rất xa giữa các vùng biển.",
  note: "",
  video: null,
  art: "/assets/knowledge/ocean/shark/movement.png",
  points: [{"box":[74,18,21,48],"label":"Đuôi","voice":"Đuôi quẫy sang hai bên để đẩy cá mập đi."},{"box":[37,40,24,28],"label":"Vây ngực","voice":"Vây ngực giúp điều chỉnh hướng và giữ tư thế trong nước."},{"box":[23,32,13,25],"label":"Mang","voice":"Cá mập lấy ô xi từ nước qua mang. Nó không thở bằng phổi như hải cẩu."}],
  source: {"name":"NOAA Fisheries","url":"https://www.fisheries.noaa.gov/species/white-shark"},
  path: "/animal/shark/topics/movement"
};

export function render(container, context = {}) {
  const { speak } = context;
  const isVideo = false;
  const videoSrc = null;
  const artSrc = "/assets/knowledge/ocean/shark/movement.png";
  const title = "Cách di chuyển";
  const animalName = "Cá mập trắng";

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
