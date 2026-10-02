// Auto-generated page module for ocean/slug/size
import { getLoading3DHtml, attachLoading3DToVideo } from '../../../components/loading-3d.js';

export const pageInfo = {
  map: "ocean",
  animal: "slug",
  animalName: "Sên biển",
  tab: "size",
  title: "Kích thước",
  voice: "Sên biển này là động vật nhỏ. Hình trên màn hình đã được phóng lớn.",
  note: "Thước minh họa không có giá trị hiệu chuẩn. Không suy ra chiều dài tối đa từ tỷ lệ tranh.",
  video: null,
  art: "/assets/knowledge/ocean/slug/size.png",
  points: [{"box":[24,24,47,39],"label":"Cơ thể nhỏ","voice":"Con sên biển nhỏ này đã được phóng lớn để nhìn rõ màu và hình dáng.","measurement":"Ảnh phóng lớn"},{"box":[21,63,58,12],"label":"Quan sát kích thước","voice":"Muốn biết chiều dài phải đo một mẫu cụ thể. Chưa có số đo xác nhận cho model này."}],
  source: {"name":"Australian Museum · Sea Slug Forum","url":"https://www.seaslugforum.net/showall/chroanna"},
  path: "/animal/slug/topics/size"
};

export function render(container, context = {}) {
  const { speak } = context;
  const isVideo = false;
  const videoSrc = null;
  const artSrc = "/assets/knowledge/ocean/slug/size.png";
  const title = "Kích thước";
  const animalName = "Sên biển";

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
