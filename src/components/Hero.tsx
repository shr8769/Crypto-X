import { Button } from "@/components/ui/button";
import { ArrowRight, Hexagon } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  const handleStartTrading = () => {
    if (isSignedIn) {
      navigate('/dashboard');
    } else {
      navigate('/sign-up');
    }
  };

  const handleViewMarkets = () => {
    if (isSignedIn) {
      // Scroll to crypto prices section
      document.getElementById('crypto-prices')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Navigate to sign-up for full market access
      navigate('/sign-up');
    }
  };
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-dark" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-8">
            <Hexagon className="w-4 h-4 text-primary" />
            <span className="text-sm">Next-gen crypto trading platform</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Trade crypto with
            <br />
            <span className="text-primary">confidence & security</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Experience seamless cryptocurrency trading with advanced features, real-time analytics, 
            and institutional-grade security. Start trading in minutes.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              variant="hero" 
              size="lg" 
              className="w-full sm:w-auto"
              onClick={handleStartTrading}
            >
              {isSignedIn ? 'Go to Dashboard' : 'Start Trading Now'}
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto group"
              onClick={handleViewMarkets}
            >
              View Markets
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">$2.4B+</div>
              <div className="text-sm text-muted-foreground mt-1">Trading Volume</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">500K+</div>
              <div className="text-sm text-muted-foreground mt-1">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">99.9%</div>
              <div className="text-sm text-muted-foreground mt-1">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
