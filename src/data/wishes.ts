export const mainWishes = [
  "Chúc các chị em luôn xinh tươi, vui vẻ và rạng rỡ theo cách rất riêng của mình.",
  "Chúc mỗi ngày đều có thật nhiều niềm vui, vài điều bất ngờ dễ thương và thật nhiều lý do để mỉm cười.",
  "Chúc công việc luôn thuận lợi, ý tưởng luôn thăng hoa và mọi nỗ lực đều được ghi nhận, trân trọng.",
  "Chúc các chị em luôn tự tin, hạnh phúc, gặp nhiều may mắn và có thật nhiều khoảnh khắc đáng nhớ.",
] as const;

export type WishIllustrationKind = "rose" | "peony" | "branch" | "blossom";
export type WishTone = "blush" | "cream" | "sage" | "champagne";

/** Thiệp lời chúc lần lượt dùng các minh họa và tông màu này. */
export const WISH_ILLUSTRATIONS: WishIllustrationKind[] = ["rose", "branch", "peony", "blossom"];
export const WISH_TONES: WishTone[] = ["blush", "sage", "cream", "champagne"];
