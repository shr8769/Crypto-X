import { useUserPortfolio } from "@/hooks/useUserPortfolio";
import { useUser } from "@clerk/clerk-react";
import Navigation from "@/components/Navigation";
import PortfolioManagement from "@/components/PortfolioManagement";
import PortfolioAIPredictions from "@/components/PortfolioAIPredictions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Activity, RefreshCw, Wallet, Target } from "lucide-react";
import { formatCurrency, formatPercentage, getChangeColor } from "@/utils/formatters";

const Dashboard = () => {
  const { user } = useUser();
  const { 
    portfolioData, 
    loading, 
    error, 
    addHolding, 
    removeHolding, 
    updateHolding,
    refreshPredictions 
  } = useUserPortfolio();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark">
        <Navigation />
        <div className="container mx-auto px-6 pt-28 pb-20">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin" />
              <span>Loading your portfolio...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-dark">
        <Navigation />
        <div className="container mx-auto px-6 pt-28 pb-20">
          <Card className="border-red-200 dark:border-red-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <Activity className="w-5 h-5" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
            Here's your personalized portfolio performance and AI-powered insights.
          </p>
        </div>

        {/* Portfolio Performance Stats */}
        {portfolioData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm animate-fade-in">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  PORTFOLIO VALUE
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {formatCurrency(portfolioData.metrics.totalValue)}
                </div>
                <div className="flex items-center gap-1 text-sm mt-2">
                  {portfolioData.metrics.totalGainLoss >= 0 ? (
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  )}
                  <span className={portfolioData.metrics.totalGainLoss >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {formatCurrency(Math.abs(portfolioData.metrics.totalGainLoss))}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm animate-fade-in delay-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  TOTAL RETURN
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${portfolioData.metrics.totalGainLossPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatPercentage(portfolioData.metrics.totalGainLossPercentage)}
                </div>
                <div className="flex items-center gap-1 text-muted-foreground text-sm mt-2">
                  <Target className="w-4 h-4" />
                  <span>Since inception</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm animate-fade-in delay-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  24H CHANGE
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${portfolioData.metrics.dayChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatCurrency(Math.abs(portfolioData.metrics.dayChange))}
                </div>
                <div className="flex items-center gap-1 text-sm mt-2">
                  {portfolioData.metrics.dayChangePercentage >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={portfolioData.metrics.dayChangePercentage >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {formatPercentage(Math.abs(portfolioData.metrics.dayChangePercentage))}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm animate-fade-in delay-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  HOLDINGS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {portfolioData.portfolio.holdings.length}
                </div>
                <div className="flex items-center gap-1 text-muted-foreground text-sm mt-2">
                  <Wallet className="w-4 h-4" />
                  <span>Active positions</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Top/Worst Performers */}
        {portfolioData && (portfolioData.metrics.topPerformer || portfolioData.metrics.worstPerformer) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {portfolioData.metrics.topPerformer && (
              <Card className="border-green-200/20 bg-green-500/5 backdrop-blur-sm animate-fade-in">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400">
                    TOP PERFORMER
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-lg">
                        {portfolioData.metrics.topPerformer.symbol}
                      </div>
                      <div className="text-green-600 dark:text-green-400">
                        {formatPercentage(portfolioData.metrics.topPerformer.gainLossPercentage)}
                      </div>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            )}

            {portfolioData.metrics.worstPerformer && (
              <Card className="border-red-200/20 bg-red-500/5 backdrop-blur-sm animate-fade-in delay-100">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-red-600 dark:text-red-400">
                    WORST PERFORMER
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-lg">
                        {portfolioData.metrics.worstPerformer.symbol}
                      </div>
                      <div className="text-red-600 dark:text-red-400">
                        {formatPercentage(portfolioData.metrics.worstPerformer.gainLossPercentage)}
                      </div>
                    </div>
                    <TrendingDown className="w-8 h-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Portfolio Management */}
        <div className="mb-8 animate-fade-in delay-400">
          <PortfolioManagement
            holdings={portfolioData?.portfolio.holdings || []}
            onAddHolding={addHolding}
            onRemoveHolding={removeHolding}
            onUpdateHolding={updateHolding}
          />
        </div>

        {/* AI Predictions */}
        <div className="animate-fade-in delay-500">
          <PortfolioAIPredictions
            predictions={portfolioData?.aiPredictions || []}
            isLoading={loading}
            onRefresh={refreshPredictions}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
