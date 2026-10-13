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

- `src/data/wishes.ts` — toàn bộ nội dung lời chúc (sửa chữ ở đây).
- `src/components/experience/` — luồng mở thiệp (phong bì, state, cánh hoa rơi, scroll reveal).
- `src/components/sections/` — 4 màn hình: Hero, Thiệp chính, Bộ sưu tập lời chúc, Lời kết.
- `src/components/botanical/` — minh họa hoa SVG tự vẽ, gradient dùng chung ở `FloralDefs`.
- `src/app/globals.css` — design tokens, animation, `prefers-reduced-motion`.
- `src/lib/music-box.ts` — nhạc nền hộp nhạc tổng hợp bằng Web Audio API (không cần file âm thanh). Chỉnh giai điệu ở `MELODY`, hợp âm ở `PROGRESSION`, âm lượng ở `MASTER_VOLUME`.
