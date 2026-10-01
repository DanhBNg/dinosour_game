// Auto-generated page module for dinosour/mosa/size
import { getLoading3DHtml, attachLoading3DToVideo } from '../../../../components/loading-3d.js';

export const pageInfo = {
  map: "dinosour",
  animal: "mosa",
  animalName: "Mosasaurus",
  tab: "size",
  title: "Kích thước",
  voice: "Mosasaurus có những loài rất lớn. Muốn chọn số đo đúng, cần biết loài và mẫu hóa thạch.",
  note: "Ví dụ Mosasaurus hoffmannii ở mốc 12 m trong nhóm ước tính 11–12 m; các nghiên cứu khác cho kết quả lớn hơn. Không gán 12 m cho mọi loài hoặc định danh model. Người và tàu là đối chiếu hiện đại, ảnh không phải phép đo.",
  video: null,
  art: "/assets/heroes/mosa.png",
  points: [{"box":[5,15,90,34],"label":"M. hoffmannii","voice":"Cảnh này chọn chiều dài mười hai mét làm ví dụ. Các ước tính cho loài này còn khác nhau.","measurement":"↔ ví dụ 12 m"},{"box":[25,55,13,11],"label":"Người lặn","voice":"Người so sánh dài một mét bảy, chưa tính chân vịt.","measurement":"↔ 1,7 m"},{"box":[57,51,25,19],"label":"Tàu nhỏ","voice":"Tàu nghiên cứu giả định dài bốn mét.","measurement":"↔ 4 m"}],
  source: {"name":"Natural History Museum","url":"https://www.nhm.ac.uk/discover/what-is-a-mosasaur.html"},
  path: "/animal/mosa/topics/size"
};

export function render(container, context = {}) {
  const { speak } = context;
  const isVideo = false;
  const videoSrc = null;
  const artSrc = "/assets/heroes/mosa.png";
  const title = "Kích thước";
  const animalName = "Mosasaurus";

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
