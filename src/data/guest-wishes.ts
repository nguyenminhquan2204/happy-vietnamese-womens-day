import { readFileSync } from "node:fs";
import path from "node:path";

export interface GuestWish {
  from: string;
  message: string;
}

/** Dòng mở đầu một lời chúc: "1. Nguyễn Văn A" */
const HEADER = /^\s*\d+\.\s+(.+?)\s*$/;

/**
 * Đọc lời chúc từ `loichuc.txt` ở gốc dự án (chỉ chạy phía server — lúc build khi export tĩnh).
 * Mỗi lời chúc bắt đầu bằng "số. Tên người gửi", các dòng tiếp theo là nội dung (giữ nguyên xuống dòng).
 * Mục chưa có nội dung sẽ được bỏ qua.
 */
export function loadGuestWishes(file = path.join(process.cwd(), "loichuc.txt")): GuestWish[] {
  const wishes: { from: string; lines: string[] }[] = [];

  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const header = HEADER.exec(line);
    if (header) wishes.push({ from: header[1], lines: [] });
    else wishes.at(-1)?.lines.push(line.trim());
  }

  return wishes
    .map(({ from, lines }) => ({ from, message: lines.join("\n").replace(/\n{3,}/g, "\n\n").trim() }))
    .filter((wish) => wish.message.length > 0);
}
