/**
 * Module hiệu ứng loading Hologram 3D Cube phát sáng AI
 * Tái sử dụng độc lập ở mọi màn hình / tác vụ tải mô hình 3D hoặc video.
 */

export const DEFAULT_LOADING_TITLE = 'AI đang tạo mô hình 3d, vui lòng đợi';

/**
 * Trả về chuỗi HTML của giao diện Loading 3D (dùng cho innerHTML hoặc template literals)
 * @param {string} [title] Tiêu đề hiển thị
 * @param {object} [options] Tùy chọn cấu hình (fixed, className, subtitle)
 * @returns {string} Chuỗi HTML
 */
export function getLoading3DHtml(title = DEFAULT_LOADING_TITLE, options = {}) {
  const { fixed = false, className = '', subtitle = '' } = options;
  const classes = [
    'video-loading-screen',
    'loading-3d-screen',
    fixed ? 'is-fixed' : '',
    className
  ].filter(Boolean).join(' ');

  const subtitleHtml = subtitle ? `<p class="loading-3d-subtitle">${subtitle}</p>` : '';

  return `<div class="${classes}" aria-live="polite">` +
    `<div class="loading-3d-box video-loading-3d-box">` +
      `<div class="cube-3d-scene">` +
        `<div class="cube-3d">` +
          `<div class="cube-face cube-front"></div>` +
          `<div class="cube-face cube-back"></div>` +
          `<div class="cube-face cube-right"></div>` +
          `<div class="cube-face cube-left"></div>` +
          `<div class="cube-face cube-top"></div>` +
          `<div class="cube-face cube-bottom"></div>` +
          `<div class="cube-core"></div>` +
          `<div class="orbit-ring ring-1"></div>` +
          `<div class="orbit-ring ring-2"></div>` +
          `<div class="orbit-ring ring-3"></div>` +
        `</div>` +
        `<div class="scan-laser-line"></div>` +
      `</div>` +
      `<p class="loading-3d-title video-loading-title">${title}<span class="loading-dots"><span>.</span><span>.</span><span>.</span></span></p>` +
      subtitleHtml +
      `<div class="loading-3d-bar video-loading-bar">` +
        `<div class="loading-3d-progress video-loading-progress"></div>` +
      `</div>` +
    `</div>` +
  `</div>`;
}

/**
 * Tạo một HTMLElement Loading 3D độc lập
 * @param {string} [title] Tiêu đề hiển thị
 * @param {object} [options] Tùy chọn cấu hình
 * @returns {HTMLDivElement}
 */
export function createLoading3DElement(title = DEFAULT_LOADING_TITLE, options = {}) {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = getLoading3DHtml(title, options);
  return wrapper.firstElementChild;
}

/**
 * Ẩn và gỡ bỏ màn hình Loading 3D với hiệu ứng chuyển động mờ dần (fade-out)
 * @param {Element|string} loader Phần tử loader hoặc selector
 * @param {number} [duration=450] Thời gian fade-out (ms)
 */
export function dismissLoading3D(loader, duration = 450) {
  const el = typeof loader === 'string' ? document.querySelector(loader) : loader;
  if (!el || el.__isDismissing) return;
  el.__isDismissing = true;
  el.classList.add('fade-out');
  setTimeout(() => {
    el.remove();
  }, duration);
}

/**
 * Gắn cơ chế tự động ẩn loading khi video sẵn sàng hiển thị khung hình đầu tiên.
 * Loading sẽ được giữ nguyên (không tắt) cho tới khi video thực sự tải xong và đang phát hình.
 * @param {Element|string} loader Phần tử loader
 * @param {HTMLVideoElement} video Phần tử video cần đợi
 * @param {object} [options] Tùy chọn (onDismiss)
 */
export function attachLoading3DToVideo(loader, video, options = {}) {
  const { onDismiss } = options;
  const loaderEl = typeof loader === 'string' ? document.querySelector(loader) : loader;
  if (!loaderEl || !video) return;

  // Đảm bảo các thuộc tính bắt buộc để video tự chạy không bị trình duyệt chặn
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');
  video.setAttribute('muted', '');

  let dismissed = false;
  let checkerInterval = null;

  const triggerDismiss = () => {
    if (dismissed) return;
    // Kiểm tra nghiêm ngặt: video PHẢI đang chạy và đã giải mã vượt qua frame đầu (>0.06s)
    if (video.paused || video.readyState < 2 || video.currentTime < 0.06) {
      return;
    }
    dismissed = true;
    if (checkerInterval) clearInterval(checkerInterval);
    dismissLoading3D(loaderEl, 300);
    onDismiss?.();
  };

  const tryPlay = () => {
    if (video.paused) {
      video.play()?.catch(() => {});
    }
  };

  // Thử phát ngay lập tức
  tryPlay();

  // Bắt sự kiện tương tác nếu trình duyệt yêu cầu cử chỉ người dùng
  const onGesture = () => {
    tryPlay();
  };
  window.addEventListener('pointerdown', onGesture, { passive: true, once: false });
  window.addEventListener('touchstart', onGesture, { passive: true, once: false });
  window.addEventListener('click', onGesture, { passive: true, once: false });
  loaderEl.addEventListener('click', onGesture, { passive: true });

  // Kiểm tra frame được vẽ bằng requestVideoFrameCallback nếu có hỗ trợ
  if (typeof video.requestVideoFrameCallback === 'function') {
    const onFrame = () => {
      if (dismissed) return;
      if (!video.paused && video.currentTime > 0.06) {
        triggerDismiss();
      } else {
        video.requestVideoFrameCallback(onFrame);
      }
    };
    video.requestVideoFrameCallback(onFrame);
  }

  // Lắng nghe khi có tiến độ thời gian thực sự
  video.addEventListener('timeupdate', () => {
    if (video.currentTime > 0.08 && !video.paused) {
      triggerDismiss();
    }
  });

  video.addEventListener('playing', () => {
    setTimeout(() => {
      if (video.currentTime > 0.06 && !video.paused) {
        triggerDismiss();
      }
    }, 150);
  });

  // Kiểm tra định kỳ: giữ loading mãi mãi nếu chưa chạy được, và liên tục thử play lại
  checkerInterval = setInterval(() => {
    if (dismissed) {
      clearInterval(checkerInterval);
      return;
    }
    if (!video.paused && video.readyState >= 2 && video.currentTime > 0.08) {
      triggerDismiss();
    } else if (video.paused) {
      tryPlay();
    }
  }, 250);

  // Nếu gặp lỗi kết nối hoặc video tạm ngắt, KHÔNG tắt màn hình loading mà thử tải lại
  video.addEventListener('error', () => {
    if (!dismissed) {
      setTimeout(() => {
        if (!dismissed) {
          video.load();
          tryPlay();
        }
      }, 1000);
    }
  });
}

/**
 * Hiển thị màn hình Loading 3D vào một container bất kỳ
 * @param {Element} [container=document.body] Nơi gắn loader
 * @param {string} [title] Tiêu đề hiển thị
 * @param {object} [options] Tùy chọn
 * @returns {{ element: HTMLElement, dismiss: Function, attachToVideo: Function }}
 */
export function showLoading3D(container = document.body, title = DEFAULT_LOADING_TITLE, options = {}) {
  const el = createLoading3DElement(title, options);
  container.append(el);

  return {
    element: el,
    dismiss: (duration) => dismissLoading3D(el, duration),
    attachToVideo: (video, opts) => attachLoading3DToVideo(el, video, opts)
  };
}

export default {
  DEFAULT_LOADING_TITLE,
  getLoading3DHtml,
  createLoading3DElement,
  dismissLoading3D,
  attachLoading3DToVideo,
  showLoading3D
};
