// Utilities to enforce inline video playback across mobile WebViews (Zalo in-app, WeChat, iOS WKWebView, Android WebView)
// and prevent videos from being hijacked into native fullscreen media players.

export const INLINE_VIDEO_ATTRS = 'muted playsinline webkit-playsinline="true" x5-playsinline="true" x5-video-player-type="h5" x5-video-player-fullscreen="false" x-webkit-airplay="allow" airplay="allow" controlsList="nodownload nofullscreen noremoteplayback" disablePictureInPicture disableRemotePlayback tabindex="-1"';

export function setupInlineVideo(video) {
  if (!video) return;
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', 'true');
  video.setAttribute('x5-playsinline', 'true');
  video.setAttribute('x5-video-player-type', 'h5');
  video.setAttribute('x5-video-player-fullscreen', 'false');
  video.setAttribute('x-webkit-airplay', 'allow');
  video.setAttribute('airplay', 'allow');
  video.setAttribute('controlsList', 'nodownload nofullscreen noremoteplayback');
  video.setAttribute('disablePictureInPicture', '');
  video.setAttribute('disableRemotePlayback', '');
  video.setAttribute('tabindex', '-1');

  // Cancel any native fullscreen transition initiated by the browser/OS
  video.addEventListener('webkitbeginfullscreen', (e) => {
    e.preventDefault();
    if (typeof video.webkitExitFullscreen === 'function') {
      video.webkitExitFullscreen();
    }
  });
  video.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement === video) {
      document.exitFullscreen?.().catch(() => {});
    }
  });
  video.addEventListener('webkitfullscreenchange', () => {
    if (document.webkitFullscreenElement === video) {
      document.webkitExitFullscreen?.();
    }
  });
}

export function installGlobalVideoPolicy() {
  if (typeof document === 'undefined') return;
  document.addEventListener('webkitbeginfullscreen', (e) => {
    e.preventDefault();
    if (typeof e.target?.webkitExitFullscreen === 'function') {
      e.target.webkitExitFullscreen();
    }
  }, true);
  document.addEventListener('fullscreenchange', (e) => {
    if (e.target?.tagName === 'VIDEO') {
      document.exitFullscreen?.().catch(() => {});
    }
  }, true);
  document.addEventListener('webkitfullscreenchange', () => {
    if (document.webkitFullscreenElement?.tagName === 'VIDEO') {
      document.webkitExitFullscreen?.();
    }
  }, true);
}
