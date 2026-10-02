export const MINIMAP_RADIUS=28;

export function minimapPoint(target,player){
 const left=50+(target.x-player.x)/MINIMAP_RADIUS*50;
 const top=50+(target.z-player.z)/MINIMAP_RADIUS*50;
 return {left,top,visible:Math.hypot(left-50,top-50)<=47};
}

export function createSurvivalMinimap(host,config,prey){
 const map=document.createElement('div');map.className='survival-minimap';
 map.setAttribute('aria-label','Bản đồ quanh rùa: hướng Bắc ở trên, vị trí con mồi cập nhật trực tiếp');
 map.innerHTML=`<div class="minimap-field">
   <svg class="minimap-terrain" viewBox="-28 -28 56 56" aria-hidden="true">
    <path fill="#123e66" d="M-100-100H100V-18H-100Z"/>
    <path fill="none" stroke="#7ee7db" stroke-opacity=".35" stroke-width=".35" stroke-dasharray="1 2" d="M-100-18H100"/>
    <ellipse cx="0" cy="12" rx="11" ry="6" fill="#6db7a0" opacity=".5"/>
    <ellipse cx="0" cy="12" rx="9" ry="4" fill="#e6ce91"/>
    <ellipse cx="0" cy="-28" rx="7" ry="4" fill="#529ea0" opacity=".6"/>
    <ellipse cx="-6" cy="-14" rx="3" ry="2" fill="#547685"/>
   </svg>
   <div class="minimap-grid"></div>
   ${config.landmarks.map(mark=>`<span class="minimap-landmark" data-landmark="${mark.id}" title="${mark.name}" aria-label="${mark.name}">${mark.icon}</span>`).join('')}
   ${prey.map((item,index)=>`<span class="minimap-prey minimap-prey-${item.type.id}" data-prey="${index}" title="${item.type.icon}" aria-label="Con mồi ${item.type.icon}"></span>`).join('')}
   <span class="minimap-boss" aria-label="Cá mập khổng lồ" hidden>🦈</span>
   <span class="survival-player" title="Vị trí của bạn" aria-label="Vị trí của bạn">🐢</span>
  </div>`;
 host.append(map);
 const terrain=map.querySelector('.minimap-terrain');
 const bossMarker=map.querySelector('.minimap-boss');
 const preyMarkers=prey.map((item,index)=>map.querySelector(`[data-prey="${index}"]`));
 const landmarkMarkers=config.landmarks.map(mark=>map.querySelector(`[data-landmark="${mark.id}"]`));
 function place(marker,target,player,visible){
  const point=minimapPoint(target,player);marker.hidden=!visible||!point.visible;
  marker.style.left=`${point.left}%`;marker.style.top=`${point.top}%`;
 }
 return {
  update(player,state){
   terrain.setAttribute('viewBox',`${player.x-MINIMAP_RADIUS} ${player.z-MINIMAP_RADIUS} ${MINIMAP_RADIUS*2} ${MINIMAP_RADIUS*2}`);
   config.landmarks.forEach((mark,index)=>{
    const marker=landmarkMarkers[index];place(marker,{x:mark.position[0],z:mark.position[2]},player,mark.minStage<=state.stageIndex);
    marker.style.opacity=state.discoveries.includes(mark.id)?'1':'.55';
   });
   prey.forEach((item,index)=>place(preyMarkers[index],item.body.position,player,item.respawn<=0));
   if(state.boss)place(bossMarker,state.boss.position,player,state.boss.active);else bossMarker.hidden=true;
  },
  dispose(){map.remove();}
 };
}
