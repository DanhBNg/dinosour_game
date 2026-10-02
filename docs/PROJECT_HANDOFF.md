# Animal World — bàn giao session

Cập nhật theo source đọc ngày 02/10/2026. Đọc tài liệu này trước khi triển khai task mới; không cần lịch sử chat.

## Cập nhật hợp nhất main — 02/10/2026

Đã đồng bộ remote đến `79d9131` (5 commit sau `c3a4728`) và ghép phần local. Các snapshot cũ bên dưới chỉ là lịch sử. Source đã refactor: `src/core/`, `src/components/`, `src/pages/`, `src/styles/`.

- Giữ gameplay rùa mới từ remote tại `src/pages/ocean-world/loggerhead/gameplay.js`, route `/animal/loggerhead/gameplay`; `/explore` của rùa chuyển đến đó. Gameplay có survival, ăn, nhiệm vụ và tăng trưởng; không dùng bảng phím cũ dưới đây làm chuẩn cho màn này.
- Map bờ biển local vẫn riêng tại `/animal/loggerhead/nesting`, controller `src/turtle-shore-roam.js` cùng các module `src/turtle-*.js`. Host riêng `#nesting-screen` tránh ghi đè canvas/HUD của gameplay mới.
- Giữ thứ tự loài từ remote; thay ô cuối bằng cá voi xanh và khóa. Các vị trí/biểu tượng khóa khác từ remote được giữ.
- Build thành công, 50 unit test đạt. Kiểm tra trình duyệt bao gồm map/khóa cá voi, route model và luồng nesting desktop/mobile.

## Đúng repo

- Repo: `DanhBNg/dinosour_game`, remote `https://github.com/DanhBNg/dinosour_game.git`.
- Thư mục đang làm trên máy: `C:/Users/AMLT/Desktop/dinosour-game`.
- Đây là ứng dụng Animal World; KHÔNG phải repo `3d-model` (Little Worlds/demo nguồn) hoặc `camera_model` (camera độc lập).
- Khi bàn giao: nhánh `main`, HEAD `c3a4728` (`ud game`), tracking local `origin/main` cùng commit. Chưa fetch lại remote trong lượt viết tài liệu này. Trước khi sửa/push hãy kiểm tra lại.
- Trước thay đổi docs, chỉ có `.vscode/` untracked. Không stage toàn bộ hoặc ghi đè thay đổi người dùng. Tài liệu bàn giao được thêm sau snapshot này, chưa commit/push trong lượt bàn giao.

## Sản phẩm và luồng hiện tại

Web Three.js cho trẻ khám phá động vật, ưu tiên hình ảnh và thao tác ngắn. Trang chủ có hai vùng mở: thế giới cổ đại và đại dương; các vùng khác khóa nhưng có model preview. Preview model tự chạy và đổi con trên trang chủ.

Luồng: trang chủ → map chọn con → các chủ đề minh họa → xem model/animation → nút gamepad mở map điều khiển (hiện T-Rex và loggerhead).

Routes dùng History API, không dùng `#`:

- `/`, `/world/dinosaurs`, `/world/ocean`.
- `/animal/loggerhead`: vào chủ đề môi trường.
- `/animal/loggerhead/topics/growth`: chủ đề cụ thể.
- `/animal/loggerhead/actions`, `/animal/loggerhead/actions/turn360`: model và action.
- `/animal/loggerhead/explore`, `/animal/trex/explore`: chơi tự do.

Map đại dương là ảnh có các địa điểm, model preview đặt tại điểm chọn, có đường nối và thao tác kéo/vuốt. Trang chủ/map không còn khay danh sách cũ ở đáy. Màn chủ đề có khay icon, animation ở cuối; hỗ trợ vuốt và chọn trực tiếp. Nút phân bố đã ẩn. Không thêm lại các chấm thuyết minh, thẻ nghe/nói hay settings đã bỏ.

Mobile ưu tiên ngang: có màn yêu cầu xoay khi vào dọc và cơ chế app xoay trong iframe. Phải kiểm tra cả landscape thật lẫn portrait qua iframe, fullscreen và phần viewport còn lại khi có thanh trình duyệt. Khay có điều khiển thu/mở; tránh chiếm chỗ joystick và action.

## Cấu trúc source đang dùng

| File/nhóm | Vai trò |
| --- | --- |
| `src/app.js` | Routing, màn hình, điều hướng, map/home, nút vào game |
| `src/pages/dinosaur-world/catalog.js`, `src/pages/ocean-world/marine.js` | Danh sách và loader loài; mapping asset, texture, action biển |
| `src/core/scene.js` | Viewer model 3D, playback, capture preview |
| `src/creatures/` | Model/rig/action khủng long và hạ tầng animation |
| `src/components/action-previews.js`, `preview-framing.js`, `loading-framing.js` | Sprite preview, framing, hình chờ trước khi model tải xong |
| `src/core/action-lessons.js` | Tên/mô tả action |
| `src/knowledge*`, `species-knowledge*`, `marine-knowledge*`, `ocean-knowledge*`, các file `*-exploration.js` | Nội dung và cảnh chủ đề minh họa |
| `src/pages/ocean-world/ocean-journey.js`, `map-pan.js` | Map đại dương và kéo/vuốt |
| `src/core/free-roam.js` | Màn game, load actor, input, action, camera follow/orbit |
| `src/core/roam-world.js` | Map low-poly đất/biển, obstacle và giới hạn di chuyển |
| `src/components/joystick.js` | Joystick mobile |
| `src/pages/ocean-world/loggerhead/turtle-turn.js` | Barrel roll quanh trục đầu–đuôi, phối hợp rig |
| `src/pages/ocean-world/loggerhead/turtle-activities.js` | Boost, dive, rise, eat phủ lên chuyển động nền |
| `src/pages/ocean-world/ocean-play-state.js`, `ocean-play.js` | Tiến trình mục tiêu, marker, HUD, âm thanh, chơi lại |
| `src/mobile-bootstrap.js`, `mobile-ui.js`, `mobile.css`, `tray-dock.js` | Viewport, xoay app, thao tác mobile và khay |
| `assets/`, `scripts/`, `tests/` | Asset, build/capture và kiểm thử |

Các file `legacy-*` không phải entry chính. Xem `build.mjs` để xác nhận entry/output trước khi thay đổi. README và plans cũ có thông tin lịch sử (số model, topic, thuyết minh); không coi tất cả nội dung đó là hiện trạng. Source và tests liên quan cần được kiểm tra lại.

## Rùa hiện tại

- ID `loggerhead`, tên Rùa quản đồng; dùng FBX `model-47a-loggerhead-sea-turtle/source/Loggerhead 18.fbx` và texture mapping trong `marine.js`.
- Giữ rig gốc; loader trả model/createActions. Các wrapper procedural cần restore offset trước mixer và reset sạch.
- Gameplay: WASD/mũi tên trên PC, joystick mobile; chuột/touch orbit map. PC có số dưới action, mobile bấm trực tiếp và ẩn số.
- Action: `clip0` bơi gốc, `turn360` lộn dọc thân như mũi khoan (KHÔNG quay yaw tại chỗ), `boost`, `dive`, `rise`, `eat`.
- Phím 1–5 lần lượt: lộn vòng, tăng tốc, lặn, nổi, ăn. Hiện giới hạn độ sâu là quy ước game, không phải số đo sinh học.
- Vòng chơi hiện tại: 3 vòng bong bóng → thức ăn → vòm đá, có replay. Không có thua/đếm ngược.
- Ăn sử dụng đầu/cổ tiếp cận; chưa có khớp hàm riêng được khai thác. Không mô tả như đã có animation hàm chính xác.
- ĐÃ thêm map biển nông nối bãi cát, chuyển bơi/bò, tạo hõm thân, đào hố, đẻ, lấp/che dấu và trở lại biển. Rùa con/ấp/nở chưa triển khai. Xem phần cập nhật map làm tổ bên dưới.

## Chạy và kiểm chứng

```sh
npm ci
npm run build
npm start
```

Mở `http://127.0.0.1:4175`. `npm start` và `npm run dev` đều chạy `serve.mjs`, phục vụ `dist`; không tự watch/build source. Sửa source/asset xong cần build lại. Vercel dùng `vercel.json` với rewrite clean routes.

Kiểm tra phù hợp với phần sửa, server phải đang chạy cho browser tests:

```sh
npm test
node tests/game-actions.mjs
node tests/ocean-play.mjs
node tests/ocean-course.mjs
node tests/roam-interaction.mjs
node tests/roam-collision.mjs
```

Các test browser dùng Playwright/Chrome cài sẵn; đọc test trước khi chạy. Một số test lịch sử dùng UI cũ, không sửa ứng dụng để chiều assertion lỗi thời. Test mobile portrait phải chọn đúng iframe và xử lý gate xoay.

Khi sửa action có preview:

```sh
node scripts/render-action-previews.mjs loggerhead
node scripts/measure-preview-bounds.mjs
npm run build
```

Snapshot bàn giao ban đầu chỉ kiểm tra source/Git/docs. Kết quả triển khai và kiểm thử map mới được ghi riêng bên dưới; không coi kết quả lịch sử là xác nhận cho mọi thay đổi sau này.

## Việc tiếp theo

Đọc [yêu cầu map rùa sinh sản](TURTLE_NESTING_MAP.md), [quy trình animation](QUY_TRINH_TAO_ANIMATION.md) và [chuẩn model](model-structure-standard.md).

Hai tài liệu quy trình được chép vào repo này để session mới không phụ thuộc thư mục `3d-model`. Ví dụ/thông số ở quy trình là tham khảo, không mặc định áp cho rùa. Chuẩn model là hướng kiến trúc; không yêu cầu refactor toàn app trước khi làm map.

## Cập nhật map làm tổ — 02/10/2026

- Entry theo yêu cầu mới: ô **Lên bờ đẻ trứng** trong khay chủ đề của `/animal/loggerhead`, cạnh ô model 3D; icon vector riêng `assets/ui/turtle-nesting.svg`. Route `/animal/loggerhead/nesting`. Back về trang chủ đề rùa. Map `/animal/loggerhead/explore`, viewer/action cũ và T-Rex giữ nguyên entry.
- WASD/mũi tên hoặc joystick để đi; kéo chuột/touch để orbit. Phím **1** chạy bước đang hiển thị, **2** dừng; mobile chạm nút và ẩn số phím. Di chuyển cũng ngắt hoạt động. Nút ↻ đặt lại tổ/trứng/rùa về biển; tiếp tục tại tổ đã tạo nếu chỉ dừng.
- Vòng chơi: lên cát khô → tạo hõm thân → đào hố trứng → đẻ → lấp → che dấu → điều khiển trở lại biển. Không ép làm tổ tại vòng đánh dấu; có thể chọn cát khô khác. Không đẻ trong nước hoặc bỏ qua thứ tự.
- Tổ/cát và tiến trình tách khỏi controller. Trứng hiển thị trong **hình cắt minh họa**; 8 hình trứng và thời gian vài giây là rút gọn gameplay, không phải số trứng/thời gian thật. Không có rùa mẹ ấp trứng, trứng nở ngay hay gameplay rùa con.

| File mới | Trách nhiệm |
| --- | --- |
| `turtle-shore-state.js` | Sampling mặt cát/mực nước, blend và vùng trễ swim/transition/crawl |
| `turtle-shore-world.js` | Geometry dùng cùng sampling, nước/bọt/đá/cỏ và điểm gợi ý |
| `turtle-shore-motion.js` | Adapter rig loggerhead, pha chống/thu vây, contact trên skin, trộn swim/crawl |
| `turtle-nest-state.js` | Điều kiện vị trí, thứ tự hoạt động, cancel/resume/replay |
| `turtle-nesting.js` | HUD, hình cắt trứng, dấu tổ và hạt cát có giới hạn |

Các file JS trên nằm trong `src/`. Tích hợp ở `app.js`, `free-roam.js`, CSS trong `mobile.css`. Không thêm action viewer nên không cần tái tạo sprite preview action cũ.

### Rig, sinh học và giới hạn

Chi tiết phép đo, nguồn và cách dựng pose: [TURTLE_NESTING_IMPLEMENTATION.md](TURTLE_NESTING_IMPLEMENTATION.md).

Rùa quản đồng dùng nhịp vây luân phiên theo [NPS Everglades](https://home.nps.gov/ever/learn/nature/seaturtles.htm). Rùa cái lên bãi cát làm tổ; loggerhead thường làm tổ ban đêm theo [NOAA](https://www.fisheries.noaa.gov/species/loggerhead-turtle). Đào bằng vây sau được đối chiếu [NPS Gulf Islands](https://home.nps.gov/guis/learn/nature/seaturtle-reproduction.htm). Ánh sáng map được tăng để nhìn rõ cơ thể; không mô phỏng điều kiện bảo tồn thực địa. Biên độ, thời lượng và phối hợp chi tiết là animation minh họa, không phải tái dựng sinh cơ học được chuyên gia duyệt.

Giữ nguyên FBX/skin/hierarchy/bind matrices. Contact dùng mẫu vertex đã skin, hướng mặt vây hiệu chỉnh theo trục mỏng local Z; giữ neo vây trong pha chống và sửa clearance sau khi blend. Đây là solver động học giới hạn, không mô phỏng vật lý cát hoặc IK chống trượt tuyệt đối. Hố tổ ngoài scene là dấu cát; lòng hố/trứng dùng hình cắt riêng, không khoét terrain thật. Chưa kiểm tra trên điện thoại vật lý.

### Lệnh kiểm tra bổ sung

```sh
node --test tests/turtle-nesting.test.mjs tests/turtle-shore-rig.test.mjs
node tests/turtle-nesting-browser.mjs
node scripts/check-turtle-shore.mjs
```

Script browser lưu ảnh theo giai đoạn trong `artifacts/nesting/` (gitignored). Script rig thật kiểm tra bề mặt mesh nhiều hướng, dừng/đổi pose, restore và chuyển môi trường cả hai chiều. Cảnh báo FBX về >4 weights và ShininessExponent là từ asset sẵn có.

Kết quả đã chạy trong lượt triển khai này:

| Kiểm tra | Kết quả |
| --- | --- |
| Build | `npm run build` thành công; esbuild cần chạy ngoài sandbox Windows do quyền đọc thư mục cha |
| State + rig mới | 5/5 test pass; kiểm tra contact toàn mesh ở các frame mẫu và clearance sau blend |
| Browser map mới | Desktop 1200×740, touch 844×390, portrait 390×844 qua iframe đều đi hết vòng và replay/back; orbit và joystick hoạt động |
| Mobile thấp/fullscreen | Viewport 740×320, replay không bị che; vào/thoát fullscreen pass trên Chrome giả lập |
| Hình ảnh/chuyển động | Đã xem ảnh theo giai đoạn và chuỗi frame bò đang chạy trước/nghiêng, sửa roll mặt vây và bóng theo dốc; chưa xem trên điện thoại thật |
| Hồi quy | `npm test` (15 loài), `game-actions.mjs` desktop/mobile, `ocean-play.mjs` desktop/mobile, `ocean-course.mjs`, `roam-interaction.mjs` pass |

`world-routes.mjs` cập nhật kỳ vọng riêng loggerhead từ 6 lên 7 ô vì thêm entry map; các loài khác vẫn 6. Test browser icon kiểm tra ảnh SVG decode được để tránh bỏ sót lỗi MIME.

Lỗi có sẵn cần biết: `node tests/roam-collision.mjs` qua land nhưng fail `obstacle` trên sea. Đã tái lập cùng lỗi bằng **cả source và test từ HEAD c3a4728**, lưu bản đối chứng trong `artifacts/baseline/`; `src/core/roam-world.js` không bị sửa trong task. Không quy lỗi này cho map mới hoặc báo toàn bộ bộ test xanh.

Chưa commit/push/deploy. README và `.vscode/` có thay đổi trước task được giữ nguyên.

## Sửa theo phản hồi hình ảnh và thao tác — 02/10/2026

Bản trước bị người dùng đánh giá map trống, bò chậm/xấu và làm tổ khó chịu. Đã tăng tốc bò 0.9 → 2.1, bước 1.5 → 2.7 để tránh tăng tốc vẫy vây theo cùng tỉ lệ, giảm biên độ thu vây và giới hạn anchor quá xa. Giữ solver contact, không thay bind/weights. Bãi biển thêm cồn cát, cụm dừa, vỏ sò, texture cát procedural và bọt cong; không đổi sampling nền đang dùng cho rig.

Làm tổ giờ bấm một lần chạy liên tục qua 5 bước, có Dừng/tiếp tục; input đi bị giữ trong lúc làm tổ để tránh hủy nhầm. Muốn rời tổ phải Dừng. Sau che tổ tự trả quyền di chuyển để về biển. Hình cắt chỉ hiện lúc đẻ/lấp, HUD gọn có tiến trình. Các mô tả phía trên về bấm từng bước hoặc đi để hủy là hành vi cũ.

Đã kiểm tra state/rig thật 5 test qua; browser desktop, landscape và portrait qua iframe đã đi hết chuỗi làm tổ/replay/back. Chất lượng chuyển động là minh họa, cần người dùng xem lại; không khẳng định chính xác sinh cơ học hoặc đạt trên điện thoại vật lý.

### Tham chiếu bò do người dùng chỉ định

Video trên `/animal/loggerhead/topics/growth` ở bản Vercel, asset `/assets/knowledge/ocean/loggerhead/growth.mp4`, được xem theo chuỗi frame đoạn khoảng 1–2.5 giây. Người dùng muốn nguyên lý đặt vây xuống cát rồi kéo thân qua điểm chống, nhấc/thu/đưa vây ra trước; không phải quét ngang như bơi. Đã đổi quỹ đạo trước–sau của vây, pha sau lệch nhẹ, giảm dao động đầu và điều biến nhẹ tốc độ tiến theo chu kỳ. Video minh họa rùa con, không coi là bằng chứng sinh cơ học của rùa trưởng thành.

### Sửa vây gập xuyên thân sau phản hồi

Bỏ CCD kéo nhiều khớp về contact anchor trong crawl vì không có giới hạn tránh thân. Tăng hướng outboard của các đốt vây; giới hạn chỉnh vai/hông tối đa 0.25 rad quanh pose đã dựng. Đã thêm regression kiểm tra các đốt vây không gập ngược vào trong qua nhiều chu kỳ/hướng; 3 test rig qua, build qua, đã xem chuỗi frame bên hông trên bãi trống. Kiểm tra này không phải phép chứng minh không tự giao nhau của toàn bộ mesh; chất lượng animation vẫn cần người dùng review. Không khẳng định chống trượt tuyệt đối sau khi bỏ anchor CCD.

### Mặt cát có texture ảnh

`assets/textures/shore-sand-v2.webp` là ảnh cát tạo bằng imagegen (không phải ảnh chụp thực địa), dùng tại `turtle-shore-world.js`, tile mirror 24 lần trên nền 120 đơn vị, tint cát khô trung tính và cát ướt sẫm hơn. Thay canvas nhiễu cũ, giữ nguyên terrain/contact. Bump nhẹ chỉ minh họa chi tiết, không thay geometry va chạm.

### Tổ và trứng trong cảnh 3D

Đã bỏ thẻ nesting-cutaway. Module turtle-nest-model.js dựng lòng hố 3D ở sau đuôi, trứng sphere rơi lần lượt xuống, lấp bằng nâng bề mặt lòng hố rồi đóng lại. Terrain shader bỏ phần mặt cát trong vòng hố; sampling di chuyển vẫn dùng nền gốc để rùa không tụt xuống hố. Không mô phỏng đào voxel/vật lý cát. Số trứng và thời gian là rút gọn. Có texture cát chung, dispose/reset khôi phục mặt đất. Build, 4 test state/geometry, browser desktop/landscape/portrait đã qua; đã xem ảnh lúc đẻ, không còn thẻ minh họa. Chưa push.


## Cá voi xanh — ô cuối đại dương (02/10/2026)

- Thay ô Amplectobelua bằng `blueWhale`, vẫn khóa: hiển thị preview bơi và ổ khóa, chặn mở trang chi tiết kể cả URL trực tiếp. Không đưa vào vòng random trên trang chủ.
- Model từ `blue-whale.zip`, FBX và texture tại `assets/sea/blue-whale/`. Dùng clip gốc `clip0`; bỏ geometry đường điều khiển rig khi load, giữ hierarchy animation.
- Giữ asset Amplectobelua nhưng ẩn khỏi danh sách. Preview riêng `assets/action-previews/blueWhale-clip0.webp`.
- Đã build và kiểm tra ô cuối/khóa/URL trực tiếp trên viewport 1366×768 và 844×390.
