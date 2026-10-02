export function localDay(date=new Date()) {
 return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}

export function levelStats(exp,config){
 const level=Math.max(1,Math.floor(Math.sqrt(exp/config.progression.expFactor+1)));
 const base=config.progression.expFactor*(level*level-1);
 return {level,levelExp:exp-base,nextLevelExp:config.progression.expFactor*(2*level+1),attack:config.progression.baseAttack+(level-1)*config.progression.attackPerLevel,maxHp:config.progression.maxHp};
}

export function createSurvivalProgress(config,{storage,now=()=>new Date(),random=Math.random}={}) {
 const key=`animal-survival-v1:${config.id}`;
 let saved;
 try{saved=JSON.parse(storage?.getItem(key)||'null');}catch{}
 const valid=saved?.version===1||saved?.version===2;
 const count=value=>Number.isSafeInteger(value)&&value>=0?value:0;
 const state={version:2,exp:valid?count(saved.exp):0,eaten:valid?count(saved.eaten):0,eatenByType:{},hp:config.progression.startingHp,bossWins:valid?count(saved.bossWins):0,day:'',missions:[],bonus:false,discoveries:[],dig:0,complete:false};
 state.eatenByType=Object.fromEntries(config.preyTypes.map(prey=>[prey.id,valid?count(saved.eatenByType?.[prey.id]):0]));
 if(valid){
  if(Number.isFinite(saved.hp))state.hp=Math.max(0,Math.min(config.progression.maxHp,saved.hp));
  state.discoveries=config.landmarks.filter(mark=>Array.isArray(saved.discoveries)&&saved.discoveries.includes(mark.id)).map(mark=>mark.id);
  state.dig=Math.min(config.lifeMission.digCount,count(saved.dig));state.complete=saved.complete===true;
 }
 const stageIndex=()=>config.lifeStages.reduce((index,stage,next)=>state.exp>=stage.exp?next:index,0);
 let storageFailed=!storage;
 function save(){try{if(!storage){storageFailed=true;return;}storage.setItem(key,JSON.stringify(state));storageFailed=false;}catch{storageFailed=true;}}
 function refreshDay(){
  const day=localDay(now());if(state.day===day)return;
  state.day=day;state.bonus=false;
  const food=config.missionPool.filter(mission=>mission.type==='eat');
  const selected=food[Math.min(food.length-1,Math.floor(random()*food.length))];
  state.missions=[selected,...config.missionPool.filter(mission=>mission.type!=='eat')].slice(0,3).map(mission=>({id:mission.id,count:0}));save();
 }
 if(valid&&saved.version===2&&saved.day===localDay(now())&&Array.isArray(saved.missions)&&saved.missions.length===3&&new Set(saved.missions.map(mission=>mission.id)).size===3&&saved.missions.every(mission=>config.missionPool.some(def=>def.id===mission.id)&&Number.isInteger(mission.count)&&mission.count>=0)){
  state.day=saved.day;state.bonus=saved.bonus===true;
  state.missions=saved.missions.map(mission=>({id:mission.id,count:Math.min(mission.count,config.missionPool.find(def=>def.id===mission.id).count)}));
 }
 refreshDay();
 function reward(amount){if(Number.isFinite(amount)&&amount>0)state.exp=Math.min(Number.MAX_SAFE_INTEGER,state.exp+Math.floor(amount));save();}
 function record(type,target){
  refreshDay();let earned=0;
  const prey=config.preyTypes.find(item=>item.id===target);
  if(type==='eat'&&prey){state.eaten++;state.eatenByType[target]++;earned+=prey.exp;}
  if(type==='defeat'&&target==='shark'){state.bossWins++;earned+=config.boss.rewardExp;}
  for(const mission of state.missions){
   const def=config.missionPool.find(item=>item.id===mission.id);
   if(def.type!==type||def.target!==target||mission.count>=def.count)continue;
   mission.count++;if(mission.count===def.count)earned+=def.rewardExp;
  }
  if(!state.bonus&&state.missions.every(mission=>mission.count===config.missionPool.find(def=>def.id===mission.id).count)){state.bonus=true;earned+=config.dailyBonus;}
  reward(earned);return earned;
 }
 return {
  get state(){return {...state,...levelStats(state.exp,config),eatenByType:{...state.eatenByType},missions:state.missions.map(mission=>({...config.missionPool.find(def=>def.id===mission.id),progress:mission.count})),discoveries:[...state.discoveries],stageIndex:stageIndex(),stage:config.lifeStages[stageIndex()],storageFailed};},
  refreshDay,save,record,reward,
  damage(amount){if(!Number.isFinite(amount)||amount<=0)return 0;const before=state.hp;state.hp=Math.max(0,state.hp-amount);save();return before-state.hp;},
  heal(amount){if(!Number.isFinite(amount)||amount<=0)return 0;const before=state.hp;state.hp=Math.min(config.progression.maxHp,state.hp+amount);save();return state.hp-before;},
  discover(id){if(!config.landmarks.some(mark=>mark.id===id&&mark.minStage<=stageIndex()))return false;const first=!state.discoveries.includes(id);if(first){state.discoveries.push(id);reward(10);}return first;},
  dig(){if(stageIndex()<config.lifeMission.minStage||state.complete||!state.discoveries.includes(config.lifeMission.landmark))return false;state.dig=Math.min(config.lifeMission.digCount,state.dig+1);save();return true;},
  layEggs(){if(stageIndex()<config.lifeMission.minStage||state.dig<config.lifeMission.digCount||state.complete)return false;state.complete=true;reward(config.lifeMission.rewardExp);return true;}
 };
}
