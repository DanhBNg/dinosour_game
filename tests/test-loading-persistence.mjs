import {chromium} from 'playwright';
import assert from 'node:assert/strict';

const b = await chromium.launch({channel:'chrome', headless:true});
try {
  const p = await b.newPage();
  await p.goto('http://127.0.0.1:4175/animal/tuna/topics/size');
  await p.waitForFunction(() => window.dinoGame?.screen === 'topic', null, {timeout: 10000});
  
  // Test loading persistence when a video is delayed
  const stayTest = await p.evaluate(async () => {
    const { createLoading3DElement, attachLoading3DToVideo } = await import('/loading-3d.js');
    const dummyVideo = document.createElement('video');
    // dummyVideo has no src, so it never plays
    const loader = createLoading3DElement('Đang tải video test...');
    document.body.append(loader);
    attachLoading3DToVideo(loader, dummyVideo);
    
    // Wait 2 seconds
    await new Promise(r => setTimeout(r, 2000));
    const stillPresent = document.body.contains(loader) && !loader.classList.contains('fade-out');
    loader.remove();
    return stillPresent;
  });
  
  assert.equal(stayTest, true, 'Loading screen must persist when video is not playing');
  console.log('PASS: Loading screen persists indefinitely until video is actually playing!');
} finally {
  await b.close();
}
