# Animal World

Web demo with a biome home map, prehistoric branch (6 models), ocean branch (8 visible models; 4 retained but hidden), model introduction and looping animation viewer.

## Local

Run `npm ci`, `npm run build`, then `npm start`. Open http://127.0.0.1:4175.

## Routes

- `/`: Animal World, two available regions and five locked regions.
- `/world/dinosaurs`, `/world/ocean`: species maps.
- `/animal/trex`, `/animal/seal`: introduction.
- `/animal/trex/actions/roar`: looping action.
- `/animal/trex/topics/growth`: completed T-Rex illustrated knowledge.

Browser back/forward and direct refresh use History API and server fallbacks. Old index hash links migrate to clean routes. T-Rex and loggerhead have illustrated knowledge topics. All marine species share the same six category icons; other species show unavailable feedback. The speech practice card is removed for all species.

`/animal/loggerhead/topics/habitat` opens the marine knowledge sample. `isopod`, `hawksbill`, `whale`, and `paShark` are hidden via `hiddenMarineIds`; their previous routes redirect to the ocean map. Original files remain available for repair.

## Assets and animation

`src/marine.js` maps each unique GLB/FBX to its supplied texture and environment. Original clips are retained. Great white shark has no original skeletal animation: its display motion is a small drift. Giant isopod has no rig/clip and currently provides a static observation action. These are not newly rigged locomotion cycles. Duplicate Copy archives are excluded. Generated environments and maps are in `assets/worlds`; model-based portraits and per-action alpha sprites are in `assets/portraits` and `assets/action-previews`.

Run `node scripts/render-action-previews.mjs [species IDs]` after model changes, then rebuild. Some original assets are large (up to about 60 MB per model), so this is a demonstration build; models load on demand. FBX texture mappings are explicit in the manifest.

## Verification

With the local server running, `npm test` verifies home/branch navigation, direct URLs, refresh, every action across 14 visible models and mobile layout. Tests use installed Google Chrome and Playwright. Earlier learning tests remain as historical files but are not part of the current no-speech-card workflow.

Run `node tests/ocean-topics.mjs` for the shared icon, hidden-route, topic and responsive map checks; `node tests/world-interaction.mjs` for marine drag/zoom and navigation. New artwork and full generation prompts: `assets/knowledge/ocean/`, `docs/ocean-topic-art.json`. Loggerhead factual reference: NOAA Fisheries species page, linked within each topic.

## Vercel

Import DanhBNg/dinosour_game, root directory repository root. The supplied vercel.json uses `npm ci`, `npm run build`, output `dist`, and clean-route rewrites. No database or environment variables required. This update has not been pushed automatically.

### Nội dung loài — đợt bổ sung 29/09/2026

- Sáu mục đã có nội dung riêng cho Stegosaurus, Triceratops, Deinonychus, Pterosaur và Mosasaurus; bảy model biển còn lại cũng đã có tranh riêng. T-Rex và rùa quản đồng giữ các bài minh họa chuyên biệt hiện có.
- Dữ liệu: src/species-knowledge-data.js và src/marine-knowledge-data.js. Mỗi mục gồm nhãn ngắn, lời đọc, ghi chú và nguồn; có thể ghi đè nguồn theo từng mục.
- Mỗi mục đã có tranh toàn cảnh riêng và vùng chạm để nghe, với ghi chú dài nằm trong nút ⓘ. Trang animation không thêm lại thẻ nghe/nói.
- Seal, bobtail squid, tuna, Black_White_Fish chưa được xác định đến loài: thông tin ví dụ ghi rõ loài tham chiếu, không coi đó là định danh model. Pterosaur chỉ ở cấp nhóm; Amplectobelua đã tuyệt chủng. Không tự điền con số vào trường chưa đủ bằng chứng.
- Kiểm tra: node tests/species-knowledge.mjs (cần server cổng 4175 và Chrome).

### Dedicated illustrated knowledge scenes

Stegosaurus and Triceratops now each have six independent panorama illustrations, image-aligned listening targets, growth-stage highlights, size comparison labels and fossil-region markers. On narrow screens, swipe the illustration horizontally or use the side arrows. These are educational reconstructions, with sources and limitations available through the information button. All six prehistoric entries now have dedicated picture lessons. All eight visible marine entries also have dedicated illustrated topics, including the existing loggerhead sample.

Validation: `node tests/stego-exploration.mjs` and `node tests/trice-exploration.mjs` (local server on port 4175).

### Complete prehistoric branch

Deinonychus, Pterosaur and Mosasaurus each have six dedicated full-screen illustrations with listening/highlight targets. Pterosaur uses a wing-anatomy topic (the existing footprints URL remains compatible); Deinonychus has a two-toed track icon; Mosasaurus has swimming and live-young illustrations. Growth arrows are embedded in the artwork. Modern maps identify example fossil locations, not living distributions. Size comparisons state reference species and uncertainty; generated drawings are educational reconstructions rather than measured diagrams.

Data: `src/remaining-dino-exploration.js`. Art and prompts: `assets/knowledge/{deino,ptero,mosa}/`, `docs/remaining-dino-art.json`. Verify with `node tests/remaining-dinos.mjs`, plus the Stegosaurus/Triceratops suites and `npm test`. Mobile panoramas support horizontal swiping.

### Complete marine branch

Seal, bobtail squid, tuna, Chromodoris annae, great white shark, bannerfish reference and Amplectobelua now each have six independent panoramas. Tap animals, food, body parts, growth stages and map markers to highlight and hear short explanations. The same six illustrated marine icons are shared; the existing loggerhead lessons remain intact. Narrow screens pan horizontally without stretching the artwork. No listening/speaking card is added to the animation page.

Generic model names remain explicitly linked to reference species, not treated as confirmed identifications. Size cards distinguish example specimens, maximum lengths and human comparison dimensions. Slug and Amplectobelua do not receive invented numerical sizes. Amplectobelua growth uses a fossil investigation rather than an unsupported egg/larva cycle. Generated fossils, maps and anatomical illustrations are reconstructions, not specimen photographs or calibrated diagrams.

Source data: `src/marine-knowledge-data.js`; artwork-aligned targets: `src/marine-exploration.js`; generated assets and prompts: `assets/knowledge/{seal,squid,tuna,slug,shark,fish,amplectobelua}/`, `docs/marine-knowledge-art.json`. Sources appear behind ⓘ in each scene.

Verification with local server on port 4175: `node tests/marine-exploration.mjs` (42 topics at three viewport sizes), `node tests/illustrated-switching.mjs`, `node tests/ocean-topics.mjs`, and `npm test`. `tests/species-knowledge.mjs` forwards to the new marine suite, superseding the old generic-card checks.

### Brachiosaurus

User-supplied `branchiosaurussf.glb` is now `assets/brachio.glb`, with embedded textures, original rig and its one original animation. Open `/animal/brachio` or select it in the dinosaur map. The action loops; drag/zoom and camera reset use the existing viewer. Six knowledge topics are pending and remain disabled. The generated hero uses a rendered model reference; preview sprites use the actual model. Verify with `node tests/brachio.mjs`.

### Mobile

Touch devices require landscape orientation. A blocking rotate-device screen appears immediately in portrait, including direct links, and reappears when the device returns to portrait. Background controls are inert. The app attempts orientation locking; the start button requests fullscreen and retries the lock on browsers requiring a user gesture. Unsupported browsers remain gated until physical rotation. Desktop navigation is unaffected.

Landscape layouts account for safe areas and browser viewport height, with one-row scrolling trays. Model loading shows the selected animal with a waiting ring and retry on failure. Settings controls have been removed throughout the app.

Run `node tests/mobile-refresh.mjs` against the local server. Browser tests emulate viewport changes and supported/unsupported orientation APIs; real device testing remains necessary for OS/browser fullscreen restrictions.

Mobile browser bars: the layout follows VisualViewport resize/scroll events at normal zoom, with innerHeight fallback. Under 350px available landscape height, trays and spacing become compact while touch controls stay usable. Fullscreen is optional; selecting a world no longer automatically enters fullscreen. Pinch zoom is not reset.
