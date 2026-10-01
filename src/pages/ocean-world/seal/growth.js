// Auto-generated page module for ocean/seal/growth
import { getLoading3DHtml, attachLoading3DToVideo } from '../../../components/loading-3d.js';

export const pageInfo = {
  map: "ocean",
  animal: "seal",
  animalName: "Hải cẩu",
  tab: "growth",
  title: "Sinh trưởng",
  voice: "Hải cẩu là động vật có vú. Hải cẩu cảng sinh con, con non bú sữa mẹ.",
  note: "Các giai đoạn được phóng lớn riêng để dễ quan sát, không cùng tỷ lệ và không biểu thị tuổi chính xác.",
  video: null,
  art: "/assets/knowledge/ocean/seal/growth.png",
  points: [{"box":[9,41,21,30],"label":"Hải cẩu con","voice":"Hải cẩu sinh con. Con nhỏ bú sữa mẹ."},{"box":[39,32,21,39],"label":"Đang lớn","voice":"Hải cẩu con lớn dần và học tìm thức ăn."},{"box":[68,19,28,53],"label":"Trưởng thành","voice":"Hải cẩu trưởng thành tiếp tục ra biển kiếm ăn và lên bờ nghỉ."}],
  source: {"name":"NOAA Fisheries","url":"https://www.fisheries.noaa.gov/species/harbor-seal"},
  path: "/animal/seal/topics/growth"
};

export function render(container, context = {}) {
  const { speak } = context;
  const isVideo = false;
  const videoSrc = null;
  const artSrc = "/assets/knowledge/ocean/seal/growth.png";
  const title = "Sinh trưởng";
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
