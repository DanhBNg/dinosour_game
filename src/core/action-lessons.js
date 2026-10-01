// Each runtime action gets its own lesson; no clip is silently omitted.
const vocabulary=[
 [/^boost$/i,'Speed up','Tăng tốc','swims faster','bơi nhanh hơn'],
 [/^dive$/i,'Dive','Lặn','dives deeper','lặn xuống sâu hơn'],
 [/^rise$/i,'Swim up','Nổi lên','swims upward','bơi lên cao hơn'],
 [/^eat$/i,'Eat','Ăn','reaches for food','vươn đầu lấy thức ăn'],
 [/t.?pose/i,'Stand still','Đứng yên','stands still','đứng yên'],
 [/soar/i,'Soar','Sải cánh','soars above the ground','sải cánh trên cao'],
 [/roarSweep/i,'Roar and whip','Gầm và quét đuôi','roars and whips its tail','gầm và quét đuôi'],
 [/hunt/i,'Chase','Săn đuổi','chases another dinosaur','đuổi theo một con khủng long khác'],
 [/breachDive/i,'Dive','Lặn','dives into the water','lặn xuống nước'],
 [/bankTurn|turn/i,'Turn','Quay mình','turns its body','quay mình'],
 [/strike|lunge/i,'Lunge','Lao tới','lunges forward','lao về phía trước'],
 [/attack/i,'Attack','Tấn công','attacks in this animation','tấn công trong hoạt cảnh này'],
 [/glide/i,'Glide','Lượn','glides through the air','lượn trong không trung'],
 [/fly|flight|flap/i,'Fly','Bay','flies through the air','bay trong không trung'],
 [/sit/i,'Sit','Ngồi','sits on the ground','ngồi xuống đất'],
 [/roar|growl/i,'Roar','Gầm','roars loudly','gầm lớn'],
 [/tail|whip|swing/i,'Swing','Vung đuôi','swings its tail','vung đuôi'],
 [/jump|pounce/i,'Jump','Nhảy','jumps forward','nhảy về phía trước'],
 [/death|die|dead|fall/i,'Fall','Ngã','falls to the ground','ngã xuống đất'],
 [/sniff/i,'Sniff','Đánh hơi','sniffs the air','đánh hơi trong không khí'],
 [/bite/i,'Bite','Cắn','bites its food','cắn thức ăn'],
 [/sprint|run/i,'Run','Chạy','runs across the ground','chạy trên mặt đất'],
 [/walk|stalk/i,'Walk','Đi bộ','walks slowly','đi chậm'],
 [/swim/i,'Swim','Bơi','swims through the water','bơi trong nước'],
 [/dig/i,'Dig','Đào','digs in the ground','đào đất'],
 [/eat|feed/i,'Eat','Ăn','eats its food','ăn thức ăn'],
 [/sleep/i,'Sleep','Ngủ','sleeps quietly','ngủ yên'],
 [/left/i,'Look left','Nhìn trái','looks to the left','nhìn sang trái'],
 [/right/i,'Look right','Nhìn phải','looks to the right','nhìn sang phải'],
 [/idle|rest|observe|look/i,'Look around','Quan sát','looks around','nhìn xung quanh'],
 [/shake/i,'Shake','Lắc mình','shakes its body','lắc mình'],
];
export function buildActionLessons(name,definitions,existing=[]){
 const lessons=Object.entries(definitions).map(([key,spec])=>{
  const known=existing.find(l=>l.clip===spec[0]||l.clip==='@'+key||(l.clip==='@first'&&key===Object.keys(definitions)[0]));
  const special=name==='Deinonychus'?{clip0:['Look around','Quan sát','looks around','nhìn xung quanh'],clip1:['Stalk','Đi rình','stalks quietly','đi rình nhẹ nhàng']}[key]:null;
  const match=vocabulary.find(([pattern])=>pattern.test(key+' '+spec[0]+' '+spec[1]));
  const [,word,meaning,verb,vi]=special?[null,...special]:match||[null,'Move','Chuyển động','moves its body','chuyển động cơ thể'];
  return {...(known||{word,meaning,example:`The ${name} ${verb}.`,translation:`${name} ${vi}.`}),clip:key,sourceLabel:spec[1],actionKey:key};
 });
 const counts={};for(const l of lessons)counts[l.word]=(counts[l.word]||0)+1;
 const seen={};for(const l of lessons){seen[l.word]=(seen[l.word]||0)+1;l.actionLabel=counts[l.word]>1?`${l.word} · variation ${seen[l.word]}`:l.word;}
 return lessons;
}
