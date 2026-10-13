import { Bouquet } from "@/components/botanical/Bouquet";
import { PeonyGlyph, SprigGlyph } from "@/components/botanical/glyphs";
import { Ornament } from "@/components/botanical/Ornament";
import { Reveal } from "@/components/experience/Reveal";
import { mainWishes } from "@/data/wishes";

function WishBullet() {
  return (
    <svg viewBox="-60 -60 120 120" className="mt-1 size-5 shrink-0" aria-hidden="true" focusable="false">
      <PeonyGlyph tone="blush" />
    </svg>
  );
}

function CornerSprig({ className }: { className: string }) {
  return (
    <svg viewBox="-10 -110 60 120" className={className} aria-hidden="true" focusable="false">
      <g transform="rotate(30)">
        <SprigGlyph />
      </g>
    </svg>
  );
}

/** Màn hình 2 (tiếp) — tấm thiệp mở dạng hai trang: minh họa bên trái, lời chúc bên phải. */
export function GreetingCard() {
  return (
    <section id="thiep" aria-labelledby="thiep-title" className="relative scroll-mt-6 px-4 py-16 sm:px-6 md:py-28">
      <Reveal className="mx-auto max-w-5xl">
        <article className="card-spread paper-texture">
          <div className="card-page card-page--art">
            <span className="card-frame" aria-hidden="true" />
            <CornerSprig className="card-corner card-corner--tl" />
            <CornerSprig className="card-corner card-corner--br" />
            <Bouquet className="float float--slow relative mx-auto w-[min(88%,380px)] drop-shadow-[0_18px_30px_rgba(112,45,70,0.18)]" />
            <div className="relative mt-2 text-center">
              <p className="font-script text-[2.4rem] leading-none text-rose-deep sm:text-5xl">Dành tặng</p>
              <p className="mt-2 font-serif text-xl italic text-burgundy sm:text-2xl">
                những người phụ nữ tuyệt vời
              </p>
              <p className="mt-4 text-[0.7rem] font-medium uppercase tracking-[0.4em] text-gold-deep">
                20 · 10 · 2026
              </p>
            </div>
          </div>

          <div className="card-page card-page--text">
            <p className="eyebrow text-gold-deep">
              Lời chúc 20/10
              <span className="eyebrow__line" />
            </p>
            <h2 id="thiep-title" className="mt-4 font-serif text-[clamp(1.8rem,4vw,2.6rem)] leading-tight text-burgundy">
              Gửi các chị em <em className="whitespace-nowrap text-rose-deep">thân mến,</em>
            </h2>
            <p className="mt-4 leading-relaxed text-ink/75">
              Nhân ngày đặc biệt này, chúng mình muốn gửi tới các chị em đôi lời chúc thật lòng:
            </p>

            <ul className="mt-7 space-y-5">
              {mainWishes.map((wish, index) => (
                <li key={wish}>
                  <Reveal delay={200 + index * 140} className="flex gap-3.5">
                    <WishBullet />
                    <p className="leading-relaxed text-ink/90">{wish}</p>
                  </Reveal>
                </li>
              ))}
            </ul>

            <Ornament className="mt-9 h-5 w-44 text-champagne" />
            <p className="mt-3 font-script text-3xl text-rose-deep">Thân mến,</p>
            <p className="text-sm tracking-wide text-ink/65">— Những người đồng nghiệp của bạn</p>
          </div>
        </article>
      </Reveal>
    </section>
  );
}
