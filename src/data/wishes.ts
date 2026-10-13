export const mainWishes = [
  "Chúc các chị em luôn xinh tươi, vui vẻ và rạng rỡ theo cách rất riêng của mình.",
  "Chúc mỗi ngày đều có thật nhiều niềm vui, vài điều bất ngờ dễ thương và thật nhiều lý do để mỉm cười.",
  "Chúc công việc luôn thuận lợi, ý tưởng luôn thăng hoa và mọi nỗ lực đều được ghi nhận, trân trọng.",
  "Chúc các chị em luôn tự tin, hạnh phúc, gặp nhiều may mắn và có thật nhiều khoảnh khắc đáng nhớ.",
] as const;

export type WishIllustrationKind = "rose" | "peony" | "branch" | "blossom";
export type WishTone = "blush" | "cream" | "sage" | "champagne";

export interface WishCard {
  title: string;
  message: string;
  illustration: WishIllustrationKind;
  tone: WishTone;
  /** Độ nghiêng nhẹ của tấm thiệp, tạo cảm giác bộ sưu tập thủ công. */
  tilt: number;
}

export const wishCards: WishCard[] = [
  {
    title: "Rạng rỡ mỗi ngày",
    message:
      "Chúc bạn luôn giữ được nụ cười tươi tắn và nguồn năng lượng tích cực lan tỏa đến mọi người xung quanh.",
    illustration: "rose",
    tone: "blush",
    tilt: -2.5,
  },
  {
    title: "Thành công rực rỡ",
    message:
      "Chúc mọi dự định đều thuận lợi và những cố gắng của bạn luôn được đền đáp thật xứng đáng.",
    illustration: "branch",
    tone: "sage",
    tilt: 1.75,
  },
  {
    title: "Hạnh phúc trọn vẹn",
    message:
      "Chúc bạn có thật nhiều niềm vui — trong công việc, trong cuộc sống và trong từng ngày bình thường nhất.",
    illustration: "peony",
    tone: "cream",
    tilt: -1.25,
  },
  {
    title: "Luôn là chính mình",
    message:
      "Chúc bạn luôn tự tin, tỏa sáng theo cách riêng và luôn được yêu quý, trân trọng.",
    illustration: "blossom",
    tone: "champagne",
    tilt: 2.25,
  },
];
