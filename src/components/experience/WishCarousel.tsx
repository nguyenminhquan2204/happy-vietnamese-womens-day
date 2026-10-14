"use client";

import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { REDUCED_MOTION_QUERY, useMediaQuery } from "@/lib/use-media-query";

const AUTOPLAY_MS = 4500;
/** Sau khi người xem tự vuốt/bấm, chờ chừng này rồi mới tự chạy tiếp. */
const RESUME_AFTER_MS = 6000;

/** Trượt một tấm thiệp; chạy hết thì quay vòng về đầu (hoặc về cuối khi lùi từ tấm đầu). */
function slide(track: HTMLElement | null, direction: 1 | -1) {
  const card = track?.firstElementChild as HTMLElement | null;
  if (!track || !card) return;
  const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
  const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
  const atStart = track.scrollLeft <= 4;
  if (direction === 1 && atEnd) track.scrollTo({ left: 0, behavior: "smooth" });
  else if (direction === -1 && atStart) track.scrollTo({ left: track.scrollWidth, behavior: "smooth" });
  else track.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: "smooth" });
}

/**
 * Dải thiệp trượt ngang (scroll-snap, vuốt được trên điện thoại).
 * Tự chạy từng tấm, có nút bật/tắt; tạm dừng khi rê chuột/focus vào thiệp.
 * Nếu thiệp vừa đủ màn hình thì không hiện nút điều khiển.
 */
export function WishCarousel({ children }: { children: ReactNode }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const lastInteraction = useRef(0);
  const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);
  const [autoplay, setAutoplay] = useState(true);
  const [hovering, setHovering] = useState(false);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new ResizeObserver(() => setOverflowing(track.scrollWidth > track.clientWidth + 4));
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  const playing = autoplay && !reducedMotion && overflowing && !hovering;

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      if (Date.now() - lastInteraction.current < RESUME_AFTER_MS) return;
      slide(trackRef.current, 1);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [playing]);

  const nudge = (direction: 1 | -1) => {
    lastInteraction.current = Date.now();
    slide(trackRef.current, direction);
  };

  const autoplayOn = autoplay && !reducedMotion;
  const toggleLabel = autoplayOn ? "Tắt tự chạy thiệp" : "Bật tự chạy thiệp";

  return (
    <div className="wish-carousel">
      <ul
        ref={trackRef}
        className={`wish-track ${overflowing ? "" : "wish-track--fit"}`}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onFocus={() => setHovering(true)}
        onBlur={() => setHovering(false)}
        onPointerDown={() => (lastInteraction.current = Date.now())}
        onWheel={() => (lastInteraction.current = Date.now())}
      >
        {children}
      </ul>

      {overflowing ? (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button type="button" className="wish-nav" onClick={() => nudge(-1)} aria-label="Thiệp trước">
            <ChevronLeft aria-hidden="true" className="size-5" strokeWidth={1.75} />
          </button>
          {reducedMotion ? null : (
            <button
              type="button"
              className={`wish-nav wish-nav--toggle ${autoplayOn ? "is-on" : ""}`}
              onClick={() => setAutoplay((on) => !on)}
              aria-pressed={autoplayOn}
              aria-label={toggleLabel}
              title={toggleLabel}
            >
              {autoplayOn ? (
                <Pause aria-hidden="true" className="size-4" strokeWidth={1.75} />
              ) : (
                <Play aria-hidden="true" className="size-4" strokeWidth={1.75} />
              )}
              <span>Tự chạy: {autoplayOn ? "Bật" : "Tắt"}</span>
            </button>
          )}
          <button type="button" className="wish-nav" onClick={() => nudge(1)} aria-label="Thiệp sau">
            <ChevronRight aria-hidden="true" className="size-5" strokeWidth={1.75} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
