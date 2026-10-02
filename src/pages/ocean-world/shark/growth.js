// Auto-generated page module for ocean/shark/growth
import { getLoading3DHtml, attachLoading3DToVideo } from '../../../components/loading-3d.js';

export const pageInfo = {
  map: "ocean",
  animal: "shark",
  animalName: "Cá mập trắng",
  tab: "growth",
  title: "Sinh trưởng",
  voice: "Cá mập trắng sinh ra cá con đã có thể bơi. Nó không đẻ trứng trên bãi cát.",
  note: "Các giai đoạn được phóng lớn riêng để dễ quan sát, không cùng tỷ lệ và không biểu thị tuổi chính xác.",
  video: null,
  art: "/assets/knowledge/ocean/shark/growth.png",
  points: [{"box":[6,35,22,34],"label":"Mới sinh","voice":"Cá mập trắng sinh con. Cá con đã có thể bơi khi ra đời."},{"box":[37,29,25,40],"label":"Đang lớn","voice":"Cá mập con tự tìm thức ăn và lớn dần."},{"box":[67,20,31,49],"label":"Trưởng thành","voice":"Cá mập trưởng thành lớn hơn nhiều. Không phải loài cá mập nào cũng sinh sản giống nhau."}],
  source: {"name":"Florida Museum","url":"https://www.floridamuseum.ufl.edu/discover-fish/species-profiles/white-shark/"},
  path: "/animal/shark/topics/growth"
};

export function render(container, context = {}) {
  const { speak } = context;
  const isVideo = false;
  const videoSrc = null;
  const artSrc = "/assets/knowledge/ocean/shark/growth.png";
  const title = "Sinh trưởng";
  const animalName = "Cá mập trắng";

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
