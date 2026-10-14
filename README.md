# Thiệp 20/10 — Blooming Elegance

Thiệp điện tử chúc mừng ngày Phụ nữ Việt Nam 20/10 dành tặng các chị em đồng nghiệp.

## Chạy dự án

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm run start
npm run lint
```

## Cấu trúc

- `loichuc.txt` — lời chúc của mọi người, hiện trên dải thiệp trượt ngang (xem bên dưới).
- `src/data/wishes.ts` — lời chúc trên tấm thiệp chính.
- `src/data/photos.ts` — lời khen dưới mỗi polaroid; `photos.json` do `npm run photos` tự sinh.
- `src/components/experience/` — luồng mở thiệp (phong bì, state, cánh hoa rơi, scroll reveal).
- `src/components/sections/` — các màn hình: Hero, Thiệp chính, Bộ sưu tập lời chúc, Ảnh chị em, Lời kết.
- `src/components/botanical/` — minh họa hoa SVG tự vẽ, gradient dùng chung ở `FloralDefs`.
- `src/app/globals.css` — design tokens, animation, `prefers-reduced-motion`.
- `src/lib/music-box.ts` — nhạc nền hộp nhạc tổng hợp bằng Web Audio API (không cần file âm thanh). Chỉnh giai điệu ở `MELODY`, hợp âm ở `PROGRESSION`, âm lượng ở `MASTER_VOLUME`.

## Lời chúc (`loichuc.txt`)

Mỗi lời chúc bắt đầu bằng một dòng `số. Tên người gửi`, các dòng bên dưới là nội dung (giữ nguyên xuống dòng, hợp cho thơ). Mục chưa có nội dung sẽ được bỏ qua. File được đọc lúc build (`src/data/guest-wishes.ts`), nên sửa xong chỉ cần build lại; khi `npm run dev` thì tải lại trang là thấy.

```
1. Nguyễn Văn A
Dòng thơ thứ nhất
Dòng thơ thứ hai

2. Trần Văn B
Chúc chị em ...
```

## Ảnh các chị em

Repo public nên **ảnh không được commit**. `photos-raw/` và `public/photos/` đều nằm trong `.gitignore`.

1. Tải ảnh từ Drive vào `photos-raw/` (JPG/PNG/WebP; ảnh HEIC của iPhone cần đổi sang JPG trước). Ảnh xếp theo thứ tự tên file.
2. Chạy `npm run photos`. Script sẽ tạo `public/photos/NN.webp` (ảnh dọc cắt 4:5, ảnh ngang cắt 4:3) và `NN-full.webp` (cho lightbox), xóa EXIF/GPS, rồi cập nhật `src/data/photos.json`. File json chỉ chứa số thứ tự và hướng ảnh nên commit được.

## Deploy lên S3

Build và deploy **từ máy đã có `public/photos/`**. Nếu build từ một bản clone mới, trang sẽ thiếu ảnh.

```bash
npm run build
aws s3 sync out/ s3://<bucket> --delete
```
