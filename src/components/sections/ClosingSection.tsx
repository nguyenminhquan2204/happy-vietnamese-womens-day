import { BloomingFlower } from "@/components/botanical/BloomingFlower";
import { SprigGlyph } from "@/components/botanical/glyphs";
import { Ornament } from "@/components/botanical/Ornament";
import { Sparkles, type SparklePoint } from "@/components/botanical/Sparkles";
import { ClosingActions } from "@/components/experience/ClosingActions";
import { Reveal } from "@/components/experience/Reveal";

const CLOSING_SPARKLES: SparklePoint[] = [
  { x: 10, y: 18, size: 12, delay: 0.2 },
  { x: 88, y: 12, size: 16, delay: 1.1 },
  { x: 92, y: 52, size: 10, delay: 2 },
  { x: 6, y: 62, size: 14, delay: 1.5 },
  { x: 30, y: 8, size: 9, delay: 2.6 },
  { x: 72, y: 34, size: 8, delay: 0.8 },
];

function SideSprigs({ className }: { className: string }) {
  return (
    <svg viewBox="-60 -120 120 130" className={className} aria-hidden="true" focusable="false">
      <g transform="rotate(-24)">
        <SprigGlyph />
      </g>
      <g transform="translate(14 4) rotate(16) scale(0.8)">
        <SprigGlyph />
      </g>
    </svg>
  );
}

/** Màn hình 4 — lời kết với bông hoa nở khi cuộn tới. */
export function ClosingSection() {
  return (
    <section id="loi-ket" aria-labelledby="loi-ket-title" className="closing">
      <div className="closing__glow" aria-hidden="true" />
      <Sparkles points={CLOSING_SPARKLES} />
      <SideSprigs className="closing__sprig closing__sprig--left" />
      <SideSprigs className="closing__sprig closing__sprig--right" />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <Reveal>
          <BloomingFlower className="bloom mx-auto w-36 sm:w-44" />
        </Reveal>

        <Reveal delay={150}>
          <p className="eyebrow mt-6 justify-center text-champagne">
            <span className="eyebrow__line" />
            Lời kết
            <span className="eyebrow__line" />
          </p>
          <h2
            id="loi-ket-title"
            className="mt-5 font-serif text-[clamp(1.75rem,5vw,3.1rem)] leading-[1.25] text-cream text-balance"
          >
            Thế giới sẽ đẹp hơn khi có <em className="text-blush">những người phụ nữ tuyệt vời</em> như
            các bạn.
          </h2>
        </Reveal>

        <Reveal delay={300}>
          <p className="mx-auto mt-6 max-w-xl text-[1.02rem] leading-relaxed text-blush/85 sm:text-lg">
            Chúc các chị em có một ngày 20/10 thật vui, nhận được thật nhiều yêu thương và luôn rạng rỡ
            trên hành trình của riêng mình!
          </p>
          <Ornament className="mx-auto mt-8 h-6 w-56 text-champagne" />
        </Reveal>

        <Reveal delay={450}>
          <p className="mt-6 font-script text-[clamp(2.2rem,6vw,3.2rem)] leading-tight text-champagne" lang="en">
            With love &amp; appreciation 💐
          </p>
          <p className="mt-3 text-blush/85">
            <span className="font-medium text-champagne">From:</span> Những người đồng nghiệp luôn quý mến các
            bạn.
          </p>
          <ClosingActions />
        </Reveal>
      </div>

      <footer className="relative mt-20 text-center text-xs tracking-[0.25em] text-blush/50 uppercase">
        Blooming Elegance · 20.10.2026
      </footer>
    </section>
  );
}
