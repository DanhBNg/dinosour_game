// Auto-generated page module for dinosour/deino/size
import { getLoading3DHtml, attachLoading3DToVideo } from '../../../components/loading-3d.js';

export const pageInfo = {
  map: "dinosour",
  animal: "deino",
  animalName: "Deinonychus",
  tab: "size",
  title: "Kích thước",
  voice: "Deinonychus dài khoảng ba mét bốn, tính cả chiếc đuôi dài.",
  note: "Dài 3,4 m theo NHM; chiều cao người và chiều dài xe là các mốc giả định hiện đại. Ảnh so sánh minh họa, không phải phép đo hóa thạch.",
  video: null,
  art: "/assets/heroes/deino.png",
  points: [{"box":[2,32,51,36],"label":"Deinonychus","voice":"Deinonychus dài khoảng ba mét bốn, tính cả đuôi.","measurement":"↔ ≈ 3,4 m"},{"box":[56,15,9,53],"label":"Người","voice":"Người so sánh cao một mét bảy.","measurement":"↕ 1,7 m"},{"box":[69,35,27,33],"label":"Xe đạp","voice":"Xe đạp minh họa dài khoảng một mét tám.","measurement":"↔ ≈ 1,8 m"}],
  source: {"name":"Natural History Museum","url":"https://www.nhm.ac.uk/discover/dino-directory/deinonychus.html"},
  path: "/animal/deino/topics/size"
};

export function render(container, context = {}) {
  const { speak } = context;
  const isVideo = false;
  const videoSrc = null;
  const artSrc = "/assets/heroes/deino.png";
  const title = "Kích thước";
  const animalName = "Deinonychus";

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
