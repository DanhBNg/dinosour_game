// Auto-generated page module for dinosour/trice/habitat
import { getLoading3DHtml, attachLoading3DToVideo } from '../../../components/loading-3d.js';

export const pageInfo = {
  map: "dinosour",
  animal: "trice",
  animalName: "Triceratops",
  tab: "habitat",
  title: "Môi trường sống",
  voice: "Triceratops là khủng long trên cạn, sống vào cuối kỷ Phấn Trắng.",
  note: "Cảnh phục dựng bãi bồi cuối Phấn Trắng, không phải địa điểm hóa thạch chính xác.",
  video: null,
  art: "/assets/heroes/trice.png",
  points: [{"box":[1,8,8,43],"label":"Rừng cây","voice":"Cây xanh mọc trên vùng bãi bồi. Đây là cảnh phục dựng môi trường sống."},{"box":[10,12,56,61],"label":"Triceratops","voice":"Triceratops sống trên cạn vào cuối kỷ Phấn Trắng."},{"box":[72,48,24,23],"label":"Dòng sông","voice":"Các dòng sông và bãi bồi tạo nên cảnh quan này."}],
  source: {"name":"Natural History Museum","url":"https://www.nhm.ac.uk/discover/dino-directory/triceratops.html"},
  path: "/animal/trice/topics/habitat"
};

export function render(container, context = {}) {
  const { speak } = context;
  const isVideo = false;
  const videoSrc = null;
  const artSrc = "/assets/heroes/trice.png";
  const title = "Môi trường sống";
  const animalName = "Triceratops";

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
