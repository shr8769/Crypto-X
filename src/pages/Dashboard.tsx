import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";

interface CryptoPrice {
  name: string;
  symbol: string;
  price: number;
  change: number;
  volume: string;
}

const Dashboard = () => {
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice[]>([
    { name: "Bitcoin", symbol: "BTC", price: 52291, change: 2.34, volume: "$84.42B" },
    { name: "Ethereum", symbol: "ETH", price: 2980.81, change: 1.87, volume: "$32.15B" },
    { name: "Cardano", symbol: "ADA", price: 0.52, change: -0.45, volume: "$804.42M" },
    { name: "Solana", symbol: "SOL", price: 98.45, change: 5.67, volume: "$2.34B" },
    { name: "Polkadot", symbol: "DOT", price: 7.23, change: 1.23, volume: "$234.56M" },
    { name: "Ripple", symbol: "XRP", price: 0.63, change: -1.12, volume: "$1.23B" },
  ]);

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCryptoPrices((prev) =>
        prev.map((crypto) => ({
          ...crypto,
          price: crypto.price * (1 + (Math.random() - 0.5) * 0.01),
          change: crypto.change + (Math.random() - 0.5) * 0.5,
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navigation />

      <div className="container mx-auto px-6 pt-28 pb-20">
        {/* Welcome section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2">Welcome back, Trader</h1>
          <p className="text-muted-foreground">
            Here's a look at your performance and analytics.
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm animate-fade-in">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                SPENT THIS MONTH
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$5,950.64</div>
              <div className="flex items-center gap-1 text-primary text-sm mt-2">
                <ArrowUpRight className="w-4 h-4" />
                <span>+2.34% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm animate-fade-in delay-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                VOLUME (24H)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$84.42B</div>
              <div className="flex items-center gap-1 text-muted-foreground text-sm mt-2">
                <TrendingUp className="w-4 h-4" />
                <span>Market activity</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm animate-fade-in delay-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                MARKET CAP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$804.42B</div>
              <div className="flex items-center gap-1 text-primary text-sm mt-2">
                <ArrowUpRight className="w-4 h-4" />
                <span>+1.87% increase</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Price feed */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm animate-fade-in delay-300">
          <CardHeader>
            <CardTitle className="text-2xl">Live Crypto Prices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cryptoPrices.map((crypto, index) => (
                <div
                  key={crypto.symbol}
                  className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-secondary/20 hover:bg-secondary/40 transition-all duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary font-bold text-lg">
                        {crypto.symbol[0]}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold">{crypto.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {crypto.symbol}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-lg">
                      ${crypto.price.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                    <div
                      className={`flex items-center gap-1 text-sm justify-end ${
                        crypto.change >= 0 ? "text-primary" : "text-destructive"
                      }`}
                    >
                      {crypto.change >= 0 ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                      <span>
                        {Math.abs(crypto.change).toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  <div className="text-right text-muted-foreground">
                    <div className="text-sm">Volume</div>
                    <div className="font-semibold">{crypto.volume}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
