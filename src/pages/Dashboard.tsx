import { useCryptoPrices } from "@/hooks/useCryptoPrices";
import { usePortfolioMetrics } from "@/hooks/usePortfolioMetrics";
import { useUser } from "@clerk/clerk-react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { formatCurrency, formatPercentage, getChangeColor } from "@/utils/formatters";

const Dashboard = () => {
  const { prices: cryptoPrices, isLoading, error, refreshPrices } = useCryptoPrices();
  const { metrics, isLoading: metricsLoading } = usePortfolioMetrics();
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navigation />

      <div className="container mx-auto px-6 pt-28 pb-20">
        {/* Welcome section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {user?.firstName || user?.username || 'Trader'}
          </h1>
          <p className="text-muted-foreground">
            Here's a look at your portfolio performance and market analytics.
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm animate-fade-in">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                MARKET CAP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {metricsLoading ? (
                  <div className="animate-pulse bg-muted h-8 w-24 rounded"></div>
                ) : (
                  `$${metrics?.totalMarketCap.toFixed(1)}T`
                )}
              </div>
              <div className="flex items-center gap-1 text-muted-foreground text-sm mt-2">
                {metrics?.marketSentiment === 'bullish' ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                ) : metrics?.marketSentiment === 'bearish' ? (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                ) : (
                  <Activity className="w-4 h-4" />
                )}
                <span className={metrics?.marketSentiment === 'bullish' ? 'text-green-500' : metrics?.marketSentiment === 'bearish' ? 'text-red-500' : 'text-muted-foreground'}>
                  {metrics?.marketSentiment || 'loading'} market
                </span>
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
              <div className="text-3xl font-bold">
                {metricsLoading ? (
                  <div className="animate-pulse bg-muted h-8 w-24 rounded"></div>
                ) : (
                  `$${metrics?.totalVolume24h.toFixed(1)}B`
                )}
              </div>
              <div className="flex items-center gap-1 text-muted-foreground text-sm mt-2">
                <TrendingUp className="w-4 h-4" />
                <span>Real-time volume</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm animate-fade-in delay-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                AVERAGE CHANGE
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {metricsLoading ? (
                  <div className="animate-pulse bg-muted h-8 w-24 rounded"></div>
                ) : (
                  <span className={metrics && metrics.averageChange >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {metrics?.averageChange >= 0 ? '+' : ''}{metrics?.averageChange.toFixed(2)}%
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-sm mt-2">
                {metrics && metrics.averageChange >= 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
                <span className={metrics && metrics.averageChange >= 0 ? 'text-green-500' : 'text-red-500'}>
                  Market average
                </span>
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
                      {formatCurrency(crypto.price)}
                    </div>
                    <div
                      className={`flex items-center gap-1 text-sm justify-end ${getChangeColor(crypto.changePercent)}`}
                    >
                      {crypto.changePercent >= 0 ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                      <span>
                        {formatPercentage(Math.abs(crypto.changePercent))}
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
