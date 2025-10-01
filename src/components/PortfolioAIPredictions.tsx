import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  RefreshCw, 
  Target,
  Activity,
  AlertCircle,
  Zap
} from "lucide-react";
import { AIPrediction } from "@/types/portfolio";

interface PortfolioAIPredictionsProps {
  predictions: AIPrediction[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

const PortfolioAIPredictions = ({ 
  predictions, 
  isLoading = false, 
  onRefresh 
}: PortfolioAIPredictionsProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'bullish':
        return 'text-green-600 dark:text-green-400';
      case 'bearish':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-yellow-600 dark:text-yellow-400';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'bullish':
        return <TrendingUp className="w-4 h-4" />;
      case 'bearish':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (predictions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            AI Price Predictions
          </CardTitle>
          <CardDescription>
            AI-powered price predictions for your portfolio holdings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No predictions available</p>
            <p className="text-sm mt-1">Add cryptocurrencies to your portfolio to see AI predictions</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              AI Price Predictions
              <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live AI</span>
              </div>
            </CardTitle>
            <CardDescription>
              Advanced ML models analyze market patterns for your holdings
            </CardDescription>
          </div>
          {onRefresh && (
            <Button 
              onClick={onRefresh} 
              variant="outline" 
              size="sm" 
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Analyzing...' : 'Refresh'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {predictions.map((prediction) => (
            <div key={prediction.cryptoId} className="border border-border/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {prediction.symbol.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold">{prediction.symbol}</h4>
                    <p className="text-sm text-muted-foreground">
                      Current: {formatCurrency(prediction.currentPrice)}
                    </p>
                  </div>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  Generated: {prediction.generatedAt.toLocaleTimeString()}
                </div>
              </div>

              <div className="grid gap-3">
                {prediction.predictions.map((pred, index) => {
                  const priceChange = pred.predictedPrice - prediction.currentPrice;
                  const priceChangePercent = (priceChange / prediction.currentPrice) * 100;
                  
                  return (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 rounded-md bg-muted/30"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="min-w-[48px]">
                          {pred.timeframe}
                        </Badge>
                        <div className={`flex items-center gap-1 ${getTrendColor(pred.trend)}`}>
                          {getTrendIcon(pred.trend)}
                          <span className="text-sm font-medium capitalize">
                            {pred.trend}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">
                            {formatCurrency(pred.predictedPrice)}
                          </span>
                          <span className={`text-sm ${priceChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatPercentage(priceChangePercent)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <Target className="w-3 h-3 text-muted-foreground" />
                            <span className={`text-xs ${getConfidenceColor(pred.confidence)}`}>
                              {(pred.confidence * 100).toFixed(0)}% confidence
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reasoning */}
              <div className="mt-3 p-3 bg-muted/20 rounded-md">
                <div className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium mb-1">AI Analysis</p>
                    <p className="text-xs text-muted-foreground">
                      {prediction.predictions[0]?.reasoning || 'Advanced technical analysis and market sentiment indicators.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Overall Portfolio Sentiment */}
        <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-primary" />
            <h4 className="font-semibold">Portfolio AI Summary</h4>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {predictions.filter(p => p.predictions[0]?.trend === 'bullish').length}
              </div>
              <div className="text-xs text-muted-foreground">Bullish Signals</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {predictions.filter(p => p.predictions[0]?.trend === 'bearish').length}
              </div>
              <div className="text-xs text-muted-foreground">Bearish Signals</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {predictions.filter(p => p.predictions[0]?.trend === 'neutral').length}
              </div>
              <div className="text-xs text-muted-foreground">Neutral Signals</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioAIPredictions;