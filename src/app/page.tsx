import FeaturesSection from "@/components/FeaturesSection";
import GallerySection from "@/components/GallerySection";
import HeroBanner from "@/components/HeroBanner";
import NewsletterSection from "@/components/NewsletterSection";

export default function Home() {
  return (
    <main >
      <HeroBanner />
      <FeaturesSection />
      <GallerySection />
      <NewsletterSection/>
    </main>
  );
}
