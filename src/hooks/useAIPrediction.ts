import { useState, useEffect } from 'react';
import { useCryptoPrices } from './useCryptoPrices';
import { 
  generateAIPrediction, 
  generateTradingSignal, 
  getMarketSentiment,
  PredictionData,
  TradingSignal,
  MarketSentiment 
} from '@/services/aiPrediction';

interface AIPredictionState {
  predictions: Record<string, PredictionData>;
  tradingSignals: Record<string, TradingSignal>;
  marketSentiments: Record<string, MarketSentiment>;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

interface HistoricalData {
  prices: number[];
  volumes: number[];
  timestamps: string[];
}

export const useAIPrediction = () => {
  const { prices } = useCryptoPrices();
  const [state, setState] = useState<AIPredictionState>({
    predictions: {},
    tradingSignals: {},
    marketSentiments: {},
    isLoading: true,
    error: null,
    lastUpdated: null
  });

  // Generate mock historical data for AI analysis
  const generateHistoricalData = (currentPrice: number): HistoricalData => {
    const days = 30;
    const prices: number[] = [];
    const volumes: number[] = [];
    const timestamps: string[] = [];
    
    let price = currentPrice * 0.8; // Start 20% lower
    
    for (let i = 0; i < days; i++) {
      // Simulate price movement with some volatility
      const change = (Math.random() - 0.5) * 0.1; // ±5% daily change
      price = price * (1 + change);
      prices.push(price);
      
      // Simulate volume (in millions)
      volumes.push(Math.random() * 1000 + 100);
      
      // Generate timestamps
      const date = new Date();
      date.setDate(date.getDate() - (days - i));
      timestamps.push(date.toISOString());
    }
    
    return { prices, volumes, timestamps };
  };

  const runAIAnalysis = async (symbols: string[]) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const predictions: Record<string, PredictionData> = {};
      const tradingSignals: Record<string, TradingSignal> = {};
      const marketSentiments: Record<string, MarketSentiment> = {};
      
      // Process each cryptocurrency
      for (const symbol of symbols) {
        const cryptoData = prices.find(p => p.symbol === symbol);
        if (!cryptoData) continue;
        
        // Generate historical data for AI analysis
        const historicalData = generateHistoricalData(cryptoData.price);
        
        // Run AI prediction
        const prediction = await generateAIPrediction(symbol, historicalData);
        predictions[symbol] = prediction;
        
        // Generate trading signal
        const signal = generateTradingSignal(prediction);
        tradingSignals[symbol] = signal;
        
        // Get market sentiment
        const sentiment = await getMarketSentiment(symbol);
        marketSentiments[symbol] = sentiment;
      }
      
      setState(prev => ({
        ...prev,
        predictions,
        tradingSignals,
        marketSentiments,
        isLoading: false,
        lastUpdated: new Date()
      }));
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to generate AI predictions',
        isLoading: false
      }));
    }
  };

  const refreshPredictions = () => {
    if (prices.length > 0) {
      const topSymbols = prices.slice(0, 5).map(p => p.symbol);
      runAIAnalysis(topSymbols);
    }
  };

  // Auto-refresh predictions every 30 seconds
  useEffect(() => {
    if (prices.length > 0) {
      const topSymbols = prices.slice(0, 5).map(p => p.symbol);
      runAIAnalysis(topSymbols);
      
      const interval = setInterval(() => {
        runAIAnalysis(topSymbols);
      }, 30 * 1000); // 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [prices]);

  // Portfolio performance calculation
  const calculatePortfolioMetrics = () => {
    const signals = Object.values(state.tradingSignals);
    if (signals.length === 0) return null;
    
    const buySignals = signals.filter(s => s.action === 'BUY').length;
    const sellSignals = signals.filter(s => s.action === 'SELL').length;
    const holdSignals = signals.filter(s => s.action === 'HOLD').length;
    
    const avgConfidence = signals.reduce((acc, s) => acc + s.confidence, 0) / signals.length;
    const riskDistribution = {
      low: signals.filter(s => s.riskLevel === 'LOW').length,
      medium: signals.filter(s => s.riskLevel === 'MEDIUM').length,
      high: signals.filter(s => s.riskLevel === 'HIGH').length
    };
    
    return {
      totalSignals: signals.length,
      distribution: { buy: buySignals, sell: sellSignals, hold: holdSignals },
      avgConfidence: Math.round(avgConfidence),
      riskDistribution,
      overallSentiment: buySignals > sellSignals ? 'BULLISH' : sellSignals > buySignals ? 'BEARISH' : 'NEUTRAL'
    };
  };

  // Get prediction accuracy simulation
  const getModelPerformance = () => {
    const predictions = Object.values(state.predictions);
    if (predictions.length === 0) return null;
    
    const accuracies = predictions.map(p => p.aiModel.accuracy);
    const avgAccuracy = accuracies.reduce((a, b) => a + b, 0) / accuracies.length;
    
    const modelTypes = predictions.reduce((acc, p) => {
      acc[p.aiModel.modelType] = (acc[p.aiModel.modelType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      avgAccuracy: Math.round(avgAccuracy),
      modelDistribution: modelTypes,
      totalPredictions: predictions.length,
      lastTrainingDate: Math.max(...predictions.map(p => new Date(p.aiModel.lastTrained).getTime()))
    };
  };

  return {
    ...state,
    refreshPredictions,
    portfolioMetrics: calculatePortfolioMetrics(),
    modelPerformance: getModelPerformance()
  };
};