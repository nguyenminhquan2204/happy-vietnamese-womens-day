import { PEONY_PETAL } from "./glyphs";

/** Đường phân cách mảnh có bông hoa nhỏ ở giữa. Màu theo `currentColor`. */
export function Ornament({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 24" className={className} aria-hidden="true" focusable="false">
      <path d="M8 12H92" stroke="currentColor" strokeWidth={0.8} strokeLinecap="round" opacity={0.7} />
      <path d="M148 12H232" stroke="currentColor" strokeWidth={0.8} strokeLinecap="round" opacity={0.7} />
      <path d="M100 12l4-4 4 4-4 4z" fill="currentColor" opacity={0.6} />
      <path d="M132 12l4-4 4 4-4 4z" fill="currentColor" opacity={0.6} />
      <g transform="translate(120 12)">
        {[0, 72, 144, 216, 288].map((angle) => (
          <path
            key={angle}
            d={PEONY_PETAL}
            transform={`rotate(${angle}) scale(0.19)`}
            fill="none"
            stroke="currentColor"
            strokeWidth={0.9}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <circle r={1.6} fill="currentColor" />
      </g>
    </svg>
  );
}
