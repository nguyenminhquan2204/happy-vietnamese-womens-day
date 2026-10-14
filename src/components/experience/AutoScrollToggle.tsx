"use client";

import { ChevronsDown, Pause } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { REDUCED_MOTION_QUERY, useMediaQuery } from "@/lib/use-media-query";
import { useExperience } from "./ExperienceProvider";

/** Tốc độ tự cuộn (px/giây) — đủ chậm để kịp đọc lời chúc. */
const SPEED = 35;
/** Thời gian tăng tốc từ đứng yên lên tốc độ đều. */
const RAMP_IN_MS = 1800;
/** Còn chừng này px tới cuối trang thì bắt đầu chậm dần. */
const EASE_OUT_PX = 180;
/** Dừng ở cuối trang để người xem đọc lời kết. */
const HOLD_AT_END_MS = 2500;
/** Thời gian lớp phủ mờ dần lên/tan ra (khớp `.loop-veil` trong globals.css). */
const VEIL_MS = 1100;
/** Sau khi về đầu trang, chờ phần mở đầu hiện ra rồi mới cuộn. */
const RESTART_DELAY_MS = 2200;
const MANUAL_SCROLL_KEYS = new Set(["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "]);

const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;
const isAtBottom = () => window.scrollY >= maxScroll() - 4;
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

/**
 * Bật/tắt tự cuộn cả trang (ví dụ khi chiếu lên màn hình lớn). Tăng tốc êm khi bắt đầu, chậm dần khi gần cuối,
 * dừng một chút ở lời kết rồi phủ một lớp màu dịu, quay về đầu trang, chạy lại mọi hiệu ứng và cuộn tiếp — lặp mãi.
 * Tắt khi người xem tự cuộn (chuột, vuốt, phím).
 */
export function AutoScrollToggle() {
  const { isRevealed, restartEffects } = useExperience();
  const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);
  const [enabled, setEnabled] = useState(false);
  const [veil, setVeil] = useState(false);
  /** Bật lúc đang ở cuối trang thì vào thẳng bước quay về đầu. */
  const loopOnStart = useRef(false);
  const active = enabled && isRevealed && !reducedMotion;

  useEffect(() => {
    if (!active) return;
    let frame = 0;
    let timer = 0;
    let last = performance.now();
    let carry = 0;
    let scrollStart = last;
    let mode: "scroll" | "hold" | "loop" = "scroll";
    const devicePixel = 1 / (window.devicePixelRatio || 1);

    const loopToTop = () => {
      mode = "loop";
      setVeil(true);
      timer = window.setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
        restartEffects();
        setVeil(false);
        carry = 0;
        scrollStart = performance.now() + RESTART_DELAY_MS;
        mode = "scroll";
      }, VEIL_MS);
    };

    const tick = (now: number) => {
      // Giới hạn bước thời gian để không "nhảy cóc" khi tab bị ẩn rồi quay lại
      const elapsed = Math.min(now - last, 64);
      last = now;

      if (mode === "scroll" && now >= scrollStart && !document.querySelector("dialog[open]")) {
        const remaining = maxScroll() - window.scrollY;
        if (remaining <= 1) {
          mode = "hold";
          timer = window.setTimeout(loopToTop, HOLD_AT_END_MS);
        } else {
          const rampIn = easeInOutSine(Math.min(1, (now - scrollStart) / RAMP_IN_MS));
          const rampOut = Math.max(0.3, Math.min(1, remaining / EASE_OUT_PX));
          carry += (SPEED * rampIn * rampOut * elapsed) / 1000;
          // Cuộn theo bước điểm ảnh thật của màn hình (0.5px trên màn retina) cho mượt
          const step = Math.floor(carry / devicePixel) * devicePixel;
          if (step > 0) {
            // `instant` để không bị `scroll-behavior: smooth` của html làm giật
            window.scrollBy({ top: step, behavior: "instant" });
            carry -= step;
          }
        }
      }
      frame = requestAnimationFrame(tick);
    };

    // Vuốt/cuộn ngang trên dải thiệp lời chúc không tính là tự cuộn trang
    const stop = (event: Event) => {
      if (event.target instanceof Element && event.target.closest(".wish-track")) return;
      setEnabled(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (MANUAL_SCROLL_KEYS.has(event.key) && !(event.target instanceof HTMLButtonElement)) setEnabled(false);
    };

    if (loopOnStart.current) {
      loopOnStart.current = false;
      loopToTop();
    }
    frame = requestAnimationFrame(tick);
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchmove", stop, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchmove", stop);
      window.removeEventListener("keydown", onKey);
    };
  }, [active, restartEffects]);

  if (!isRevealed || reducedMotion) return null;

  const label = active ? "Tắt tự cuộn trang" : "Bật tự cuộn trang";
  const Icon = active ? Pause : ChevronsDown;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (active) return setEnabled(false);
          setVeil(false);
          loopOnStart.current = isAtBottom();
          setEnabled(true);
        }}
        aria-pressed={active}
        aria-label={label}
        title={label}
        className={`dock-button dock-button--scroll ${active ? "is-active" : ""}`}
      >
        <Icon aria-hidden="true" className="size-4" strokeWidth={1.75} />
        <span className="dock-button__label">{active ? "Đang tự cuộn" : "Tự cuộn"}</span>
      </button>
      {createPortal(<div className={`loop-veil ${active && veil ? "is-visible" : ""}`} aria-hidden="true" />, document.body)}
    </>
  );
}
