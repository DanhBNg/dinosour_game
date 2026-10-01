import {chromium} from 'playwright';
const b = await chromium.launch({channel:'chrome', headless:true});
try {
  const p = await b.newPage();
  await p.goto('http://127.0.0.1:4175/animal/tuna/topics/size');
  await p.waitForFunction(() => window.dinoGame?.screen === 'topic', null, {timeout: 10000});
  await p.waitForTimeout(500);
  console.log('Clicking growth tab...');
  await p.locator('#topic-hub [data-topic="growth"]').click();
  const hasLoaderImmediate = await p.locator('.video-loading-screen, .loading-3d-screen').count();
  console.log('Loader count immediately after click:', hasLoaderImmediate);
  await p.waitForTimeout(400);
  const videoState = await p.evaluate(() => {
    const v = document.querySelector('video.explore-art');
    const loader = document.querySelector('.video-loading-screen, .loading-3d-screen');
    return {
      hasVideo: !!v,
      videoSrc: v?.src,
      readyState: v?.readyState,
      currentTime: v?.currentTime,
      paused: v?.paused,
      loaderCount: loader ? 1 : 0,
      loaderClass: loader?.className
    };
  });
  console.log('Video state after 400ms:', videoState);
  await p.screenshot({path: 'artifacts/debug-growth.png'});
} finally {
  await b.close();
}
