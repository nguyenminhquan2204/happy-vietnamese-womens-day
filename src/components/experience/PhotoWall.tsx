"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, RotateCcw, X } from "lucide-react";
import { useRef, useState } from "react";
import type { Photo } from "@/data/photos";
import { cssVars, seeded } from "@/lib/css-vars";
import { Reveal } from "./Reveal";

/** Thông số rơi riêng cho từng ảnh — dùng `seeded` để server và client khớp nhau. */
function fallVars(index: number) {
  const direction = seeded(index, 3) > 0.5 ? 1 : -1;
  return cssVars({
    "--fall-delay": `${((index % 4) * 0.28 + seeded(index, 5) * 0.25).toFixed(2)}s`,
    "--fall-drift": `${(direction * (40 + seeded(index, 9) * 50)).toFixed(0)}px`,
    "--fall-spin": `${(direction * (18 + seeded(index, 11) * 16)).toFixed(1)}deg`,
    "--sway-duration": `${(5 + seeded(index, 13) * 3).toFixed(2)}s`,
  });
}

/**
 * Lưới polaroid: ảnh rơi lả tả như lá khi cuộn tới, "hiện hình" như ảnh lấy liền rồi đung đưa nhẹ.
 * Lightbox dùng `<dialog>` gốc (Esc, focus trap có sẵn), vuốt trái/phải trên điện thoại.
 */
export function PhotoWall({ photos }: { photos: Photo[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [direction, setDirection] = useState(1);
  const [dropCount, setDropCount] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const open = (index: number) => {
    setActive(index);
    dialogRef.current?.showModal();
  };
  const step = (delta: number) => {
    setDirection(delta);
    setActive((current) => (current === null ? current : (current + delta + photos.length) % photos.length));
  };

  const current = active === null ? null : photos[active];

  return (
    <>
      {/* Đổi `key` để remount cả lưới — Reveal quan sát lại và ảnh rơi thêm lần nữa */}
      <ul key={dropCount} className="photo-wall mx-auto mt-14 max-w-6xl">
        {photos.map((photo, index) => (
          <li key={photo.thumb} className={`photo-wall__item--${photo.orientation}`}>
            <Reveal className="photo-drop">
              <div className="photo-drop__fall" style={fallVars(index)}>
                <div className="photo-drop__sway">
                  <button
                    type="button"
                    className="polaroid"
                    style={cssVars({ "--tilt": `${(seeded(index, 7) * 7 - 3.5).toFixed(2)}deg` })}
                    onClick={() => open(index)}
                    aria-label={`Xem ảnh lớn ${index + 1} trên ${photos.length}`}
                  >
                    <span className="polaroid__tape" aria-hidden="true" />
                    <span className="polaroid__photo">
                      <Image
                        src={photo.thumb}
                        alt={`Ảnh chị em ${index + 1} — ${photo.caption}`}
                        fill
                        sizes={
                          photo.orientation === "landscape" ? "(min-width: 640px) 18.5rem, 92vw" : "(min-width: 640px) 14rem, 46vw"
                        }
                        className="object-cover"
                      />
                      <span className="polaroid__shine" aria-hidden="true" />
                    </span>
                    <span className="polaroid__caption">{photo.caption}</span>
                  </button>
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>

      <div className="mt-14 flex justify-center">
        <button type="button" className="photo-replay" onClick={() => {
            setDropCount((count) => count + 1);
            document.getElementById("khoanh-khac")?.scrollIntoView({ behavior: "smooth" });
          }}>
          <RotateCcw aria-hidden="true" className="size-4" strokeWidth={1.75} />
          Thả ảnh rơi lại
        </button>
      </div>

      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-label="Xem ảnh"
        onClose={() => setActive(null)}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") step(1);
          if (event.key === "ArrowLeft") step(-1);
        }}
        onClick={(event) => {
          // Bấm ra vùng tối bên ngoài ảnh thì đóng
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          const startX = touchStartX.current;
          const endX = event.changedTouches[0]?.clientX;
          touchStartX.current = null;
          if (startX === null || endX === undefined || Math.abs(endX - startX) < 50) return;
          step(endX < startX ? 1 : -1);
        }}
      >
        {current && active !== null ? (
          <figure className="lightbox__figure">
            <div
              key={current.full}
              className={`lightbox__photo ${direction > 0 ? "lightbox__photo--next" : "lightbox__photo--prev"}`}
            >
              <Image src={current.full} alt={`Ảnh chị em ${active + 1}`} fill sizes="90vw" className="object-contain" />
            </div>
            <figcaption className="lightbox__caption">
              <span className="font-script text-3xl text-champagne">{current.caption}</span>
              <span className="text-xs tracking-[0.3em] text-blush/70">
                {active + 1} / {photos.length}
              </span>
            </figcaption>
          </figure>
        ) : null}

        <button type="button" className="lightbox__btn lightbox__btn--close" onClick={() => dialogRef.current?.close()} aria-label="Đóng">
          <X aria-hidden="true" className="size-6" strokeWidth={1.5} />
        </button>
        <button type="button" className="lightbox__btn lightbox__btn--prev" onClick={() => step(-1)} aria-label="Ảnh trước">
          <ChevronLeft aria-hidden="true" className="size-7" strokeWidth={1.5} />
        </button>
        <button type="button" className="lightbox__btn lightbox__btn--next" onClick={() => step(1)} aria-label="Ảnh sau">
          <ChevronRight aria-hidden="true" className="size-7" strokeWidth={1.5} />
        </button>
      </dialog>
    </>
  );
}
