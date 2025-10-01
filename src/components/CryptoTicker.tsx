import { useCryptoPrices } from "@/hooks/useCryptoPrices";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const CryptoPriceCard = ({ crypto }: { crypto: any }) => {
  const isPositive = crypto.changePercent >= 0;
  
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-all">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {crypto.image && (
              <img src={crypto.image} alt={crypto.name} className="w-6 h-6 rounded-full" />
            )}
            <div>
              <h3 className="font-semibold text-sm">{crypto.symbol}</h3>
              <p className="text-xs text-muted-foreground">{crypto.name}</p>
            </div>
          </div>
          <div className={`flex items-center gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="text-sm font-medium">{isPositive ? '+' : ''}{crypto.changePercent.toFixed(2)}%</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold">${crypto.price.toLocaleString()}</p>
          <p className={`text-xs ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? '+' : ''}${crypto.change.toFixed(2)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const CryptoTicker = () => {
  const { prices, isLoading, error, refreshPrices } = useCryptoPrices();

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500 mb-2">Error loading crypto data</p>
        <Button onClick={refreshPrices} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Live Crypto Prices</h2>
        <Button onClick={refreshPrices} variant="outline" size="sm" disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {isLoading && prices.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-6 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {prices.slice(0, 5).map((crypto) => (
            <CryptoPriceCard key={crypto.id} crypto={crypto} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CryptoTicker;