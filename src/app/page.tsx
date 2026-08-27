

import FaqSection from "@/Components/Homepage/FaqSection";
import BannerSection from "@/Components/Homepage/BannerSection";


export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-all duration-300">
       <BannerSection></BannerSection>
      <FaqSection />
    </div>
  );
}
