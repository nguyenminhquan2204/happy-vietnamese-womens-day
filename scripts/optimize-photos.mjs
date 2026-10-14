// Nén ảnh gốc trong `photos-raw/` thành WebP nhẹ trong `public/photos/`.
// Cả hai thư mục đều bị gitignore — repo public nên ảnh cá nhân không được commit.
//
//   npm run photos
//
// Mỗi ảnh gốc sinh ra hai bản:
//   NN.webp       — cắt khung 4:5 (ảnh dọc) hoặc 4:3 (ảnh ngang), ưu tiên vùng có chi tiết, cho lưới polaroid
//   NN-full.webp  — giữ nguyên tỉ lệ, cạnh dài tối đa 1600px cho lightbox
// sharp mặc định bỏ toàn bộ metadata EXIF (kể cả vị trí GPS) khi xuất ảnh.
// Danh sách ảnh (chỉ gồm số thứ tự + hướng ảnh, không có tên) được ghi vào `src/data/photos.json`.

import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const RAW_DIR = "photos-raw";
const OUT_DIR = "public/photos";
const MANIFEST = "src/data/photos.json";
const INPUT_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".tif", ".tiff"]);

const files = (await readdir(RAW_DIR).catch(() => []))
  .filter((name) => INPUT_EXTENSIONS.has(path.extname(name).toLowerCase()))
  .sort((a, b) => a.localeCompare(b, "vi", { numeric: true }));

if (files.length === 0) {
  console.error(`Không tìm thấy ảnh nào trong ${RAW_DIR}/. Tải ảnh từ Drive về thư mục này rồi chạy lại.`);
  process.exit(1);
}

await rm(OUT_DIR, { recursive: true, force: true });
await mkdir(OUT_DIR, { recursive: true });

const manifest = [];

for (const [index, file] of files.entries()) {
  const id = String(index + 1).padStart(2, "0");
  const input = sharp(path.join(RAW_DIR, file)).rotate();
  // .rotate() đã xoay theo EXIF nên kích thước thật là kích thước sau khi xoay
  const { width, height } = await input.clone().toBuffer({ resolveWithObject: true }).then((r) => r.info);
  const orientation = width > height ? "landscape" : "portrait";
  manifest.push({ id, orientation });

  await input
    .clone()
    .resize(...(orientation === "landscape" ? [960, 720] : [720, 900]), {
      fit: "cover",
      position: sharp.strategy.attention,
    })
    .webp({ quality: 80 })
    .toFile(path.join(OUT_DIR, `${id}.webp`));

  await input
    .clone()
    .resize(1600, 1600, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(path.join(OUT_DIR, `${id}-full.webp`));

  console.log(`${file} → ${id}.webp, ${id}-full.webp (${orientation === "landscape" ? "ngang" : "dọc"})`);
}

await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`\nĐã xử lý ${files.length} ảnh vào ${OUT_DIR}/ và cập nhật ${MANIFEST}.`);
