import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import CryptoTicker from "@/components/CryptoTicker";
import CryptoNews from "@/components/CryptoNews";
import PricePrediction from "@/components/PricePrediction";
import { useScrollToSection } from "@/hooks/useScrollToSection";
import { useUser } from "@clerk/clerk-react";

const Index = () => {
  // This hook will handle hash navigation when the page loads
  useScrollToSection();
  const { isSignedIn } = useUser();

  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      
      {/* Show crypto news to everyone */}
      <div id="crypto-news">
        <CryptoNews />
      </div>
      
      {/* Only show advanced features to authenticated users */}
      {isSignedIn && (
        <>
          <div id="crypto-prices">
            <CryptoTicker />
          </div>
          <div id="price-prediction">
            <PricePrediction />
          </div>
        </>
      )}
    </div>
  );
};

export default Index;
