

import FaqSection from "@/Components/Homepage/FaqSection";
import BannerSection from "@/Components/Homepage/BannerSection";
import TrendingNow from "@/Components/Homepage/TreandingNow";
import PricingSection from "@/Components/Homepage/PricingSection";
import AiSearch from "@/Components/AI/AiSearch";



export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-all duration-300">
        <AiSearch />
       <BannerSection></BannerSection>
       <TrendingNow></TrendingNow>
      <FaqSection />
      <PricingSection/>
    </div>
  );
}
