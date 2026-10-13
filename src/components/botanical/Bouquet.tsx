import { BudGlyph, LeafGlyph, PeonyGlyph, RoseGlyph, SparkleGlyph, SprigGlyph } from "./glyphs";

/** [góc xoay, khoảng cách từ tâm, tỉ lệ] */
const LEAVES: [number, number, number][] = [
  [-150, 58, 1.5],
  [-118, 70, 1.3],
  [-62, 72, 1.35],
  [-28, 62, 1.45],
  [18, 70, 1.3],
  [62, 70, 1.4],
  [95, 80, 1.1],
  [122, 64, 1.45],
  [160, 60, 1.3],
  [200, 66, 1.2],
];

const SPRIGS: [number, number, number][] = [
  [-84, 70, 1.05],
  [-172, 68, 0.9],
  [38, 82, 1],
  [142, 74, 0.95],
];

interface BouquetProps {
  className?: string;
}

/** Bó hoa tròn: mẫu đơn lớn ở tâm, hồng và nụ xung quanh, lá xoè đều. */
export function Bouquet({ className }: BouquetProps) {
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden="true" focusable="false">
      <g transform="translate(200 205)">
        {SPRIGS.map(([angle, distance, scale]) => (
          <g key={angle} transform={`rotate(${angle}) translate(0 ${-distance}) scale(${scale})`}>
            <SprigGlyph />
          </g>
        ))}
        {LEAVES.map(([angle, distance, scale]) => (
          <g key={angle} transform={`rotate(${angle}) translate(0 ${-distance}) scale(${scale})`}>
            <LeafGlyph />
          </g>
        ))}
      </g>

      <g transform="translate(128 132) scale(0.62)">
        <PeonyGlyph tone="cream" />
      </g>
      <g transform="translate(274 120) scale(0.72)">
        <PeonyGlyph tone="blush" />
      </g>
      <g transform="translate(118 248) rotate(-14) scale(0.95)">
        <RoseGlyph tone="blush" />
      </g>
      <g transform="translate(294 260) rotate(18) scale(0.82)">
        <RoseGlyph tone="rose" />
      </g>
      <g transform="translate(205 312) rotate(176) scale(1.1)">
        <BudGlyph tone="rose" />
      </g>
      <g transform="translate(66 190) rotate(-80) scale(1)">
        <BudGlyph tone="blush" />
      </g>
      <g transform="translate(205 198) scale(1.55)">
        <PeonyGlyph tone="rose" />
      </g>

      <g transform="translate(340 170) scale(0.7)">
        <SparkleGlyph />
      </g>
      <g transform="translate(70 300) scale(0.5)">
        <SparkleGlyph />
      </g>
      <g transform="translate(200 52) scale(0.45)">
        <SparkleGlyph />
      </g>
    </svg>
  );
}
