import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  BarChart3, 
  AlertCircle, 
  RefreshCw, 
  Target,
  Shield,
  Zap,
  Activity,
  LineChart
} from "lucide-react";
import { useAIPrediction } from "@/hooks/useAIPrediction";
import { useCryptoPrices } from "@/hooks/useCryptoPrices";

const PricePrediction = () => {
  const { prices } = useCryptoPrices();
  const { 
    predictions, 
    tradingSignals, 
    marketSentiments, 
    isLoading, 
    error, 
    lastUpdated,
    refreshPredictions,
    portfolioMetrics,
    modelPerformance
  } = useAIPrediction();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <div id="price-prediction" className="w-full max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Brain className="w-8 h-8 text-primary" />
          <h2 className="text-3xl font-bold">AI-Powered Price Predictions</h2>
          {!isLoading && lastUpdated && (
            <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live AI</span>
            </div>
          )}
        </div>
        <p className="text-muted-foreground text-lg mb-4">
          Advanced LSTM, GRU & Transformer models analyze market patterns for precise predictions
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button 
            onClick={refreshPredictions} 
            variant="outline" 
            size="sm" 
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Analyzing...' : 'Refresh Predictions'}
          </Button>
          {lastUpdated && (
            <span className="text-xs text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {error && (
        <Card className="mb-6 border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Portfolio Performance Overview */}
      {portfolioMetrics && (
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Signals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {portfolioMetrics.totalSignals}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Active trading signals
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {portfolioMetrics.avgConfidence}%
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Signal confidence
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Buy Signals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {portfolioMetrics.distribution.buy}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Out of {portfolioMetrics.totalSignals} total
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Market Sentiment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {portfolioMetrics.overallSentiment}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Overall market mood
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Model Performance */}
      {modelPerformance && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              AI Model Performance
            </CardTitle>
            <CardDescription>Real-time performance metrics for all prediction models</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Average Accuracy</h4>
                  <Badge variant={modelPerformance.avgAccuracy > 80 ? "default" : "secondary"}>
                    {modelPerformance.avgAccuracy}% Accuracy
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Predictions</span>
                    <span>{modelPerformance.totalPredictions}</span>
                  </div>
                  <Progress value={modelPerformance.avgAccuracy} className="h-2" />
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Model Distribution</h4>
                <div className="space-y-2">
                  {Object.entries(modelPerformance.modelDistribution).map(([model, count]) => (
                    <div key={model} className="flex justify-between text-sm">
                      <span className="capitalize">{model}</span>
                      <span>{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Last Training</h4>
                <div className="text-sm text-muted-foreground">
                  {new Date(modelPerformance.lastTrainingDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Predictions */}
      <div className="grid gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="w-5 h-5" />
              AI Price Predictions
            </CardTitle>
            <CardDescription>
              Real-time predictions from LSTM, GRU, and Transformer models
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-3">
                {Object.values(predictions).slice(0, 3).map((prediction) => (
                  <div key={prediction.symbol} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{prediction.symbol}</h4>
                        <p className="text-sm text-muted-foreground">
                          Current: {formatCurrency(prices.find(p => p.symbol === prediction.symbol)?.price || 0)}
                        </p>
                      </div>
                      <Badge variant={prediction.aiModel.accuracy > 0.8 ? "default" : "secondary"}>
                        {(prediction.aiModel.accuracy * 100).toFixed(0)}%
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>1d Prediction:</span>
                        <span className="font-medium">
                          {formatCurrency(prediction.predictions.find(p => p.timeframe === '1d')?.predictedPrice || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>7d Prediction:</span>
                        <span className="font-medium">
                          {formatCurrency(prediction.predictions.find(p => p.timeframe === '7d')?.predictedPrice || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>30d Prediction:</span>
                        <span className="font-medium">
                          {formatCurrency(prediction.predictions.find(p => p.timeframe === '30d')?.predictedPrice || 0)}
                        </span>
                      </div>
                      
                      <div className="pt-2 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Direction:</span>
                          <div className={`flex items-center gap-1 ${
                            prediction.predictions[0]?.direction === 'up' 
                              ? 'text-green-600' 
                              : prediction.predictions[0]?.direction === 'down' 
                                ? 'text-red-600' 
                                : 'text-gray-600'
                          }`}>
                            {prediction.predictions[0]?.direction === 'up' && <TrendingUp className="w-4 h-4" />}
                            {prediction.predictions[0]?.direction === 'down' && <TrendingDown className="w-4 h-4" />}
                            {prediction.predictions[0]?.direction === 'sideways' && <Target className="w-4 h-4" />}
                            <span className="text-sm font-medium capitalize">{prediction.predictions[0]?.direction || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Trading Signals */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Trading Signals
            </CardTitle>
            <CardDescription>AI-generated buy/sell/hold recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(tradingSignals).slice(0, 4).map(([symbol, signal]) => (
                <div key={symbol} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      signal.action === 'BUY' 
                        ? 'bg-green-500' 
                        : signal.action === 'SELL' 
                          ? 'bg-red-500' 
                          : 'bg-yellow-500'
                    }`}></div>
                    <div>
                      <p className="font-medium">{symbol}</p>
                      <p className="text-xs text-muted-foreground">
                        Confidence: {(signal.confidence * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={
                      signal.action === 'BUY' 
                        ? "default" 
                        : signal.action === 'SELL' 
                          ? "destructive" 
                          : "secondary"
                    }>
                      {signal.action}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatCurrency(signal.targetPrice)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Market Sentiment
            </CardTitle>
            <CardDescription>AI analysis of market emotions and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(marketSentiments).slice(0, 4).map(([symbol, sentiment]) => (
                <div key={symbol} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{symbol}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {sentiment.overall.toLowerCase()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {sentiment.score.toFixed(0)}
                    </div>
                    <Progress 
                      value={Math.abs(sentiment.score)} 
                      className="w-16 h-2 mt-1"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Disclaimer */}
      <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div>
              <p className="text-sm text-amber-800 dark:text-amber-200 font-medium mb-2">
                AI Prediction Disclaimer
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                These predictions are generated by machine learning models using historical data, technical indicators, 
                and market sentiment analysis. Cryptocurrency markets are highly volatile and unpredictable. 
                Past performance does not guarantee future results. Always conduct your own research and consider 
                your risk tolerance before making investment decisions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricePrediction;