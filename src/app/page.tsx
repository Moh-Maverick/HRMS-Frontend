import Hero from "@/components/Hero";
import Features from "@/components/Features";
import AIHighlights from "@/components/AIHighlights";
import Footer from "@/components/Footer";
import { Navbar } from "@/components/ui";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <AIHighlights />
      <Footer />
    </div>
  );
}
