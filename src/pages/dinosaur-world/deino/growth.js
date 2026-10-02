// Auto-generated page module for dinosour/deino/growth
import { getLoading3DHtml, attachLoading3DToVideo } from '../../../components/loading-3d.js';

export const pageInfo = {
  map: "dinosour",
  animal: "deino",
  animalName: "Deinonychus",
  tab: "growth",
  title: "Sinh trưởng",
  voice: "Khủng long nở từ trứng rồi lớn lên. Tỷ lệ các bộ phận cũng thay đổi.",
  note: "Trứng, lông và các giai đoạn là phục dựng; không khẳng định tuổi, kích thước trứng hay tốc độ lớn lên. Các giai đoạn không cùng tỷ lệ.",
  video: null,
  art: "/assets/heroes/deino.png",
  points: [{"box":[2,53,11,13],"label":"Trứng","voice":"Khủng long nở từ trứng. Đây là trứng phục dựng minh họa."},{"box":[18,48,16,23],"label":"Mới nở","voice":"Con nhỏ có tỷ lệ đầu và thân khác con trưởng thành."},{"box":[38,37,25,35],"label":"Đang lớn","voice":"Cơ thể và chiếc đuôi dài ra khi con non lớn lên."},{"box":[65,14,32,56],"label":"Trưởng thành","voice":"Deinonychus trưởng thành có hai chân khỏe, đuôi dài và móng cong lớn."}],
  source: {"name":"American Museum of Natural History","url":"https://www.amnh.org/dinosaurs/dinosaur-eggs"},
  path: "/animal/deino/topics/growth"
};

export function render(container, context = {}) {
  const { speak } = context;
  const isVideo = false;
  const videoSrc = null;
  const artSrc = "/assets/heroes/deino.png";
  const title = "Sinh trưởng";
  const animalName = "Deinonychus";

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
