// Auto-generated page module for dinosour/ptero/growth
import { getLoading3DHtml, attachLoading3DToVideo } from '../../../../components/loading-3d.js';

export const pageInfo = {
  map: "dinosour",
  animal: "ptero",
  animalName: "Pterosaur",
  tab: "growth",
  title: "Sinh trưởng",
  voice: "Bò sát bay đẻ trứng. Con non lớn lên thành con trưởng thành.",
  note: "Hình các giai đoạn là minh họa ở cấp nhóm, không gán tuổi hay thời điểm bắt đầu bay; không cùng tỷ lệ.",
  video: null,
  art: "/assets/heroes/ptero.png",
  points: [{"box":[4,51,9,18],"label":"Trứng","voice":"Bò sát bay đẻ trứng."},{"box":[19,43,15,27],"label":"Con nhỏ","voice":"Con non có đầu, mỏ và cánh đang phát triển."},{"box":[41,31,18,39],"label":"Con đang lớn","voice":"Tỷ lệ các bộ phận thay đổi khi lớn lên."},{"box":[67,15,29,55],"label":"Trưởng thành","voice":"Con trưởng thành có cánh màng phát triển."}],
  source: {"name":"AMNH · Pterosaurs educator guide","url":"https://www.amnh.org/content/download/71573/1323008/file/pterosaurs-educators-guide.pdf"},
  path: "/animal/ptero/topics/growth"
};

export function render(container, context = {}) {
  const { speak } = context;
  const isVideo = false;
  const videoSrc = null;
  const artSrc = "/assets/heroes/ptero.png";
  const title = "Sinh trưởng";
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
