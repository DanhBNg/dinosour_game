// Auto-generated page module for dinosour/trice/size
import { getLoading3DHtml, attachLoading3DToVideo } from '../../../../components/loading-3d.js';

export const pageInfo = {
  map: "dinosour",
  animal: "trice",
  animalName: "Triceratops",
  tab: "size",
  title: "Kích thước",
  voice: "Triceratops có thể dài khoảng chín mét từ đầu đến chót đuôi.",
  note: "Triceratops dài khoảng 9 m theo NHM. Người cao 1,7 m, xe dài khoảng 5 m, voi cao vai khoảng 3 m là các vật đối chiếu giả định hiện đại. Phân biệt chiều dài với chiều cao; ảnh AI là minh họa, không thay phép đo.",
  video: null,
  art: "/assets/heroes/trice.png",
  points: [{"box":[1,24,43,43],"label":"Triceratops","measurement":"↔ ≈ 9 m","voice":"Triceratops dài khoảng chín mét từ đầu tới chót đuôi, không phải cao chín mét."},{"box":[42,48,4,19],"label":"Người","measurement":"↕ 1,7 m","voice":"Người dùng để so sánh cao một mét bảy."},{"box":[47,46,25,21],"label":"Xe","measurement":"↔ ≈ 5 m","voice":"Chiếc xe dùng để so sánh dài khoảng năm mét. Triceratops dài gần bằng hai chiếc xe này."},{"box":[74,29,25,38],"label":"Voi","measurement":"↕ vai ≈ 3 m","voice":"Con voi dùng để so sánh cao khoảng ba mét ở vai."}],
  source: {"name":"Natural History Museum","url":"https://www.nhm.ac.uk/discover/dino-directory/triceratops.html"},
  path: "/animal/trice/topics/size"
};

export function render(container, context = {}) {
  const { speak } = context;
  const isVideo = false;
  const videoSrc = null;
  const artSrc = "/assets/heroes/trice.png";
  const title = "Kích thước";
  const animalName = "Triceratops";

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
