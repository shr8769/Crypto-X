import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import CryptoTicker from "@/components/CryptoTicker";
import CryptoNews from "@/components/CryptoNews";
import PricePrediction from "@/components/PricePrediction";
import { useScrollToSection } from "@/hooks/useScrollToSection";

const Index = () => {
  // This hook will handle hash navigation when the page loads
  useScrollToSection();

  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <div id="crypto-prices">
        <CryptoTicker />
      </div>
      <div id="crypto-news">
        <CryptoNews />
      </div>
      <div id="price-prediction">
        <PricePrediction />
      </div>
    </div>
  );
};

export default Index;
