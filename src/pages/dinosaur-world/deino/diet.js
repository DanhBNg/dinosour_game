// Auto-generated page module for dinosour/deino/diet
import { getLoading3DHtml, attachLoading3DToVideo } from '../../../components/loading-3d.js';

export const pageInfo = {
  map: "dinosour",
  animal: "deino",
  animalName: "Deinonychus",
  tab: "diet",
  title: "Thức ăn",
  voice: "Deinonychus ăn thịt các động vật khác. Móng cong lớn ở chân giúp nó xử lý con mồi.",
  note: "Con mồi là ví dụ minh họa, không xác định loài hay khẳng định chiến thuật săn theo bầy.",
  video: null,
  art: "/assets/heroes/deino.png",
  points: [{"box":[7,18,53,49],"label":"Kẻ săn mồi","voice":"Deinonychus ăn động vật. Cảnh đuổi mồi này là minh họa."},{"box":[72,43,22,25],"label":"Con mồi nhỏ","voice":"Một con thằn lằn nhỏ đang chạy. Ta không biết toàn bộ khẩu phần của Deinonychus."}],
  source: {"name":"Natural History Museum","url":"https://www.nhm.ac.uk/discover/dino-directory/deinonychus.html"},
  path: "/animal/deino/topics/diet"
};

export function render(container, context = {}) {
  const { speak } = context;
  const isVideo = false;
  const videoSrc = null;
  const artSrc = "/assets/heroes/deino.png";
  const title = "Thức ăn";
  const animalName = "Deinonychus";

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
