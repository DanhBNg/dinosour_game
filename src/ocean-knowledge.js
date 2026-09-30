// Category artwork is shared. Species facts and scenes are deliberately separate.
export const oceanCategories={
 habitat:{title:'Môi trường sống',hue:110},diet:{title:'Thức ăn',hue:353},
 movement:{title:'Cách di chuyển',hue:38},size:{title:'Kích thước',hue:205},
 growth:{title:'Vòng đời',hue:280},range:{title:'Phân bố',hue:175}
};
const source='https://www.fisheries.noaa.gov/species/loggerhead-turtle';
export const oceanContent={loggerhead:{
 habitat:{voice:'Rùa quản đồng sống ngoài biển và vùng nước ven bờ.',note:'Cảnh minh họa môi trường ven bờ; không phải một địa điểm cụ thể.'},
 diet:{voice:'Rùa quản đồng ăn cua và các động vật có vỏ. Hàm khỏe giúp rùa nghiền vỏ thức ăn.',note:'Cua và ốc là ví dụ thức ăn; không đại diện cho toàn bộ khẩu phần.'},
 movement:{voice:'Rùa bơi bằng những chiếc chân chèo. Chạm vào chân chèo để nhìn rõ hơn.',note:'Mũi tên minh họa chuyển động, không phải quỹ đạo đo đạc.'},
 size:{voice:'Mai rùa trưởng thành dài khoảng không phẩy tám đến một phẩy một mét.',note:'Chiều dài mai, không tính đầu, chân chèo và đuôi. Khoảng làm tròn từ 2,5–3,5 feet; mỗi cá thể có kích thước khác nhau.'},
 growth:{voice:'Rùa đẻ trứng trên bãi cát. Rùa con nở ra, xuống biển rồi lớn lên.',note:'Các giai đoạn được phóng to để dễ nhìn, không cùng tỉ lệ. Hình minh họa vòng đời, không mô tả thời gian chính xác.'},
 range:{voice:'Rùa quản đồng sống ở Đại Tây Dương, Thái Bình Dương, Ấn Độ Dương và Địa Trung Hải.',note:'Điểm sáng chỉ các vùng biển khái quát, không phải ranh giới phân bố hay vị trí cá thể. Loài chủ yếu sống ở vùng cận nhiệt và ôn đới.'}
}};
export function oceanTopicButtons(){return Object.entries(oceanCategories).map(([key,t])=>`<button class="topic-orb ocean-topic-orb" data-topic="${key}" style="--orb-hue:${t.hue}" aria-label="${t.title}"><img src="/assets/knowledge/ocean/icons/${key}.png" alt=""></button>`).join('');}
export function createOceanKnowledge({speak}){
 const $=id=>document.getElementById(id);let narration='';
 const hotspot=()=>'';
 function show(id,key){
  const t=oceanContent[id]?.[key];if(!t)return false;narration=t.voice;
  const view=$('knowledge-view');view.dataset.owner='ocean';view.dataset.topic=key;view.removeAttribute('data-focus');
  $('topic-options').hidden=true;$('size-guide').hidden=true;$('topic-notes').open=false;
  $('topic-explanation').textContent=t.note;$('topic-source').href=source;$('topic-source').textContent='Nguồn: NOAA Fisheries';
  const art=`/assets/knowledge/ocean/${id}/${key}.png`;
  let marks='';
  if(key==='growth')marks=[['Trứng',1,31,16,32,'Rùa đẻ trứng trên bãi cát.'],['Rùa mới nở',23,38,16,27,'Rùa con xuống biển sau khi nở.'],['Rùa non',44,30,18,33,'Rùa non lớn lên trong biển.'],['Rùa trưởng thành',68,23,29,47,'Rùa trưởng thành.']].map(a=>hotspot(...a)).join('');
  if(key==='movement')marks=hotspot('Chân chèo phía trước',30,30,45,42,t.voice);
  if(key==='diet')marks=hotspot('Thức ăn có vỏ',48,43,40,32,t.voice);
  if(key==='size')marks='<div class="ocean-size-note"><img src="/assets/knowledge/ocean/icons/size.png" alt=""><strong>0,8–1,1 m</strong><span>Chiều dài mai</span><div class="ocean-ruler" aria-hidden="true"></div></div>';
  if(key==='range')marks=[['Thái Bình Dương',12,45],['Đại Tây Dương',32,43],['Ấn Độ Dương',65,51],['Địa Trung Hải',47,25],['Thái Bình Dương',89,47]].map(([label,x,y])=>`<button class="ocean-range-pin" aria-label="${label}" aria-pressed="false" data-voice="Rùa quản đồng có ở ${label}." style="left:${x}%;top:${y}%"><img src="/assets/map-portraits/loggerhead.png" alt=""></button>`).join('');
  $('knowledge-overlay').innerHTML=`<div class="ocean-topic-backdrop" style="background-image:url('${art}')"></div><div class="ocean-board"><img class="ocean-scene" src="${art}" alt="${oceanCategories[key].title} — rùa quản đồng, hình minh họa">${marks}</div>`;
  $('knowledge-overlay').querySelectorAll('[data-voice]').forEach(b=>b.onclick=()=>{view.querySelectorAll('[data-voice]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));narration=b.dataset.voice;speak(narration,'vi-VN');});
  document.querySelectorAll('#topic-hub button[data-topic]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.topic===key)));
  return true;
 }
 return {show,narrate(){speak(narration,'vi-VN');}};
}
