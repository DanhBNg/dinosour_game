// Auto-generated page module for dinosour/ptero/size
import { getLoading3DHtml, attachLoading3DToVideo } from '../../../components/loading-3d.js';

export const pageInfo = {
  map: "dinosour",
  animal: "ptero",
  animalName: "Pterosaur",
  tab: "size",
  title: "Kích thước",
  voice: "Bò sát bay có loài nhỏ và có loài rất lớn. Sải cánh được đo từ đầu cánh này sang đầu cánh kia.",
  note: "Hai loài tham chiếu, không phải định danh model. Dimorphodon 1,4 m: AMNH, The Dimorphodon: Early Pterosaur (2014). Người là mốc hiện đại. Sải cánh khác chiều dài cơ thể; tỷ lệ ảnh mang tính minh họa.",
  video: null,
  art: "/assets/heroes/ptero.png",
  points: [{"box":[2,16,68,60],"label":"Pteranodon","voice":"Ví dụ Pteranodon có sải cánh tới khoảng sáu mét, đo từ đầu cánh này sang đầu cánh kia.","measurement":"↔ cánh ≈ 6 m"},{"box":[70,40,7,36],"label":"Người","voice":"Người dùng để so sánh cao một mét bảy.","measurement":"↕ 1,7 m"},{"box":[78,43,20,23],"label":"Dimorphodon","voice":"Ví dụ Dimorphodon có sải cánh khoảng một mét bốn.","measurement":"↔ cánh ≈ 1,4 m"}],
  source: {"name":"Natural History Museum","url":"https://www.nhm.ac.uk/discover/the-truth-about-pterosaurs.html"},
  path: "/animal/ptero/topics/size"
};

export function render(container, context = {}) {
  const { speak } = context;
  const isVideo = false;
  const videoSrc = null;
  const artSrc = "/assets/heroes/ptero.png";
  const title = "Kích thước";
  const animalName = "Pterosaur";

  const loaderTag = isVideo ? getLoading3DHtml('AI đang tạo mô hình 3d, vui lòng đợi') : '';
  const backdropTag = isVideo
    ? `<div class="ocean-topic-backdrop"><video class="ocean-backdrop-video" src="${videoSrc}" autoplay loop muted playsinline webkit-playsinline=true x5-playsinline=true x5-video-player-type=h5 x5-video-player-fullscreen=false x-webkit-airplay=allow airplay=allow controlsList=nodownload nofullscreen noremoteplayback disablePictureInPicture disableRemotePlayback tabindex=-1></video></div>`
    : `<div class="ocean-topic-backdrop" style="background-image:url('${artSrc}')"></div>`;

  const sceneTag = isVideo
    ? `<video class="ocean-scene ocean-video" src="${videoSrc}" autoplay loop muted playsinline webkit-playsinline=true x5-playsinline=true x5-video-player-type=h5 x5-video-player-fullscreen=false x-webkit-airplay=allow airplay=allow controlsList=nodownload nofullscreen noremoteplayback disablePictureInPicture disableRemotePlayback tabindex=-1 preload="auto" aria-label="${title} — ${animalName}"></video>`
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
