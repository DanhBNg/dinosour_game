export const loggerheadConfig = {
 id:'loggerhead', name:'Rùa quản đồng', baseSpeed:6,
 progression:{maxHp:100,startingHp:80,baseAttack:10,attackPerLevel:2,expFactor:10},
 boss:{name:'Cá mập khổng lồ',hp:300,minLevel:2,spawnDelay:6,respawnDelay:65,rewardExp:50,speed:3.4,damage:8,attackRange:3.8,detectRange:18,leashRange:25,windup:1.1,attackCooldown:2.6},
 shelter:{radius:3.2,depthRange:2.2,healAmount:15,healInterval:2},
 skills:[
  {id:'ram',name:'Tấn công',icon:'⚔️',key:'5',cooldown:4,range:7,multiplier:2,stun:1.2,color:0x65dfff},
  {id:'shield',name:'Phòng thủ',icon:'🛡️',key:'6',cooldown:9,duration:3,color:0x74ffa5}
 ],
 lifeStages:[
  {id:'hatchling',name:'Rùa con',exp:0,scale:.7,speed:1,stamina:70,maxDepth:0},
  {id:'juvenile',name:'Rùa non',exp:100,scale:.85,speed:1.15,stamina:100,maxDepth:0},
  {id:'adult',name:'Trưởng thành',exp:260,scale:1,speed:1.3,stamina:130,maxDepth:0}
 ],
 zones:[{id:'coast',name:'Ven bờ',minStage:0},{id:'reef',name:'Rạn san hô',minStage:1,boundaryZ:-18}],
 preyTypes:[{id:'fish',icon:'🐟',color:0x62d7dc,exp:8,food:16,height:2,motionSpeed:.65,motionRadius:1.2},{id:'crab',icon:'🦀',color:0xe9774e,exp:10,food:22,height:1,motionSpeed:.4,motionRadius:.65},{id:'snail',icon:'🐚',color:0xc48a52,exp:6,food:12,height:1,motionSpeed:.15,motionRadius:.3}],
 missionPool:[
  {id:'crab',type:'eat',target:'crab',icon:'🦀',label:'Ăn 2 con cua',count:2,rewardExp:15,minStage:0},
  {id:'fish',type:'eat',target:'fish',icon:'🐟',label:'Ăn 3 con cá nhỏ',count:3,rewardExp:15,minStage:0},
  {id:'snail',type:'eat',target:'snail',icon:'🐚',label:'Ăn 3 con ốc nhỏ',count:3,rewardExp:15,minStage:0},
  {id:'boss',type:'defeat',target:'shark',icon:'🦈',label:'Đánh boss 1 lần',count:1,rewardExp:30,minStage:0},
  {id:'recover',type:'heal',target:'cave',icon:'🏠',label:'Ẩn náu hồi máu',count:1,rewardExp:15,minStage:0}
 ],
 events:[{id:'swarm',minStage:0,duration:22,label:'🐟 Đàn cá nhỏ xuất hiện gần bạn!'},{id:'current',minStage:1,duration:14,label:'🌊 Dòng chảy mạnh — bơi qua vùng sáng!'}],
 landmarks:[
  {id:'feeding',icon:'🐚',name:'Nơi kiếm ăn',position:[0,2,-9],minStage:0},
  {id:'cave',icon:'🏠',name:'Hang an toàn',position:[-6,2,-14],minStage:0},
  {id:'reef',icon:'🪸',name:'Rạn san hô',position:[0,2,-28],minStage:1},
  {id:'wet',icon:'💧',name:'Cát quá gần nước',position:[-6,6,8],minStage:2,nest:false},
  {id:'rocky',icon:'🪨',name:'Quá nhiều đá',position:[6,6,8],minStage:2,nest:false},
  {id:'beach',icon:'🏖️',name:'Cát cao và khô',position:[0,6,12],minStage:2,nest:true}
 ],
 lifeMission:{minStage:2,landmark:'beach',digCount:3,rewardExp:60,badge:'Người bảo vệ đại dương'},dailyBonus:30
};
