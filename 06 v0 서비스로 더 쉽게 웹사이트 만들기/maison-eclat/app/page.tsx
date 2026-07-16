import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { BrandMarquee } from "@/components/brand-marquee"
import { StorySection } from "@/components/story-section"
import { CollectionsSection } from "@/components/collections-section"
import { PhilosophySection } from "@/components/philosophy-section"
import { AtelierSection } from "@/components/atelier-section"
import { ContactSection } from "@/components/contact-section"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <HeroSection />
        <BrandMarquee />
        <StorySection />
        <CollectionsSection />
        <PhilosophySection />
        <AtelierSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  )
}
