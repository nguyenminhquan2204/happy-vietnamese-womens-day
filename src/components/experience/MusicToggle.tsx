"use client";

import { Music2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MusicBox } from "@/lib/music-box";

/** Bật/tắt nhạc nền. Không tự phát — chỉ chạy khi người dùng chủ động bấm. */
export function MusicToggle() {
  const musicBox = useRef<MusicBox | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => () => musicBox.current?.dispose(), []);

  const toggle = () => {
    musicBox.current ??= new MusicBox();
    if (musicBox.current.isPlaying) {
      musicBox.current.pause();
      setPlaying(false);
    } else {
      setPlaying(true);
      musicBox.current.play().catch(() => setPlaying(false));
    }
  };

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
