# Chuẩn source và runtime cho model 3D tương tác

Tài liệu độc lập để mang sang dự án hoặc session AI mới. Không cần lịch sử hội thoại, source demo cũ hay đường dẫn trên máy người viết để hiểu và áp dụng.

Áp dụng cho model Three.js: đồ vật, máy móc, nhân vật, động vật và môi trường; dùng trong viewer, game, ứng dụng học tập hoặc mô phỏng. JavaScript và TypeScript đều được. Khi dự án đã có quy ước tương đương, giữ quy ước đó và viết adapter nếu cần; không đổi toàn bộ cấu trúc chỉ để khớp tên file trong tài liệu.

Đây là **quy ước kiến trúc của dự án**, lấy cảm hứng từ cách tổ chức model của img2threejs: factory, bộ phận có tên, pivots, sockets và controller riêng. Đây không phải đặc tả chính thức của img2threejs và không chứng nhận model đã qua pipeline/gate của skill đó. Nếu task yêu cầu chạy skill img2threejs, phải đọc skill đang có trong session và thực hiện đúng quy trình của nó.

## 1. Hướng dẫn cho AI trong session mới

Khi người dùng yêu cầu “làm theo chuẩn này”, hiểu là:

1. Giao **source có thể sửa và build lại**, không chỉ HTML/JS đã bundle hoặc một model nhìn được nhưng không có cấu trúc tương tác.
2. Tách phần dựng/load model, dữ liệu, controller và viewer/gameplay.
3. Cung cấp factory tạo model và contract runtime có tên ổn định để ứng dụng sử dụng.
4. Khai báo đúng những bộ phận, socket, rig và action thực sự có. Không tạo tên giả để trông như đủ chuẩn.
5. Không mặc định phải dựng procedural, có skeleton, tháo rời, animation, nội dung học tập hoặc xuất HTML offline. Chọn theo yêu cầu và asset thực tế.
6. Kiểm tra asset/source trước khi quyết định kỹ thuật. Chỉ hỏi thêm khi thiếu thông tin ảnh hưởng đáng kể tới kết quả; tự xử lý các lựa chọn triển khai thông thường.
7. Kiểm chứng model, tương tác, reset và vòng đời tài nguyên trước khi báo hoàn tất. Nói rõ phần đã thử, chưa thử và giới hạn.

Tài liệu này không tự cấp quyền push, deploy, thay asset, mở rộng sản phẩm hoặc sửa các phần ngoài yêu cầu người dùng.

### Đoạn có thể gửi cho session mới

> Đọc `docs/model-structure-standard.md` và áp dụng làm chuẩn kiến trúc cho task này. Trước tiên kiểm tra source và asset hiện có; giữ kiến trúc tương thích nếu đã có. Tôi cần source model có thể tái sử dụng, factory + runtime rõ ràng, controller tách khỏi geometry, viewer/gameplay gọi qua contract. Không giao riêng file HTML đã bundle. Chỉ triển khai các capability cần cho task và thực sự được asset hỗ trợ. Hoàn tất bằng build/kiểm tra phù hợp, hướng dẫn chạy và ghi rõ giới hạn.

Đính kèm thêm yêu cầu cụ thể về model, reference/asset, tương tác mong muốn và thiết bị mục tiêu. Tài liệu này mô tả **cách tổ chức**, không thay thế mô tả sản phẩm.

## 2. Ranh giới trách nhiệm

| Thành phần | Chịu trách nhiệm | Không nên chứa |
| --- | --- | --- |
| Model factory | Dựng/load geometry, material, hierarchy; khai báo runtime; quản lý tài nguyên thuộc model | DOM, phím/chuột, route, vòng render riêng |
| Metadata/config | ID, bộ phận, action, đơn vị, nguồn asset, tham số | Trạng thái UI hoặc scene toàn cục |
| Controller | Trạng thái action, mixer, pose, transition, reset | Tạo renderer hoặc tự gắn listener toàn trang |
| Viewer | Renderer, camera, ánh sáng trình bày, picking, UI | Logic nội bộ của khớp hoặc phụ thuộc tên mesh sâu trong asset |
| Gameplay | Input, di chuyển, nhiệm vụ, va chạm, luật chơi | Can thiệp tùy tiện vào bone đang do controller điều khiển |

Ứng dụng sở hữu vòng `requestAnimationFrame` và gọi `controller.update(dt)`. `dt` tính bằng **giây**. Model không tự mở vòng render nền khi được import.

## 3. Factory và cây object

API mặc định:

```js
export function createExampleModel(options = {}) {
  // Dựng model và runtime, rồi trả về THREE.Group.
  return root;
}

// Với asset cần tải:
export async function loadExampleModel(options = {}) {
  // Tải, kiểm tra, chuẩn hóa và trả về THREE.Group.
  return root;
}
```

Factory tạo instance độc lập. Nếu cache geometry/material/texture, phải khai báo cách chia sẻ và giải phóng. Không âm thầm thay đổi scene, camera hay model khác.

Cây tham khảo:

```text
placementRoot                  # ứng dụng điều khiển vị trí, hướng, scale
  modelRoot                    # factory trả về; chứa sculptRuntime
    visualRoot                 # hiệu chỉnh trục/kích thước asset
      componentPivot           # bộ phận cứng chuyển động quanh pivot
        mesh
        socket
      rigRoot                  # nếu có skeleton; giữ hierarchy/bind pose
        skinnedMesh / bones
    pickProxies                # nếu cần proxy để chọn
```

Không bắt buộc tạo tất cả các lớp nếu model đơn giản. Tuy nhiên phải phân biệt transform do ứng dụng quản lý với transform của animation để reset action không đưa nhân vật về gốc thế giới hoặc xóa hướng người chơi đang chọn.

### Trục, đơn vị và điểm gốc

- Chọn và ghi rõ đơn vị, trục lên, hướng trước, điểm gốc. Mặc định đề xuất: mét, `+Y` là lên, `-Z` là trước.
- Nếu engine hoặc asset dùng quy ước khác, normalize ở wrapper hoặc khai báo adapter. Không đoán hướng trước từ bounding box.
- Ghi rõ điểm tiếp đất/điểm đặt, pivot quay và kích thước tham chiếu ở pose nào.
- Bounds tĩnh không đại diện cho mọi frame animation. Nếu dùng để framing hoặc va chạm, chọn bounds phù hợp và nêu rõ cách tính.
- Pivot của bản lề/khớp phải đặt đúng vị trí. Không bù lỗi pivot bằng offset phụ thuộc từng góc camera.

## 4. Contract `root.userData.sculptRuntime`

Contract đề xuất phiên bản 1. Đây là object runtime chứa tham chiếu Three.js, **không phải JSON để lưu thẳng**. Ví dụ dưới đây là sơ đồ; các biến tham chiếu phải được tạo trước khi gán:

```js
root.userData.sculptRuntime = {
  schemaVersion: 1,
  id: 'example_model',
  coordinates: {
    unit: 'meter', up: '+Y', forward: '-Z', origin: 'ground_center'
  },
  nodes: { body: bodyGroup },
  meshes: { body: bodyMesh },
  pivots: {},
  sockets: { inspect: inspectAnchor },
  colliders: {},
  assemblies: {},
  animations: {},
  bounds: {
    space: 'model-local', pose: 'rest',
    min: [-0.5, 0, -0.3], max: [0.5, 1, 0.3]
  },
  provenance: {
    route: 'procedural',
    sources: [],
    modifications: [],
    limitations: []
  },
  dispose() {
    // Giải phóng đúng tài nguyên do instance này sở hữu.
  }
};
```

### Trường bắt buộc và tùy chọn

| Trường | Quy tắc |
| --- | --- |
| `schemaVersion`, `id` | Bắt buộc; version contract và ID loại model ổn định |
| `coordinates` | Bắt buộc; đủ để hiểu transform và đơn vị |
| `nodes`, `meshes` | Bắt buộc có registry; đăng ký các object mà ứng dụng cần truy cập |
| `pivots`, `sockets`, `colliders`, `assemblies`, `animations` | Bắt buộc có registry, được để `{}` khi không có capability tương ứng |
| `provenance` | Bắt buộc; ghi nguồn, cách tạo và giới hạn trung thực |
| `dispose` | Bắt buộc; gọi nhiều lần không gây lỗi hoặc dispose nhầm tài nguyên chia sẻ |
| `bounds` | Có khi cần framing/đo kích thước; ghi hệ tọa độ và pose tham chiếu |
| `rig` | Chỉ có khi thực sự có rig được hỗ trợ |

Ứng dụng gọi `runtime.nodes.body` hoặc `runtime.sockets.inspect`, không dựa vào `children[3]` hay tên mesh phát sinh từ phần mềm xuất file. Có thể giữ tên gốc bên trong và ánh xạ sang alias ổn định.

Không dùng `root.clone()` hoặc `JSON.stringify(root.userData)` như cơ chế sao chép runtime: tham chiếu object, function và vòng tham chiếu có thể không được giữ đúng. Clone qua factory/loader phù hợp, sau đó dựng lại registry cho instance mới; rigged asset cần clone skeleton đúng cách.

### Ngữ nghĩa registry

- `nodes`: group/bone/object dùng làm điểm điều khiển công khai.
- `meshes`: mesh hiển thị cần truy cập, không bắt buộc đăng ký mọi chi tiết trang trí.
- `pivots`: điểm quay/trượt có chủ đích; không nhất thiết là mesh.
- `sockets`: `Object3D` neo nhãn, hiệu ứng, vật cầm, điểm quan sát hoặc tiếp xúc. Gắn dưới bộ phận/bone phù hợp để đi theo chuyển động.
- `colliders`: mô tả va chạm đơn giản; ghi `shape`, kích thước, offset và node/hệ tọa độ tham chiếu. Đây chưa phải collider vật lý đã đăng ký vào engine.
- `assemblies`: bộ phận tháo/lắp; khai báo node, parent/pivot, pose lắp chuẩn và giới hạn chuyển động nếu có.
- `animations`: descriptor action được controller hỗ trợ. Không trộn tùy ý `null`, clip và function trong cùng contract.

Ví dụ descriptor action:

```js
animations: {
  idle: { kind: 'clip', clip: idleClip, loop: true, duration: 2 },
  open: { kind: 'procedural', loop: false, duration: 0.8 }
}
```

`duration` tính bằng giây. Action điều khiển liên tục hoặc theo trạng thái có thể dùng `duration: null` và mô tả điều kiện kết thúc. Không khai báo action chưa triển khai như thể đã chạy được.

## 5. Model procedural, imported và hybrid

Chọn kỹ thuật theo yêu cầu, chất lượng asset và ngân sách hiệu năng; không coi một kỹ thuật là bắt buộc cho mọi model.

| `provenance.route` | Ý nghĩa |
| --- | --- |
| `procedural` | Geometry được dựng bằng code |
| `imported-static` | Asset được load và bọc, không điều khiển bằng skeleton |
| `imported-rigged` | Asset được load với skeleton/skin |
| `measured-code` | Dữ liệu hình học đo/trích từ nguồn rồi đóng gói thành module; không cần load asset gốc khi chạy |
| `hybrid` | Kết hợp nhiều kỹ thuật; ghi rõ phần nào dùng cách nào |

Với dự án đã dùng tên route khác, giữ tương thích và mô tả mapping. Mỗi source nên có đường dẫn tương đối hoặc URL nguồn, định dạng, tác giả/license nếu biết, cùng các bước chỉnh sửa. Không tự suy đoán license.

Trước khi dùng model import, kiểm tra mesh/material/texture, bounds, trục, skeleton, skin weights, clip và decoder cần thiết. Không coi tên file là bằng chứng asset có rig hoặc animation.

Model tĩnh một khối không tự có khả năng cử động từng chi. Với model rigged, giữ bind pose, inverse bind matrices và hierarchy; không reparent hoặc scale bone tùy tiện. `measured-code` chỉ thay cách biểu diễn/phân phối geometry, không tự tạo rig hay quyền sử dụng asset.

## 6. Controller và animation

API tham khảo; có thể dùng adapter cho API sẵn có:

```js
const controller = createExampleController(root);
controller.play('open');    // false hoặc lỗi rõ ràng nếu action không tồn tại
controller.update(dt);      // ứng dụng gọi mỗi frame
controller.reset();         // khôi phục pose/trạng thái gốc
controller.dispose();      // dừng mixer và giải phóng phần controller sở hữu
```

Nêu rõ hành vi khi gọi action đang chạy: bỏ qua, restart, queue hay blend. Nếu có pause, tốc độ, loop, root motion hoặc sự kiện hoàn tất, ghi contract tương ứng. Không tự gắn phím số hoặc nút UI trong controller.

Quy tắc animation:

1. Lưu pose gốc; tính pose theo thời gian/trạng thái. Không cộng transform vào frame trước gây trôi sau nhiều lần play/reset.
2. Phân biệt local space với world space, trục của model với trục bone. Kiểm tra hướng quay thực tế thay vì đoán tên trục.
3. Với procedural pose phủ lên mixer: khôi phục offset cũ → cập nhật mixer → áp offset mới. Có chuyển tiếp vào/ra để tránh giật.
4. Hành động có chuẩn bị, thực hiện và hồi phục phù hợp; phối hợp các khớp cần thiết. Xoay/dịch cả root không thay thế cho chuyển động chi, đầu hoặc khớp.
5. Chuyển động có tiếp xúc phải kiểm tra tiếp đất, điểm cầm/chạm, trượt chân và xuyên vật. Không giả định bounds của rest pose đủ cho mọi action.
6. Loop phải nối được ở cuối/đầu; action một lần phải có kết thúc và trả quyền điều khiển rõ ràng.
7. Gameplay và clip không được cùng áp root motion hai lần. Chọn một bên điều khiển di chuyển hoặc trích root motion qua adapter.
8. Kiểm tra khi đứng yên, khi di chuyển, đổi hướng, ngắt action và reset lặp lại nếu các trường hợp đó được hỗ trợ.

Nếu asset thiếu khớp cần thiết, ghi giới hạn hoặc đề xuất chỉnh rig; không giả tạo capability bằng biến dạng sai cấu trúc.

## 7. Picking, UI và metadata nghiệp vụ

Picking có thể dùng mesh thật hoặc proxy đơn giản. Gắn ID ổn định và xử lý click vào mesh con về đúng bộ phận. Proxy chỉ phục vụ picking không được vô tình hiện lên hay cản thao tác orbit.

Nhãn/hiệu ứng lấy vị trí world từ socket rồi project sang màn hình. UI tự xử lý bị che khuất, mép màn hình, safe area và kích thước nhỏ. Không hard-code tọa độ màn hình làm điểm neo model.

Metadata nghiệp vụ là **phần mở rộng tùy chọn**: từ vựng, đa ngôn ngữ, inventory, nhiệm vụ, thông số kỹ thuật… Để trong module dữ liệu riêng, tham chiếu model/part/action bằng ID. Không bắt buộc `learningObject`, vai trò nhân vật, ngôn ngữ UI hoặc loại gameplay nào trong chuẩn lõi.

## 8. Source và bản build

Cấu trúc tham khảo, không phải tên đường dẫn bắt buộc:

```text
src/
  models/<model-id>/
    createModel.js             # hoặc loadModel.js
    materials.js
    metadata.js
    controller.js              # khi có hành động
    rig.js                     # khi cần adapter skeleton
  viewer/                     # renderer, camera, input, UI
  gameplay/                   # nếu sản phẩm có game
assets/
  models/                     # asset cần lúc chạy
  textures/
scripts/                      # build, preprocess, kiểm tra
tests/
docs/
package.json
package-lock.json             # hoặc lockfile của package manager đã chọn
README.md
dist/                         # kết quả build
```

Model nhỏ có thể gộp file; không tạo module trống chỉ để đủ cây. Giữ asset gốc/reference riêng với asset tối ưu và mô tả bước chuyển đổi khi có. Dùng đường dẫn tương đối hoặc resolver của dự án, không dùng đường dẫn máy cá nhân.

Bộ bàn giao cần:

- Source dễ sửa, toàn bộ dependency nội bộ cần thiết và các asset được phép phân phối.
- Manifest, lockfile, lệnh cài/build và hướng dẫn mở/chạy demo.
- Ghi rõ dependency ngoài, decoder và yêu cầu mạng/offline.
- Test/script kiểm chứng phù hợp, tài liệu runtime/action và giới hạn còn lại.
- Build tái lập từ checkout sạch, không nhờ ngầm vào `node_modules` hoặc file của dự án khác.

HTML nhúng toàn bộ hoặc JS minify là **artifact bổ sung**, không thay source. Nếu cần offline, kiểm tra thực tế không tải tài nguyên mạng. Nếu repo giữ cả artifact, nêu lệnh tái tạo và cách giữ đồng bộ. Chỉ publish thư mục output cần thiết; không vô tình đưa asset gốc, secrets, tests hoặc file tạm vào site.

## 9. Vòng đời và hiệu năng

Ứng dụng chịu trách nhiệm tháo model khỏi scene, hủy listener/input và ngừng update trước khi dispose. Controller và factory phải phân định tài nguyên sở hữu; tài nguyên chia sẻ cần cache/ref-count hoặc cơ chế tương đương. Không dispose texture dùng chung trong khi instance khác còn dùng.

Với load bất đồng bộ, xử lý lỗi và yêu cầu đã lỗi thời: người dùng rời màn trước khi load xong thì kết quả cũ không được gắn vào scene mới. Thử load/unload lặp để phát hiện listener, mixer hoặc GPU resource bị giữ lại.

Không dùng một ngưỡng triangle/FPS chung làm bằng chứng đạt hiệu năng. Chọn ngân sách theo thiết bị, số model cùng xuất hiện, rig, material, texture, shadows và hậu kỳ; đo trên scene thật.

Tối thiểu ghi nhận kích thước tải, triangle/draw call, texture và thời gian tải/render khi cần tối ưu. Xem xét instancing/LOD, proxy picking, giới hạn pixel ratio và chỉ update nội dung đang cần. Không đổi chất lượng asset hoặc công bố FPS trên điện thoại thật chỉ dựa vào giả lập desktop.

## 10. Kiểm chứng trước khi bàn giao

Chọn kiểm tra theo capability đã triển khai; đánh dấu không áp dụng khi model không có tính năng đó.

- **Cấu trúc:** factory tạo được model, registry trỏ đúng instance, ID/API ổn định, không thiếu import/asset.
- **Hình ảnh:** xem trước/nghiêng/sau; đúng scale, trục, pivot, material, texture, normals và điểm đặt.
- **Tương tác:** picking đúng bộ phận, socket bám đúng khi animate, orbit/UI không tranh input.
- **Animation:** play/loop/transition/reset đúng; không trôi transform, không phá placement của ứng dụng; kiểm tra tiếp xúc và biến dạng rig.
- **Vòng đời:** nhiều instance không điều khiển nhầm nhau; load/unload/dispose và tải lỗi được xử lý.
- **Thiết bị:** kiểm tra kích thước màn hình và phương thức input thuộc phạm vi yêu cầu; phân biệt giả lập với thiết bị thật.
- **Build:** cài/build theo README trong môi trường độc lập; không có file máy cá nhân bị phụ thuộc ngầm; artifact khớp source.

Test logic tập trung vào trạng thái, reset, giới hạn và các lỗi có nguy cơ tái diễn. Ảnh/render review dùng cho chất lượng hình và chuyển động; unit test không thay thế việc nhìn model. Báo cáo kết quả thực tế, không ghi “đạt chuẩn” khi chưa kiểm chứng.

## 11. Áp dụng vào dự án có sẵn

1. Đọc cấu trúc repo và hướng dẫn nội bộ; xác định factory/controller/viewer hiện có.
2. Liệt kê capability của model thật và yêu cầu của task.
3. Bổ sung hoặc ánh xạ contract cần thiết; giữ API đang được ứng dụng dùng.
4. Chỉ refactor phần liên quan, tránh đổi hành vi hoặc tên ID ngoài phạm vi.
5. Kiểm tra tính năng hiện có sau khi tích hợp; cập nhật README/runtime docs.

Quy ước đặt tên ưu tiên của repo. Nếu chưa có: model/part/action ID dùng `snake_case`, key JS dùng `camelCase`, tên mang nghĩa chức năng. Không dùng `mesh001`, `group2`, chỉ số child hoặc tên xuất ngẫu nhiên làm API công khai.

Kết quả mong muốn: người khác hoặc một session AI mới có thể đọc README và contract, build repo, tạo model, điều khiển action, gắn UI và giải phóng tài nguyên mà không phải suy ngược từ một file HTML minify hay từ lịch sử hội thoại.
