import FeaturesSection from "@/components/FeaturesSection";
import GallerySection from "@/components/GallerySection";
import HeroBanner from "@/components/HeroBanner";
import NewsletterSection from "@/components/NewsletterSection";
import RecentUpcoming from "@/components/RecentUpcoming";

export default function Home() {
  return (
    <main >
      <HeroBanner />
      <FeaturesSection />
      <RecentUpcoming />
      <GallerySection />
      <NewsletterSection/>
    </main>
  );
}
