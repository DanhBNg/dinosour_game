// Positions are normalized against the final artwork, not against the viewport.
export const stegoExploration={
 habitat:{focus:.49,alt:'Stegosaurus uống nước giữa bãi bồi, cây lá kim và dương xỉ',points:[
  {box:[9,8,22,47],label:'Cây lá kim',voice:'Cây lá kim, dương xỉ và mộc tặc mọc trong môi trường Morrison.'},
  {box:[25,23,31,50],label:'Stegosaurus bên sông',voice:'Stegosaurus sống trên cạn. Dòng sông cung cấp nước trong cảnh phục dựng này.'},
  {box:[64,54,27,24],label:'Dòng sông',voice:'Sông và bãi bồi là một phần môi trường nơi hóa thạch Stegosaurus được tìm thấy.'}
 ]},
 diet:{focus:.62,alt:'Stegosaurus cúi đầu ăn thực vật thấp',points:[
  {box:[63,53,12,20],label:'Miệng đang ăn lá',voice:'Stegosaurus ăn thực vật. Hãy nhìn những chiếc lá bên miệng nó.'},
  {box:[76,44,20,37],label:'Thực vật thấp',voice:'Đây là thực vật minh họa cho thức ăn. Ta không biết chính xác mọi loài cây trong khẩu phần.'}
 ]},
 footprints:{focus:.48,alt:'Dấu chân trước nhỏ và dấu chân sau lớn có ba ngón tròn',note:'Minh họa dạng Deltapodus thường được quy cho nhóm stegosaur: dấu chân trước hình lưỡi liềm, chân sau có ba ngón ngắn tròn. Không phải dấu chân hóa thạch đã xác định chắc chắn của chi Stegosaurus.',source:{name:'University of Kansas · Deltapodus',url:'https://ichnology.ku.edu/vertebrate_traces/dinosaurtracks/deltapodus.html'},points:[
  {box:[19,51,27,30],label:'Chân trước',voice:'Dấu chân trước nhỏ, rộng và cong như một vầng trăng khuyết.'},
  {box:[52,43,32,39],label:'Chân sau',voice:'Dấu chân sau lớn hơn. Hãy tìm ba ngón ngắn, tròn ở phía trước dấu chân.'}
 ]},
 size:{focus:.45,alt:'Stegosaurus, người lớn, xe và voi nhìn ngang trên cùng mặt đất',note:'So sánh minh họa cùng mặt đất: Stegosaurus dài tới khoảng 9 m theo NHM; người giả định cao 1,7 m, xe dài 4,5 m, voi giả định cao vai 3 m. Người, xe và voi là vật đối chiếu hiện đại, không sống cùng Stegosaurus. Kích thước ảnh AI không thay cho phép đo.',points:[
  {box:[3,24,40,50],label:'Stegosaurus',measurement:'↔ ≈ 9 m',voice:'Chiều dài từ đầu tới chót đuôi khoảng chín mét. Đây không phải chiều cao.'},
  {box:[44,49,6,25],label:'Người',measurement:'↕ 1,7 m',voice:'Người lớn dùng để so sánh cao một mét bảy.'},
  {box:[52,49,20,25],label:'Xe',measurement:'↔ 4,5 m',voice:'Chiếc xe dài bốn mét rưỡi. Chín mét bằng chiều dài hai chiếc xe như thế này.'},
  {box:[76,37,21,38],label:'Voi',measurement:'↕ vai ≈ 3 m',voice:'Voi dùng để so sánh cao khoảng ba mét ở vai.'}
 ]},
 growth:{focus:.50,alt:'Trứng, Stegosaurus mới nở, con non và con trưởng thành nối bằng ba mũi tên',note:'Trứng và các giai đoạn con non là phục dựng minh họa, không thể hiện tỷ lệ kích thước thật hoặc tuổi chính xác. Con non được vẽ với tỷ lệ cơ thể khác con trưởng thành; các mũi tên chỉ thứ tự phát triển.',points:[
  {box:[5,60,8,12],label:'Trứng',voice:'Khủng long nở từ trứng. Quả trứng này là hình minh họa.'},
  {box:[18,53,14,20],label:'Mới nở',voice:'Stegosaurus mới nở còn rất nhỏ. Hình dáng chi tiết là phục dựng.'},
  {box:[37,40,21,34],label:'Đang lớn',voice:'Con non lớn dần. Cơ thể và các tấm lưng cũng thay đổi.'},
  {box:[58,20,40,56],label:'Trưởng thành',voice:'Stegosaurus trưởng thành có thân lớn, đầu nhỏ và những tấm xương cao trên lưng.'}
 ]},
 range:{focus:.45,alt:'Bản đồ Bắc Mỹ hiện đại với điểm minh họa vùng tìm thấy hóa thạch Stegosaurus',note:'Bản đồ hiện đại giúp định vị miền tây Hoa Kỳ. Đây là vùng hóa thạch minh họa, không phải bản đồ Jura hoặc ranh giới phân bố đầy đủ. Bấm điểm khủng long để nghe.',points:[
  {box:[35,24,13,20],label:'Miền tây Hoa Kỳ',portrait:true,voice:'Hóa thạch Stegosaurus được tìm thấy trong các lớp đá Morrison ở miền tây Hoa Kỳ.'}
 ]}
};
export function createStegoExploration({speak,record,id="stego",scenes=stegoExploration}){
 let narration='',serial=0;const $=id=>document.getElementById(id);
 function show(key){
  const scene=scenes[key],fact=record.topics[key];if(!scene)return false;
  const token=++serial;narration=scene.voice||fact.voice;const view=$('knowledge-view');view.dataset.owner='illustrated';view.dataset.record=id;view.dataset.topic=key;view.removeAttribute('data-focus');
  $('topic-options').hidden=true;$('size-guide').hidden=true;$('topic-notes').open=false;
  $('topic-explanation').textContent=[scene.voice||fact.voice,scene.note||fact.note,record.identity].filter(Boolean).join(' ');
  const source=scene.source||fact.source||record.source;$('topic-source').href=source.url;$('topic-source').textContent='Nguồn: '+source.name;
  const overlay=$('knowledge-overlay');overlay.innerHTML=`<div class="explore-scroll" tabindex="0" aria-label="Cảnh minh họa; vuốt ngang để khám phá"><div class="explore-board"><img class="explore-art" src="/assets/knowledge/${id}/${key}.png" alt="${scene.alt}">${scene.points.map((p,i)=>`<button class="explore-point ${p.measurement?'measured':''} ${p.portrait?'map-point':''}" data-point="${i}" aria-label="${p.label}" aria-pressed="false" style="left:${p.box[0]}%;top:${p.box[1]}%;width:${p.box[2]}%;height:${p.box[3]}%">${p.portrait?`<img src="${record.world==='ocean'?`/assets/map-portraits/${id}.png`:`/assets/portraits/${id}.webp`}" alt="">`:`<span class="explore-dot" aria-hidden="true">◉</span>`}${p.measurement?`<span class="explore-measure">${p.label}<b>${p.measurement}</b></span>`:''}</button>`).join('')}</div></div><button class="explore-pan previous" aria-label="Xem phần bên trái">‹</button><button class="explore-pan next" aria-label="Xem phần bên phải">›</button>`;
  const scroll=overlay.querySelector('.explore-scroll'),board=overlay.querySelector('.explore-board'),art=overlay.querySelector('.explore-art');
  const arrows=[...overlay.querySelectorAll('.explore-pan')];
  const update=()=>{arrows[0].hidden=scroll.scrollLeft<2;arrows[1].hidden=scroll.scrollLeft+scroll.clientWidth>=scroll.scrollWidth-2;};
  let ratio=2.2,zoomed=key!=='range';
  const fitButton=document.createElement('button');fitButton.className='explore-fit round';fitButton.textContent='⛶';fitButton.setAttribute('aria-label','Đổi giữa toàn cảnh và phóng gần');overlay.append(fitButton);
  const backdrop=document.createElement('div');backdrop.className='explore-backdrop';backdrop.style.backgroundImage=`url('/assets/knowledge/${id}/${key}.png')`;overlay.prepend(backdrop);
  fitButton.onclick=()=>{zoomed=!zoomed;layout();};
  function layout(){if(token!==serial||(view.dataset.owner!=='illustrated'||view.dataset.record!==id))return;const portrait=matchMedia('(max-width:650px) and (orientation:portrait)').matches;const width=portrait?(zoomed?Math.max(scroll.clientWidth,scroll.clientHeight*1.25):scroll.clientWidth):Math.max(scroll.clientWidth,scroll.clientHeight*ratio);board.style.width=width+'px';board.style.height=(width/ratio)+'px';board.style.marginTop=portrait?Math.max(0,(scroll.clientHeight-width/ratio)/2)+'px':'0px';scroll.scrollLeft=Math.max(0,width*scene.focus-scroll.clientWidth/2);fitButton.hidden=!portrait;fitButton.setAttribute('aria-pressed',String(zoomed));if(matchMedia('(max-width:1024px)').matches||navigator.maxTouchPoints>0){for(const label of board.querySelectorAll('.explore-measure')){label.style.top='0px';const overflow=8-(label.getBoundingClientRect().top-scroll.getBoundingClientRect().top);if(overflow>0)label.style.top=overflow+'px';}}update();}
  art.onload=()=>{if(token!==serial||view.dataset.record!==id)return;ratio=art.naturalWidth/art.naturalHeight;layout();scroll.scrollLeft=Math.max(0,board.clientWidth*(scroll.clientWidth<650?scene.focus:.5)-scroll.clientWidth/2);update();};
  arrows.forEach((b,i)=>b.onclick=()=>scroll.scrollBy({left:(i?1:-1)*scroll.clientWidth*.7,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));scroll.onscroll=update;
  scroll.onkeydown=e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();scroll.scrollBy({left:(e.key==='ArrowRight'?1:-1)*scroll.clientWidth*.7,behavior:'smooth'});}};
  overlay.querySelectorAll('[data-point]').forEach(b=>b.onclick=()=>{overlay.querySelectorAll('[data-point]').forEach(other=>other.setAttribute('aria-pressed',String(other===b)));narration=scene.points[Number(b.dataset.point)].voice;speak(narration,'vi-VN');});
  // Disconnect when the app replaces this scene, rather than retaining obsolete artwork.
  resize?.disconnect();resize=new ResizeObserver(layout);resize.observe(scroll);layout();
  document.querySelectorAll('#topic-hub button[data-topic]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.topic===key)));
  return true;
 }
 let resize;
 return{show,narrate(){speak(narration,'vi-VN');}};
}
