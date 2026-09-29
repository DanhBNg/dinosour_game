// Generic asset names are NOT species identifications. Reference examples are explicit.
const entry=(label,voice,note='',source)=>({label,voice,note,...(source?{source}:{})});
const noaa=slug=>({name:'NOAA Fisheries',url:`https://www.fisheries.noaa.gov/species/${slug}`});
export const marineKnowledge={
 seal:{name:'Hải cẩu',world:'ocean',environment:'coast',reference:true,source:noaa('harbor-seal'),identity:'Asset chỉ ghi seal. Phoca vitulina (hải cẩu cảng) là ví dụ tham chiếu, chưa xác nhận định danh model.',topics:{
  habitat:entry('Biển ven bờ · chỗ nghỉ','Hải cẩu cảng kiếm ăn dưới nước và lên bờ hoặc băng để nghỉ.'),
  diet:entry('Cá · động vật có vỏ','Hải cẩu cảng ăn cá và một số động vật không xương sống dưới biển.'),
  movement:entry('Bơi · lặn','Hải cẩu cảng bơi và lặn tìm thức ăn. Nó phải lên mặt nước để thở.'),
  size:entry('Kích thước tùy loài','Có nhiều loài hải cẩu với kích thước khác nhau. Model này chưa được xác định loài.','Không lấy kích thước chuẩn hóa của model làm số đo sinh học.'),
  growth:entry('Sinh con · bú sữa','Hải cẩu là động vật có vú. Hải cẩu cảng sinh con, con non bú sữa mẹ.'),
  range:entry('Bắc Đại Tây Dương · Bắc Thái Bình Dương','Hải cẩu cảng sống ở vùng ven biển phía bắc Đại Tây Dương và Thái Bình Dương.','Đây là phân bố của loài tham chiếu.')
 }},
 squid:{name:'Mực bobtail',world:'ocean',environment:'reef',reference:true,source:{name:'Monterey Bay Aquarium',url:'https://www.montereybayaquarium.org/animals-the-ocean/animals-a-to-z/hawaiian-bobtail-squid'},identity:'Bobtail squid là tên một nhóm. Dùng Euprymna scolopes ở Hawaii làm ví dụ, không xác nhận model thuộc loài này.',topics:{
  habitat:entry('Ven bờ · ẩn trong cát','Mực bobtail Hawaii thường vùi mình trong cát ban ngày và kiếm ăn ban đêm.'),
  diet:entry('Giáp xác nhỏ','Mực bobtail Hawaii ăn các động vật giáp xác nhỏ.'),
  movement:entry('Rời đáy · tìm mồi','Ban đêm, mực bobtail Hawaii rời nơi ẩn ở đáy biển để kiếm ăn.'),
  size:entry('Ví dụ: thân áo tới 3,5 cm','Thân áo của mực bobtail Hawaii dài tới khoảng ba phẩy năm xen ti mét.','Đo thân áo, không tính các tay và xúc tu; chỉ áp dụng cho ví dụ tham chiếu.'),
  growth:entry('Trứng → mực con','Mực bobtail Hawaii đẻ trứng. Mực con nở ra rồi lớn lên.'),
  range:entry('Ví dụ: Hawaii','Mực bobtail Hawaii sống ở vùng biển nông ven các đảo Hawaii.','Không phải phân bố của toàn bộ nhóm bobtail squid.')
 }},
 tuna:{name:'Cá ngừ',world:'ocean',environment:'deep',reference:true,source:noaa('atlantic-yellowfin-tuna'),identity:'Asset chỉ ghi tuna. Thunnus albacares (cá ngừ vây vàng) là hồ sơ ví dụ; chưa xác định loài của model.',topics:{
  habitat:entry('Đại dương · tầng gần mặt','Cá ngừ vây vàng sống trong các đại dương ấm, thường ở gần mặt nước.'),
  diet:entry('Cá · mực · giáp xác','Cá ngừ vây vàng ăn cá, mực và giáp xác.'),
  movement:entry('Bơi xa · di cư','Cá ngừ vây vàng có thể bơi qua cả một đại dương.'),
  size:entry('Kích thước tùy loài','Các loài cá ngừ có kích thước khác nhau. Cần biết loài trước khi chọn số đo.','Chưa gán chiều dài tối đa của cá ngừ vây vàng cho model chưa rõ loài.'),
  growth:entry('Trứng → cá non','Cá ngừ vây vàng đẻ trứng trong nước. Cá non lớn lên và thường bơi thành đàn.'),
  range:entry('Biển nhiệt đới · cận nhiệt đới','Cá ngừ vây vàng có ở các đại dương nhiệt đới và cận nhiệt đới trên thế giới.')
 }},
 slug:{name:'Chromodoris annae',world:'ocean',environment:'reef',source:{name:'Australian Museum · Sea Slug Forum',url:'https://www.seaslugforum.net/showall/chroanna'},identity:'Tên asset xác định Chromodoris annae. Màu và chi tiết model vẫn là minh họa.',topics:{
  habitat:entry('Đáy biển · rạn','Sên biển Chromodoris annae được ghi nhận trên các rạn và nền đá dưới biển.'),
  diet:entry('Ăn bọt biển','Chromodoris annae ăn bọt biển. Bọt biển là động vật, không phải cây.', '',{name:'Australian Museum · Sea Slug Forum',url:'https://www.seaslugforum.net/find/21421'}),
  movement:entry('Bò trên nền đáy','Sên biển di chuyển trên nền đáy bằng phần chân mềm ở mặt dưới.','Giới thiệu giải phẫu của nhóm sên biển, không suy ra tốc độ từ animation.',{name:'Australian Museum · How sea slugs crawl',url:'https://www.seaslugforum.net/find/locomotion'}),
  size:entry('Nhỏ · đo bằng cm','Sên biển này là động vật nhỏ. Hình trên màn hình đã được phóng lớn.','Chưa chọn mẫu tham chiếu để công bố số đo tối đa.'),
  growth:entry('Trứng · lớn lên','Sên biển đẻ trứng. Các giai đoạn phát triển khác nhau giữa các loài.','Chưa phục dựng chu kỳ ấu trùng riêng của Chromodoris annae.',{name:'Australian Museum · Nudibranch egg masses',url:'https://www.seaslugforum.net/showall/eggspir'}),
  range:entry('Tây Thái Bình Dương nhiệt đới','Chromodoris annae được ghi nhận ở vùng nhiệt đới phía tây Thái Bình Dương.','Nguồn còn ghi khả năng có ở Ấn Độ Dương; chưa coi đó là ranh giới chắc chắn.')
 }},
 shark:{name:'Cá mập trắng',world:'ocean',environment:'coast',source:noaa('white-shark'),identity:'Carcharodon carcharias theo tên asset. Hình và hoạt ảnh không mô tả tốc độ hay hành vi chính xác.',topics:{
  habitat:entry('Biển ôn đới · cận nhiệt đới','Cá mập trắng sống ở biển ôn đới và cận nhiệt đới, cả vùng ven bờ và ngoài khơi.'),
  diet:entry('Cá · động vật biển','Cá mập trắng ăn cá và những động vật biển khác. Con lớn có thể săn hải cẩu.','Thức ăn thay đổi theo tuổi và khu vực.',{name:'Florida Museum',url:'https://www.floridamuseum.ufl.edu/discover-fish/species-profiles/white-shark/'}),
  movement:entry('Bơi · di chuyển xa','Cá mập trắng bơi và có thể di chuyển rất xa giữa các vùng biển.'),
  size:entry('Con lớn tới khoảng 6,4 m','Những cá mập trắng lớn có thể dài tới khoảng sáu mét bốn.','Làm tròn từ 21 feet theo NOAA; không phải kích thước trung bình.'),
  growth:entry('Sinh con trong biển','Cá mập trắng sinh ra cá con đã có thể bơi. Nó không đẻ trứng trên bãi cát.', '',{name:'Florida Museum',url:'https://www.floridamuseum.ufl.edu/discover-fish/species-profiles/white-shark/'}),
  range:entry('Nhiều đại dương','Cá mập trắng phân bố ở các vùng biển ôn đới và cận nhiệt đới trên thế giới.')
 }},
 fish:{name:'Cá biển',world:'ocean',environment:'reef',reference:true,source:{name:'Australian Museum',url:'https://australian.museum/learn/animals/fishes/longfin-bannerfish-heniochus-acuminatus-linnaeus-1758/'},identity:'Asset Black_White_Fish chưa định danh. Heniochus acuminatus là ví dụ cá có hình dáng tương tự, không phải xác nhận phân loại.',topics:{
  habitat:entry('Ví dụ: cá vùng rạn','Cá cờ Heniochus acuminatus sống ở vịnh ven bờ và vùng rạn san hô.'),
  diet:entry('Động vật phù du nhỏ','Loài cá cờ tham chiếu ăn động vật phù du và động vật không xương sống ở đáy.'),
  movement:entry('Vây và đuôi','Hãy quan sát vây và đuôi của model cá. Đó là những bộ phận giúp cá di chuyển.','Quan sát giải phẫu; không khẳng định animation là cách bơi chính xác của loài tham chiếu.'),
  size:entry('Ví dụ: dài tới 25 cm','Cá cờ Heniochus acuminatus có thể dài tới hai mươi lăm xen ti mét.','Số đo của loài tham chiếu, không phải định danh của model.'),
  growth:entry('Con non · con trưởng thành','Cá con lớn lên, kích thước và hình dáng có thể thay đổi.','Chưa có nội dung chu kỳ sinh sản cụ thể cho asset chưa định danh.'),
  range:entry('Ấn Độ Dương · Thái Bình Dương','Loài cá cờ tham chiếu có ở vùng nhiệt đới Ấn Độ Dương và phần tây, trung tâm Thái Bình Dương.')
 }},
 amplectobelua:{name:'Amplectobelua symbrachiata',world:'ocean',environment:'deep',source:{name:'Cong và cộng sự · BMC Evolutionary Biology (2017)',url:'https://doi.org/10.1186/s12862-017-1049-1'},identity:'Sinh vật biển đã tuyệt chủng, thuộc Radiodonta; không phải động vật đang sống trong đại dương hiện nay.',topics:{
  habitat:entry('Biển cổ · kỷ Cambri','Amplectobelua sống trong biển từ kỷ Cambri, rất lâu trước khủng long.','Rạn san hô hiện đại không phải bối cảnh của loài này.'),
  diet:entry('Phụ bộ bắt mồi','Các phụ bộ phía trước giúp Amplectobelua nắm giữ con mồi.','Chức năng suy luận từ cấu trúc hóa thạch, không xác nhận một thực đơn cố định.'),
  movement:entry('Các thùy bơi hai bên','Amplectobelua có những thùy dọc hai bên cơ thể, thích nghi cho việc bơi.'),
  size:entry('Đo từ hóa thạch','Nhà khoa học nghiên cứu kích thước Amplectobelua từ hóa thạch.','Chưa chọn ước tính chiều dài toàn thân phù hợp; model được chuẩn hóa không có tỷ lệ thật.'),
  growth:entry('Hóa thạch còn thiếu','Chúng ta chưa biết đầy đủ vòng đời của Amplectobelua. Hóa thạch giúp tìm hiểu thêm.','Không tự dựng trứng, ấu trùng hay tuổi trưởng thành khi chưa có nguồn phù hợp.'),
  range:entry('Chengjiang · Trung Quốc','Hóa thạch Amplectobelua symbrachiata được nghiên cứu từ Chengjiang ở Trung Quốc.','Nơi tìm thấy hóa thạch, không phải phạm vi phân bố hiện nay.')
 }}
};
