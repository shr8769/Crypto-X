import { useCryptoPrices } from "@/hooks/useCryptoPrices";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const { prices, isLoading } = useCryptoPrices();

  if (!user) {
    return null;
  }

  const topGainer = prices.reduce((prev, current) => 
    prev.changePercent > current.changePercent ? prev : current
  );

  const topLoser = prices.reduce((prev, current) => 
    prev.changePercent < current.changePercent ? prev : current
  );

  const totalMarketCap = prices.reduce((acc, crypto) => {
    const cap = parseFloat(crypto.marketCap.replace(/[^\d.]/g, ''));
    return acc + cap;
  }, 0);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Welcome to your Dashboard, {user.name}!</h2>
        <p className="text-muted-foreground">Here's your cryptocurrency market overview</p>
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tracked Coins</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{prices.length}</div>
            <p className="text-xs text-muted-foreground">Active cryptocurrencies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Cap</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalMarketCap.toFixed(2)}T</div>
            <p className="text-xs text-muted-foreground">Combined market cap</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Gainer</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topGainer?.symbol || 'N/A'}</div>
            <p className="text-xs text-green-500">+{topGainer?.changePercent?.toFixed(2) || 0}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Loser</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topLoser?.symbol || 'N/A'}</div>
            <p className="text-xs text-red-500">{topLoser?.changePercent?.toFixed(2) || 0}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Price Table */}
      <Card>
        <CardHeader>
          <CardTitle>Cryptocurrency Prices</CardTitle>
          <CardDescription>Real-time prices and 24h changes</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 animate-pulse">
                  <div className="h-8 w-8 bg-muted rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {prices.map((crypto) => (
                <div key={crypto.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    {crypto.image && (
                      <img src={crypto.image} alt={crypto.name} className="w-8 h-8 rounded-full" />
                    )}
                    <div>
                      <h3 className="font-semibold">{crypto.name}</h3>
                      <p className="text-sm text-muted-foreground">{crypto.symbol}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold">${crypto.price.toLocaleString()}</p>
                    <div className={`flex items-center gap-1 text-sm ${crypto.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {crypto.changePercent >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span>{crypto.changePercent >= 0 ? '+' : ''}{crypto.changePercent.toFixed(2)}%</span>
                    </div>
                  </div>
                  
                  <div className="text-right text-sm text-muted-foreground">
                    <p>Vol: {crypto.volume}</p>
                    <p>Cap: {crypto.marketCap}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;