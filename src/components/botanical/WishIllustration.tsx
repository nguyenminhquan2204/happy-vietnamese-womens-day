import type { ReactNode } from "react";
import type { WishIllustrationKind } from "@/data/wishes";
import { BudGlyph, LeafGlyph, PeonyGlyph, RoseGlyph, SparkleGlyph, SprigGlyph } from "./glyphs";

function Leaves({ angles, distance = 30, scale = 0.9 }: { angles: number[]; distance?: number; scale?: number }) {
  return (
    <>
      {angles.map((angle) => (
        <g key={angle} transform={`rotate(${angle}) translate(0 ${-distance}) scale(${scale})`}>
          <LeafGlyph />
        </g>
      ))}
    </>
  );
}

const ILLUSTRATIONS: Record<WishIllustrationKind, () => ReactNode> = {
  rose: () => (
    <>
      <Leaves angles={[-130, -50, 50, 140]} distance={34} />
      <g transform="translate(-30 26) rotate(-30) scale(0.8)">
        <BudGlyph tone="blush" />
      </g>
      <RoseGlyph tone="rose" />
      <g transform="translate(44 -40) scale(0.5)">
        <SparkleGlyph />
      </g>
    </>
  ),
  peony: () => (
    <>
      <Leaves angles={[-150, -100, 100, 150, 200]} distance={36} />
      <g transform="scale(1.05)">
        <PeonyGlyph tone="blush" />
      </g>
      <g transform="translate(-46 -38) scale(0.4)">
        <SparkleGlyph />
      </g>
    </>
  ),
  branch: () => (
    <>
      <g transform="translate(-8 58) rotate(-18) scale(1.15)">
        <SprigGlyph />
      </g>
      <g transform="translate(6 58) rotate(22) scale(0.95)">
        <SprigGlyph />
      </g>
      <g transform="translate(14 -6) scale(0.42)">
        <PeonyGlyph tone="cream" />
      </g>
      <g transform="translate(-22 14) scale(0.32)">
        <RoseGlyph tone="blush" />
      </g>
      <g transform="translate(40 -44) scale(0.45)">
        <SparkleGlyph />
      </g>
    </>
  ),
  blossom: () => (
    <>
      <Leaves angles={[-160, -70, 20, 110]} distance={30} scale={0.8} />
      <g transform="translate(-20 10) scale(0.62)">
        <PeonyGlyph tone="cream" />
      </g>
      <g transform="translate(24 -14) scale(0.5)">
        <RoseGlyph tone="deep" />
      </g>
      <g transform="translate(20 34) rotate(150) scale(0.8)">
        <BudGlyph tone="rose" />
      </g>
      <g transform="translate(-44 -40) scale(0.45)">
        <SparkleGlyph />
      </g>
    </>
  ),
};

export function WishIllustration({ kind, className }: { kind: WishIllustrationKind; className?: string }) {
  return (
    <svg viewBox="-75 -75 150 150" className={className} aria-hidden="true" focusable="false">
      {ILLUSTRATIONS[kind]()}
    </svg>
  );
}
