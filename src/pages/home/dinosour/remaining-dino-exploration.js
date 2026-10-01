const point=(box,label,voice,extra={})=>({box,label,voice,...extra});
const scene=(focus,alt,points,extra={})=>({focus,alt,points,...extra});
const source=(name,url)=>({name,url});
const amnh=source('American Museum of Natural History','https://www.amnh.org/exhibitions/permanent/vertebrate-origins/pterosaurs');
const mosasaur=source('Natural History Museum · Mosasaurs','https://www.nhm.ac.uk/discover/what-is-a-mosasaur.html');
export const remainingDinoExploration={
 deino:{
  habitat:scene(.49,'Deinonychus trong rừng ven sông',[
   point([3,10,16,45],'Rừng cây','Rừng cây trong ảnh là cảnh phục dựng môi trường trên cạn.'),
   point([27,14,34,66],'Deinonychus','Deinonychus sống ở Bắc Mỹ vào kỷ Phấn Trắng sớm.'),
   point([75,43,22,27],'Dòng nước','Hãy tìm dòng nước chảy bên cạnh khu rừng.')]),
  diet:scene(.61,'Deinonychus đuổi một con thằn lằn nhỏ',[
   point([7,18,53,49],'Kẻ săn mồi','Deinonychus ăn động vật. Cảnh đuổi mồi này là minh họa.'),
   point([72,43,22,25],'Con mồi nhỏ','Một con thằn lằn nhỏ đang chạy. Ta không biết toàn bộ khẩu phần của Deinonychus.')],{note:'Con mồi là ví dụ minh họa, không xác định loài hay khẳng định chiến thuật săn theo bầy.'}),
  footprints:scene(.58,'Dấu hai ngón và ngón mang móng cong nhấc khỏi mặt đất',[
   point([7,48,39,36],'Hai ngón chạm đất','Hãy đếm hai ngón chịu lực trong dấu chân minh họa này.'),
   point([57,22,25,52],'Móng cong nhấc lên','Ngón thứ hai mang móng lớn có thể nhấc khỏi đất khi bước đi.')],{source:source('Bureau of Land Management · Dromaeosaur tracks','https://www.blm.gov/sites/default/files/documents/files/Mill%20Canyon%20Dinosaur%20Tracksite.pdf'),note:'Dạng dấu chân dromaeosaur hai ngón; không phải mẫu dấu chân đã định danh riêng cho Deinonychus. Tư thế và nền đất ảnh hưởng dấu in.'}),
  size:scene(.45,'Deinonychus cạnh người lớn và xe đạp',[
   point([2,32,51,36],'Deinonychus','Deinonychus dài khoảng ba mét bốn, tính cả đuôi.',{measurement:'↔ ≈ 3,4 m'}),
   point([56,15,9,53],'Người','Người so sánh cao một mét bảy.',{measurement:'↕ 1,7 m'}),
   point([69,35,27,33],'Xe đạp','Xe đạp minh họa dài khoảng một mét tám.',{measurement:'↔ ≈ 1,8 m'})],{note:'Dài 3,4 m theo NHM; chiều cao người và chiều dài xe là các mốc giả định hiện đại. Ảnh so sánh minh họa, không phải phép đo hóa thạch.'}),
  growth:scene(.49,'Trứng, con mới nở, con non và Deinonychus trưởng thành',[
   point([2,53,11,13],'Trứng','Khủng long nở từ trứng. Đây là trứng phục dựng minh họa.'),
   point([18,48,16,23],'Mới nở','Con nhỏ có tỷ lệ đầu và thân khác con trưởng thành.'),
   point([38,37,25,35],'Đang lớn','Cơ thể và chiếc đuôi dài ra khi con non lớn lên.'),
   point([65,14,32,56],'Trưởng thành','Deinonychus trưởng thành có hai chân khỏe, đuôi dài và móng cong lớn.')],{note:'Trứng, lông và các giai đoạn là phục dựng; không khẳng định tuổi, kích thước trứng hay tốc độ lớn lên. Các giai đoạn không cùng tỷ lệ.'}),
  range:scene(.43,'Bắc Mỹ với điểm hóa thạch Deinonychus tại Montana',[
   point([32,17,12,18],'Montana','Những hóa thạch đầu tiên được nghiên cứu để đặt tên Deinonychus được tìm thấy ở miền nam Montana, Hoa Kỳ.',{portrait:true})],{note:'Bản đồ hiện đại định vị một địa điểm hóa thạch ở Montana, không phải toàn bộ phạm vi phân bố hay bản đồ Phấn Trắng.'})
 },
 ptero:{
  habitat:scene(.49,'Bò sát bay lượn trên vùng bờ biển',[
   point([3,32,16,37],'Vách đá ven biển','Đây là một môi trường ven biển minh họa. Không phải mọi bò sát bay đều sống ở đây.'),
   point([21,13,57,48],'Bò sát bay','Bò sát bay có khả năng bay chủ động. Chúng không phải chim hay khủng long.'),
   point([81,45,17,25],'Mặt biển','Một số loài tìm thức ăn gần mặt nước.')],{source:amnh}),
  diet:scene(.64,'Bò sát bay săn cá trên mặt nước',[
   point([15,18,48,42],'Bò sát bay ăn cá','Một số bò sát bay ăn cá. Các loài khác có thể ăn côn trùng hoặc thức ăn khác.'),
   point([64,44,8,19],'Cá','Hãy tìm con cá ở gần mỏ. Đây là ví dụ về một kiểu kiếm ăn.')],{note:'Ví dụ nhóm ăn cá, không gán khẩu phần này cho mọi pterosaur hoặc xác nhận danh tính model.',source:amnh}),
  footprints:scene(.5,'Cánh màng và ngón tay dài của bò sát bay',[
   point([5,10,32,25],'Màng cánh','Cánh là màng da, không phải một hàng lông bay như cánh chim.'),
   point([64,9,29,26],'Ngón tay nâng cánh','Ngón tay thứ tư kéo dài nâng đỡ phần ngoài của cánh.')],{source:amnh,note:'Mục vận động trình bày cấu tạo cánh thay cho dấu chân. Hình mô mềm là phục dựng.'}),
  size:scene(.49,'So sánh sải cánh Pteranodon, Dimorphodon và người',[
   point([2,16,68,60],'Pteranodon','Ví dụ Pteranodon có sải cánh tới khoảng sáu mét, đo từ đầu cánh này sang đầu cánh kia.',{measurement:'↔ cánh ≈ 6 m'}),
   point([70,40,7,36],'Người','Người dùng để so sánh cao một mét bảy.',{measurement:'↕ 1,7 m'}),
   point([78,43,20,23],'Dimorphodon','Ví dụ Dimorphodon có sải cánh khoảng một mét bốn.',{measurement:'↔ cánh ≈ 1,4 m'})],{source:source('AMNH · Pteranodon longiceps','https://www.amnh.org/explore/news-blogs/pteranodon-longiceps'),note:'Hai loài tham chiếu, không phải định danh model. Dimorphodon 1,4 m: AMNH, The Dimorphodon: Early Pterosaur (2014). Người là mốc hiện đại. Sải cánh khác chiều dài cơ thể; tỷ lệ ảnh mang tính minh họa.'}),
  growth:scene(.49,'Trứng và ba giai đoạn bò sát bay trên mặt đất',[
   point([4,51,9,18],'Trứng','Bò sát bay đẻ trứng.'),
   point([19,43,15,27],'Con nhỏ','Con non có đầu, mỏ và cánh đang phát triển.'),
   point([41,31,18,39],'Con đang lớn','Tỷ lệ các bộ phận thay đổi khi lớn lên.'),
   point([67,15,29,55],'Trưởng thành','Con trưởng thành có cánh màng phát triển.')],{note:'Hình các giai đoạn là minh họa ở cấp nhóm, không gán tuổi hay thời điểm bắt đầu bay; không cùng tỷ lệ.',source:source('AMNH · Pterosaurs educator guide','https://www.amnh.org/content/download/71573/1323008/file/pterosaurs-educators-guide.pdf')}),
  range:scene(.5,'Bản đồ thế giới với các vùng hóa thạch bò sát bay',[
   point([13.5,16,9,15],'Hoa Kỳ','Hóa thạch bò sát bay được tìm thấy ở Hoa Kỳ.',{portrait:true}),
   point([28,43,9,15],'Brazil','Brazil có nhiều địa điểm hóa thạch bò sát bay quan trọng.',{portrait:true}),
   point([42.5,10,9,15],'Đức','Các lớp đá ở Đức lưu giữ hóa thạch bò sát bay.',{portrait:true}),
   point([73,14.5,9,15],'Trung Quốc','Trung Quốc cũng có các địa điểm hóa thạch bò sát bay.',{portrait:true})],{source:source('AMNH · Pterosaur fossil localities','https://www.amnh.org/explore/news-blogs/pterosaur-fossils-rarity'),note:'Các vùng ví dụ của cả nhóm Pterosauria trên bản đồ hiện đại. Không phải phạm vi một loài, không phải các điểm GPS chính xác.'})
 },
 mosa:{
  habitat:scene(.57,'Mosasaurus dưới biển gần mặt nước',[
   point([22,33,54,33],'Bò sát biển','Mosasaurus sống trong biển.'),
   point([67,6,25,23],'Không khí phía trên','Mosasaurus thở bằng phổi và cần lên mặt nước lấy không khí.')],{source:mosasaur}),
  diet:scene(.62,'Mosasaurus đuổi đàn cá dưới biển',[
   point([5,20,60,47],'Mosasaurus','Hàm và răng giúp Mosasaurus bắt động vật biển.'),
   point([75,35,22,29],'Đàn cá','Đàn cá là ví dụ về con mồi. Khẩu phần có thể khác nhau giữa các loài.')],{source:mosasaur}),
  movement:scene(.59,'Đuôi và bốn vây của Mosasaurus khi bơi',[
   point([65,20,28,46],'Đuôi tạo lực đẩy','Đuôi quét sang hai bên để góp phần đẩy cơ thể về phía trước.'),
   point([25,38,22,30],'Vây điều hướng','Những chiếc vây giúp điều hướng trong nước.')],{source:mosasaur,note:'Vây đuôi phục dựng từ bằng chứng họ hàng mosasaur; hình ảnh không phải mô phỏng thủy động lực học.'}),
  size:scene(.5,'Mosasaurus so với người lặn và tàu nghiên cứu nhỏ',[
   point([5,15,90,34],'M. hoffmannii','Cảnh này chọn chiều dài mười hai mét làm ví dụ. Các ước tính cho loài này còn khác nhau.',{measurement:'↔ ví dụ 12 m'}),
   point([25,55,13,11],'Người lặn','Người so sánh dài một mét bảy, chưa tính chân vịt.',{measurement:'↔ 1,7 m'}),
   point([57,51,25,19],'Tàu nhỏ','Tàu nghiên cứu giả định dài bốn mét.',{measurement:'↔ 4 m'})],{source:mosasaur,note:'Ví dụ Mosasaurus hoffmannii ở mốc 12 m trong nhóm ước tính 11–12 m; các nghiên cứu khác cho kết quả lớn hơn. Không gán 12 m cho mọi loài hoặc định danh model. Người và tàu là đối chiếu hiện đại, ảnh không phải phép đo.'}),
  growth:scene(.5,'Mosasaur sơ sinh, con non và trưởng thành dưới nước',[
   point([1,40,19,15],'Sơ sinh','Bằng chứng ở họ mosasaur cho thấy con non có thể được sinh ra ngay trong biển.'),
   point([23,36,32,25],'Con non','Con non lớn dần trong môi trường biển.'),
   point([60,23,38,43],'Trưởng thành','Con trưởng thành có cơ thể thích nghi với việc bơi.')],{source:mosasaur,note:'Suy luận ở cấp họ Mosasauridae; không coi đây là hóa thạch sinh con trực tiếp của chi Mosasaurus. Không cùng tỷ lệ, không khẳng định chăm sóc con.'}),
  range:scene(.52,'Tây Âu với địa điểm Maastricht ở Hà Lan',[
   point([37,28,11,18],'Maastricht','Những hóa thạch Mosasaurus nổi tiếng được phát hiện gần Maastricht, thuộc Hà Lan ngày nay.',{portrait:true})],{source:mosasaur,note:'Điểm hóa thạch trên bản đồ hiện đại. Vùng đất này từng có môi trường biển; không có Mosasaurus còn sống tại đây.'})
 }
};
