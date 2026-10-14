import { Ornament } from "@/components/botanical/Ornament";
import { PhotoWall } from "@/components/experience/PhotoWall";
import { Reveal } from "@/components/experience/Reveal";
import { photos } from "@/data/photos";

/** Màn hình 3.5 — bức tường polaroid ảnh các chị em, bấm vào để xem ảnh lớn. */
export function PhotoMemories() {
  return (
    <section id="khoanh-khac" aria-labelledby="khoanh-khac-title" className="relative px-4 pb-24 pt-6 sm:px-6 md:pb-36">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="eyebrow justify-center text-gold-deep">
          <span className="eyebrow__line" />
          Khoảnh khắc
          <span className="eyebrow__line" />
        </p>
        <h2
          id="khoanh-khac-title"
          className="mt-4 font-serif text-[clamp(1.9rem,5vw,3.2rem)] leading-tight text-burgundy text-balance"
        >
          Những bông hoa <em className="text-rose-deep">của chúng mình</em>
        </h2>
        <p className="mt-4 leading-relaxed text-ink/75">
          Mỗi nụ cười là một lý do để văn phòng mình thêm rực rỡ.
        </p>
        <Ornament className="mx-auto mt-5 h-6 w-52 text-champagne" />
      </Reveal>

      <PhotoWall photos={photos} />
    </section>
  );
}
