import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HorizontalGallery from "@/components/HorizontalGallery";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <main className="bg-bg">
      <Navbar />
      <HeroSection />
      <HorizontalGallery />
      <AboutSection />
      <ContactSection />
    </main>
  );
}
