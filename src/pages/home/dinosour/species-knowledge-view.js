import {marineExploration} from '../ocean/marine-exploration.js';
import {remainingDinoExploration} from './remaining-dino-exploration.js';
import {triceExploration} from './trice/trice-exploration.js';
import {createStegoExploration} from './stego/stego-exploration.js';
import {speciesKnowledge} from './species-knowledge-data.js';
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const topicTitles={habitat:'Môi trường sống',diet:'Thức ăn',footprints:'Dấu chân & vận động',movement:'Cách di chuyển',size:'Kích thước',growth:'Sinh trưởng',range:'Phân bố'};
export function speciesTopicButtons(id){
 const record=speciesKnowledge[id];
 return Object.keys(record.topics).filter(key=>key!=='range').map(key=>{
  const label = id==='ptero'&&key==='footprints' ? 'Cánh & cách bay' : (topicTitles[key] || key);
  return `<button class="topic-orb ocean-topic-orb" data-topic="${key}" aria-label="${label}"><img src="${topicArtwork(record,key)}" alt=""><span class="topic-label">${label}</span></button>`;
 }).join('');
}
function topicArtwork(record,key){if(key==='footprints'&&record.name==='Pterosaur')return '/assets/knowledge/ptero/icon-movement.png';if(key==='footprints'&&record.name==='Deinonychus')return '/assets/knowledge/deino/icon-movement.png';if(key==='diet'&&['Stegosaurus','Triceratops'].includes(record.name))return '/assets/knowledge/shared/herbivore-food.png';if(record.name==='Mosasaurus'&&key==='growth')return '/assets/knowledge/ocean/icons/growth.png';return record.world==='ocean'||key==='movement'?`/assets/knowledge/ocean/icons/${key}.png`:`/assets/knowledge/trex/icon-${key}.png`;}
export function createSpeciesKnowledge({speak}){
 const illustratedViews={stego:createStegoExploration({speak,record:speciesKnowledge.stego}),trice:createStegoExploration({speak,record:speciesKnowledge.trice,id:'trice',scenes:triceExploration})};for(const [id,scenes] of Object.entries({...remainingDinoExploration,...marineExploration}))illustratedViews[id]=createStegoExploration({speak,record:speciesKnowledge[id],id,scenes});let illustrated=null;
 let narration='';const $=id=>document.getElementById(id);
 function show(id,key){
  illustrated=illustratedViews[id];if(illustrated)return illustrated.show(key);
  const r=speciesKnowledge[id],t=r?.topics[key];if(!t)return false;
  narration=t.voice;const v=$('knowledge-view');v.dataset.owner='species';v.dataset.topic=key;v.dataset.record=id;v.removeAttribute('data-focus');
  $('topic-options').hidden=true;$('size-guide').hidden=true;$('topic-notes').open=false;
  const mainVoice=(t.voice||'').trim();
  const esc=s=>(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
  $('topic-explanation').innerHTML='<span class="topic-voice-text">'+esc(mainVoice)+'</span>';
  const source=t.source||r.source;$('topic-source').href=source.url;$('topic-source').textContent='Nguồn: '+source.name;
  const art=r.world==='ocean'?`/assets/worlds/${r.environment||'reef'}.png`:`/assets/heroes/${id}.png`;
  const portrait=r.world==='ocean'?`<img class="species-fact-animal" src="/assets/portraits/${id}.webp" alt="${escape(r.name)}">`:'';
  $('knowledge-overlay').innerHTML=`<div class="species-fact-scene" style="background-image:url('${art}')">${portrait}</div><button class="species-fact" aria-label="Nghe: ${escape(t.voice)}"><img src="${topicArtwork(r,key)}" alt=""><span class="species-fact-copy"><small>${escape(topicTitles[key])}</small><strong>${escape(t.label)}</strong>${r.reference?'<em>Ví dụ tham chiếu</em>':''}</span><span class="species-fact-speaker" aria-hidden="true">♫</span></button>`;
  $('knowledge-overlay').querySelector('.species-fact').onclick=()=>speak(narration,'vi-VN');
  document.querySelectorAll('#topic-hub button[data-topic]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.topic===key)));
  return true;
 }
 return {show,narrate(onFinish){if(illustrated)illustrated.narrate(onFinish);else speak(narration,'vi-VN',onFinish);}};
}
