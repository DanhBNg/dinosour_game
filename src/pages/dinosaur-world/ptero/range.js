// Auto-generated page module for dinosour/ptero/range
import { getLoading3DHtml, attachLoading3DToVideo } from '../../../components/loading-3d.js';

export const pageInfo = {
  map: "dinosour",
  animal: "ptero",
  animalName: "Pterosaur",
  tab: "range",
  title: "Phân bố",
  voice: "Hóa thạch bò sát bay được tìm thấy ở nhiều nơi trên thế giới.",
  note: "Các vùng ví dụ của cả nhóm Pterosauria trên bản đồ hiện đại. Không phải phạm vi một loài, không phải các điểm GPS chính xác.",
  video: null,
  art: "/assets/heroes/ptero.png",
  points: [{"box":[13.5,16,9,15],"label":"Hoa Kỳ","voice":"Hóa thạch bò sát bay được tìm thấy ở Hoa Kỳ.","portrait":true},{"box":[28,43,9,15],"label":"Brazil","voice":"Brazil có nhiều địa điểm hóa thạch bò sát bay quan trọng.","portrait":true},{"box":[42.5,10,9,15],"label":"Đức","voice":"Các lớp đá ở Đức lưu giữ hóa thạch bò sát bay.","portrait":true},{"box":[73,14.5,9,15],"label":"Trung Quốc","voice":"Trung Quốc cũng có các địa điểm hóa thạch bò sát bay.","portrait":true}],
  source: {"name":"Natural History Museum","url":"https://www.nhm.ac.uk/discover/the-truth-about-pterosaurs.html"},
  path: "/animal/ptero/topics/range"
};

export function render(container, context = {}) {
  const { speak } = context;
  const isVideo = false;
  const videoSrc = null;
  const artSrc = "/assets/heroes/ptero.png";
  const title = "Phân bố";
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
