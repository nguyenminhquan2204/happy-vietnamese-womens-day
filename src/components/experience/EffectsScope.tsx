"use client";

import { Fragment, type ReactNode } from "react";
import { useExperience } from "./ExperienceProvider";

/** Remount nội dung bên trong khi `restartEffects()` được gọi, để các hiệu ứng xuất hiện chạy lại. */
export function EffectsScope({ children }: { children: ReactNode }) {
  const { effectsKey } = useExperience();
  return <Fragment key={effectsKey}>{children}</Fragment>;
}
