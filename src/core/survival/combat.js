const range=(first,second)=>Math.hypot(first.x-second.x,first.y-second.y,first.z-second.z);
const clamp=value=>Math.max(-45,Math.min(45,value));

export function createSurvivalCombat(config,progress){
 const settings=config.boss,shelter=config.landmarks.find(mark=>mark.id==='cave');
 const home={x:shelter.position[0],y:shelter.position[1],z:shelter.position[2]};
 const position={x:0,y:2,z:-28},cooldowns=Object.fromEntries(config.skills.map(skill=>[skill.id,0]));
 const events=[];
 let phase='dormant',hp=settings.hp,timer=settings.spawnDelay,shield=0,hitCooldown=0,healTimer=0,safe=false,attackTarget={...position};
 function emit(type,data={}){events.push({type,...data});}
 function sheltered(player){return Math.hypot(player.x-home.x,player.z-home.z)<=config.shelter.radius&&Math.abs(player.y-home.y)<=config.shelter.depthRange;}
 function moveToward(target,dt,speed){const distance=range(position,target);if(distance<.01)return;const step=Math.min(1,speed*dt/distance);position.x+=(target.x-position.x)*step;position.y+=(target.y-position.y)*step;position.z+=(target.z-position.z)*step;}
 function defeated(){phase='defeated';timer=settings.respawnDelay;const exp=progress.record('defeat','shark');emit('victory',{exp});}
 function recover(player){
  Object.assign(player,home);progress.heal(35);shield=4;phase='retreat';timer=8;healTimer=0;safe=true;emit('recover');
 }
 return {
  get state(){return {phase,hp,maxHp:settings.hp,position:{...position},shield,cooldowns:{...cooldowns},safe,warning:phase==='windup',active:!['dormant','defeated'].includes(phase),combat:['chase','windup','stunned'].includes(phase)};},
  drainEvents(){return events.splice(0);},
  canUse(id,player,busy=false){
   const skill=config.skills.find(item=>item.id===id);
   if(!skill||busy||progress.state.hp<=0||cooldowns[id]>0||!['chase','windup','stunned'].includes(phase)||sheltered(player))return false;
   return id==='shield'||range(position,player)<=skill.range;
  },
  use(id,player,busy=false){
   if(!this.canUse(id,player,busy))return false;
   const skill=config.skills.find(item=>item.id===id);cooldowns[id]=skill.cooldown;
   if(id==='shield'){shield=skill.duration;emit('shield');return true;}
   const damage=Math.min(hp,Math.round(progress.state.attack*skill.multiplier));hp-=damage;
   emit('hit',{id,damage});
   if(hp<=0)defeated();else{phase='stunned';timer=skill.stun;}
   return true;
  },
  update(dt,player){
   shield=Math.max(0,shield-dt);hitCooldown=Math.max(0,hitCooldown-dt);
   for(const id of Object.keys(cooldowns))cooldowns[id]=Math.max(0,cooldowns[id]-dt);
   const wasSafe=safe;safe=sheltered(player);
   if(progress.state.hp<=0){recover(player);return;}
   if(safe){
    if(!wasSafe){emit('shelter');progress.discover('cave');}
    healTimer+=dt;
    if(healTimer>=config.shelter.healInterval){healTimer=0;const amount=progress.heal(config.shelter.healAmount);if(amount){const exp=progress.record('heal','cave');emit('heal',{amount,exp});}}
    if(['chase','windup','stunned','warning'].includes(phase)){phase='retreat';timer=5;emit('escape');}
   }else healTimer=0;
   if(phase==='dormant'||phase==='defeated'){
    if(progress.state.level<settings.minLevel)return;
    timer-=dt;if(timer>0||safe)return;
    position.x=clamp(player.x+10);position.y=player.y;position.z=clamp(player.z-8);hp=settings.hp;phase='warning';timer=2.5;emit('spawn');return;
   }
   timer=Math.max(0,timer-dt);
   if(phase==='warning'){if(timer===0)phase='chase';return;}
   if(phase==='retreat'){
    moveToward({x:home.x+14,y:2,z:home.z-14},dt,settings.speed);
    if(timer===0&&!safe&&range(position,player)<settings.detectRange)phase='chase';
    return;
   }
   if(phase==='stunned'){if(timer===0)phase='chase';return;}
   if(phase==='windup'){
    if(timer===0){
     if(!safe&&range(position,player)<=settings.attackRange+1&&range(player,attackTarget)<3){
      if(shield>0)emit('blocked');else{const damage=progress.damage(settings.damage);emit('damage',{damage});if(progress.state.hp<=0){recover(player);return;}}
     }else emit('dodge');
     hitCooldown=settings.attackCooldown;phase='chase';
    }
    return;
   }
   if(phase==='chase'){
    if(range(position,player)>settings.leashRange){phase='retreat';timer=4;return;}
    if(range(position,player)>settings.attackRange)moveToward(player,dt,settings.speed);
    else if(hitCooldown===0){phase='windup';timer=settings.windup;attackTarget={...player};emit('warning');}
   }
  }
 };
}
