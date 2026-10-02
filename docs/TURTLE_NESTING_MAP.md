# Map rùa lên bờ và đẻ trứng — yêu cầu bàn giao

Ngày: 02/10/2026. Trạng thái: đã có bản triển khai map và vòng làm tổ; xem kết quả/giới hạn trong `PROJECT_HANDOFF.md` và `TURTLE_NESTING_IMPLEMENTATION.md`. Phần dưới giữ yêu cầu và tham khảo ban đầu. Làm trong repo `dinosour-game`, model mục tiêu `loggerhead`.

## Yêu cầu đã xác nhận từ người dùng

- Thêm map bờ biển, nếu được có cả biển nông và bãi cát trong cùng một map.
- Rùa bơi từ biển nông lên bờ; lên bờ chuyển sang bò.
- Tạo animation di chuyển trên bờ đúng hình thể và phối hợp vây/thân; không lấy swim rồi chỉ dịch model trên đất.
- Map nhằm mô tả việc rùa đẻ trứng. Đoạn sinh học người dùng đưa là tài liệu tham khảo, KHÔNG phải flow gameplay đã chốt.
- Quy trình tạo animation phải có trong repo này. Đã bổ sung `QUY_TRINH_TAO_ANIMATION.md`.
- Bổ sung trong lúc triển khai: map mới phải là một ô ngay trong khay chủ đề trang rùa, cạnh ô model 3D. Đã chọn route `/animal/loggerhead/nesting`, Back về `/animal/loggerhead`.

## Hướng đề xuất để session mới tiếp tục

Ưu tiên map Three.js low-poly đồng bộ màn chơi hiện tại, không mặc định cần video/background gen. Có bãi cát thoải, nước nông và vùng chuyển tiếp rõ. Giữ joystick mobile, keyboard desktop, orbit camera và nút action dễ chạm.

Làm phần nền tảng trước: di chuyển liên tục qua mép nước, nhận biết môi trường, pose tiếp xúc và animation bò. Sau khi phần này ổn, nối hoạt động đào tổ, đẻ, lấp/che dấu và trở lại biển. Cảnh ấp/nở/rùa con nên dùng chuyển thời gian hoặc hoạt động riêng; đây là đề xuất, không phải yêu cầu phải triển khai hết ngay.

Không thay map biển cũ hoặc bỏ action hiện tại khi chưa có lý do trong task. Có thể thêm lựa chọn map trong màn game của rùa; tự chọn cách tích hợp nhỏ gọn, ghi rõ route/entry mới. Không mặc định mở map cho mọi loài.

## Thiết kế kỹ thuật cần giải quyết

1. Đọc loader, rig thật, controller và route hiện tại; ghi tên bone, trục, rest pose, offsets và clip nền. Không dựa vào tên bone đơn thuần để đoán chuyển động.
2. Tách sampling địa hình/mực nước khỏi controller animation. Cả hiển thị lẫn tiếp xúc dùng cùng dữ liệu mặt đất; tránh mặt cát nhìn một nơi nhưng rùa đứng nơi khác.
3. Có trạng thái swim / chuyển tiếp / crawl dựa trên vị trí và độ ngập của thân. Dùng vùng trễ và blend để không đổi qua lại liên tục ở mép nước; xử lý được chiều quay lại xuống biển.
4. Crawl có pha chống vây tạo lực và pha thu/đưa vây; đồng bộ tốc độ tiến với nhịp và khoảng bước. Thân thấp phù hợp, không chìm cát, không nổi cách mặt đất, không trượt như bơi. Kiểm chứng nhịp bò theo rùa quản đồng từ nguồn/video phù hợp trước khi chốt đối xứng hay luân phiên.
5. Không áp swim mixer toàn biên độ lên crawl nếu gây sai tiếp xúc. Quy định ai sở hữu pose, root placement và root motion; blend/reset không làm actor nhảy vị trí.
6. Đào bằng hai vây sau có chu kỳ xúc/đưa cát; quay đầu/vây trước/thân làm đúng vai trò ổn định, không rung mọi bone. Rig thiếu khả năng thì giới hạn có giải thích hoặc điều chỉnh có kiểm chứng.
7. Tổ/trứng/cát là entity có trạng thái riêng. Nếu cần nhìn trứng dưới cát, dùng cách minh họa có chủ đích (góc cắt/lớp đất mở), không để model xuyên đất để phô diễn.
8. Action sinh sản cần điều kiện vị trí, thứ tự hợp lý, ngắt/reset/replay sạch; PC có phím tắt nếu dùng số, mobile không hiện số. Không khóa vĩnh viễn người chơi trong animation.
9. Nếu dùng đêm để minh họa, vẫn đủ sáng cho trẻ nhận ra đường đi/vây/mép nước; không coi đây là mô phỏng bảo tồn thực địa.

## Tham khảo người dùng cung cấp — chưa kiểm chứng

> Rùa cái chọn bãi cát hoặc đất tơi xốp, thường vào ban đêm. Rùa biển phải bò lên bờ. Nó dùng hai chân sau đào một hố hình bình, sâu khoảng 30–60 cm. Nó đẻ từng quả trứng vào hố. Số lượng từ vài quả (rùa nhỏ) đến 50–200 quả (rùa biển). Nó lấp hố lại, che dấu vết rồi bỏ đi và không ở lại ấp. Trứng ủ trong cát khoảng 45–70 ngày. Nhiệt độ cát quyết định giới tính: nóng hơn thì nhiều rùa cái, mát hơn thì nhiều rùa đực. Rùa con nở ra, bò lên mặt cát (thường ban đêm) và chạy thẳng ra biển hoặc ra nước.

Đây là nguyên liệu tham khảo người dùng, pha trộn rùa nói chung và rùa biển. Không lấy các khoảng số hoặc cách diễn đạt này làm dữ kiện chắc chắn của loggerhead. Trước khi đưa vào lời đọc/UI hoặc dùng để chốt chuyển động, tra nguồn chuyên môn như NOAA Fisheries, tài liệu nghiên cứu/bảo tồn về loggerhead; lưu URL và điều nguồn hỗ trợ. Phân biệt minh họa rút gọn với số lượng, thời gian, tập tính thật. Không mặc định rùa định hướng về biển chỉ bằng một đường thẳng, hoặc nhiệt độ là công thức tuyệt đối áp mọi loài.

Chưa chọn flow cuối, cách thưởng, số trứng hiển thị, camera quan sát tổ, hoặc quyền điều khiển rùa con. Chọn bản thử nghiệm nhỏ để review; không coi tài liệu tham khảo là chuỗi nhiệm vụ bắt buộc nguyên văn.

## Các bước và nghiệm thu đề xuất

### A. Map và chuyển bơi/bò

- Bãi cát + nước nông; đi được hai chiều qua mép nước ở nhiều góc/tốc độ.
- Bò nhìn rõ lực vây, thân và đầu phối hợp; xem trước/nghiêng/sau, không chỉ một camera đẹp.
- Không xuyên cát, bay lên, đổi state giật, hoặc trôi pose sau nhiều lần đổi môi trường.
- Joystick + orbit + action hoạt động cả mobile ngang và chế độ iframe xoay; không bị UI chắn.

### B. Tổ và hoạt động đẻ trứng

- Sau khi A được kiểm tra, tạo trạng thái tổ và action theo rig, nguồn tham khảo đã kiểm chứng.
- Có thể hoàn thành, ngắt hoặc chơi lại; không sinh chồng trứng/mesh/listener sau reset.
- Các chi tiết ấp/nở qua chuyển thời gian ghi là minh họa, không biểu diễn như diễn ra ngay sau đẻ trong thực tế.

### C. Bàn giao

- Build, logic test cho chuyển môi trường/state tổ, kiểm thử browser cho entry/back/replay và input.
- Xem chuyển động thực tế; test pass không chứng minh animation đẹp hoặc chính xác sinh học.
- Giữ hồi quy map/action rùa cũ và game T-Rex. Regenerate preview cho action được đưa vào khay.
- Cập nhật `PROJECT_HANDOFF.md`: file mới, cách vào map, đã làm/chưa làm, nguồn và kết quả kiểm chứng. Không push/deploy trừ khi người dùng yêu cầu.
