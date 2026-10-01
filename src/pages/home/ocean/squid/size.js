// Auto-generated page module for ocean/squid/size
import { getLoading3DHtml, attachLoading3DToVideo } from '../../../../components/loading-3d.js';

export const pageInfo = {
  map: "ocean",
  animal: "squid",
  animalName: "Mực đuôi cộc",
  tab: "size",
  title: "Kích thước",
  voice: "Thân áo của mực bobtail Hawaii dài tới khoảng ba phẩy năm xen ti mét.",
  note: "Đo thân áo, không tính các tay và xúc tu; chỉ áp dụng cho ví dụ tham chiếu.",
  video: null,
  art: "/assets/knowledge/ocean/squid/size.png",
  points: [{"box":[28,23,20,39],"label":"Thân áo","voice":"Thân áo của mực bobtail Hawaii dài tới khoảng ba phẩy năm xen ti mét. Không cộng phần tay vào số đo này.","measurement":"↔ thân áo ≤ 3,5 cm"},{"box":[55,65,34,12],"label":"Thước","voice":"Hình đã phóng lớn. Các vạch thước là minh họa, không dùng để đo trực tiếp trên màn hình."}],
  source: {"name":"Monterey Bay Aquarium","url":"https://www.montereybayaquarium.org/animals-the-ocean/animals-a-to-z/hawaiian-bobtail-squid"},
  path: "/animal/squid/topics/size"
};

export function render(container, context = {}) {
  const { speak } = context;
  const isVideo = false;
  const videoSrc = null;
  const artSrc = "/assets/knowledge/ocean/squid/size.png";
  const title = "Kích thước";
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
