import { SiteHeader } from "@/components/site-header";
import { HeroSection } from "@/components/hero-section";
import { PillarBand } from "@/components/pillar-band";
import { MissionSection } from "@/components/mission-section";
import { OfferingsSection } from "@/components/offerings-section";
import { AutoTradingSection } from "@/components/auto-trading-section";
import { LiveDataSection } from "@/components/live-data-section";
import { UpdatesSection } from "@/components/updates-section";
import { LeadershipSection } from "@/components/leadership-section";
import { CorporateSection } from "@/components/corporate-section";
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
        <AutoTradingSection />
        <LiveDataSection />
        <UpdatesSection />
        <LeadershipSection />
        <CorporateSection />
      </main>
      <SiteFooter />
    </>
  );
}
