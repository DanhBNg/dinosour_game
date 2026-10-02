export function createSurvivalHUD(host,config,onSkill){
 host.classList?.add('survival-layout');
 const panel=document.createElement('section');panel.className='survival-hud journey-hud';panel.setAttribute('aria-label','Trạng thái rùa và nhiệm vụ');
 panel.innerHTML='<div class="journey-stats"><img class="journey-avatar" src="/assets/portraits/loggerhead.webp" alt="Rùa biển"><div class="journey-bars"><label>HP <progress class="journey-hp" max="100"></progress><b class="journey-hp-text"></b></label><label>EXP <progress class="journey-exp"></progress><b class="journey-exp-text"></b></label></div><div class="journey-level"><strong></strong><span></span></div></div><div class="journey-footer"><div class="survival-eaten"></div></div>';
 host.append(panel);
 const daily=document.createElement('details');daily.className='journey-task-menu';
 daily.innerHTML='<summary aria-label="Danh sách nhiệm vụ hàng ngày" title="Nhiệm vụ hàng ngày"><svg viewBox="0 0 32 32" aria-hidden="true"><rect x="7" y="6" width="18" height="23" rx="3"/><rect x="12" y="3" width="8" height="6" rx="2"/><path d="m11 14 1 1 2-2m-3 7 1 1 2-2m3-5h5m-5 6h5m-11 5h11"/></svg><span>Nhiệm vụ</span></summary><section class="journey-task-card" aria-label="Nhiệm vụ hôm nay"><strong>Nhiệm vụ hôm nay</strong><div class="journey-missions"></div></section>';
 host.append(daily);
 const taskShortcut=panel.querySelector('.journey-task-shortcut');
 if(taskShortcut){
  taskShortcut.onclick=()=>{daily.open=!daily.open;taskShortcut.setAttribute('aria-expanded',String(daily.open));};
  daily.ontoggle=()=>taskShortcut.setAttribute('aria-expanded',String(daily.open));
 }
 const boss=document.createElement('section');boss.className='journey-boss';boss.hidden=true;boss.setAttribute('aria-label',config.boss.name);boss.innerHTML='<strong>'+config.boss.name+'</strong><div><progress max="'+config.boss.hp+'"></progress><span></span></div>';host.append(boss);
 const notice=document.createElement('div');notice.className='journey-notice';notice.setAttribute('role','status');notice.setAttribute('aria-live','polite');host.append(notice);
 const numbers=document.createElement('div');numbers.className='journey-numbers';numbers.setAttribute('aria-hidden','true');host.append(numbers);
 const skills=document.createElement('div');skills.className='journey-skills';
 skills.innerHTML=config.skills.map(skill=>`<button type="button" class="journey-skill skill-${skill.id}" data-skill="${skill.id}" aria-label="${skill.name}"><span>${skill.icon}</span><i class="skill-cooldown-shade" aria-hidden="true"></i><svg class="skill-cooldown-ring" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46" pathLength="100" /></svg><b class="skill-countdown" aria-hidden="true"></b><strong>${skill.name}</strong><small></small><kbd>${skill.key}</kbd></button>`).join('');host.append(skills);
 const buttons=config.skills.map(skill=>{const button=skills.querySelector(`[data-skill="${skill.id}"]`);button.onclick=()=>onSkill(skill.id);return {skill,button};});
 const actionRow=host.querySelector?.('.roam-actions');if(actionRow)actionRow.append(skills);
 let messageTime=0,floatTime=0,previousMissions='';
 return {
  notify(text,kind='info'){notice.textContent=text;notice.dataset.kind=kind;notice.hidden=false;messageTime=3.5;},
  float(text,kind='reward'){numbers.textContent=text;numbers.dataset.kind=kind;numbers.hidden=false;floatTime=1.5;},
  update(state,combat,canUse,dt){
   panel.querySelector('.journey-hp').value=state.hp;panel.querySelector('.journey-hp-text').textContent=`${Math.ceil(state.hp)}/${state.maxHp}`;
   panel.querySelector('.journey-exp').max=state.nextLevelExp;panel.querySelector('.journey-exp').value=state.levelExp;
   panel.querySelector('.journey-exp-text').textContent=`${state.levelExp}/${state.nextLevelExp}`;
   panel.querySelector('.journey-level strong').textContent=`Lv ${state.level}`;panel.querySelector('.journey-level span').textContent=`⚔ ATK ${state.attack}`;
   panel.querySelector('.survival-eaten').textContent=config.preyTypes.map(type=>`${type.icon} ${state.eatenByType[type.id]}`).join('   ');
   panel.dataset.low=String(state.hp<=30);
   const signature=JSON.stringify(state.missions.map(mission=>[mission.id,mission.progress]));
   if(signature!==previousMissions){previousMissions=signature;daily.querySelector('.journey-missions').innerHTML=state.missions.map(mission=>`<div class="journey-mission ${mission.progress>=mission.count?'done':''}"><span>${mission.icon}</span><strong>${mission.label}</strong><small>${mission.progress>=mission.count?'✓':`${mission.progress}/${mission.count}`}</small></div>`).join('');}
   boss.hidden=!combat.active;boss.querySelector('progress').value=combat.hp;boss.querySelector('span').textContent=`${Math.ceil(combat.hp)}/${combat.maxHp}`;boss.dataset.warning=String(combat.warning);
   skills.hidden=false;
   for(const {skill,button} of buttons){
    const remaining=Math.max(0,combat.cooldowns[skill.id]),cooling=remaining>0;
    const fraction=Math.min(1,remaining/skill.cooldown);
    button.disabled=!canUse(skill.id);button.dataset.cooling=String(cooling);button.dataset.ready=String(!button.disabled);
    button.querySelector('.skill-cooldown-shade').style.background=`conic-gradient(from 0deg, #101d4fc9 ${fraction*360}deg, transparent 0deg)`;
    button.querySelector('.skill-cooldown-ring circle').setAttribute('stroke-dashoffset',String(100*(1-fraction)));
    button.querySelector('.skill-countdown').textContent=cooling?String(Math.ceil(remaining)):'';
    button.querySelector('small').textContent=cooling?'':skill.id==='shield'?'3s':`×${skill.multiplier}`;
    button.setAttribute('aria-label',cooling?`${skill.name}, hồi chiêu ${Math.ceil(remaining)} giây`:skill.name);
   }
   messageTime=Math.max(0,messageTime-dt);floatTime=Math.max(0,floatTime-dt);if(messageTime===0)notice.hidden=true;if(floatTime===0)numbers.hidden=true;
  },
  dispose(){host.classList?.remove('survival-layout');panel.remove();daily.remove();boss.remove();notice.remove();numbers.remove();skills.remove();}
 };
}
