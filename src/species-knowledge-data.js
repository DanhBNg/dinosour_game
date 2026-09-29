// Initial, source-backed content layer. Illustration and identification are separate.
const nhm=(slug)=>({name:'Natural History Museum',url:`https://www.nhm.ac.uk/discover/${slug}`});
const noaa=(slug)=>({name:'NOAA Fisheries',url:`https://www.fisheries.noaa.gov/species/${slug}`});
const eggs={name:'American Museum of Natural History',url:'https://www.amnh.org/dinosaurs/dinosaur-eggs'};
const entry=(label,voice,note='',source)=>({label,voice,note,...(source?{source}:{})});
const eggGrowth=()=>entry('Trứng → con non → trưởng thành','Khủng long nở từ trứng rồi lớn lên. Tỷ lệ các bộ phận cũng thay đổi.','Mô tả chung về khủng long; chưa phục dựng tổ, số trứng hay thời gian lớn lên cho chi này.',eggs);
export const speciesKnowledge={
 stego:{name:'Stegosaurus',world:'dinosaurs',source:nhm('dino-directory/stegosaurus.html'),identity:'Hồ sơ ở cấp chi. Màu sắc và cảnh nền là minh họa phục dựng.',topics:{
  habitat:entry('Bãi bồi · cây xanh','Stegosaurus sống trên cạn. Những vùng có sông và bãi bồi từng là nhà của nó.','Bối cảnh Morrison cuối kỷ Jura; cảnh minh họa không phải một địa điểm hóa thạch.',{name:'National Park Service',url:'https://www.nps.gov/subjects/fossils/the-morrison-formation.htm'}),
  diet:entry('Ăn thực vật','Stegosaurus ăn thực vật, không săn động vật khác.'),
  footprints:entry('Đi bằng bốn chân','Bốn chân nâng đỡ cơ thể Stegosaurus. Đuôi có gai giúp nó tự vệ.','Không coi hình bàn chân model là mẫu dấu chân hóa thạch đã định danh.'),
  size:entry('Dài tới khoảng 9 m','Những Stegosaurus lớn có thể dài khoảng chín mét, tính cả đuôi.','Chiều dài tham khảo, không phải chiều cao; cá thể và loài khác nhau có kích thước khác nhau.'),
  growth:eggGrowth(),
  range:entry('Bắc Mỹ · kỷ Jura','Hóa thạch Stegosaurus được tìm thấy tại Hoa Kỳ. Nó sống trước Tê rex rất lâu.','Một vùng tìm thấy hóa thạch, không phải toàn bộ ranh giới phân bố.')
 }},
 trice:{name:'Triceratops',world:'dinosaurs',source:nhm('dino-directory/triceratops.html'),identity:'Hồ sơ ở cấp chi; không suy ra loài cụ thể từ model. Cảnh và màu da là minh họa.',topics:{
  habitat:entry('Sống trên cạn','Triceratops là khủng long trên cạn, sống vào cuối kỷ Phấn Trắng.','Không suy ra khí hậu hay loài cây cụ thể từ cảnh nền.'),
  diet:entry('Mỏ cắt lá cây','Triceratops dùng mỏ cắt thực vật và răng để xử lý thức ăn.'),
  footprints:entry('Bốn chân nâng đỡ','Triceratops bước đi bằng bốn chân. Hãy tìm hai chân trước và hai chân sau.'),
  size:entry('Dài khoảng 9 m','Triceratops có thể dài khoảng chín mét từ đầu đến chót đuôi.','Ước tính tham khảo, không phải chiều cao hoặc số đo của model.'),
  growth:eggGrowth(),
  range:entry('Bắc Mỹ · Phấn Trắng muộn','Hóa thạch Triceratops được tìm thấy ở Hoa Kỳ. Nó sống khoảng sáu mươi tám đến sáu mươi sáu triệu năm trước.')
 }},
 deino:{name:'Deinonychus',world:'dinosaurs',source:nhm('dino-directory/deinonychus.html'),identity:'Deinonychus antirrhopus. Model chưa thể hiện lớp lông có khả năng hiện diện theo suy luận từ họ hàng gần.',topics:{
  habitat:entry('Trên cạn · Phấn Trắng sớm','Deinonychus sống trên cạn ở Bắc Mỹ vào đầu kỷ Phấn Trắng.','Cảnh cây xanh là minh họa, không phải phục dựng chính xác một địa điểm.'),
  diet:entry('Ăn động vật','Deinonychus ăn thịt các động vật khác. Móng cong lớn ở chân giúp nó xử lý con mồi.','Vai trò chính xác của móng còn được nghiên cứu; không khẳng định săn theo bầy.'),
  footprints:entry('Hai chân · móng cong','Deinonychus đi bằng hai chân. Ngón thứ hai có móng lớn, thường được nhấc khỏi đất.','Không dùng dấu ba ngón của T-Rex làm dấu chân của Deinonychus.'),
  size:entry('Dài khoảng 3,4 m','Deinonychus dài khoảng ba mét bốn, tính cả chiếc đuôi dài.','Đây là chiều dài, không phải chiều cao.'),
  growth:eggGrowth(),
  range:entry('Bắc Mỹ · Hoa Kỳ','Các hóa thạch Deinonychus được tìm thấy ở Hoa Kỳ. Nó sống trước Tê rex hàng chục triệu năm.')
 }},
 ptero:{name:'Pterosaur',world:'dinosaurs',source:nhm('the-truth-about-pterosaurs.html'),identity:'Model chỉ xác định ở nhóm Pterosauria. Đây là bò sát bay, không phải khủng long; không gán số đo của Pteranodon cho model.',topics:{
  habitat:entry('Bầu trời · mặt đất','Bò sát bay có thể bay chủ động. Những loài khác nhau sống trong những môi trường khác nhau.'),
  diet:entry('Thức ăn tùy loài','Có bò sát bay ăn cá, có loài ăn côn trùng hoặc những động vật khác.','Chưa đủ dữ liệu để gán khẩu phần cụ thể cho model.'),
  footprints:entry('Cánh màng','Cánh của bò sát bay là một màng được nâng đỡ bởi ngón tay rất dài.','Mục này giới thiệu vận động, không gán dấu chân hóa thạch cho model.'),
  size:entry('Sải cánh tùy loài','Bò sát bay có loài nhỏ và có loài rất lớn. Sải cánh được đo từ đầu cánh này sang đầu cánh kia.','Chưa định danh loài nên chưa gán số đo.'),
  growth:entry('Nở từ trứng','Bò sát bay đẻ trứng. Con non lớn lên thành con trưởng thành.','Không khẳng định thời điểm tập bay cho model chưa rõ loài.',{name:'AMNH · Pterosaurs educator guide',url:'https://www.amnh.org/content/download/71573/1323008/file/pterosaurs-educators-guide.pdf'}),
  range:entry('Nhiều vùng trên thế giới','Hóa thạch bò sát bay được tìm thấy ở nhiều nơi trên thế giới.','Phạm vi của cả nhóm, không phải phạm vi của một loài.')
 }},
 mosa:{name:'Mosasaurus',world:'dinosaurs',source:nhm('what-is-a-mosasaur.html'),identity:'Mosasaurus là bò sát biển thuộc họ Mosasauridae, không phải khủng long. Asset chưa xác định đến loài.',topics:{
  habitat:entry('Biển · thở không khí','Mosasaurus sống trong biển nhưng thở bằng phổi, nên cần lên mặt nước lấy không khí.'),
  diet:entry('Săn động vật biển','Mosasaurus ăn những động vật biển khác. Hàm và răng giúp nó bắt con mồi.','Thức ăn thay đổi giữa các loài mosasaur; không dựng một khẩu phần cố định.'),
  movement:entry('Đuôi đẩy · vây lái','Đuôi góp phần tạo lực đẩy, còn những chiếc vây giúp điều hướng khi bơi.'),
  size:entry('Kích thước tùy loài','Mosasaurus có những loài rất lớn. Muốn chọn số đo đúng, cần biết loài và mẫu hóa thạch.','Các ước tính chiều dài có khác biệt; không áp một con số tối đa cho mọi model.'),
  growth:entry('Con non → trưởng thành','Bằng chứng ở họ mosasaur cho thấy chúng có thể sinh con ngay trong biển.','Suy luận ở cấp họ; không minh họa Mosasaurus lên bờ đẻ trứng.'),
  range:entry('Biển cổ · Maastricht','Mosasaurus nổi tiếng với hóa thạch được tìm thấy ở Maastricht, thuộc Hà Lan ngày nay.','Nơi tìm thấy hóa thạch, không phải nơi còn sinh sống.')
 }},
};
import {marineKnowledge} from './marine-knowledge-data.js';
Object.assign(speciesKnowledge,marineKnowledge);
export const knowledgeCheckedAt='2026-09-29';
