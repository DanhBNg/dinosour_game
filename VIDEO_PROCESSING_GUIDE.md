# Hướng Dẫn Xử Lý, Nén & Tối Ưu Hóa Video Trong Dự Án

Tài liệu này giải thích chi tiết **cách hệ thống đang xử lý và tải video** (cụ thể là các video trong `video/loggerhead/`) và **hướng dẫn toàn diện cách nén dung lượng, tối ưu streaming cho web**.

---

## 1. Cơ Chế Xử Lý & Tải Video Trong Dự Án Hiện Tại

### 1.1. Cấu trúc lưu trữ
Mỗi video của một loài (ví dụ rùa quản đồng - `loggerhead`) gồm 5 chủ đề: `habitat`, `diet`, `movement`, `size`, `growth`.
Hiện tại dự án lưu ở 2 vị trí:
1. **Đường dẫn chính thức**: `assets/knowledge/ocean/loggerhead/*.mp4` (được ưu tiên tải trước).
2. **Đường dẫn dự phòng (Fallback)**: `video/loggerhead/*.mp4` (dùng khi đường dẫn chính gặp sự cố).

### 1.2. Quy trình đóng gói (Build) & Phục vụ (Serve)
- **Khi Build (`build.mjs`)**:
  Toàn bộ thư mục `assets/` và `video/` được copy sang `dist/assets/` và `dist/video/`.
- **Khi Chạy Server (`serve.mjs`) - Kỹ thuật HTTP Range Requests (206 Partial Content)**:
  `serve.mjs` có bộ xử lý chuyên biệt cho file `.mp4`:
  ```javascript
  const range = req.headers.range;
  if (range && extname(file) === '.mp4') {
    // Trả về Header HTTP 206, Content-Range và chunk dữ liệu theo bytes
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileStat.size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4'
    });
    createReadStream(file, { start, end }).pipe(res);
  }
  ```
  *Lợi ích*: Trình duyệt **không cần tải hết toàn bộ file** mới bắt đầu phát. Trình duyệt chỉ cần tải vài trăm KB đầu tiên là video đã phát ngay, đồng thời người dùng có thể tua mà không bị đứng.

### 1.3. Cơ chế tải và hiển thị ở Frontend (`src/pages/ocean-world/ocean-knowledge.js`)
1. **Layer hiển thị đôi (Dual-layer)**:
   - Một video nền mờ `ocean-backdrop-video` (làm hiệu ứng thị giác chiều sâu).
   - Một video chính `ocean-scene` hiển thị ở khung trung tâm.
2. **Trạng thái Muted & Playsinline**:
   - `muted = true`, `defaultMuted = true`, `playsinline = true` giúp video tự động phát (`autoplay`) được trên toàn bộ trình duyệt di động (iOS Safari, Android Chrome) mà không bị hệ điều hành chặn.
3. **Màn hình chờ 3D Loading (`loading-3d.js`)**:
   - Gắn sự kiện lắng nghe video: khi video đã đệm đủ dữ liệu (`canplay` / `playing`), màn hình loading mờ dần và tự hủy để lộ video mượt mà.
4. **Tải trước thông minh (Idle Prefetching)**:
   - Khi người dùng đang xem 1 chủ đề bất kỳ, hệ thống tận dụng thời gian rảnh của CPU/mạng (`requestIdleCallback`) để tự động chèn `<link rel="prefetch" as="video">` cho các chủ đề còn lại (`habitat`, `diet`, `movement`, `size`, `growth`).
   - Nhờ đó, khi trẻ bấm sang tab khác, video tiếp theo mở lên **ngay lập tức** từ bộ nhớ đệm (Cache).
5. **Cơ chế Fallback an toàn**:
   - Nếu đường dẫn `/assets/knowledge/...` lỗi 404 hoặc mạng đứt đoạn, sự kiện `onerror` lập tức đổi `src` sang `/video/${id}/${key}.mp4` để thử lại.

---

## 2. Thông Số Kỹ Thuật Video Gốc & Điểm Cần Tối Ưu

Qua kiểm tra trực tiếp các file trong `video/loggerhead/`:
- **Độ phân giải**: 1280x720 (720p).
- **Tốc độ khung hình**: 24 FPS.
- **Thời lượng**: 8 giây lặp lại (Loop).
- **Dung lượng**: ~1.8 MB - 2.1 MB / file.
- **Vấn đề tồn tại**:
  - File đang chứa 1 luồng âm thanh `AAC 129 kbps`. Tuy nhiên, giao diện web lại phát ở chế độ `muted` (tắt tiếng). Việc giữ luồng âm thanh câm này làm lãng phí khoảng 130 ~ 150 KB mỗi video.
  - Cần đảm bảo cờ `+faststart` (đưa atom metadata `moov` lên đầu file) để tăng tốc độ phát tức thì trên mạng 3G/4G.

---

## 3. Hướng Dẫn Tối Ưu & Nén Video Bằng FFmpeg

Hệ thống của bạn đã cài đặt sẵn **FFmpeg 8.1**. Dưới đây là các bước chuẩn hóa video:

### 3.1. Bộ tham số chuẩn (Golden Preset) cho Web Video
| Tham số | Giá trị khuyên dùng | Ý nghĩa |
| :--- | :--- | :--- |
| **Codec Video** | `-c:v libx264` | Chuẩn H.264 tương thích 100% thiết bị và trình duyệt |
| **Pixel Format** | `-pix_fmt yuv420p` | Đảm bảo tương thích trên cả iOS Safari và thiết bị cũ |
| **Tỷ lệ nén** | `-crf 26` (hoặc `28`) | Mức nén cân bằng hoàn hảo giữa độ nét và dung lượng nhẹ |
| **Tốc độ mã hóa** | `-preset slow` | Nén chặt nhất với dung lượng nhỏ nhất |
| **Web Streaming** | `-movflags +faststart` | **Bắt buộc**: Đưa `moov atom` lên đầu file để stream ngay |
| **Keyframe Interval** | `-g 48` | Tạo keyframe mỗi 2 giây (với 24fps) giúp tua và lặp mượt mà |
| **Âm thanh** | `-an` | Loại bỏ âm thanh (video câm), giảm ngay 10-15% dung lượng |

---

### 3.2. Lệnh nén 1 file cụ thể
Mở PowerShell tại thư mục dự án và chạy:
```powershell
ffmpeg -y -i "video/loggerhead/diet.mp4" `
  -c:v libx264 `
  -crf 26 `
  -preset slow `
  -pix_fmt yuv420p `
  -movflags +faststart `
  -g 48 `
  -an `
  "video/loggerhead/diet_optimized.mp4"
```
*Kết quả thực tế*: Dung lượng giảm từ **2.08 MB** xuống còn **~1.65 MB** (tiết kiệm ~21%), video bắt đầu stream ngay từ byte đầu tiên.

---

### 3.3. Script Batch xử lý tự động toàn bộ thư mục (PowerShell)

Để nén hàng loạt tất cả video trong `video/loggerhead` (hoặc bất kỳ thư mục loài nào):

Tạo file script PowerShell (hoặc chạy trực tiếp trên terminal):
```powershell
$targetFolder = "video\loggerhead"
$backupFolder = "video\loggerhead_raw"

# 1. Tạo thư mục sao lưu file gốc
if (!(Test-Path $backupFolder)) { New-Item -ItemType Directory -Path $backupFolder }

Get-ChildItem -Path $targetFolder -Filter "*.mp4" | ForEach-Object {
    $file = $_
    $inputPath = $file.FullName
    $backupPath = Join-Path $backupFolder $file.Name
    $tempOptimized = Join-Path $targetFolder ("opt_" + $file.Name)

    Write-Host "Dang toi uu: $($file.Name)..." -ForegroundColor Cyan

    # Chạy FFmpeg nén tối ưu
    ffmpeg -y -v error -i $inputPath `
      -c:v libx264 `
      -crf 26 `
      -preset slow `
      -pix_fmt yuv420p `
      -movflags +faststart `
      -g 48 `
      -an `
      $tempOptimized

    # Sao lưu file cũ và thay thế bằng file đã tối ưu
    Move-Item -Path $inputPath -Destination $backupPath -Force
    Move-Item -Path $tempOptimized -Destination $inputPath -Force

    $oldSize = (Get-Item $backupPath).Length / 1MB
    $newSize = (Get-Item $inputPath).Length / 1MB
    Write-Host "Hoan thanh $($file.Name): $([math]::Round($oldSize,2))MB -> $([math]::Round($newSize,2))MB" -ForegroundColor Green
}
```

---

### 3.4. Xuất Poster Image (Ảnh đại diện tĩnh) từ Video
Để hiển thị ngay bức tranh sắc nét trong 0.1 giây đầu tiên khi video đang nạp buffer, bạn có thể xuất frame đầu tiên ra ảnh WebP/PNG:
```powershell
ffmpeg -y -i "video/loggerhead/diet.mp4" -vframes 1 -q:v 2 "assets/knowledge/ocean/loggerhead/diet.png"
```

---

## 4. Quy Trình Cập Nhật Video Mới Vào Dự Án (Checklist)

Khi bạn có video mới cho một loài (ví dụ `loggerhead`, `tuna`, `shark`...):

1. **Chuẩn bị file nguồn**:
   - Đặt tên theo đúng 5 chủ đề: `habitat.mp4`, `diet.mp4`, `movement.mp4`, `size.mp4`, `growth.mp4`.
   - Độ dài khuyến nghị: 6 - 10 giây (dạng vòng lặp liền mạch).
2. **Nén bằng FFmpeg**:
   - Dùng lệnh ở mục 3.2 hoặc script mục 3.3 với cờ `-movflags +faststart` và `-an`.
3. **Đồng bộ vào 2 vị trí thư mục**:
   - Thư mục chính: `assets/knowledge/ocean/<loài>/<chủ_đề>.mp4`
   - Thư mục phụ (fallback): `video/<loài>/<chủ_đề>.mp4`
4. **Kiểm tra và Đóng gói**:
   - Chạy lệnh build:
     ```powershell
     npm run build
     ```
   - Chạy kiểm thử tự động:
     ```powershell
     npm test
     ```
   - Chạy thử nghiệm trên trình duyệt (mở DevTools tab Network -> kiểm tra mã `206 Partial Content` khi video chạy).
