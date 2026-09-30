# Animal Explorer Cards – Animal World 3D

## 1. Tổng quan ý tưởng

**Animal Explorer Cards** là hệ thống gameplay mở rộng cho app **Animal World 3D**, trong đó:

- Mỗi con vật sau khi khám phá xong sẽ mở khóa **1 thẻ bài**.
- Thẻ được thêm vào **bộ sưu tập số** trong app.
- Thẻ có thể dùng để tham gia **Chuyến thám hiểm hàng ngày**.
- Thẻ có thể được **in ra bản cứng** để chơi ngoài đời.
- Thẻ vật lý có thể được quét để mở **AR**.
- Hệ thống nhiệm vụ có thể tự động mở rộng bằng dữ liệu và AI.

Core loop:

> **Explore → Unlock → Collect → Solve → Level Up**

Mục tiêu là biến việc khám phá động vật từ một hoạt động xem nội dung thành một hệ thống có progression lâu dài.

---

# 2. Vấn đề cần giải quyết

Nếu app chỉ tập trung vào:

- xem mô hình 3D
- nghe tiếng kêu
- xem môi trường sống
- xem dấu chân
- xem kích thước
- xem thức ăn

thì sau khi người dùng đã khám phá hết động vật, trải nghiệm gần như kết thúc.

Animal Explorer Cards giải quyết vấn đề này bằng cách biến mỗi con vật thành một **tài nguyên gameplay**.

Mỗi con vật khám phá thêm sẽ:

- mở thêm một thẻ mới
- tăng số cách giải nhiệm vụ
- mở thêm tổ hợp card
- giúp người chơi hoàn thành nhiệm vụ khó hơn
- tăng giá trị của bộ sưu tập

---

# 3. Core Concept

## 3.1. Mỗi con vật = một thẻ bài

Ví dụ người chơi khám phá xong **T-Rex**.

Sau khi hoàn thành các nội dung:

- môi trường sống
- thức ăn
- kích thước
- dấu chân
- hành vi
- vòng đời

người chơi nhận:

> **T-Rex Card**

Card này được lưu vào bộ sưu tập.

---

## 3.2. Card không chỉ để sưu tập

Card được dùng như một đơn vị gameplay.

Ví dụ một nhiệm vụ yêu cầu:

- 🌊 sống dưới nước
- 🥩 ăn thịt
- 📏 kích thước lớn

Người chơi phải chọn card phù hợp từ bộ sưu tập của mình.

---

## 3.3. Không chia thành quá nhiều game mode

Không tạo riêng:

- Guess Animal Mode
- Compare Mode
- Team Mode
- Set Collection Mode
- Mission Card Mode

Tất cả được gom vào một hệ thống:

# **Daily Expedition – Chuyến thám hiểm hàng ngày**

Mỗi ngày hệ thống thay đổi luật chơi.

---

# 4. Core Loop sản phẩm

## Bước 1 – Explore

Người chơi vào thế giới động vật.

Ví dụ:

- Ancient World
- Ocean
- Savannah
- Polar
- Jungle

Chọn một con vật để khám phá.

---

## Bước 2 – Unlock

Sau khi hoàn thành khám phá:

> **New Card Unlocked**

Ví dụ:

**T-Rex**

Card xuất hiện với animation ngắn.

---

## Bước 3 – Collect

Card được đưa vào:

> **Animal Card Album**

Trong Album:

- Card đã mở: full color
- Card chưa mở: silhouette
- Card mới: có hiệu ứng NEW

---

## Bước 4 – Solve

Người chơi dùng card để hoàn thành:

> **Daily Expedition**

Ví dụ:

> 🌊  
> Hãy tìm 3 con vật sống dưới nước.

Người chơi chọn:

- Dolphin
- Shark
- Turtle

---

## Bước 5 – Level Up

Hoàn thành nhiệm vụ nhận:

- EXP
- Star
- badge
- progression
- mở nhiệm vụ khó hơn

---

# 5. Thiết kế thẻ bài

## 5.1. Mặt trước

Mỗi thẻ chỉ nên chứa một số thông tin chuẩn hóa.

Ví dụ T-Rex:

- Ảnh / render con vật
- Tên
- Habitat
- Diet
- Size
- Ability
- Family

Ví dụ:

| Thuộc tính | T-Rex |
|---|---|
| Habitat | 🌳 Land |
| Diet | 🥩 Meat |
| Size | 🔵 Huge |
| Ability | 🏃 Run |
| Family | 🦖 Dinosaur |

Không nên đưa quá nhiều thông tin lên card.

Các nội dung chi tiết như:

- cân nặng
- chiều cao
- tốc độ
- dấu chân
- vòng đời
- phân bố địa lý

vẫn nằm trong màn Discovery.

---

## 5.2. Mặt sau

Mặt sau card vật lý có thể gồm:

- QR / AR marker
- mã card
- silhouette
- pattern nhận diện
- 1 fun fact ngắn
- icon môi trường

Đối với trẻ nhỏ:

- hạn chế chữ
- ưu tiên icon
- ưu tiên hình ảnh
- ưu tiên âm thanh khi scan

---

# 6. Daily Expedition

Daily Expedition là gameplay chính.

Người chơi không cần chọn mode.

Mỗi ngày hệ thống đưa ra một chuyến thám hiểm khác nhau.

Ví dụ:

> 🌊 Đại dương đang cần trợ giúp!  
> Hãy chọn 3 người bạn sống dưới nước.

Người chơi kéo 3 card vào các slot.

Nếu hợp lệ:

- card sáng lên
- phát âm thanh
- animation ngắn
- hoàn thành mission
- nhận EXP

---

# 7. Các loại nhiệm vụ

Tất cả các loại sau chỉ là **rule khác nhau trong cùng hệ thống Daily Expedition**.

---

## 7.1. Find

Ví dụ:

> 🌊  
> Chọn 3 con vật sống dưới nước.

Đáp án có thể gồm:

- Dolphin
- Shark
- Turtle
- Penguin
- Crocodile

Có nhiều đáp án hợp lệ.

---

## 7.2. Avoid

Ví dụ:

> ❄️  
> Chọn 2 con vật không phù hợp với vùng lạnh.

Người chơi phải loại bỏ những card sai.

---

## 7.3. Compare

Ví dụ:

- Elephant
- Giraffe

Câu hỏi:

> 📏 Con nào cao hơn?

Hoặc:

- Penguin
- Elephant
- T-Rex

Yêu cầu:

> Xếp từ nhỏ đến lớn.

---

## 7.4. Mystery Animal

Hệ thống đưa manh mối từng bước.

Ví dụ:

1. 🥩
2. 📏 Huge
3. 🐾 Three toes

Người chơi chọn:

> T-Rex

Nếu chọn sớm với ít clue hơn có thể nhận nhiều điểm hơn.

---

## 7.5. Build a Team

Mission yêu cầu nhiều thuộc tính.

Ví dụ:

> Đội cần:
>
> 🌊  
> 🥩  
> 🏃

Người chơi chọn một nhóm card sao cho tổng thuộc tính của nhóm đáp ứng yêu cầu.

Ví dụ:

- Shark → 🌊 + 🥩
- Cheetah → 🏃

Hai card đã đủ.

Gameplay này giúp:

- không có một đáp án duy nhất
- card collection lớn càng có giá trị
- tạo puzzle nhẹ

---

## 7.6. Group

Ví dụ:

> Gom tất cả động vật sống ở Ocean.

Hoặc:

> Tìm tất cả động vật ăn cỏ.

Hoặc:

> Chọn 3 động vật thuộc nhóm Dinosaur.

---

# 8. Không nên chỉ có một đáp án

Một nguyên tắc quan trọng:

> Nhiệm vụ nên ưu tiên nhiều lời giải hợp lệ.

Ví dụ:

Mission:

> 🌊 + 🥩

Có thể dùng:

- Shark
- Dolphin
- Crocodile

hoặc kết hợp nhiều card.

Điều này giúp:

- bộ card lớn càng mạnh
- nhiệm vụ ít lặp lại
- người chơi có cảm giác tự lựa chọn
- dễ mở rộng số lượng động vật

---

# 9. Cơ chế thiếu card

Đây là một phần quan trọng của loop.

Ví dụ mission yêu cầu:

> ❄️ + 🐟

Nhưng người chơi chưa có card phù hợp.

Không hiển thị:

> Bạn không đủ card.

Thay vào đó:

> 🔍 Có một con vật mới có thể giúp bạn!

Sau đó:

1. Hiện silhouette Penguin.
2. Dẫn người chơi đến Polar World.
3. Người chơi khám phá Penguin.
4. Nhận Penguin Card.
5. Quay lại mission.
6. Hoàn thành nhiệm vụ.

Loop lúc này trở thành:

> **Mission → Missing Card → Discovery → Unlock Card → Mission**

Đây là cách kết nối gameplay card với hệ thống khám phá động vật.

---

# 10. Progression

Progression không chỉ dựa trên EXP.

Độ khó mission tăng cùng kích thước collection.

---

## Level thấp

Người chơi có khoảng 5 card.

Mission:

> Chọn một con ăn thịt.

---

## Level trung bình

Người chơi có khoảng 15 card.

Mission:

> Chọn 3 con sống dưới nước.

---

## Level cao hơn

Người chơi có khoảng 30 card.

Mission:

> Lập đội có đủ:
>
> 🌊 + 🥩 + 🌿

---

## Level cao

Mission:

> Chỉ được dùng tối đa 3 card để phủ đủ:
>
> 🌊  
> 🥩  
> 🏃  
> 📏

Gameplay dần chuyển từ:

> nhận biết thông tin

sang:

> puzzle + chiến thuật nhẹ.

---

# 11. Hệ thống EXP

Người chơi nhận EXP từ:

- khám phá con vật mới
- mở card mới
- hoàn thành Daily Expedition
- hoàn thành mission khó
- hoàn thành nhiệm vụ liên tiếp
- sử dụng card mới

Ví dụ:

| Hoạt động | EXP |
|---|---:|
| Khám phá con vật | +20 |
| Mở card mới | +10 |
| Mission thường | +30 |
| Mission khó | +50 |
| Daily streak | Bonus |

EXP dùng để:

- tăng Explorer Level
- mở thế giới mới
- mở nhiệm vụ mới
- mở hiệu ứng card
- mở reward

---

# 12. Card Album

Card Album là trung tâm progression.

Hiển thị dạng grid.

Ví dụ:

```text
[ T-Rex ] [ Triceratops ] [ ??? ]

[ Shark  ] [ Dolphin      ] [ ??? ]

[ Lion   ] [ Elephant     ] [ ??? ]
```

Card chưa mở:

- silhouette
- khóa
- chỉ hiện vài hint

Ví dụ:

> 🌊  
> 📏 Huge  
> ???

Điều này tạo động lực khám phá.

---

# 13. Physical Cards

Card trong app có thể được in thành card thật.

Có hai loại.

---

## 13.1. Animal Cards

Mỗi con vật = 1 card.

Ví dụ:

- T-Rex
- Elephant
- Dolphin
- Penguin
- Lion

---

## 13.2. Mission Cards

Mission Card chứa rule.

Ví dụ:

```text
🌊 + 🐟 + 📏 Small
```

Người chơi phải tìm card động vật phù hợp.

Mission Card cho phép:

- chơi offline
- chơi với bố mẹ
- chơi với nhiều trẻ
- không cần màn hình liên tục

---

# 14. AR

AR là lớp mở rộng, không phải gameplay bắt buộc.

Người không có card giấy vẫn có thể chơi toàn bộ app.

---

# 15. AR Mode 1 – Scan một card

Quét T-Rex Card.

Trên bàn xuất hiện:

- T-Rex 3D
- animation
- âm thanh
- tên tiếng Anh

Các icon xuất hiện quanh model:

- 🥩 Food
- 🐾 Footprint
- 📏 Size
- 🌍 Habitat

Người chơi chạm icon để xem.

---

# 16. AR Mode 2 – Scan hai card

Ví dụ:

- T-Rex
- Elephant

Hai model xuất hiện cạnh nhau.

Có thể chọn:

- 📏 Compare Size
- 🥩 Compare Food
- 🌍 Compare Habitat

Ứng dụng hiển thị tỷ lệ tương đối.

Đây là một trải nghiệm trực quan mạnh hơn việc chỉ nhìn số liệu.

---

# 17. AR Mode 3 – Bring Your Collection to Life

Đây là hướng AR quan trọng nhất.

Người chơi đặt nhiều card thật lên bàn.

Ví dụ:

- Lion
- Zebra
- Elephant

Camera nhận diện.

App tạo một **mini Savannah AR** trên mặt bàn.

Các động vật xuất hiện cùng nhau:

- Zebra chạy
- Elephant đi
- Lion quan sát

Nếu scan:

- Penguin
- Seal

môi trường trở thành:

> Polar World

Ý tưởng:

> **Bộ card vật lý trở thành công cụ để xây một thế giới động vật AR.**

---

# 18. Chơi cùng bố mẹ

Physical card có thể tạo một gameplay đơn giản.

App phát âm:

> “Can you find the elephant?”

Trẻ tìm card Elephant.

Giơ card trước camera.

App nhận diện:

> “Elephant!”

Sau đó:

- phát âm lại
- hiện animation
- hiện model 3D

Loop:

> **Listen → Find → Hold → Scan → Hear Again**

Có thể dùng để hỗ trợ học từ vựng tiếng Anh.

---

# 19. Daily Content

Mỗi ngày hệ thống có thể tạo một mission mới.

Ví dụ tuần:

| Ngày | Mission |
|---|---|
| Day 1 | Find 3 Ocean Animals |
| Day 2 | Guess the Animal |
| Day 3 | Compare Size |
| Day 4 | Build a Team |
| Day 5 | Group by Habitat |
| Day 6 | Mystery Animal |
| Day 7 | Weekly Expedition |

Người chơi không cần chọn mode.

App tự thay đổi luật.

---

# 20. AI Mission Generator

AI không nên tự tạo toàn bộ logic gameplay.

Nên có một tập rule cố định.

Ví dụ:

```text
FIND
attribute = habitat
value = ocean
count = 3
```

---

Ví dụ:

```text
COMPARE
attribute = size
cards = elephant, lion
```

---

Ví dụ:

```text
TEAM
requirements:
  ocean: 1
  carnivore: 1
  fast: 1
```

AI chỉ làm nhiệm vụ:

- chọn theme
- chọn animal
- chọn rule
- tạo lời dẫn
- tạo difficulty
- chọn icon

Server vẫn kiểm tra đáp án bằng metadata.

---

# 21. Animal Metadata

Mỗi animal nên có dữ liệu chuẩn hóa.

Ví dụ:

```json
{
  "id": "trex",
  "name": "T-Rex",
  "habitat": ["land"],
  "diet": ["carnivore"],
  "size": "huge",
  "abilities": ["run"],
  "family": ["dinosaur"]
}
```

Ví dụ Dolphin:

```json
{
  "id": "dolphin",
  "name": "Dolphin",
  "habitat": ["ocean"],
  "diet": ["carnivore"],
  "size": "medium",
  "abilities": ["swim"],
  "family": ["marine_mammal"]
}
```

Mission Engine chỉ cần query metadata này.

---

# 22. Các màn hình chính

## Screen 1 – Animal World

Hiển thị các khu vực:

- Ancient World
- Ocean
- Savannah
- Polar
- Jungle

Có một khu vực nổi bật:

> 🧭 Daily Expedition

---

## Screen 2 – Animal Discovery

Hiển thị model 3D.

Người chơi khám phá:

- habitat
- food
- footprint
- size
- behaviour
- life cycle

---

## Screen 3 – Card Unlocked

Sau khi khám phá xong:

> NEW CARD!

Card xuất hiện.

Ví dụ:

> T-Rex

Có animation xoay nhẹ.

---

## Screen 4 – Card Album

Grid card collection.

Có:

- card đã mở
- silhouette card
- card mới
- số card đã sưu tập

Ví dụ:

> 24 / 80 Animals

---

## Screen 5 – Daily Expedition

Hiển thị nhiệm vụ hôm nay.

Ví dụ:

> 🌊  
> Find 3 animals that live in water.

Có 3 slot card.

---

## Screen 6 – Select Cards

Hiển thị collection phía dưới.

Người chơi:

- chạm card
- kéo card
- thả vào slot

---

## Screen 7 – Result

Nếu đúng:

- card phát sáng
- animal animation
- âm thanh
- stars
- EXP

Ví dụ:

> +30 EXP

---

## Screen 8 – Next Expedition Preview

Sau khi hoàn thành:

Hiện hint cho ngày mai.

Ví dụ:

> ❄️ + 🥩 + ???

Hoặc silhouette một con vật.

Mục tiêu:

- tạo tò mò
- kéo người chơi quay lại

---

# 23. Reward System

Reward có thể gồm:

- EXP
- Explorer Level
- Star
- Badge
- New World
- New Card Frame
- New AR Environment
- Special Card Effect

Không nên dùng quá nhiều currency.

Khuyến nghị:

- EXP
- Card Collection
- Badge

là đủ cho giai đoạn đầu.

---

# 24. Weekly Expedition

Mỗi tuần có một mission lớn.

Ví dụ:

> **Ocean Rescue**

Yêu cầu:

- 2 animal sống dưới nước
- 1 animal ăn cá
- 1 animal kích thước lớn

Người chơi sử dụng collection đã mở trong tuần.

Reward:

- badge
- special card frame
- AR environment

---

# 25. MVP

Phiên bản đầu tiên không cần làm toàn bộ hệ thống.

MVP chỉ cần:

## Discovery

- khám phá animal
- unlock card

## Card Album

- xem collection
- silhouette card

## Daily Expedition

3 loại mission:

1. Find
2. Compare
3. Mystery

## Progression

- EXP
- level

## Physical Card

- xuất PDF card

## AR

- scan 1 card → hiện animal 3D

---

# 26. Phase 2

Sau khi MVP ổn định:

- Build a Team
- Group Mission
- Weekly Expedition
- scan 2 card
- compare AR
- physical mission cards
- parent-child gameplay

---

# 27. Phase 3

Mở rộng:

- multi-card AR environment
- AI mission generator
- printable weekly card packs
- special card collections
- seasonal missions
- cooperative gameplay

---

# 28. Điểm mạnh của hệ thống

## Dễ mở rộng

Thêm animal mới chỉ cần:

- model
- metadata
- card

Animal tự động tham gia được vào rất nhiều mission cũ.

---

## Ít phụ thuộc vào 3D

Gameplay chính sử dụng:

- card
- metadata
- icon
- animation UI

3D chủ yếu dùng cho:

- discovery
- reward
- AR

---

## AI dễ hỗ trợ

AI có thể sinh:

- daily mission
- clue
- mission theme
- mission combination

mà không cần sinh asset mới.

---

## Có progression dài hạn

Collection càng lớn:

- mission càng khó
- càng nhiều cách giải
- càng nhiều tổ hợp
- càng nhiều content

---

## Có thể mở rộng thành sản phẩm vật lý

App có thể phát triển thành:

> **Digital Animal World + Printable Cards + AR Toy**

---

# 29. Nguyên tắc thiết kế quan trọng

1. **Card phải là tài nguyên gameplay**, không chỉ để sưu tập.
2. **Daily Expedition là gameplay chính duy nhất.**
3. Compare, Guess, Group, Team chỉ là mission rule.
4. Mission nên có nhiều lời giải hợp lệ.
5. Không bắt buộc người chơi phải có card vật lý.
6. AR là reward / toy mode.
7. Card thiếu phải dẫn người chơi quay lại Discovery.
8. Dữ liệu animal phải chuẩn hóa.
9. AI chỉ sinh mission dựa trên rule có sẵn.
10. UI cho trẻ nhỏ phải ưu tiên icon, hình ảnh và âm thanh.

---

# 30. Product Loop hoàn chỉnh

```text
Explore Animal
      ↓
Unlock Card
      ↓
Add to Collection
      ↓
Daily Expedition
      ↓
Use Cards
      ↓
Complete Mission
      ↓
Earn EXP
      ↓
Unlock Harder Missions
      ↓
Need New Card
      ↓
Explore New Animal
```

Đây là loop chính của Animal Explorer Cards.

---

# 31. Kết luận

**Animal Explorer Cards** biến Animal World 3D từ một app chủ yếu để xem và khám phá động vật thành một hệ thống có:

- khám phá
- sưu tập
- gameplay
- nhiệm vụ hàng ngày
- progression
- card vật lý
- AR
- khả năng mở rộng tự động

Concept cốt lõi:

> **Khám phá một con vật → nhận một thẻ → dùng thẻ giải Chuyến thám hiểm → mở thêm nội dung → tiếp tục khám phá.**

Tên tạm đề xuất:

# **Animal Explorer Cards**

Tagline:

> **Explore. Collect. Play. Bring Animals to Life.**
