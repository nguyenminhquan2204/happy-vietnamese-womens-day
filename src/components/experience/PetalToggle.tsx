"use client";

import { Pause, Play } from "lucide-react";
import { REDUCED_MOTION_QUERY, useMediaQuery } from "@/lib/use-media-query";
import { useExperience } from "./ExperienceProvider";

/** Nút nhỏ để tạm dừng/tiếp tục hoa rơi — dành cho người nhạy cảm với chuyển động. */
export function PetalToggle() {
  const { isRevealed, petalsPaused, togglePetals } = useExperience();
  const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);

  if (!isRevealed || reducedMotion) return null;

  const label = petalsPaused ? "Tiếp tục hoa rơi" : "Tạm dừng hoa rơi";
  const Icon = petalsPaused ? Play : Pause;

  return (
    <button
      type="button"
      onClick={togglePetals}
      aria-pressed={petalsPaused}
      aria-label={label}
      title={label}
      className="dock-button dock-button--enter"
    >
      <Icon aria-hidden="true" className="size-4" strokeWidth={1.75} />
    </button>
  );
}
