# Triển khai map rùa làm tổ — 02/10/2026

## Thiết kế và kế hoạch

Yêu cầu bổ sung: ô **Lên bờ đẻ trứng** trong khay chủ đề loggerhead, cạnh ô model 3D. Route `/animal/loggerhead/nesting`, Back về `/animal/loggerhead`. Giữ nguyên explore cũ.

Chọn map low-poly liên tục, dùng cùng hàm độ cao cho geometry và contact. Không dùng ảnh nền hoặc scene tách biển/đất vì cần điều khiển hai chiều qua mép nước. Giữ controller input/camera của free-roam; module riêng cho terrain, locomotion, nest state và presentation. Người dùng đã giao tự xử lý lựa chọn kỹ thuật và triển khai, không cần duyệt lại các lựa chọn này.

- [x] Khảo sát FBX, bone hierarchy, clip và skin; ghi phép đo.
- [x] Test terrain, chuyển môi trường có hysteresis, thứ tự/cancel/replay tổ trước implementation.
- [x] Map biển nông–bãi cát; pose bò độc lập, blend với swim, tiếp xúc mesh.
- [x] Ô khay, route/back, input/orbit; kiểm tra foundation trên render.
- [x] Đào ổ thân, đào hố trứng, đẻ, lấp/che dấu, quay lại biển; minh họa tổ bằng ô cắt riêng.
- [x] Build, unit/browser tests, xem chuỗi frame desktop/mobile, hồi quy map/action cũ (lỗi collision biển cũ ghi riêng trong bàn giao).
- [x] Cập nhật bàn giao và giới hạn; không push/deploy.

## Nguồn sinh học

- https://home.nps.gov/ever/learn/nature/seaturtles.htm — dấu bò loggerhead luân phiên, khác dấu song song của green/leatherback.
- https://sccf.org/2023/07/26/loggerhead-versus-green-sea-turtles/ — mô tả riêng loggerhead dùng vây trước/sau luân phiên.
- https://www.fisheries.noaa.gov/species/loggerhead-turtle — sinh sản trên bãi cát, rùa cái trở lại biển; tra trước khi đưa dữ kiện số vào UI.
- https://home.nps.gov/guis/learn/nature/seaturtle-reproduction.htm — đào hố bằng vây sau, đẻ trứng trong cát.

Game rút ngắn thời gian, không dùng số trứng minh họa làm kích thước ổ thật. Không triển khai nở ngay sau đẻ hay nhiệt độ quyết định giới tính trong vòng chơi này.

## Khảo sát nguồn

Git ban đầu `main@c3a4728`; README modified, `.vscode/` và bốn docs untracked có sẵn. Giữ nguyên thay đổi người dùng. FBX 828700 bytes, một SkinnedMesh `loggerheadbody` 37488 vertex entries, 22 skin bones, clip swim 3.5 giây (position/quaternion/scale tracks). Bone phụ `_end` không có skin weights. `Main` → Spine003 → Spine002 → Spine001 → head002 → head001. Vây trước: flipper-{left,right}001 → 002 → 004 → 005 → 005_end. Vây sau: hind-{left,right}001 → 002 → 003 → 003_end. Tail: tail001. World/model forward -Z, up +Y; bone local +Y đi tới khớp tiếp theo, không tương đương world +Y. Source armature mang scale 100 và chuyển trục; giữ nguyên hierarchy/bind matrices.

Raw pose bounds: x [-28.139,26.313], y [-20.188,16.786], z [-62.816,23.375]. Rest pose có đầu vây trước nhấc cao nên không dùng nguyên làm pose bò. Loader chuẩn hóa cạnh dài về 6, visual đặt minY +1; gameplay scale cạnh dài về 4.5. Root placement phải bù offset này. Cảnh báo FBX có vertex >4 weights và map ShininessExponent không hỗ trợ đã tồn tại khi đọc asset; không sửa asset trong task.

Script tái kiểm tra: `node scripts/inspect-turtle-rig.mjs`.

## Pose, tiếp xúc và thời gian

- Root gameplay sở hữu vị trí/yaw; controller shore sở hữu nghiêng theo dốc và bone pose, không reparent/scale bone. Trình tự mỗi frame: restore pose swim → mixer swim → dựng pose land độc lập → giải contact → blend → kiểm lại clearance. Swim đóng góp bằng 0 khi land=1.
- Local +Y của bone dọc chuỗi; phép đo skin cho thấy local Z thường là chiều mỏng của bản vây. Đặt mặt vây theo trục này để tránh vây chống bằng cạnh. Xem `scripts/inspect-turtle-skin.mjs`.
- Một chu kỳ bò ứng với 1.5 đơn vị quãng đường. Hai bên lệch nửa chu kỳ; pha chống 60%, pha thu 40%. Không tăng phase khi dừng hoặc đụng vật cản. Neo contact ở world space trong pha chống; giới hạn bước CCD, hiệu chỉnh cao độ tại vai/hông theo skin. Các thông số là lựa chọn minh họa cho asset này, không phải số đo sinh học.
- Tốc độ blend từ bơi 7.5 xuống bò 0.9 đơn vị game/giây. Depth và clearance là đơn vị map, không công bố như mét. Phần đầu/cổ bù nhỏ; thân thấp ổn định, vây tạo lực. Không rung mọi bone.
- Tạo hõm thân/che dấu dùng vây trước; đào/lấp dùng vây sau luân phiên xúc–nhấc. Thân/vây trước ổn định khi đào; đẻ gần tĩnh, hình cắt thể hiện trứng. Tiến trình 4/6/5/4/4 giây, được ghi rõ là rút gọn.
- Contact dựa mẫu skin, kiểm tra test trên toàn mesh tại các frame đã chọn. Không đảm bảo mọi vertex/mọi frame/mọi góc va chạm đều tuyệt đối chính xác; không phải solver cát vật lý.

## Kiểm chứng và lỗi đã sửa

- 5 test logic/rig: terrain liên tục, state hai chiều, điều kiện/thứ tự/cancel/replay tổ; mesh contact nhiều hướng/đứng yên, restore; transition clearance và giới hạn bước cao độ. Mẫu full mesh trên quỹ đạo land: min gap khoảng 0.0119, body gap tối đa khoảng 0.074, bước cao độ lớn nhất khoảng 0.0212 đơn vị/frame trong phép thử dt=.02.
- Review độc lập phát hiện clearance phải chạy **sau** blend; trước sửa có vây xuyên 0.123 đơn vị ở chuyển tiếp. Đã sửa, thêm assertion và giảm tốc hạ thân khi nhả điểm chống. Bản probe tốc độ game sau sửa clearance tối thiểu 0.012.
- Browser: Chrome desktop, touch 844×390, portrait 390×844 trong iframe xoay; thử entry từ khay, keyboard/joystick, orbit không di chuyển actor, toàn vòng làm tổ, stop/resume, trở lại biển, replay/back. Ảnh scene và chuỗi frame đang chạy được xem trực tiếp; không thay bằng kết luận từ unit test.
- Biểu tượng là SVG source tự dựng, server dev bổ sung MIME `image/svg+xml`. Nút replay chừa chỗ fullscreen trên mobile. Không thêm preview sprite action vì map không phải action viewer.
- Hồi quy: `npm test`, `game-actions`, `ocean-play`, `ocean-course`, `roam-interaction`. Riêng `roam-collision` fail sea đã tái lập từ HEAD ban đầu; không chỉnh thế giới cũ để che lỗi.
- Chưa có đo trên điện thoại vật lý hoặc xác nhận sinh cơ học từ chuyên gia. Browser tích hợp không khởi tạo được trong môi trường này; dùng Playwright/Chrome của repo.
