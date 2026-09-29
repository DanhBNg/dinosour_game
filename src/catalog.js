import {SPECIES} from './creatures/species-data.js';
export const ids=['trex','stego','trice','ptero','mosa','deino','brachio'];
const lesson=(word,meaning,example,translation,clip)=>({word,meaning,example,translation,clip});
export const catalog={
 brachio:{name:'Brachiosaurus',region:'Rừng cổ cao',pos:[82,40],intro:'original-0',rest:'original-0',lessons:[lesson('Move','Chuyển động','The Brachiosaurus moves.','Brachiosaurus chuyển động.','original-0')]},
 trex:{name:'T-Rex',region:'Thung lũng cổ đại',pos:[32,43],intro:'ROAR',rest:'idle investigate loop',lessons:[lesson('Roar','Gầm','The T-Rex roars loudly.','T-Rex gầm lớn.','ROAR'),lesson('Walk','Đi bộ','The T-Rex walks through the forest.','T-Rex đi qua khu rừng.','walk loop'),lesson('Run','Chạy','The T-Rex runs on two legs.','T-Rex chạy bằng hai chân.','sprint loop'),lesson('Bite','Cắn','The T-Rex bites its food.','T-Rex cắn thức ăn.','chase bite')]},
 stego:{name:'Stegosaurus',region:'Rừng dương xỉ',pos:[20,68],intro:'original-3',rest:'original-7',lessons:[lesson('Walk','Đi bộ','The Stegosaurus walks slowly.','Stegosaurus đi chậm.','original-1'),lesson('Run','Chạy','The Stegosaurus runs across the plain.','Stegosaurus chạy qua đồng bằng.','original-2'),lesson('Shake','Lắc','The Stegosaurus shakes its body.','Stegosaurus lắc mình.','original-3')]},
 trice:{name:'Triceratops',region:'Đồng cỏ phía đông',pos:[73,65],intro:'original-1',rest:'original-2',lessons:[lesson('Walk','Đi bộ','The Triceratops walks on four legs.','Triceratops đi bằng bốn chân.','original-9'),lesson('Run','Chạy','The Triceratops runs across the grass.','Triceratops chạy qua bãi cỏ.','original-0'),lesson('Dig','Đào','The Triceratops digs in the ground.','Triceratops đào đất.','original-1')]},
 ptero:{name:'Pterosaur',region:'Đỉnh núi gió',pos:[66,26],intro:null,rest:null,lessons:[lesson('Fly','Bay','The pterosaur flies above the trees.','Bò sát bay bay phía trên cây.','@first'),lesson('Glide','Lượn','The pterosaur glides through the air.','Bò sát bay lượn trong không trung.','@glide')]},
 mosa:{name:'Mosasaurus',region:'Vịnh xanh',pos:[52,66],intro:'original-0',rest:'original-0',lessons:[lesson('Swim','Bơi','The Mosasaurus swims in the sea.','Mosasaurus bơi trong biển.','original-0'),lesson('Turn','Quay','The Mosasaurus turns in the water.','Mosasaurus quay mình trong nước.','@bankTurn')]},
 deino:{name:'Deinonychus',region:'Lối mòn ven suối',pos:[44,25],intro:'original-6',rest:'original-0',lessons:[lesson('Walk','Đi bộ','The Deinonychus walks quietly.','Deinonychus đi nhẹ nhàng.','original-3'),lesson('Run','Chạy','The Deinonychus runs quickly.','Deinonychus chạy nhanh.','original-4'),lesson('Jump','Nhảy','The Deinonychus jumps forward.','Deinonychus nhảy về phía trước.','original-2')]}
};
catalog.trex.lessons.push(lesson('Look','Nhìn','The T-Rex looks to the left.','T-Rex nhìn sang trái.','look left'));
catalog.stego.lessons.push(lesson('Swing','Vung','The Stegosaurus swings its tail.','Stegosaurus vung đuôi.','original-8'));
catalog.trice.lessons.push(lesson('Charge','Lao tới','The Triceratops charges forward.','Triceratops lao về phía trước.','original-8'));
catalog.ptero.lessons.push(lesson('Sit','Ngồi','The pterosaur sits on the ground.','Bò sát bay ngồi trên mặt đất.','@pteranodonSit'),lesson('Roar','Gầm','The pterosaur roars in this animation.','Bò sát bay gầm trong hoạt cảnh này.','@pteranodonRoar'));
catalog.mosa.lessons.push(lesson('Lunge','Lao tới','The Mosasaurus lunges forward.','Mosasaurus lao về phía trước.','@strike'));
catalog.deino.lessons.push(lesson('Look','Nhìn','The Deinonychus looks around.','Deinonychus nhìn xung quanh.','original-6'));
for(const id of ids)catalog[id].info=SPECIES[id];
export function matchesWord(text,word){const normalize=s=>s.toLowerCase().replace(/[^a-z\s]/g,' ').replace(/\s+/g,' ').trim();return (' '+normalize(text)+' ').includes(' '+normalize(word)+' ');}
