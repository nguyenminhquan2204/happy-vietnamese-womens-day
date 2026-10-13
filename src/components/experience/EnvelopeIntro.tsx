"use client";

import { MailOpen } from "lucide-react";
import { useEffect, useRef } from "react";
import { Bouquet } from "@/components/botanical/Bouquet";
import { PeonyGlyph, SprigGlyph } from "@/components/botanical/glyphs";
import { Sparkles, type SparklePoint } from "@/components/botanical/Sparkles";
import { useExperience } from "./ExperienceProvider";

const INTRO_SPARKLES: SparklePoint[] = [
  { x: 18, y: 22, size: 14, delay: 0 },
  { x: 82, y: 16, size: 10, delay: 1.2 },
  { x: 88, y: 58, size: 16, delay: 0.6 },
  { x: 10, y: 70, size: 11, delay: 1.8 },
  { x: 62, y: 88, size: 9, delay: 2.4 },
];

function EnvelopePocket() {
  return (
    <svg viewBox="0 0 100 70" className="env-pocket" aria-hidden="true" focusable="false">
      <path d="M0 0L47 38L0 70Z" fill="url(#env-side-l)" />
      <path d="M100 0L53 38L100 70Z" fill="url(#env-side-r)" />
      <path
        d="M0 70L44 35.5Q50 31 56 35.5L100 70Z"
        fill="url(#env-bottom)"
        stroke="rgba(112, 45, 70, 0.12)"
        strokeWidth={0.3}
      />
      <g transform="translate(6 69) rotate(28) scale(0.17)" opacity={0.9}>
        <SprigGlyph />
      </g>
      <g transform="translate(94 69) rotate(-28) scale(0.17)" opacity={0.9}>
        <SprigGlyph />
      </g>
    </svg>
  );
}

function EnvelopeFlap() {
  return (
    <div className="env-flap" aria-hidden="true">
      <svg viewBox="0 0 100 43.4" className="env-flap__face env-flap__face--front" focusable="false">
        <path d="M0 0H100L54 40Q50 43.4 46 40Z" fill="url(#env-flap)" />
        <path d="M7 2.5L50 37.5L93 2.5" fill="none" stroke="url(#gold-line)" strokeWidth={0.35} opacity={0.8} />
      </svg>
      <svg viewBox="0 0 100 43.4" className="env-flap__face env-flap__face--back" focusable="false">
        <path d="M0 0H100L54 40Q50 43.4 46 40Z" fill="url(#env-flap-inside)" />
      </svg>
    </div>
  );
}

function WaxSeal() {
  return (
    <div className="wax-seal" aria-hidden="true">
      <svg viewBox="-30 -30 60 60" focusable="false">
        <path
          d="M0-27C6-28 9-24 14-23C20-22 22-17 24-12C27-7 28-2 27 4C26 10 27 15 22 19C18 23 13 26 7 26C1 28-4 27-9 25C-15 24-20 22-23 17C-26 12-28 7-27 1C-27-5-26-10-22-15C-19-20-14-23-8-25C-5-26-3-27 0-27Z"
          fill="url(#seal-wax)"
        />
        <circle r={17} fill="none" stroke="url(#gold-line)" strokeWidth={0.9} opacity={0.85} />
        <circle r={14.5} fill="none" stroke="url(#gold-line)" strokeWidth={0.4} opacity={0.6} />
        <g transform="scale(0.24)" opacity={0.95}>
          <g className="seal-flower">
            <PeonyGlyph tone="cream" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function LetterPreview() {
  return (
    <div className="env-letter paper-texture">
      <span className="env-letter__frame" aria-hidden="true" />
      <p className="text-[0.62rem] font-medium uppercase tracking-[0.32em] text-gold-deep sm:text-[0.68rem]">
        Gửi tặng
      </p>
      <p className="mt-1 font-script text-[1.9rem] leading-none text-rose-deep sm:text-[2.35rem]">
        những đóa hoa
      </p>
      <p className="mt-2 font-serif text-[1.1rem] italic tracking-[0.18em] text-burgundy sm:text-[1.3rem]">
        20 · 10
      </p>
    </div>
  );
}

export function EnvelopeIntro() {
  const { phase, openCard, replayCount } = useExperience();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isSealed = phase === "sealed";

  useEffect(() => {
    if (replayCount > 0 && phase === "sealed") buttonRef.current?.focus({ preventScroll: true });
  }, [replayCount, phase]);

  if (phase === "open") return null;

  return (
    <section className="intro" aria-label="Phong bì thiệp chúc mừng 20/10">
      <div className="intro__decor" aria-hidden="true">
        <Bouquet className="intro__bouquet intro__bouquet--tl float" />
        <Bouquet className="intro__bouquet intro__bouquet--br float" />
        <Sparkles points={INTRO_SPARKLES} />
      </div>

      <div className="intro__inner">
        <header className="intro__copy">
          <p className="eyebrow justify-center text-gold-deep">
            <span className="eyebrow__line" />
            20 · 10 · 2026
            <span className="eyebrow__line" />
          </p>
          <h1 className="mt-4 font-serif text-[clamp(1.55rem,5.4vw,2.6rem)] leading-[1.2] text-burgundy text-balance">
            Một món quà nhỏ dành tặng{" "}
            <em className="font-medium text-rose-deep">những đóa hoa tuyệt vời</em>
          </h1>
        </header>

        <div className="envelope-stage">
          <div className="envelope" onClick={openCard} aria-hidden="true">
            <div className="env-back" />
            <LetterPreview />
            <EnvelopePocket />
            <EnvelopeFlap />
            <WaxSeal />
          </div>
        </div>

        <div className="intro__cta">
          <button
            ref={buttonRef}
            type="button"
            onClick={openCard}
            disabled={!isSealed}
            className="btn btn--primary btn--glow"
          >
            <MailOpen aria-hidden="true" className="size-5" strokeWidth={1.6} />
            Mở thiệp chúc mừng
          </button>
          <p className="mt-3 text-sm text-ink/60">Có một lời chúc nhỏ đang chờ bạn bên trong</p>
        </div>
      </div>
    </section>
  );
}
