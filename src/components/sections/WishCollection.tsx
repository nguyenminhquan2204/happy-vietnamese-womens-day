import { WishIllustration } from "@/components/botanical/WishIllustration";
import { Ornament } from "@/components/botanical/Ornament";
import { Reveal } from "@/components/experience/Reveal";
import { WishCarousel } from "@/components/experience/WishCarousel";
import { loadGuestWishes, type GuestWish } from "@/data/guest-wishes";
import { WISH_ILLUSTRATIONS, WISH_TONES } from "@/data/wishes";
import { cssVars, seeded } from "@/lib/css-vars";

function WishCard({ wish, index }: { wish: GuestWish; index: number }) {
  const tone = WISH_TONES[index % WISH_TONES.length];
  const tilt = (seeded(index, 17) * 4 - 2).toFixed(2);
  return (
    <article
      className={`wish-card wish-card--${tone}`}
      style={cssVars({ "--tilt": `${tilt}deg` })}
      aria-label={`Lời chúc từ ${wish.from}`}
    >
      <span className="wish-card__frame" aria-hidden="true" />
      <span className="wish-card__shine" aria-hidden="true" />
      <div className="flex items-start justify-between">
        <span className="font-serif text-sm italic text-gold-deep">Thiệp số</span>
        <span className="font-serif text-2xl italic leading-none text-burgundy/70" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="wish-card__arch">
        <WishIllustration kind={WISH_ILLUSTRATIONS[index % WISH_ILLUSTRATIONS.length]} className="wish-card__art" />
      </div>
      <p className="mt-6 whitespace-pre-line leading-relaxed text-ink/85">{wish.message}</p>
      <p className="wish-card__from">
        <span className="font-serif text-sm italic text-gold-deep">Từ</span>
        <span className="font-script text-[1.9rem] leading-tight text-rose-deep">{wish.from}</span>
      </p>
      <span className="wish-card__stamp" aria-hidden="true">
        20 · 10
      </span>
    </article>
  );
}

/** Màn hình 3 — lời chúc của mọi người (đọc từ `loichuc.txt`) trên dải thiệp trượt ngang. */
export function WishCollection() {
  const wishes = loadGuestWishes();
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
          Mỗi tấm thiệp là một lời chúc từ những người đồng nghiệp — và tấm nào cũng dành cho bạn.
        </p>
        <Ornament className="mx-auto mt-5 h-6 w-52 text-champagne" />
      </Reveal>

      <Reveal delay={150} className="mt-12">
        <WishCarousel>
          {wishes.map((wish, index) => (
            <li key={`${wish.from}-${index}`} className="wish-slide">
              <WishCard wish={wish} index={index} />
            </li>
          ))}
        </WishCarousel>
      </Reveal>
    </section>
  );
}
