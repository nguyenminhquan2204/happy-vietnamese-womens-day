import { WishIllustration } from "@/components/botanical/WishIllustration";
import { Ornament } from "@/components/botanical/Ornament";
import { Reveal } from "@/components/experience/Reveal";
import { wishCards, type WishCard as WishCardData } from "@/data/wishes";
import { cssVars } from "@/lib/css-vars";

function WishCard({ card, index }: { card: WishCardData; index: number }) {
  return (
    <article className={`wish-card wish-card--${card.tone}`} style={cssVars({ "--tilt": `${card.tilt}deg` })}>
      <span className="wish-card__frame" aria-hidden="true" />
      <span className="wish-card__shine" aria-hidden="true" />
      <div className="flex items-start justify-between">
        <span className="font-serif text-sm italic text-gold-deep">Thiệp số</span>
        <span className="font-serif text-2xl italic leading-none text-burgundy/70" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="wish-card__arch">
        <WishIllustration kind={card.illustration} className="wish-card__art" />
      </div>
      <h3 className="mt-6 font-serif text-[1.45rem] leading-snug text-burgundy">{card.title}</h3>
      <p className="mt-2.5 leading-relaxed text-ink/80">{card.message}</p>
      <span className="wish-card__stamp" aria-hidden="true">
        20 · 10
      </span>
    </article>
  );
}

/** Màn hình 3 — bộ sưu tập thiệp nhỏ, bố cục so le như được bày trên bàn. */
export function WishCollection() {
  return (
    <section id="loi-chuc" aria-labelledby="loi-chuc-title" className="relative px-4 pb-24 pt-10 sm:px-6 md:pb-36 md:pt-16">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="eyebrow justify-center text-gold-deep">
          <span className="eyebrow__line" />
          Bộ sưu tập lời chúc
          <span className="eyebrow__line" />
        </p>
        <h2 id="loi-chuc-title" className="mt-4 font-serif text-[clamp(1.9rem,5vw,3.2rem)] leading-tight text-burgundy text-balance">
          Những lời chúc dành riêng <em className="text-rose-deep">cho chị em</em>
        </h2>
        <p className="mt-4 leading-relaxed text-ink/75">
          Mỗi tấm thiệp nhỏ là một lời chúc — và tấm nào cũng dành cho bạn.
        </p>
        <Ornament className="mx-auto mt-5 h-6 w-52 text-champagne" />
      </Reveal>

      <ul className="wish-gallery mx-auto mt-14 grid max-w-6xl gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {wishCards.map((card, index) => (
          <li key={card.title}>
            <Reveal delay={index * 130}>
              <WishCard card={card} index={index} />
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
