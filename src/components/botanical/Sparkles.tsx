import { cssVars } from "@/lib/css-vars";
import { SPARKLE } from "./glyphs";

export interface SparklePoint {
  /** Vị trí theo % của khung chứa */
  x: number;
  y: number;
  size: number;
  delay: number;
}

/** Vài hạt sáng lấp lánh, đặt tuyệt đối trong khung cha (cần `position: relative`). */
export function Sparkles({ points, className = "" }: { points: SparklePoint[]; className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      {points.map((point, i) => (
        <svg
          key={i}
          viewBox="-10 -10 20 20"
          className="sparkle absolute"
          style={cssVars(
            { "--twinkle-delay": `${point.delay}s` },
            { left: `${point.x}%`, top: `${point.y}%`, width: point.size, height: point.size },
          )}
        >
          <path d={SPARKLE} fill="url(#gold-line)" />
        </svg>
      ))}
    </div>
  );
}
