// Auto-generated page module for ocean/shark/size
import { getLoading3DHtml, attachLoading3DToVideo } from '../../../../components/loading-3d.js';

export const pageInfo = {
  map: "ocean",
  animal: "shark",
  animalName: "Cá mập trắng",
  tab: "size",
  title: "Kích thước",
  voice: "Những cá mập trắng lớn có thể dài tới khoảng sáu mét bốn.",
  note: "Cá mập lớn tới khoảng 6,4 m theo NOAA. Người 1,7 m và tàu lặn 3 m là vật đối chiếu giả định; tranh không thay phép đo.",
  video: null,
  art: "/assets/knowledge/ocean/shark/size.png",
  points: [{"box":[19,15,68,37],"label":"Cá mập trắng","voice":"Cá mập trắng lớn có thể dài tới khoảng sáu mét bốn. Đây không phải kích thước trung bình.","measurement":"↔ tới ≈ 6,4 m"},{"box":[18,57,20,15],"label":"Người","voice":"Người đối chiếu dài một mét bảy, không tính chân vịt.","measurement":"↔ 1,7 m"},{"box":[49,51,31,25],"label":"Tàu lặn","voice":"Tàu lặn minh họa dài ba mét. Hai chiếc như vậy mới gần bằng cá mập lớn trong ví dụ.","measurement":"↔ ví dụ 3 m"}],
  source: {"name":"NOAA Fisheries","url":"https://www.fisheries.noaa.gov/species/white-shark"},
  path: "/animal/shark/topics/size"
};

export function render(container, context = {}) {
  const { speak } = context;
  const isVideo = false;
  const videoSrc = null;
  const artSrc = "/assets/knowledge/ocean/shark/size.png";
  const title = "Kích thước";
  const animalName = "Cá mập trắng";

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
