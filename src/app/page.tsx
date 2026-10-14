import { FloralDefs } from "@/components/botanical/FloralDefs";
import { ControlDock } from "@/components/experience/ControlDock";
import { EffectsScope } from "@/components/experience/EffectsScope";
import { EnvelopeIntro } from "@/components/experience/EnvelopeIntro";
import { ExperienceProvider } from "@/components/experience/ExperienceProvider";
import { PetalField } from "@/components/experience/PetalField";
import { ClosingSection } from "@/components/sections/ClosingSection";
import { GreetingCard } from "@/components/sections/GreetingCard";
import { HeroSection } from "@/components/sections/HeroSection";
import { PhotoMemories } from "@/components/sections/PhotoMemories";
import { WishCollection } from "@/components/sections/WishCollection";

export default function Home() {
  return (
    <ExperienceProvider>
      <FloralDefs />
      <div className="backdrop" aria-hidden="true" />
      <EnvelopeIntro />
      <PetalField />
      <ControlDock />

      <EffectsScope>
        <main className="stage">
          <HeroSection />
          <GreetingCard />
          <WishCollection />
          <PhotoMemories />
          <ClosingSection />
        </main>
      </EffectsScope>
    </ExperienceProvider>
  );
}
