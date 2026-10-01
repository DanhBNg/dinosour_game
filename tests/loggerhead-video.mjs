import {chromium} from 'playwright';
import assert from 'node:assert/strict';

const b = await chromium.launch({channel:'chrome', headless:true});
try {
  const p = await b.newPage();
  const errors = [];
  p.on('pageerror', e => errors.push(e.message));

  for (const topic of ['habitat', 'diet', 'movement', 'size', 'growth']) {
    await p.goto('http://127.0.0.1:4175/animal/loggerhead/topics/' + topic);
    await p.waitForFunction(() => document.querySelector('video.ocean-scene')?.readyState >= 2, null, {timeout: 30000});
    const v = p.locator('video.ocean-scene');
    await p.waitForTimeout(400);
    assert.ok(await v.evaluate(e => e.currentTime > 0 && !e.paused), `Video ${topic} should be playing`);
    assert.equal(await p.locator('[data-topic=range]').count(), 0, 'Range topic should be hidden');
    console.log('PASS loggerhead video', topic);
  }

  // Test in-page tab switching
  console.log('Testing interactive tab clicks on loggerhead...');
  for (const topic of ['diet', 'movement', 'size', 'growth', 'habitat']) {
    await p.locator('#topic-hub [data-topic="' + topic + '"]').click();
    await p.waitForFunction((t) => document.querySelector('video.ocean-scene')?.src.includes(t + '.mp4') && document.querySelector('video.ocean-scene')?.currentTime > 0, topic, {timeout: 15000});
    const v = p.locator('video.ocean-scene');
    assert.ok(await v.evaluate(e => e.currentTime > 0 && !e.paused));
    console.log('PASS interactive tab click', topic);
  }

  assert.deepEqual(errors, []);
} finally {
  await b.close();
}
