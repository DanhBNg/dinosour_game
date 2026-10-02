// Auto-generated page module for ocean/tuna/habitat
import { getLoading3DHtml, attachLoading3DToVideo } from '../../../components/loading-3d.js';

export const pageInfo = {
  map: "ocean",
  animal: "tuna",
  animalName: "Cá ngừ",
  tab: "habitat",
  title: "Môi trường sống",
  voice: "Cá ngừ vây vàng sống trong các đại dương ấm, thường ở gần mặt nước.",
  note: "",
  video: "/assets/knowledge/ocean/tuna/habitat.mp4",
  art: "/assets/knowledge/ocean/tuna/habitat.png",
  points: [{"box":[17,23,59,46],"label":"Cá ngừ","voice":"Cá ngừ vây vàng sống trong các đại dương ấm, thường ở tầng gần mặt."},{"box":[79,25,18,30],"label":"Đàn cá","voice":"Cá ngừ có thể bơi thành đàn ở vùng biển khơi."}],
  source: {"name":"NOAA Fisheries","url":"https://www.fisheries.noaa.gov/species/atlantic-yellowfin-tuna"},
  path: "/animal/tuna/topics/habitat"
};

export function render(container, context = {}) {
  const { speak } = context;
  const isVideo = true;
  const videoSrc = "/assets/knowledge/ocean/tuna/habitat.mp4";
  const artSrc = "/assets/knowledge/ocean/tuna/habitat.png";
  const title = "Môi trường sống";
  const animalName = "Cá ngừ";

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
