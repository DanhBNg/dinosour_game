import test from 'node:test';
import assert from 'node:assert/strict';
const terrain = await import('../src/turtle-shore-state.js').catch(()=>({}));
const nesting = await import('../src/turtle-nest-state.js').catch(()=>({}));
test('shore has a continuous submerged slope and dry nesting area',()=>{
 assert.equal(typeof terrain.sampleShore,'function');
 assert.ok(terrain.sampleShore(0,15).height < -1);
 assert.ok(terrain.sampleShore(0,-15).height > .5);
 for(let z=-30;z<30;z+=.1)assert.ok(Math.abs(terrain.sampleShore(0,z+.1).height-terrain.sampleShore(0,z).height)<.05);
});
test('shore transition is reversible and does not chatter at thresholds',()=>{
 assert.equal(typeof terrain.createShoreState,'function');
 const s=terrain.createShoreState();
 for(let i=0;i<100;i++)s.update(.02,0,15);
 assert.equal(s.mode,'swim');assert.ok(s.land<.01);
 for(let i=0;i<100;i++)s.update(.02,0,-15);
 assert.equal(s.mode,'crawl');assert.ok(s.land>.99);
 for(let i=0;i<20;i++)s.update(.02,0,-15+i%2*.01);
 assert.equal(s.mode,'crawl');
 for(let i=0;i<100;i++)s.update(.02,0,15);
 assert.equal(s.mode,'swim');assert.ok(s.land<.01);
});
test('nest gates location and order, pauses safely, completes and resets',()=>{
 assert.equal(typeof nesting.createNestState,'function');
 const n=nesting.createNestState();
 assert.equal(n.start({x:0,z:15}),false);
 assert.equal(n.start({x:0,z:-15}),true);
 n.update(1);n.cancel();assert.equal(n.busy,false);assert.equal(n.stage,'bodyPit');
 assert.equal(n.start({x:8,z:-15}),false,'must resume at existing nest');
 assert.equal(n.start({x:0,z:-15}),true);
 for(let i=0;i<5;i++){n.update(30);if(i<4)assert.equal(n.busy,true,'continues automatically without repeated taps');}
 assert.equal(n.stage,'return');n.returnToSea(false);assert.equal(n.stage,'return');
 n.returnToSea(true);assert.equal(n.stage,'complete');
 n.reset();assert.equal(n.stage,'bodyPit');assert.equal(n.eggs,0);assert.equal(n.site,null);
});
