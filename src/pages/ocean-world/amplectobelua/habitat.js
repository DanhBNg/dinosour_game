// Auto-generated page module for ocean/amplectobelua/habitat
import { getLoading3DHtml, attachLoading3DToVideo } from '../../../components/loading-3d.js';

export const pageInfo = {
  map: "ocean",
  animal: "amplectobelua",
  animalName: "Amplectobelua",
  tab: "habitat",
  title: "Môi trường sống",
  voice: "Amplectobelua sống trong biển từ kỷ Cambri, rất lâu trước khủng long.",
  note: "Phục dựng minh họa từ kiến thức hóa thạch; màu sắc và chi tiết phần mềm không được bảo tồn đầy đủ.",
  video: null,
  art: "/assets/knowledge/ocean/amplectobelua/habitat.png",
  points: [{"box":[19,20,59,47],"label":"Sinh vật biển cổ","voice":"Amplectobelua sống trong biển kỷ Cambri, rất lâu trước khủng long."},{"box":[6,48,17,24],"label":"Đáy biển cổ","voice":"Cảnh phục dựng có nền đáy và sinh vật đơn giản, không phải rạn san hô hiện đại."}],
  source: {"name":"Cong và cộng sự · BMC Evolutionary Biology (2017)","url":"https://doi.org/10.1186/s12862-017-1049-1"},
  path: "/animal/amplectobelua/topics/habitat"
};

export function render(container, context = {}) {
  const { speak } = context;
  const isVideo = false;
  const videoSrc = null;
  const artSrc = "/assets/knowledge/ocean/amplectobelua/habitat.png";
  const title = "Môi trường sống";
  const animalName = "Amplectobelua";

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
