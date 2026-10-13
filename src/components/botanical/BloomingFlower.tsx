import { cssVars } from "@/lib/css-vars";
import { LeafGlyph, PEONY_PETAL } from "./glyphs";

const RINGS = [
  { count: 10, scale: 1, offset: 0, fill: "url(#petal-blush)" },
  { count: 8, scale: 0.74, offset: 18, fill: "url(#petal-rose)" },
  { count: 6, scale: 0.5, offset: 8, fill: "url(#petal-deep)" },
];

/**
 * Bông mẫu đơn "nở" khi phần tử cha nhận class `is-visible` (xem <Reveal />).
 * Mỗi cánh có `--i` để nở lần lượt từ vòng ngoài vào trong.
 */
export function BloomingFlower({ className }: { className?: string }) {
  let order = 0;
  return (
    <svg viewBox="-80 -80 160 160" className={className} aria-hidden="true" focusable="false">
      <g className="bloom-leaves">
        {[-135, -45, 45, 135].map((angle) => (
          <g key={angle} transform={`rotate(${angle}) translate(0 -38) scale(1.3)`}>
            <LeafGlyph />
          </g>
        ))}
      </g>
      <g className="bloom-head">
        {RINGS.map((ring) =>
          Array.from({ length: ring.count }, (_, i) => {
            const index = order++;
            return (
              <g key={`${ring.scale}-${i}`} transform={`rotate(${ring.offset + (360 / ring.count) * i})`}>
                <path
                  className="bloom-petal"
                  d={PEONY_PETAL}
                  fill={ring.fill}
                  stroke="rgba(112, 45, 70, 0.25)"
                  strokeWidth={0.6}
                  vectorEffect="non-scaling-stroke"
                  style={cssVars({ "--i": index, "--s": ring.scale })}
                />
              </g>
            );
          }),
        )}
        <circle className="bloom-core" r={9} fill="url(#core-gold)" />
      </g>
    </svg>
  );
}
