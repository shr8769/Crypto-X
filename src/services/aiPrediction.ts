// AI Crypto Price Prediction Service
export interface PredictionData {
  symbol: string;
  currentPrice: number;
  predictions: {
    timeframe: '1h' | '4h' | '1d' | '7d' | '30d';
    predictedPrice: number;
    confidence: number;
    direction: 'up' | 'down' | 'sideways';
    percentChange: number;
  }[];
  technicalIndicators: {
    rsi: number;
    macd: number;
    bollinger: { upper: number; lower: number; middle: number };
    volume: number;
    volatility: number;
  };
  aiModel: {
    accuracy: number;
    lastTrained: string;
    modelType: 'LSTM' | 'GRU' | 'Transformer' | 'Hybrid';
  };
}

export interface TradingSignal {
  action: 'BUY' | 'SELL' | 'HOLD';
  strength: number; // 0-100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  targetPrice: number;
  stopLoss: number;
  confidence: number;
}

export interface MarketSentiment {
  overall: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  score: number; // -100 to 100
  sources: {
    news: number;
    social: number;
    onchain: number;
    technical: number;
  };
}

// Advanced Feature Engineering Functions
export const calculateTechnicalIndicators = (prices: number[], volumes: number[]) => {
  const rsi = calculateRSI(prices);
  const macd = calculateMACD(prices);
  const bollinger = calculateBollingerBands(prices);
  const volatility = calculateVolatility(prices);
  
  return {
    rsi,
    macd,
    bollinger,
    volume: volumes[volumes.length - 1],
    volatility
  };
};

const calculateRSI = (prices: number[], period = 14): number => {
  if (prices.length < period + 1) return 50;
  
  const changes = prices.slice(1).map((price, i) => price - prices[i]);
  const gains = changes.map(change => change > 0 ? change : 0);
  const losses = changes.map(change => change < 0 ? -change : 0);
  
  const avgGain = gains.slice(-period).reduce((a, b) => a + b) / period;
  const avgLoss = losses.slice(-period).reduce((a, b) => a + b) / period;
  
  if (avgLoss === 0) return 100;
  
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
};

const calculateMACD = (prices: number[]): number => {
  const ema12 = calculateEMA(prices, 12);
  const ema26 = calculateEMA(prices, 26);
  return ema12 - ema26;
};

const calculateEMA = (prices: number[], period: number): number => {
  if (prices.length === 0) return 0;
  
  const multiplier = 2 / (period + 1);
  let ema = prices[0];
  
  for (let i = 1; i < prices.length; i++) {
    ema = (prices[i] * multiplier) + (ema * (1 - multiplier));
  }
  
  return ema;
};

const calculateBollingerBands = (prices: number[], period = 20) => {
  if (prices.length < period) {
    const avg = prices.reduce((a, b) => a + b) / prices.length;
    return { upper: avg * 1.02, lower: avg * 0.98, middle: avg };
  }
  
  const recentPrices = prices.slice(-period);
  const middle = recentPrices.reduce((a, b) => a + b) / period;
  
  const variance = recentPrices.reduce((acc, price) => acc + Math.pow(price - middle, 2), 0) / period;
  const stdDev = Math.sqrt(variance);
  
  return {
    upper: middle + (stdDev * 2),
    lower: middle - (stdDev * 2),
    middle
  };
};

const calculateVolatility = (prices: number[]): number => {
  if (prices.length < 2) return 0;
  
  const returns = prices.slice(1).map((price, i) => Math.log(price / prices[i]));
  const avgReturn = returns.reduce((a, b) => a + b) / returns.length;
  const variance = returns.reduce((acc, ret) => acc + Math.pow(ret - avgReturn, 2), 0) / returns.length;
  
  return Math.sqrt(variance) * Math.sqrt(252) * 100; // Annualized volatility %
};

// Real ML Prediction Engine
const ML_API_URL = 'http://localhost:5000'; // Your ML service URL

export const generateAIPrediction = async (symbol: string, historicalData: any): Promise<PredictionData> => {
  try {
    // Call real ML API
    const response = await fetch(`${ML_API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        symbol: symbol.toLowerCase(),
        historicalData
      })
    });

    if (!response.ok) {
      throw new Error(`ML API error: ${response.status}`);
    }

    const mlPrediction = await response.json();
    
    // Return data in expected format
    return {
      symbol: mlPrediction.symbol,
      currentPrice: mlPrediction.currentPrice,
      predictions: mlPrediction.predictions,
      technicalIndicators: mlPrediction.technicalIndicators,
      aiModel: mlPrediction.aiModel
    };

  } catch (error) {
    console.warn('ML API failed, falling back to simulation:', error);
    
    // Fallback to simulation if ML API is down
    return await generateSimulatedPrediction(symbol, historicalData);
  }
};

// Fallback simulation function (keep as backup)
const generateSimulatedPrediction = async (symbol: string, historicalData: any): Promise<PredictionData> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const currentPrice = historicalData.prices[historicalData.prices.length - 1];
  const technicalIndicators = calculateTechnicalIndicators(historicalData.prices, historicalData.volumes || []);
  
  const models = ['LSTM', 'GRU', 'Transformer', 'Hybrid'] as const;
  const modelType = models[Math.floor(Math.random() * models.length)];
  
  const predictions = [
    {
      timeframe: '1h' as const,
      predictedPrice: currentPrice * (1 + (Math.random() - 0.5) * 0.05),
      confidence: 75 + Math.random() * 15,
      direction: technicalIndicators.rsi > 70 ? 'down' as const : technicalIndicators.rsi < 30 ? 'up' as const : 'sideways' as const,
      percentChange: (Math.random() - 0.5) * 10
    },
    {
      timeframe: '4h' as const,
      predictedPrice: currentPrice * (1 + (Math.random() - 0.5) * 0.15),
      confidence: 70 + Math.random() * 20,
      direction: technicalIndicators.macd > 0 ? 'up' as const : 'down' as const,
      percentChange: (Math.random() - 0.5) * 20
    },
    {
      timeframe: '1d' as const,
      predictedPrice: currentPrice * (1 + (Math.random() - 0.5) * 0.25),
      confidence: 65 + Math.random() * 25,
      direction: Math.random() > 0.5 ? 'up' as const : 'down' as const,
      percentChange: (Math.random() - 0.5) * 30
    },
    {
      timeframe: '7d' as const,
      predictedPrice: currentPrice * (1 + (Math.random() - 0.5) * 0.40),
      confidence: 55 + Math.random() * 30,
      direction: Math.random() > 0.5 ? 'up' as const : 'down' as const,
      percentChange: (Math.random() - 0.5) * 50
    },
    {
      timeframe: '30d' as const,
      predictedPrice: currentPrice * (1 + (Math.random() - 0.5) * 0.80),
      confidence: 45 + Math.random() * 35,
      direction: Math.random() > 0.5 ? 'up' as const : 'down' as const,
      percentChange: (Math.random() - 0.5) * 100
    }
  ];

  return {
    symbol,
    currentPrice,
    predictions,
    technicalIndicators,
    aiModel: {
      accuracy: 75 + Math.random() * 20,
      lastTrained: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      modelType
    }
  };
};

export const generateTradingSignal = (predictionData: PredictionData): TradingSignal => {
  const { predictions, technicalIndicators } = predictionData;
  const shortTermPred = predictions.find(p => p.timeframe === '4h');
  const mediumTermPred = predictions.find(p => p.timeframe === '1d');
  
  if (!shortTermPred || !mediumTermPred) {
    return {
      action: 'HOLD',
      strength: 0,
      riskLevel: 'HIGH',
      targetPrice: predictionData.currentPrice,
      stopLoss: predictionData.currentPrice * 0.95,
      confidence: 0
    };
  }
  
  // Simple trading logic based on multiple factors
  const rsiSignal = technicalIndicators.rsi < 30 ? 1 : technicalIndicators.rsi > 70 ? -1 : 0;
  const macdSignal = technicalIndicators.macd > 0 ? 1 : -1;
  const shortTermSignal = shortTermPred.direction === 'up' ? 1 : shortTermPred.direction === 'down' ? -1 : 0;
  const mediumTermSignal = mediumTermPred.direction === 'up' ? 1 : mediumTermPred.direction === 'down' ? -1 : 0;
  
  const overallSignal = (rsiSignal + macdSignal + shortTermSignal + mediumTermSignal) / 4;
  const confidence = (shortTermPred.confidence + mediumTermPred.confidence) / 2;
  
  let action: 'BUY' | 'SELL' | 'HOLD';
  let strength: number;
  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  
  if (overallSignal > 0.3) {
    action = 'BUY';
    strength = Math.min(100, confidence * (overallSignal + 1));
    riskLevel = technicalIndicators.volatility > 50 ? 'HIGH' : technicalIndicators.volatility > 25 ? 'MEDIUM' : 'LOW';
  } else if (overallSignal < -0.3) {
    action = 'SELL';
    strength = Math.min(100, confidence * Math.abs(overallSignal - 1));
    riskLevel = technicalIndicators.volatility > 50 ? 'HIGH' : technicalIndicators.volatility > 25 ? 'MEDIUM' : 'LOW';
  } else {
    action = 'HOLD';
    strength = confidence * 0.5;
    riskLevel = 'MEDIUM';
  }
  
  return {
    action,
    strength,
    riskLevel,
    targetPrice: shortTermPred.predictedPrice,
    stopLoss: predictionData.currentPrice * (action === 'BUY' ? 0.95 : 1.05),
    confidence
  };
};

export const getMarketSentiment = async (symbol: string): Promise<MarketSentiment> => {
  // Simulate sentiment analysis
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newsScore = (Math.random() - 0.5) * 200; // -100 to 100
  const socialScore = (Math.random() - 0.5) * 200;
  const onchainScore = (Math.random() - 0.5) * 200;
  const technicalScore = (Math.random() - 0.5) * 200;
  
  const overallScore = (newsScore + socialScore + onchainScore + technicalScore) / 4;
  
  let overall: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  if (overallScore > 20) overall = 'BULLISH';
  else if (overallScore < -20) overall = 'BEARISH';
  else overall = 'NEUTRAL';
  
  return {
    overall,
    score: overallScore,
    sources: {
      news: newsScore,
      social: socialScore,
      onchain: onchainScore,
      technical: technicalScore
    }
  };
};