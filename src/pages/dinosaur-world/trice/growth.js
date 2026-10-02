// Auto-generated page module for dinosour/trice/growth
import { getLoading3DHtml, attachLoading3DToVideo } from '../../../components/loading-3d.js';

export const pageInfo = {
  map: "dinosour",
  animal: "trice",
  animalName: "Triceratops",
  tab: "growth",
  title: "Sinh trưởng",
  voice: "Khủng long nở từ trứng rồi lớn lên. Tỷ lệ các bộ phận cũng thay đổi.",
  note: "Nghiên cứu hộp sọ cho thấy sừng và diềm thay đổi khi lớn lên. Quả trứng, mô mềm và màu sắc là minh họa; không gán tuổi chính xác hay coi các giai đoạn trong ảnh là cùng tỷ lệ.",
  video: null,
  art: "/assets/heroes/trice.png",
  points: [{"box":[5,47,7,16],"label":"Trứng","voice":"Khủng long nở từ trứng. Đây là quả trứng minh họa, không phải mẫu hóa thạch Triceratops."},{"box":[16,41,16,23],"label":"Con nhỏ","voice":"Triceratops nhỏ có sừng ngắn và diềm nhỏ. Nó không giống hệt một con trưởng thành thu nhỏ."},{"box":[36,26,24,38],"label":"Con đang lớn","voice":"Khi lớn lên, hình dạng của sừng và diềm sọ thay đổi."},{"box":[60,10,38,55],"label":"Trưởng thành","voice":"Con trưởng thành có hai sừng lớn trên mắt, một sừng trên mũi và diềm sọ rộng."}],
  source: {"name":"American Museum of Natural History","url":"https://www.amnh.org/dinosaurs/dinosaur-eggs"},
  path: "/animal/trice/topics/growth"
};

export function render(container, context = {}) {
  const { speak } = context;
  const isVideo = false;
  const videoSrc = null;
  const artSrc = "/assets/heroes/trice.png";
  const title = "Sinh trưởng";
  const animalName = "Triceratops";

  const loaderTag = isVideo ? getLoading3DHtml('AI đang tạo mô hình 3d, vui lòng đợi') : '';
  const backdropTag = isVideo
    ? `<div class="ocean-topic-backdrop"><video class="ocean-backdrop-video" src="${videoSrc}" autoplay loop muted playsinline webkit-playsinline=true x5-playsinline=true x5-video-player-type=h5 x5-video-player-fullscreen=false x-webkit-airplay=allow airplay=allow controlsList=nodownload nofullscreen noremoteplayback disablePictureInPicture disableRemotePlayback tabindex=-1></video></div>`
    : `<div class="ocean-topic-backdrop" style="background-image:url('${artSrc}')"></div>`;

  const sceneTag = isVideo
    ? `<video class="ocean-scene ocean-video" src="${videoSrc}" autoplay loop muted playsinline webkit-playsinline=true x5-playsinline=true x5-video-player-type=h5 x5-video-player-fullscreen=false x-webkit-airplay=allow airplay=allow controlsList=nodownload nofullscreen noremoteplayback disablePictureInPicture disableRemotePlayback tabindex=-1 preload="auto" aria-label="${title} — ${animalName}"></video>`
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
