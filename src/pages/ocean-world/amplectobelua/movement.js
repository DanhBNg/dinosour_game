// Auto-generated page module for ocean/amplectobelua/movement
import { getLoading3DHtml, attachLoading3DToVideo } from '../../../components/loading-3d.js';

export const pageInfo = {
  map: "ocean",
  animal: "amplectobelua",
  animalName: "Amplectobelua",
  tab: "movement",
  title: "Cách di chuyển",
  voice: "Amplectobelua có những thùy dọc hai bên cơ thể, thích nghi cho việc bơi.",
  note: "",
  video: null,
  art: "/assets/knowledge/ocean/amplectobelua/movement.png",
  points: [{"box":[26,28,45,35],"label":"Thùy bơi","voice":"Những thùy hai bên thân thích nghi cho việc bơi trong biển."},{"box":[76,30,19,34],"label":"Phần đuôi","voice":"Hãy quan sát phần đuôi và thân phân đốt của sinh vật biển cổ này."}],
  source: {"name":"Cong và cộng sự · BMC Evolutionary Biology (2017)","url":"https://doi.org/10.1186/s12862-017-1049-1"},
  path: "/animal/amplectobelua/topics/movement"
};

export function render(container, context = {}) {
  const { speak } = context;
  const isVideo = false;
  const videoSrc = null;
  const artSrc = "/assets/knowledge/ocean/amplectobelua/movement.png";
  const title = "Cách di chuyển";
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
