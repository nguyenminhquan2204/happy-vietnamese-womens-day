"use client";

import type { CSSProperties } from "react";
import { cssVars, seeded } from "@/lib/css-vars";
import { REDUCED_MOTION_QUERY, useMediaQuery } from "@/lib/use-media-query";
import { useExperience } from "./ExperienceProvider";

const PETAL_PATH = "M0 14C-10 6-11-8-3-14C-1-15.5 1-15.5 3-14C11-8 10 6 0 14Z";
const PETAL_FILLS = ["url(#petal-blush)", "url(#petal-rose)", "url(#petal-blush)", "url(#petal-cream)"];

interface PetalSpec {
  key: string;
  fill: string;
  style: CSSProperties;
}

function createPetals(count: number, salt: number, burst: boolean): PetalSpec[] {
  return Array.from({ length: count }, (_, i) => {
    const r = (offset: number) => seeded(i + 1, salt + offset);
    const duration = burst ? 4.5 + r(1) * 2.5 : 15 + r(1) * 10;
    const delay = burst ? r(2) * 1.2 : -r(2) * duration;
    return {
      key: `${salt}-${i}`,
      fill: PETAL_FILLS[i % PETAL_FILLS.length],
      style: cssVars({
        "--x": `${(r(3) * 100).toFixed(2)}vw`,
        "--dur": `${duration.toFixed(2)}s`,
        "--delay": `${delay.toFixed(2)}s`,
        "--size": `${Math.round((burst ? 14 : 11) + r(4) * 12)}px`,
        "--sway": `${Math.round(18 + r(5) * 42)}px`,
        "--spin": `${Math.round(160 + r(6) * 380)}deg`,
        "--alpha": (burst ? 0.9 : 0.5 + r(7) * 0.35).toFixed(2),
      }),
    };
  });
}

function Petal({ spec, className }: { spec: PetalSpec; className: string }) {
  return (
    <span className={className} style={spec.style}>
      <svg viewBox="-12 -16 24 32">
        <path d={PETAL_PATH} fill={spec.fill} />
      </svg>
    </span>
  );
}

// Tính sẵn ở module scope — thông số cố định, không cần tính lại mỗi lần render.
const AMBIENT_DESKTOP = createPetals(14, 7, false);
const AMBIENT_MOBILE = AMBIENT_DESKTOP.slice(0, 7);

/**
 * Hai lớp cánh hoa:
 * - Lớp nền (phía sau nội dung) rơi chậm liên tục, số lượng ít hơn trên mobile.
 * - Lớp "mưa hoa" ngắn (phía trước) khi mở thiệp hoặc khi người dùng bấm nút.
 */
export function PetalField() {
  const { isRevealed, bursts, petalsPaused } = useExperience();
  const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);
  const isSmallScreen = useMediaQuery("(max-width: 640px)");

  if (reducedMotion || !isRevealed) return null;

  const ambient = isSmallScreen ? AMBIENT_MOBILE : AMBIENT_DESKTOP;
  const burstCount = isSmallScreen ? 10 : 22;

  return (
    <>
      <div className={`petal-layer ${petalsPaused ? "is-paused" : ""}`} aria-hidden="true">
        {ambient.map((spec) => (
          <Petal key={spec.key} spec={spec} className="petal" />
        ))}
      </div>
      <div className="petal-layer petal-layer--burst" aria-hidden="true">
        {bursts.map((id) =>
          createPetals(burstCount, 100 + id, true).map((spec) => (
            <Petal key={spec.key} spec={spec} className="petal petal--burst" />
          )),
        )}
      </div>
    </>
  );
}
