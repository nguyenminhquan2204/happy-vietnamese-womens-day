"use client";

import { RotateCcw, Sparkles } from "lucide-react";
import { REDUCED_MOTION_QUERY, useMediaQuery } from "@/lib/use-media-query";
import { useExperience } from "./ExperienceProvider";

export function ClosingActions() {
  const { triggerBurst, replay } = useExperience();
  const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);

  return (
    <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
      {reducedMotion ? null : (
        <button type="button" onClick={triggerBurst} className="btn btn--gold">
          <Sparkles aria-hidden="true" className="size-[18px]" strokeWidth={1.75} />
          Thêm một cơn mưa hoa
        </button>
      )}
      <button type="button" onClick={replay} className="btn btn--ghost-light">
        <RotateCcw aria-hidden="true" className="size-[18px]" strokeWidth={1.75} />
        Mở lại tấm thiệp
      </button>
    </div>
  );
}
