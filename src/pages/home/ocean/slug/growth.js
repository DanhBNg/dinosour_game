// Auto-generated page module for ocean/slug/growth
import { getLoading3DHtml, attachLoading3DToVideo } from '../../../../components/loading-3d.js';

export const pageInfo = {
  map: "ocean",
  animal: "slug",
  animalName: "Sên biển",
  tab: "growth",
  title: "Sinh trưởng",
  voice: "Sên biển đẻ trứng. Các giai đoạn phát triển khác nhau giữa các loài.",
  note: "Dải trứng minh họa đặc điểm thường gặp ở sên biển; không khẳng định hình dạng trứng riêng của Chromodoris annae hoặc toàn bộ vòng đời.",
  video: null,
  art: "/assets/knowledge/ocean/slug/growth.png",
  points: [{"box":[11,32,29,39],"label":"Dải trứng","voice":"Nhiều sên biển đẻ trứng thành dải cuộn trên nền đá. Đây là minh họa của nhóm."},{"box":[58,24,31,45],"label":"Sên biển trưởng thành","voice":"Đây là sên biển trưởng thành. Ta chưa trình bày toàn bộ giai đoạn ấu trùng của loài này."}],
  source: {"name":"Australian Museum · Nudibranch egg masses","url":"https://www.seaslugforum.net/showall/eggspir"},
  path: "/animal/slug/topics/growth"
};

export function render(container, context = {}) {
  const { speak } = context;
  const isVideo = false;
  const videoSrc = null;
  const artSrc = "/assets/knowledge/ocean/slug/growth.png";
  const title = "Sinh trưởng";
  const animalName = "Sên biển";

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
