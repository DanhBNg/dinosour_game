// Category artwork is shared. Species facts and scenes are deliberately separate.
export const oceanCategories={
 habitat:{title:'Môi trường sống',hue:110},diet:{title:'Thức ăn',hue:353},
 movement:{title:'Cách di chuyển',hue:38},size:{title:'Kích thước',hue:205},
 growth:{title:'Sinh trưởng',hue:280},range:{title:'Phân bố',hue:175}
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
import { getLoading3DHtml, attachLoading3DToVideo } from '../../../components/loading-3d.js';

// Polyfill decode on HTMLVideoElement if needed for test assertions
if (typeof HTMLVideoElement !== 'undefined' && !HTMLVideoElement.prototype.decode) {
  HTMLVideoElement.prototype.decode = function() {
    return Promise.resolve();
  };
}

export function oceanTopicButtons(){return Object.entries(oceanCategories).filter(([key])=>key!=='range').map(([key,t])=>`<button class="topic-orb ocean-topic-orb" data-topic="${key}" style="--orb-hue:${t.hue}" aria-label="${t.title}"><img src="/assets/knowledge/ocean/icons/${key}.png" alt=""><span class="topic-label">${t.title}</span></button>`).join('');}
export function createOceanKnowledge({speak}){
 const $=id=>document.getElementById(id);let narration='';
 const hotspot=()=>'';
 function show(id,key){
  const t=oceanContent[id]?.[key];if(!t)return false;narration=t.voice;
  const view=$('knowledge-view');view.dataset.owner='ocean';view.dataset.topic=key;view.removeAttribute('data-focus');
  $('topic-options').hidden=true;$('size-guide').hidden=true;$('topic-notes').open=false;
  $('topic-explanation').textContent=t.note;$('topic-source').href=source;$('topic-source').textContent='Nguồn: NOAA Fisheries';
  const art=`/assets/knowledge/ocean/${id}/${key}.png`;
  const isVideo=key!=='range';
  const videoSrc=isVideo?`/assets/knowledge/ocean/${id}/${key}.mp4`:null;
  const loaderTag=isVideo?getLoading3DHtml('AI đang tạo mô hình 3d, vui lòng đợi'):'';
  const backdropTag=isVideo
   ? `<div class="ocean-topic-backdrop"><video class="ocean-backdrop-video" src="${videoSrc}" autoplay loop muted playsinline></video></div>`
   : `<div class="ocean-topic-backdrop" style="background-image:url('${art}')"></div>`;
  const sceneTag=isVideo
   ? `<video class="ocean-scene ocean-video" src="${videoSrc}" autoplay loop muted playsinline preload="auto" aria-label="${oceanCategories[key]?.title||''} — rùa quản đồng"></video>`
   : `<img class="ocean-scene" src="${art}" alt="${oceanCategories[key]?.title||''} — rùa quản đồng, hình minh họa">`;
  let marks='';
  if(!isVideo){
   if(key==='range')marks=[['Thái Bình Dương',12,45],['Đại Tây Dương',32,43],['Ấn Độ Dương',65,51],['Địa Trung Hải',47,25],['Thái Bình Dương',89,47]].map(([label,x,y])=>`<button class="ocean-range-pin" aria-label="${label}" aria-pressed="false" data-voice="Rùa quản đồng có ở ${label}." style="left:${x}%;top:${y}%"><img src="/assets/map-portraits/loggerhead.png" alt=""></button>`).join('');
  }
  const overlay=$('knowledge-overlay');
  overlay.innerHTML=`${backdropTag}<div class="ocean-board ${isVideo?'has-video':''}">${sceneTag}${marks}</div>${loaderTag}`;
  if(isVideo){
   const artVideo=overlay.querySelector('video.ocean-scene');
   const bgVid=overlay.querySelector('video.ocean-backdrop-video');
   const loader=overlay.querySelector('.video-loading-screen');
   if(artVideo){
    artVideo.muted=true;artVideo.defaultMuted=true;artVideo.playsInline=true;
    if(bgVid){bgVid.muted=true;bgVid.defaultMuted=true;bgVid.playsInline=true;}
    artVideo.onerror=()=>{
     if(!artVideo.dataset.triedFallback){
      artVideo.dataset.triedFallback='1';
      const fbSrc=`/video/loggerhead/${key}.mp4`;
      artVideo.src=fbSrc;
      if(bgVid)bgVid.src=fbSrc;
      artVideo.play?.().catch(()=>{});
      bgVid?.play?.().catch(()=>{});
     }
    };
    if(loader)attachLoading3DToVideo(loader,artVideo);
    artVideo.play?.().catch(()=>{});
    bgVid?.play?.().catch(()=>{});
    let zoomed=true;
    const fitButton=document.createElement('button');
    fitButton.className='explore-fit round';
    fitButton.textContent='⛶';
    fitButton.setAttribute('aria-label','Đổi giữa toàn cảnh và phóng gần');
    fitButton.onclick=()=>{
     zoomed=!zoomed;
     artVideo.style.setProperty('object-fit',zoomed?'cover':'contain','important');
     fitButton.setAttribute('aria-pressed',String(zoomed));
    };
    overlay.append(fitButton);
   }
   const preloadNext=()=>{
    ['habitat','diet','movement','size','growth'].forEach(k=>{
     const u=`/assets/knowledge/ocean/${id}/${k}.mp4`;
     if(!document.querySelector(`link[rel=prefetch][href="${u}"]`)){
      const l=document.createElement('link');l.rel='prefetch';l.as='video';l.href=u;document.head.append(l);
     }
    });
   };
   if('requestIdleCallback' in window)requestIdleCallback(preloadNext);
   else setTimeout(preloadNext,600);
  }
  overlay.querySelectorAll('[data-voice]').forEach(b=>b.onclick=()=>{view.querySelectorAll('[data-voice]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));narration=b.dataset.voice;speak(narration,'vi-VN');});
  document.querySelectorAll('#topic-hub button[data-topic]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.topic===key)));
  return true;
 }
 return {show,narrate(){speak(narration,'vi-VN');}};
}
