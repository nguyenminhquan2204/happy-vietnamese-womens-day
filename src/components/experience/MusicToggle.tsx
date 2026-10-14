"use client";

import { Music2 } from "lucide-react";
import { useExperience } from "./ExperienceProvider";

/** Bật/tắt nhạc nền. Nhạc tự phát khi người xem bấm mở phong bì (xem `openCard`). */
export function MusicToggle() {
  const { musicPlaying: playing, toggleMusic: toggle } = useExperience();

  const label = playing ? "Tắt nhạc nền" : "Bật nhạc nền";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={playing}
      aria-label={label}
      title={label}
      className={`dock-button dock-button--music ${playing ? "is-playing" : ""}`}
    >
      {playing ? (
        <span className="equalizer" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      ) : (
        <Music2 aria-hidden="true" className="size-4" strokeWidth={1.75} />
      )}
      <span className="dock-button__label" aria-hidden="true">
        {playing ? "Đang phát" : "Nhạc nền"}
      </span>
    </button>
  );
}
