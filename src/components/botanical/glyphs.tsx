/**
 * Các "glyph" là nhóm <g> vẽ quanh gốc toạ độ (0, 0) để ghép thành bố cục lớn hơn.
 * Mọi màu tham chiếu gradient trong <FloralDefs />.
 */

export type FlowerTone = "rose" | "blush" | "cream" | "deep";

const TONE_FILLS: Record<FlowerTone, { outer: string; mid: string; inner: string }> = {
  rose: { outer: "url(#petal-blush)", mid: "url(#petal-rose)", inner: "url(#petal-deep)" },
  blush: { outer: "url(#petal-cream)", mid: "url(#petal-blush)", inner: "url(#petal-rose)" },
  cream: { outer: "url(#petal-cream)", mid: "url(#petal-cream)", inner: "url(#petal-blush)" },
  deep: { outer: "url(#petal-rose)", mid: "url(#petal-deep)", inner: "url(#petal-deep)" },
};

const PETAL_STROKE = "rgba(112, 45, 70, 0.22)";

/** Cánh mẫu đơn với vết lõm nhẹ ở đỉnh, gốc tại (0, 0), hướng lên trên. */
export const PEONY_PETAL =
  "M0 0C-17-5-27-28-17-44C-12-52-4-50 0-46C4-50 12-52 17-44C27-28 17-5 0 0Z";
const ROSE_PETAL = "M0 0C-26-2-36-30-21-46C-11-56 11-56 21-46C36-30 26-2 0 0Z";
const LEAF = "M0 0C-11-12-12-34 0-50C12-34 11-12 0 0Z";
export const SPARKLE =
  "M0-10C1-2 2-1 10 0C2 1 1 2 0 10C-1 2-2 1-10 0C-2-1-1-2 0-10Z";

interface PetalRingProps {
  d: string;
  count: number;
  scale: number;
  offset: number;
  fill: string;
}

function PetalRing({ d, count, scale, offset, fill }: PetalRingProps) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <path
          key={i}
          d={d}
          fill={fill}
          stroke={PETAL_STROKE}
          strokeWidth={0.6}
          vectorEffect="non-scaling-stroke"
          transform={`rotate(${offset + (360 / count) * i}) scale(${scale})`}
        />
      ))}
    </>
  );
}

export function PeonyGlyph({ tone = "rose" }: { tone?: FlowerTone }) {
  const fills = TONE_FILLS[tone];
  return (
    <g>
      <PetalRing d={PEONY_PETAL} count={10} scale={1} offset={0} fill={fills.outer} />
      <PetalRing d={PEONY_PETAL} count={8} scale={0.74} offset={18} fill={fills.mid} />
      <PetalRing d={PEONY_PETAL} count={6} scale={0.5} offset={8} fill={fills.inner} />
      <circle r={9} fill="url(#core-gold)" />
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (Math.PI * 2 * i) / 8;
        return (
          <circle
            key={i}
            cx={Math.cos(angle) * 5.5}
            cy={Math.sin(angle) * 5.5}
            r={1.3}
            fill="#A9833F"
          />
        );
      })}
    </g>
  );
}

export function RoseGlyph({ tone = "rose" }: { tone?: FlowerTone }) {
  const fills = TONE_FILLS[tone];
  return (
    <g>
      <PetalRing d={ROSE_PETAL} count={5} scale={1} offset={0} fill={fills.outer} />
      <PetalRing d={ROSE_PETAL} count={5} scale={0.7} offset={36} fill={fills.mid} />
      <circle r={17} fill={fills.inner} />
      <path
        d="M-9 3C-13-6-5-14 4-11C12-8 11 3 3 6C-4 8-7 0-2-3C2-5 5-2 3 1"
        fill="none"
        stroke="rgba(74, 26, 45, 0.45)"
        strokeWidth={1.4}
        strokeLinecap="round"
      />
      <path
        d="M-15 6C-10 14 10 15 16 4"
        fill="none"
        stroke="rgba(255, 255, 255, 0.5)"
        strokeWidth={1.2}
        strokeLinecap="round"
      />
    </g>
  );
}

export function LeafGlyph() {
  return (
    <g>
      <path d={LEAF} fill="url(#leaf)" />
      <path d="M0-2V-44" stroke="#5F7853" strokeWidth={0.8} opacity={0.55} />
    </g>
  );
}

export function BudGlyph({ tone = "rose" }: { tone?: "rose" | "blush" }) {
  return (
    <g>
      <path d="M0 0C-6-4-7-14 0-21C7-14 6-4 0 0Z" fill={`url(#petal-${tone})`} />
      <path
        d="M0 1C-4-1-6-6-5-10M0 1C4-1 6-6 5-10"
        fill="none"
        stroke="#6F8862"
        strokeWidth={1.2}
        strokeLinecap="round"
      />
    </g>
  );
}

/** Cành lá mảnh mọc từ (0, 0) lên trên, dài khoảng 100 đơn vị. */
export function SprigGlyph({ withBud = true }: { withBud?: boolean }) {
  const leaves: [number, number, number, number][] = [
    [1, -24, -42, 0.45],
    [-1, -44, 40, 0.42],
    [0, -64, -36, 0.36],
    [2, -80, 32, 0.3],
  ];
  return (
    <g>
      <path
        d="M0 0C4-30-6-60 2-96"
        fill="none"
        stroke="#7E9670"
        strokeWidth={1.4}
        strokeLinecap="round"
      />
      {leaves.map(([x, y, r, s]) => (
        <g key={y} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
          <LeafGlyph />
        </g>
      ))}
      {withBud ? (
        <g transform="translate(2 -94) scale(0.7)">
          <BudGlyph tone="blush" />
        </g>
      ) : null}
    </g>
  );
}

export function SparkleGlyph() {
  return <path d={SPARKLE} fill="url(#gold-line)" />;
}
