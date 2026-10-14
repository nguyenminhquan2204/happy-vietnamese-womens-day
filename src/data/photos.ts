import manifest from "./photos.json";

/**
 * Ảnh các chị em — file ảnh KHÔNG nằm trong repo (repo public).
 * Đặt ảnh gốc vào `photos-raw/`, chạy `npm run photos` để sinh `public/photos/NN.webp`
 * và `photos.json` (số lượng + hướng ảnh). Thứ tự ảnh theo tên file gốc.
 */

/** Lời khen nhỏ viết tay dưới mỗi polaroid — không ghi tên. */
const captions = [
  "Rạng rỡ",
  "Dịu dàng",
  "Tỏa sáng",
  "Duyên dáng",
  "Tự tin",
  "Đáng yêu",
  "Ấm áp",
  "Tuyệt vời",
  "Năng động",
  "Xinh tươi",
  "Hạnh phúc",
];

export interface Photo {
  /** Bản cắt 4:5 cho lưới polaroid */
  thumb: string;
  /** Bản giữ nguyên tỉ lệ cho lightbox */
  full: string;
  caption: string;
  orientation: "portrait" | "landscape";
}

export const photos: Photo[] = manifest.map(({ id, orientation }, index) => ({
  thumb: `/photos/${id}.webp`,
  full: `/photos/${id}-full.webp`,
  caption: captions[index % captions.length],
  orientation: orientation === "landscape" ? "landscape" : "portrait",
}));
