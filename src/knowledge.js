export const topics={
 habitat:{title:'Môi trường sống',word:'Habitat',hue:110,voice:'Tê rex sống trong môi trường ấm và ẩm. Hãy nhìn cây xanh, bãi bồi và dòng sông trong cảnh phục dựng này.',note:'Cảnh minh họa môi trường, không phải ảnh chụp một địa điểm hóa thạch cụ thể.',source:'https://www.nhm.ac.uk/discover/dino-directory/tyrannosaurus.html'},
 diet:{title:'Thức ăn',word:'Food',hue:353,voice:'Tê rex ăn thịt. Nó săn các loài động vật khác và cũng có thể ăn xác động vật. Hãy nhìn Tê rex đang đuổi theo một con khủng long ăn thực vật.',note:'Dấu răng Tyrannosaurus được ghi nhận trên hóa thạch Triceratops và Edmontosaurus. Cảnh gặp nhau là minh họa.',source:'https://www.nhm.ac.uk/discover/dino-directory/tyrannosaurus.html'},
 footprints:{title:'Dấu chân',word:'Footprints',hue:38,voice:'Tê rex đi bằng hai chân sau. Mỗi bàn chân có ba ngón chính hướng về phía trước. Hãy đếm ba ngón trên dấu chân nhé.',note:'Ảnh minh họa dấu chân khủng long chân thú (theropod), không phải một dấu chân hóa thạch đã xác định thuộc T. rex.',source:'https://www.nhm.ac.uk/discover/dino-directory/tyrannosaurus.html'},
 size:{title:'Kích thước',word:'Size',hue:205,voice:'Một con Tê rex trưởng thành dài khoảng mười hai mét từ đầu tới chót đuôi. So với người lớn cao một mét bảy, nó thật to!',note:'T. rex thường dài khoảng 12 m, cao 3,5–4 m ở hông. Hình AI là so sánh minh họa; chiều dài và chiều cao là hai phép đo khác nhau. Người là thước so sánh hiện đại, không sống cùng T. rex.',source:'https://www.nhm.ac.uk/discover/dino-directory/tyrannosaurus.html'},
 growth:{title:'Sinh trưởng',word:'Growth',hue:280,voice:'Từ trong trứng, khủng long nở thành con non. Khi lớn lên, thân hình và tỷ lệ các bộ phận thay đổi. Hãy chọn một giai đoạn ở phía trên.',note:'Trứng và hình dáng con mới nở trong ảnh là phục dựng minh họa. Lớp lông con non còn là giả thuyết; không thể coi màu sắc và chi tiết ảnh là bằng chứng hóa thạch.',source:'https://www.amnh.org/explore/news-blogs/studying-young-t-rex'},
 range:{title:'Nơi phân bố',word:'North America',hue:175,voice:'Hóa thạch Tê rex được tìm thấy ở Bắc Mỹ, trong những khu vực ngày nay thuộc Hoa Kỳ và Canada. Vùng sáng giúp con tìm phía tây Bắc Mỹ.',note:'Dùng hình dạng lục địa hiện đại để định vị, không phải bản đồ cuối kỷ Phấn Trắng. Vùng sáng là chỉ dẫn khái quát, không phải ranh giới phân bố chính xác.',source:'https://www.nhm.ac.uk/discover/dino-directory/tyrannosaurus.html'}
};
const paths={
 habitat:'<path d="M31 48V30M31 35C12 36 8 24 9 14c16-1 24 5 22 21Zm1-7C32 14 41 8 54 9c0 14-7 22-22 22"/>',
 diet:'<path d="M12 43c-9-14 8-30 22-32 15-2 25 7 22 19-2 7-13 9-17 15-9 12-23 7-27-2Z"/><ellipse cx="36" cy="25" rx="8" ry="6"/><path d="m29 29-9 13m24-14 8 6"/>',
 footprints:'<path d="M23 36c-3-9-6-13-5-19 1-7 7-6 10 10-1-17 0-22 4-22s6 9 5 22c6-15 9-17 12-13 4 6-4 16-7 23 0 9-2 17-10 19s-15-5-13-12Z"/>',
 size:'<path d="M46 9v46m-6-39 6-7 6 7m-12 32 6 7 6-7M10 45h24M13 45V28l8-8 11 6v8H20v11M21 20v-8h13v8"/>',
 growth:'<path d="M32 7C21 7 10 32 12 42c2 18 38 18 40 0C54 31 42 7 32 7Z"/><path d="m13 35 10 7 8-10 8 10 12-7"/>',
 range:'<circle cx="32" cy="32" r="24"/><path d="m13 17 13-4 7 8-9 6 1 8-8 1-6-11m20 8 13 3 3 8-10 12-6-9Zm9-22 1 9 13 6"/>'
};
export const topicIcon=key=>`<svg viewBox="0 0 64 64" aria-hidden="true">${paths[key]}</svg>`;
export function topicButtons(){return Object.entries(topics).filter(([key])=>key!=='range').map(([key,t])=>`<button class="topic-orb" data-topic="${key}" style="--orb-hue:${t.hue}" aria-label="${t.title}"><span class="picture-icon picture-${key}" aria-hidden="true"></span></button>`).join('');}
export function createKnowledgeView({speak}){
 const $=id=>document.getElementById(id);let current='habitat',narration='',zoomed=true,pan=.5;
 const view=$('knowledge-view'),img=$('knowledge-image');
 const fit=document.createElement('button');fit.className='trex-fit round';fit.textContent='⛶';fit.setAttribute('aria-label','Đổi giữa toàn cảnh và phóng gần');fit.onclick=()=>{zoomed=!zoomed;layout();};view.append(fit);
 for(const [direction,label]of [[-1,'Xem phần bên trái'],[1,'Xem phần bên phải']]){const b=document.createElement('button');b.className='trex-pan round '+(direction<0?'previous':'next');b.textContent=direction<0?'‹':'›';b.setAttribute('aria-label',label);b.onclick=()=>{pan=Math.max(0,Math.min(1,pan+direction*.28));layout();};view.append(b);}
 let drag=null;
 view.addEventListener('pointerdown',e=>{if(view.dataset.owner!=='dinosaur'||!zoomed||!matchMedia('(max-width:650px) and (orientation:portrait)').matches||e.target.closest('button,details'))return;drag={x:e.clientX,pan};view.setPointerCapture(e.pointerId);});
 view.addEventListener('pointermove',e=>{if(!drag)return;pan=Math.max(0,Math.min(1,drag.pan-(e.clientX-drag.x)/Math.max(1,view.clientHeight*1.25-view.clientWidth)));layout();});
 for(const event of ['pointerup','pointercancel'])view.addEventListener(event,()=>drag=null);
 new MutationObserver(()=>{if(view.dataset.owner!=='dinosaur'){img.style.removeProperty('width');img.style.removeProperty('left');}}).observe(view,{attributes:true,attributeFilter:['data-owner']});
 function choose(index){
  document.querySelectorAll('#topic-options button, [data-growth-step]').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));
  const t=topics[current];narration=t.voice;
  if(current==='growth'){
   narration=['Khủng long đẻ trứng. Đây là một quả trứng minh họa.','Con non nhỏ, chân thanh mảnh. Hình dáng này là phục dựng.','Khi lớn lên, con non có chân dài và thân thon hơn con trưởng thành.','Con trưởng thành có đầu lớn và đôi chân sau khỏe.'][index];
   $('knowledge-view').style.setProperty('--focus-x',[6,24,47,82][index]+'%');$('knowledge-view').dataset.focus=String(index);layout();
  }
  if(current==='size'){
   $('size-guide').textContent=index===0?'↔  ≈ 12 m':'↕  1,7 m';
   narration=index===0?'Tê rex dài khoảng mười hai mét, đo từ mũi tới chót đuôi.':'Người lớn trong hình cao một mét bảy. Người không sống cùng thời với Tê rex.';
   if(index===2)narration='Chiếc xe dài khoảng bốn mét rưỡi. Chiều dài Tê rex gần bằng ba chiếc xe này.';
   if(index===3)narration='Con voi trong hình cao khoảng ba mét ở vai. Tê rex cao khoảng ba mét rưỡi tới bốn mét ở hông.';
   document.querySelectorAll('.dimension-labels button').forEach((e,i)=>e.classList.toggle('selected',i===index));
   $('size-guide').dataset.measure=index===0?'dinosaur':'human';
  }
  speak(narration,'vi-VN');
 }
 function show(key){
  current=key;zoomed=key!=='range';pan=.5;const t=topics[key];narration=t.voice;$('knowledge-view').dataset.topic=key;$('knowledge-view').removeAttribute('data-focus');
  $('knowledge-image').src=`assets/knowledge/trex/${['habitat','diet','footprints','growth'].includes(key)?key+'-wide':key==='size'?'size-v2':key}.png`;$('knowledge-image').alt=t.title+' — ảnh minh họa';$('knowledge-view').style.setProperty('--topic-art',`url("assets/knowledge/trex/${key}.png")`);
  $('topic-explanation').textContent=t.note;$('topic-source').href=t.source;$('topic-source').textContent='Nguồn: '+(t.source.includes('amnh')?'AMNH':'Natural History Museum');$('topic-notes').open=false;
  $('knowledge-overlay').innerHTML=key==='growth'?['Trứng','Con non','Con đang lớn','Trưởng thành'].map((label,i)=>`<button class="growth-region" data-growth-step="${i}" aria-label="${label}" aria-pressed="false"><span class="growth-pick">◉</span></button>`).join(''):key==='range'?'<span class="range-marker" aria-label="Phía tây Bắc Mỹ"><img src="assets/trex.png" alt="T-Rex"></span>':key==='size'?'<div class="dimension-labels"><button data-measure-index="0">T-Rex · ↔ ≈ 12 m<br>Hông · ↕ ≈ 3,7 m</button><button data-measure-index="1">Người · ↕ 1,7 m</button><button data-measure-index="2">Xe · ↔ 4,5 m</button><button data-measure-index="3">Voi · ↕ vai ≈ 3 m</button></div>':'';
  $('topic-options').innerHTML=key==='growth'?['Trứng','Con non','Con đang lớn','Trưởng thành'].map((label,i)=>`<button data-step="${i}" aria-label="${label}" aria-pressed="false"><span class="growth-thumbnail" style="background-position:${[3,23,49,95][i]}% ${[94,86,62,38][i]}%"></span></button>`).join(''):key==='size'?['T-Rex','Người','Xe','Voi'].map((label,i)=>`<button data-step="${i}" aria-label="${label}" aria-pressed="${i===0}"><span class="size-thumbnail size-thumb-${i}"></span></button>`).join(''):'';
  $('topic-options').hidden=true;$('size-guide').hidden=key!=='size';$('size-guide').textContent='↔  ≈ 12 m';$('size-guide').dataset.measure='dinosaur';
  $('knowledge-overlay').querySelectorAll('[data-measure-index]').forEach((b,i)=>b.onclick=()=>choose(i));
  $('knowledge-overlay').querySelectorAll('[data-growth-step]').forEach((b,i)=>b.onclick=()=>choose(i));
  layout();
  $('topic-options').querySelectorAll('button').forEach((b,i)=>b.onclick=()=>choose(i));
  document.querySelectorAll('#topic-hub button[data-topic]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.topic===key)));
 }
 function layout(){
  const box=$('knowledge-view'),img=$('knowledge-image');if(box.dataset.owner!=='dinosaur')return;if(!img.naturalWidth)return;
  const portrait=matchMedia('(max-width:650px) and (orientation:portrait)').matches;const w=portrait&&zoomed?Math.max(box.clientWidth,box.clientHeight*1.25):box.clientWidth,h=box.clientHeight,offset=(w-box.clientWidth)*pan;img.style.setProperty('width',w+'px','important');img.style.setProperty('left',-offset+'px','important');fit.setAttribute('aria-pressed',String(zoomed));box.querySelectorAll('.trex-pan').forEach(b=>{b.hidden=!portrait||!zoomed||w<=box.clientWidth;b.disabled=b.classList.contains('previous')?pan<=0:pan>=1;});const scale=(getComputedStyle(img).objectFit==='contain'?Math.min:Math.max)(w/img.naturalWidth,h/img.naturalHeight),iw=img.naturalWidth*scale,ih=img.naturalHeight*scale;
  if(current==='growth'){
   const regions=[[.10,.55,.065,.15],[.23,.50,.12,.20],[.39,.36,.23,.33],[.62,.12,.33,.57]];
   box.querySelectorAll('[data-growth-step]').forEach((b,i)=>{const [x,y,rw,rh]=regions[i];Object.assign(b.style,{left:((w-iw)/2+x*iw-offset)+'px',top:((h-ih)/2+y*ih)+'px',width:rw*iw+'px',height:rh*ih+'px'});});return;
  }
  const anchors=[[.29,.39],[.45,.60],[.61,.58],[.87,.45]];
  box.querySelectorAll('[data-measure-index]').forEach((b,i)=>{b.style.left=((w-iw)/2+anchors[i][0]*iw-offset)+'px';b.style.top=((h-ih)/2+anchors[i][1]*ih)+'px';});
 }
 $('knowledge-image').addEventListener('load',layout);new ResizeObserver(layout).observe($('knowledge-view'));
 return {show,narrate(){speak(narration,'vi-VN');}};
}
