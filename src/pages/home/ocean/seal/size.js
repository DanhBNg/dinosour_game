// Auto-generated page module for ocean/seal/size
import { getLoading3DHtml, attachLoading3DToVideo } from '../../../../components/loading-3d.js';

export const pageInfo = {
  map: "ocean",
  animal: "seal",
  animalName: "Hải cẩu",
  tab: "size",
  title: "Kích thước",
  voice: "Hãy so chiều dài hải cẩu minh họa một mét tám với người cao một mét bảy.",
  note: "Ví dụ hải cẩu cảng dài 1,8 m, người giả định cao 1,7 m. Không phải số đo của model hoặc chiều dài tối đa; tranh chỉ minh họa, không thay phép đo.",
  video: null,
  art: "/assets/knowledge/ocean/seal/size.png",
  points: [{"box":[40,38,45,32],"label":"Hải cẩu","voice":"Hải cẩu minh họa dài một mét tám, đo từ đầu đến cuối thân. Đây là một ví dụ, không phải kích thước mọi hải cẩu.","measurement":"↔ ví dụ 1,8 m"},{"box":[16,20,12,50],"label":"Người","voice":"Người đối chiếu cao một mét bảy. Ta đang so chiều dài của hải cẩu với chiều cao của người.","measurement":"↕ 1,7 m"}],
  source: {"name":"NOAA Fisheries","url":"https://www.fisheries.noaa.gov/species/harbor-seal"},
  path: "/animal/seal/topics/size"
};

export function render(container, context = {}) {
  const { speak } = context;
  const isVideo = false;
  const videoSrc = null;
  const artSrc = "/assets/knowledge/ocean/seal/size.png";
  const title = "Kích thước";
  const animalName = "Hải cẩu";

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
