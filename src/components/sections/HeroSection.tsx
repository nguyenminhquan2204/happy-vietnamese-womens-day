import { ChevronDown } from "lucide-react";
import { Bouquet } from "@/components/botanical/Bouquet";
import { Ornament } from "@/components/botanical/Ornament";
import { Sparkles, type SparklePoint } from "@/components/botanical/Sparkles";
import { cssVars } from "@/lib/css-vars";

const HERO_SPARKLES: SparklePoint[] = [
  { x: 14, y: 46, size: 12, delay: 0.4 },
  { x: 86, y: 30, size: 16, delay: 1.4 },
  { x: 74, y: 78, size: 10, delay: 2.1 },
  { x: 24, y: 84, size: 14, delay: 0.9 },
  { x: 50, y: 10, size: 9, delay: 1.8 },
];

/** Màn hình 2 — phần tiêu đề chính, xuất hiện ngay sau khi phong bì mở. */
export function HeroSection() {
  return (
    <section
      id="mo-dau"
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-4 pb-20 pt-32 sm:px-6 sm:pt-28"
    >
      <div className="hero-decor" aria-hidden="true">
        <div className="hero-decor__item hero-decor__item--left enter" style={cssVars({ "--d": 500 })}>
          <Bouquet className="float h-full w-full" />
        </div>
        <div className="hero-decor__item hero-decor__item--right enter" style={cssVars({ "--d": 650 })}>
          <Bouquet className="float float--slow h-full w-full" />
        </div>
        <div className="hero-halo" />
        <Sparkles points={HERO_SPARKLES} />
      </div>

      <div className="relative z-[1] mx-auto flex max-w-3xl flex-col items-center text-center">
        <p className="eyebrow enter text-gold-deep" style={cssVars({ "--d": 0 })}>
          <span className="eyebrow__line" />
          Ngày 20 tháng 10
          <span className="eyebrow__line" />
        </p>

        <p
          className="enter mt-5 font-script text-[clamp(1.6rem,6.9vw,3.6rem)] whitespace-nowrap leading-tight text-rose-deep"
          style={cssVars({ "--d": 120 })}
          lang="en"
        >
          Happy Vietnamese Women&apos;s Day
        </p>

        <h1
          id="hero-title"
          tabIndex={-1}
          className="enter mt-3 font-serif text-[clamp(2.1rem,6.6vw,4.4rem)] font-medium leading-[1.08] text-burgundy text-balance"
          style={cssVars({ "--d": 240 })}
        >
          Chúc mừng ngày <em className="font-normal text-rose-deep">Phụ nữ Việt Nam</em>
          <span className="hero-date text-gold-gradient">20/10</span>
        </h1>

        <Ornament className="enter mt-2 h-6 w-56 text-champagne" />

        <p
          className="enter mt-6 max-w-xl text-[1.02rem] leading-relaxed text-ink/80 sm:text-lg"
          style={cssVars({ "--d": 420 })}
        >
          Hôm nay là ngày đặc biệt để tôn vinh những người phụ nữ tuyệt vời — những người luôn mang
          đến năng lượng tích cực, sự dịu dàng và thật nhiều niềm vui cho mọi người xung quanh.
        </p>

        <a href="#thiep" className="scroll-cue enter mt-10" style={cssVars({ "--d": 620 })}>
          Mở tiếp tấm thiệp
          <ChevronDown aria-hidden="true" className="scroll-cue__icon size-5" strokeWidth={1.5} />
        </a>
      </div>
    </section>
  );
}
