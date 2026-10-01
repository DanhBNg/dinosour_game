// Auto-generated page module for ocean/shark/diet
import { getLoading3DHtml, attachLoading3DToVideo } from '../../../components/loading-3d.js';

export const pageInfo = {
  map: "ocean",
  animal: "shark",
  animalName: "Cá mập trắng",
  tab: "diet",
  title: "Thức ăn",
  voice: "Cá mập trắng ăn cá và những động vật biển khác. Con lớn có thể săn hải cẩu.",
  note: "Thức ăn thay đổi theo tuổi và khu vực.",
  video: null,
  art: "/assets/knowledge/ocean/shark/diet.png",
  points: [{"box":[7,22,59,46],"label":"Cá mập đang săn","voice":"Cá mập trắng ăn nhiều động vật biển. Khẩu phần thay đổi theo tuổi và vùng sống."},{"box":[74,32,21,31],"label":"Cá mồi","voice":"Cá là một phần thức ăn. Những cá mập trắng lớn cũng có thể săn hải cẩu."}],
  source: {"name":"Florida Museum","url":"https://www.floridamuseum.ufl.edu/discover-fish/species-profiles/white-shark/"},
  path: "/animal/shark/topics/diet"
};

export function render(container, context = {}) {
  const { speak } = context;
  const isVideo = false;
  const videoSrc = null;
  const artSrc = "/assets/knowledge/ocean/shark/diet.png";
  const title = "Thức ăn";
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
