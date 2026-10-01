// Auto-generated page module for ocean/squid/growth
import { getLoading3DHtml, attachLoading3DToVideo } from '../../../../components/loading-3d.js';

export const pageInfo = {
  map: "ocean",
  animal: "squid",
  animalName: "Mực đuôi cộc",
  tab: "growth",
  title: "Sinh trưởng",
  voice: "Mực bobtail Hawaii đẻ trứng. Mực con nở ra rồi lớn lên.",
  note: "Các giai đoạn được phóng lớn riêng để dễ quan sát, không cùng tỷ lệ và không biểu thị tuổi chính xác.",
  video: null,
  art: "/assets/knowledge/ocean/squid/growth.png",
  points: [{"box":[7,37,20,34],"label":"Trứng","voice":"Trứng mực nằm trong các bao trứng mềm dưới biển, không giống vỏ trứng chim."},{"box":[39,35,20,35],"label":"Mực mới nở","voice":"Mực con nở ra rất nhỏ."},{"box":[68,21,28,50],"label":"Mực trưởng thành","voice":"Mực con lớn lên thành mực trưởng thành."}],
  source: {"name":"Monterey Bay Aquarium","url":"https://www.montereybayaquarium.org/animals-the-ocean/animals-a-to-z/hawaiian-bobtail-squid"},
  path: "/animal/squid/topics/growth"
};

export function render(container, context = {}) {
  const { speak } = context;
  const isVideo = false;
  const videoSrc = null;
  const artSrc = "/assets/knowledge/ocean/squid/growth.png";
  const title = "Sinh trưởng";
  const animalName = "Mực đuôi cộc";

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
