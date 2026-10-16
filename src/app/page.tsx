import { SiteHeader } from "@/components/site-header";
import { HeroSection } from "@/components/hero-section";
import { PillarBand } from "@/components/pillar-band";
import { MissionSection } from "@/components/mission-section";
import { OfferingsSection } from "@/components/offerings-section";
import { AdvantagesSection } from "@/components/advantages-section";
import { AutoTradingSection } from "@/components/auto-trading-section";
import { AiTechnologySection } from "@/components/ai-technology-section";
import { IncomeStreamsSection } from "@/components/income-streams-section";
import { LiveDataSection } from "@/components/live-data-section";
import { LeadershipSection } from "@/components/leadership-section";
import { CorporateSection } from "@/components/corporate-section";
import { ClosingSection } from "@/components/closing-section";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <PillarBand />
        <MissionSection />
        <OfferingsSection />
        <AdvantagesSection />
        <AutoTradingSection />
        <AiTechnologySection />
        <IncomeStreamsSection />
        <LiveDataSection />
        <LeadershipSection />
        <CorporateSection />
        <ClosingSection />
      </main>
      <SiteFooter />
    </>
  );
}
