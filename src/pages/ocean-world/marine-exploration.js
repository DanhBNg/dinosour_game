// Hotspots use percentages of each dedicated illustration, never viewport coordinates.
const point=(box,label,voice,measurement)=>({box,label,voice,...(measurement?{measurement}:{})});
const scene=(alt,points,extra={})=>({focus:.5,alt,points,...extra});
const map=(alt,points,note)=>scene(alt,points.map(p=>({...p,portrait:true})),{note});
const growthNote='Các giai đoạn được phóng lớn riêng để dễ quan sát, không cùng tỷ lệ và không biểu thị tuổi chính xác.';
const mapNote='Bản đồ minh họa định hướng, không phải ranh giới phân bố chính xác. Chạm hình con vật để nghe về vùng biển.';
export const marineExploration={
 seal:{
  habitat:scene('Hải cẩu cảng nằm nghỉ trên đá ven biển',[
   point([24,20,44,47],'Hải cẩu nghỉ trên bờ','Hải cẩu cảng lên bờ hoặc băng để nghỉ. Nó vẫn kiếm ăn ở dưới nước.'),
   point([72,32,23,30],'Biển ven bờ','Vùng nước ven bờ là nơi hải cẩu cảng tìm thức ăn.')]),
  diet:scene('Hải cẩu bơi đuổi cá trong nước',[
   point([12,20,49,44],'Hải cẩu săn mồi','Hải cẩu bơi và lặn để tìm thức ăn.'),
   point([73,30,22,33],'Đàn cá','Cá là một phần thức ăn của hải cẩu cảng. Nó cũng ăn một số động vật không xương sống.')]),
  movement:scene('Hải cẩu bơi bằng cơ thể và chân bơi phía sau',[
   point([70,25,23,38],'Chân bơi phía sau','Hải cẩu thật dùng phần sau cơ thể và hai chân bơi sau để đẩy mình trong nước.'),
   point([35,38,22,29],'Chân bơi phía trước','Chân bơi phía trước giúp hải cẩu điều chỉnh hướng.'),
   point([10,5,25,17],'Mặt nước','Hải cẩu thở bằng phổi. Nó phải trở lên mặt nước để lấy không khí.')]),
  size:scene('Hải cẩu và người nhìn ngang để so sánh chiều dài với chiều cao',[
   point([38,44,43,28],'Hải cẩu', 'Hải cẩu minh họa dài một mét tám, đo từ đầu đến cuối thân. Đây là một ví dụ, không phải kích thước mọi hải cẩu.','↔ ví dụ 1,8 m'),
   point([16,7,12,61],'Người','Người đối chiếu cao một mét bảy. Ta đang so chiều dài của hải cẩu với chiều cao của người.','↕ 1,7 m')],{voice:'Hãy so chiều dài hải cẩu minh họa một mét tám với người cao một mét bảy.',note:''}),
  growth:scene('Hải cẩu con, con đang lớn và con trưởng thành',[
   point([9,41,21,30],'Hải cẩu con','Hải cẩu sinh con. Con nhỏ bú sữa mẹ.'),
   point([39,32,21,39],'Đang lớn','Hải cẩu con lớn dần và học tìm thức ăn.'),
   point([68,19,28,53],'Trưởng thành','Hải cẩu trưởng thành tiếp tục ra biển kiếm ăn và lên bờ nghỉ.')],{note:growthNote}),
  range:map('Vùng ven biển phía bắc Đại Tây Dương và Thái Bình Dương',[
   point([14,18,13,22],'Bắc Thái Bình Dương','Hải cẩu cảng sống ở nhiều vùng ven bờ phía bắc Thái Bình Dương.'),
   point([40,16,13,22],'Bắc Đại Tây Dương','Hải cẩu cảng cũng sống dọc các bờ biển phía bắc Đại Tây Dương.')],mapNote)
 },
 squid:{
  habitat:scene('Mực bobtail ẩn trong cát dưới biển',[
   point([23,28,24,36],'Mực trong cát','Mực bobtail Hawaii thường vùi mình trong cát ban ngày. Hai mắt có thể vẫn lộ ra.'),
   point([70,45,23,25],'Nền cát','Cát ở vùng biển nông là chỗ ẩn của loài mực nhỏ này.')]),
  diet:scene('Mực bobtail với con tôm nhỏ dưới nước',[
   point([14,20,49,48],'Mực kiếm ăn','Ban đêm mực bobtail Hawaii ra ngoài tìm mồi.'),
   point([73,34,20,30],'Tôm nhỏ','Các giáp xác nhỏ, như tôm, là thức ăn của mực bobtail Hawaii.')]),
  movement:scene('Mực bobtail dùng vây và dòng nước để di chuyển',[
   point([24,24,22,36],'Vây nhỏ','Hai vây nhỏ giúp mực điều chỉnh chuyển động trong nước.'),
   point([53,35,26,32],'Dòng nước đẩy','Mực có thể đẩy nước qua phễu để tạo lực di chuyển.')],{note:'Minh họa cơ chế vận động của nhóm mực; không thể hiện tốc độ.',source:{name:'Monterey Bay Aquarium · Cephalopods',url:'https://www.montereybayaquarium.org/animals-the-ocean/animals-a-to-z/cephalopods'}}),
  size:scene('Mực bobtail nhỏ bên thước minh họa',[
   point([15,23,28,39],'Thân áo','Thân áo của mực bobtail Hawaii dài tới khoảng ba phẩy năm xen ti mét. Không cộng phần tay vào số đo này.','↔ thân áo ≤ 3,5 cm'),
   point([46,51,35,21],'Thước','Hình đã phóng lớn. Các vạch thước là minh họa, không dùng để đo trực tiếp trên màn hình.')]),
  growth:scene('Trứng mềm, mực mới nở và mực trưởng thành',[
   point([7,37,20,34],'Trứng','Trứng mực nằm trong các bao trứng mềm dưới biển, không giống vỏ trứng chim.'),
   point([39,35,20,35],'Mực mới nở','Mực con nở ra rất nhỏ.'),
   point([68,21,28,50],'Mực trưởng thành','Mực con lớn lên thành mực trưởng thành.')],{note:growthNote}),
  range:map('Chuỗi đảo Hawaii giữa Thái Bình Dương',[
   point([39,27,14,22],'Hawaii','Mực bobtail Hawaii sống ở vùng nước nông ven các đảo Hawaii. Đây là loài tham chiếu cho model bobtail.')],mapNote)
 },
 tuna:{
  habitat:{...scene('Cá ngừ vây vàng bơi gần mặt đại dương',[
   point([17,23,59,46],'Cá ngừ','Cá ngừ vây vàng sống trong các đại dương ấm, thường ở tầng gần mặt.'),
   point([79,25,18,30],'Đàn cá','Cá ngừ có thể bơi thành đàn ở vùng biển khơi.')]),video:'habitat.mp4'},
  diet:{...scene('Cá ngừ đuổi theo đàn cá nhỏ',[
   point([7,22,57,44],'Cá ngừ săn mồi','Cá ngừ vây vàng ăn cá, mực và giáp xác.'),
   point([74,27,23,40],'Cá nhỏ','Đàn cá nhỏ trong hình là một ví dụ thức ăn.')]),video:'diet.mp4'},
  movement:{...scene('Đuôi hình lưỡi liềm của cá ngừ tạo lực bơi',[
   point([71,23,22,42],'Đuôi','Cá ngừ quẫy đuôi sang hai bên để đẩy mình về phía trước.'),
   point([24,25,44,35],'Thân thuôn','Thân thuôn giúp cá đi qua nước. Cá ngừ vây vàng có thể di chuyển rất xa.')]),video:'motion.mp4'},
  size:{...scene('Cá ngừ và người bơi nằm ngang cùng mặt phẳng',[],{voice:'Cá ngừ vây vàng dài 1 mét rưỡi, dài gần bằng 1 người trưởng thành.',note:''}),video:'size.mp4'},
   growth:{...scene('Trứng trong nước, cá non và cá ngừ trưởng thành',[
   point([8,33,19,34],'Trứng trong nước','Cá ngừ vây vàng đẻ trứng trong nước biển.'),
   point([37,32,21,36],'Cá mới nở','Cá mới nở rất nhỏ, hình dáng chưa giống cá trưởng thành.'),
   point([65,25,31,44],'Cá trưởng thành','Cá lớn lên và phát triển thân thuôn cùng chiếc đuôi khỏe.')],{note:growthNote}),video:'growth.mp4'},
  range:map('Các vùng đại dương ấm trên bản đồ thế giới',[
   point([3,35,13,22],'Thái Bình Dương','Cá ngừ vây vàng sống trong vùng nhiệt đới và cận nhiệt đới Thái Bình Dương.'),
   point([34,36,13,22],'Đại Tây Dương','Loài này cũng có ở Đại Tây Dương ấm.'),
   point([66,40,13,22],'Ấn Độ Dương','Ấn Độ Dương cũng là nơi sống của cá ngừ vây vàng.')],mapNote)
 },
 slug:{
  habitat:scene('Sên biển xanh cam bò trên nền đá ở rạn',[
   point([24,25,47,46],'Sên biển','Chromodoris annae sống trên nền đá và rạn dưới biển.'),
   point([77,36,19,32],'Nền rạn','Đá và các sinh vật bám tạo nên môi trường của sên biển.')]),
  diet:scene('Sên biển ăn bọt biển bám trên đá',[
   point([11,39,22,30],'Bọt biển','Bọt biển là thức ăn của Chromodoris annae. Bọt biển là động vật, không phải cây.'),
   point([34,24,43,43],'Sên biển đang ăn','Sên biển dùng miệng ở phía đầu để lấy thức ăn từ bọt biển.')]),
  movement:scene('Phần chân mềm của sên biển tiếp xúc nền đá',[
   point([20,51,61,19],'Chân bụng','Phần chân mềm ở mặt dưới giúp sên biển bò trên nền đá.'),
   point([18,24,29,24],'Phía đầu','Hai phần nhô lên trên đầu giúp sên biển cảm nhận môi trường, không phải chân.')]),
  size:scene('Sên biển được phóng lớn cạnh thước minh họa',[
   point([24,24,47,39],'Cơ thể nhỏ','Con sên biển nhỏ này đã được phóng lớn để nhìn rõ màu và hình dáng.','Ảnh phóng lớn'),
   point([21,63,58,12],'Quan sát kích thước','Muốn biết chiều dài phải đo một mẫu cụ thể. Chưa có số đo xác nhận cho model này.')],{note:'Thước minh họa không có giá trị hiệu chuẩn. Không suy ra chiều dài tối đa từ tỷ lệ tranh.'}),
  growth:scene('Dải trứng xoắn của sên biển và con trưởng thành',[
   point([11,32,29,39],'Dải trứng','Nhiều sên biển đẻ trứng thành dải cuộn trên nền đá. Đây là minh họa của nhóm.'),
   point([58,24,31,45],'Sên biển trưởng thành','Đây là sên biển trưởng thành. Ta chưa trình bày toàn bộ giai đoạn ấu trùng của loài này.')],{note:'Dải trứng minh họa đặc điểm thường gặp ở sên biển; không khẳng định hình dạng trứng riêng của Chromodoris annae hoặc toàn bộ vòng đời.'}),
  range:map('Vùng biển nhiệt đới phía tây Thái Bình Dương',[
   point([39,20,13,22],'Philippines','Chromodoris annae được ghi nhận tại vùng biển Philippines.'),
   point([53,43,13,22],'Tây Thái Bình Dương','Các ghi nhận khác thuộc vùng nhiệt đới phía tây Thái Bình Dương.')],mapNote)
 },
 shark:{
  habitat:scene('Cá mập trắng bơi ở biển ven bờ',[
   point([18,23,61,45],'Cá mập trắng','Cá mập trắng sống ở biển ôn đới và cận nhiệt đới.'),
   point([4,25,13,43],'Bờ biển','Nó có thể ở ven bờ hoặc đi xa ngoài khơi.')]),
  diet:scene('Cá mập trắng đuổi theo cá trong biển',[
   point([7,22,59,46],'Cá mập đang săn','Cá mập trắng ăn nhiều động vật biển. Khẩu phần thay đổi theo tuổi và vùng sống.'),
   point([74,32,21,31],'Cá mồi','Cá là một phần thức ăn. Những cá mập trắng lớn cũng có thể săn hải cẩu.')]),
  movement:scene('Cá mập trắng quẫy đuôi khi bơi',[
   point([74,18,21,48],'Đuôi','Đuôi quẫy sang hai bên để đẩy cá mập đi.'),
   point([37,40,24,28],'Vây ngực','Vây ngực giúp điều chỉnh hướng và giữ tư thế trong nước.'),
   point([23,32,13,25],'Mang','Cá mập lấy ô xi từ nước qua mang. Nó không thở bằng phổi như hải cẩu.')]),
  size:scene('Cá mập trắng lớn so với người bơi và tàu lặn nhỏ',[
   point([4,14,89,34],'Cá mập trắng','Cá mập trắng lớn có thể dài tới khoảng sáu mét bốn. Đây không phải kích thước trung bình.','↔ tới ≈ 6,4 m'),
   point([12,52,26,21],'Người','Người đối chiếu dài một mét bảy, không tính chân vịt.','↔ 1,7 m'),
   point([50,50,42,23],'Tàu lặn','Tàu lặn minh họa dài ba mét. Hai chiếc như vậy mới gần bằng cá mập lớn trong ví dụ.','↔ ví dụ 3 m')],{note:'Cá mập lớn tới khoảng 6,4 m theo NOAA. Người 1,7 m và tàu lặn 3 m là vật đối chiếu giả định; tranh không thay phép đo.'}),
  growth:scene('Cá mập trắng mới sinh, con non và trưởng thành',[
   point([6,35,22,34],'Mới sinh','Cá mập trắng sinh con. Cá con đã có thể bơi khi ra đời.'),
   point([37,29,25,40],'Đang lớn','Cá mập con tự tìm thức ăn và lớn dần.'),
   point([67,20,31,49],'Trưởng thành','Cá mập trưởng thành lớn hơn nhiều. Không phải loài cá mập nào cũng sinh sản giống nhau.')],{note:growthNote}),
  range:map('Những vùng biển phân bố của cá mập trắng',[
   point([15,29,13,22],'Bắc Mỹ','Cá mập trắng được ghi nhận ở các vùng biển ven Bắc Mỹ.'),
   point([49,52,13,22],'Nam Phi','Vùng biển quanh Nam Phi là một nơi có cá mập trắng.'),
   point([77,51,13,22],'Australia và New Zealand','Cá mập trắng cũng sống ở vùng biển Australia và New Zealand.')],mapNote)
 },
 fish:{
  habitat:scene('Cá cờ đen trắng bơi bên rạn san hô',[
   point([26,16,44,53],'Cá cờ','Cá cờ Heniochus acuminatus là ví dụ cá có hình dáng giống model. Nó sống ở vịnh và vùng rạn.'),
   point([5,36,19,33],'Rạn san hô','Rạn có nhiều chỗ trú và nhiều sinh vật nhỏ.')]),
  diet:scene('Cá cờ tìm động vật phù du nhỏ',[
   point([19,18,47,50],'Cá tìm mồi','Loài cá cờ tham chiếu ăn động vật phù du và một số động vật không xương sống ở đáy.'),
   point([74,32,22,33],'Động vật phù du','Những động vật nhỏ trôi trong nước được phóng lớn để dễ thấy.')],{note:'Con mồi được phóng lớn riêng, không cùng tỷ lệ với cá.'}),
  movement:scene('Vây và đuôi của cá cờ khi bơi',[
   point([59,35,20,32],'Đuôi','Đuôi giúp cá tạo lực và điều chỉnh chuyển động.'),
   point([28,34,25,33],'Vây','Các vây giúp cá giữ thăng bằng và đổi hướng trong rạn.')]),
  size:scene('Cá cờ có chiều dài tới khoảng hai mươi lăm xen ti mét',[
   point([14,19,42,43],'Cá cờ','Loài cá cờ Heniochus acuminatus có thể dài tới hai mươi lăm xen ti mét.','↔ tới 25 cm'),
   point([59,60,28,13],'Thước minh họa','Đây là số đo của loài tham chiếu, chưa phải số đo xác nhận cho model.')],{note:'Số đo theo Australian Museum. Tranh và thước không hiệu chuẩn; phần vây lưng dài không phải chiều dài từ đầu tới đuôi.'}),
  growth:scene('Cá cờ nhỏ và cá cờ trưởng thành',[
   point([16,31,25,38],'Cá nhỏ','Cá non còn nhỏ và tiếp tục lớn lên.'),
   point([60,17,29,52],'Cá trưởng thành','Cá trưởng thành lớn hơn. Tranh này chỉ so sánh hai giai đoạn, chưa mô tả trứng và ấu trùng.')],{note:growthNote}),
  range:map('Ấn Độ Dương và phần tây, trung tâm Thái Bình Dương',[
   point([28,36,13,22],'Ấn Độ Dương','Loài cá cờ tham chiếu sống ở vùng nhiệt đới Ấn Độ Dương.'),
   point([67,35,13,22],'Thái Bình Dương','Nó cũng có ở vùng nhiệt đới phía tây và trung tâm Thái Bình Dương.')],mapNote)
 },
 amplectobelua:{
  habitat:scene('Amplectobelua bơi trong biển cổ kỷ Cambri',[
   point([19,20,59,47],'Sinh vật biển cổ','Amplectobelua sống trong biển kỷ Cambri, rất lâu trước khủng long.'),
   point([6,48,17,24],'Đáy biển cổ','Cảnh phục dựng có nền đáy và sinh vật đơn giản, không phải rạn san hô hiện đại.')],{note:'Phục dựng minh họa từ kiến thức hóa thạch; màu sắc và chi tiết phần mềm không được bảo tồn đầy đủ.'}),
  diet:scene('Các phụ bộ có gai phía trước của Amplectobelua hướng về con mồi',[
   point([40,30,25,39],'Phụ bộ bắt mồi','Các phần có gai phía trước có thể nắm giữ con mồi. Chức năng này được suy luận từ hóa thạch.'),
   point([74,46,20,26],'Con mồi minh họa','Sinh vật nhỏ này chỉ minh họa ý tưởng săn mồi, không phải bằng chứng về một thực đơn đã xác nhận.')]),
  movement:scene('Các thùy bơi dọc hai bên cơ thể Amplectobelua',[
   point([26,28,45,35],'Thùy bơi','Những thùy hai bên thân thích nghi cho việc bơi trong biển.'),
   point([76,30,19,34],'Phần đuôi','Hãy quan sát phần đuôi và thân phân đốt của sinh vật biển cổ này.')]),
  size:scene('Minh họa hóa thạch Amplectobelua cạnh dụng cụ đo',[
   point([13,22,59,46],'Hóa thạch','Nhà khoa học đo hóa thạch để tìm hiểu kích thước của sinh vật.','Nghiên cứu hóa thạch'),
   point([76,22,13,47],'Dụng cụ đo','Ta chưa chọn một ước tính chiều dài toàn thân đáng tin cho model này.')],{note:'Đây là tranh minh họa hóa thạch, không phải ảnh một mẫu khai quật thật. Thước không hiệu chuẩn; chưa công bố chiều dài toàn thân.'}),
  growth:scene('Các mảnh hóa thạch giúp tìm hiểu sinh vật cổ',[
   point([13,23,30,47],'Phụ bộ hóa thạch','Hóa thạch các bộ phận giúp nhà khoa học nghiên cứu Amplectobelua.'),
   point([57,26,31,44],'Điều còn chưa biết','Chúng ta chưa biết đầy đủ vòng đời. Vì vậy tranh không tự thêm trứng hoặc ấu trùng.')],{note:'Tranh nghiên cứu hóa thạch minh họa, không phải vòng đời hoặc ảnh mẫu thật.'}),
  range:map('Vân Nam ở phía tây nam Trung Quốc',[
   point([44,40,13,22],'Chengjiang, Vân Nam','Hóa thạch Amplectobelua symbrachiata được nghiên cứu từ Chengjiang, tỉnh Vân Nam, Trung Quốc.')],'Bản đồ hiện đại định vị nơi tìm thấy hóa thạch. Đây không phải biển Cambri hoặc phân bố của động vật còn sống.')
 }
};

// Final placement follows reviewed output; generation coordinates are only a brief.
const positions={
 'seal.size':[[40,38,45,32],[16,20,12,50]],
 'squid.movement':[[39,15,13,28],[27,33,15,17]],
 'squid.size':[[28,23,20,39],[55,65,34,12]],
 'tuna.size':[[25,17,39,24],[27,45,48,25]],
 'slug.movement':[[25,41,58,20],[26,12,14,29]],
 'slug.range':[[38,12,13,22],[49,42,13,22]],
 'shark.size':[[19,15,68,37],[18,57,20,15],[49,51,31,25]],
 'fish.size':[[34,20,29,34],[64,53,25,10]],
 'fish.movement':[[58,30,16,26],[34,34,18,29]],
 'amplectobelua.diet':[[48,26,21,34],[67,54,15,17]],
 'amplectobelua.range':[[26,43,13,22]]
};
for(const [key,boxes] of Object.entries(positions)){const [id,topic]=key.split('.');boxes.forEach((box,i)=>{const p=marineExploration[id]?.[topic]?.points?.[i];if(p)p.box=box;});}
marineExploration.squid.habitat.focus=.32;
marineExploration.slug.habitat.focus=.38;
marineExploration.amplectobelua.range.focus=.325;
marineExploration.amplectobelua.size.points.splice(1,1);
marineExploration.amplectobelua.growth.points[0].label='Mảnh hóa thạch';
