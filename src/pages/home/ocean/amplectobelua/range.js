// Auto-generated page module for ocean/amplectobelua/range
import { getLoading3DHtml, attachLoading3DToVideo } from '../../../../components/loading-3d.js';

export const pageInfo = {
  map: "ocean",
  animal: "amplectobelua",
  animalName: "Amplectobelua",
  tab: "range",
  title: "Phân bố",
  voice: "Hóa thạch Amplectobelua symbrachiata được nghiên cứu từ Chengjiang ở Trung Quốc.",
  note: "Bản đồ hiện đại định vị nơi tìm thấy hóa thạch. Đây không phải biển Cambri hoặc phân bố của động vật còn sống.",
  video: null,
  art: "/assets/knowledge/ocean/amplectobelua/range.png",
  points: [{"box":[26,43,13,22],"label":"Chengjiang, Vân Nam","voice":"Hóa thạch Amplectobelua symbrachiata được nghiên cứu từ Chengjiang, tỉnh Vân Nam, Trung Quốc.","portrait":true}],
  source: {"name":"Cong và cộng sự · BMC Evolutionary Biology (2017)","url":"https://doi.org/10.1186/s12862-017-1049-1"},
  path: "/animal/amplectobelua/topics/range"
};

export function render(container, context = {}) {
  const { speak } = context;
  const isVideo = false;
  const videoSrc = null;
  const artSrc = "/assets/knowledge/ocean/amplectobelua/range.png";
  const title = "Phân bố";
  const animalName = "Amplectobelua";

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
