export interface Portfolio {
  id: string;
  userId: string; // Clerk user ID
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  holdings: PortfolioHolding[];
}

export interface PortfolioHolding {
  id: string;
  cryptoId: string; // CoinGecko ID (bitcoin, ethereum, etc.)
  symbol: string; // BTC, ETH, etc.
  name: string; // Bitcoin, Ethereum, etc.
  quantity: number;
  averageBuyPrice: number; // USD
  totalInvested: number; // USD
  purchaseDate: Date;
  notes?: string;
}

export interface PortfolioMetrics {
  totalValue: number; // Current USD value
  totalInvested: number; // Total money invested
  totalGainLoss: number; // Profit/Loss in USD
  totalGainLossPercentage: number; // Profit/Loss percentage
  dayChange: number; // 24h change in USD
  dayChangePercentage: number; // 24h change percentage
  topPerformer: {
    symbol: string;
    gainLoss: number;
    gainLossPercentage: number;
  } | null;
  worstPerformer: {
    symbol: string;
    gainLoss: number;
    gainLossPercentage: number;
  } | null;
}

export interface AIPrediction {
  cryptoId: string;
  symbol: string;
  currentPrice: number;
  predictions: {
    timeframe: '24h' | '7d' | '30d' | '90d';
    predictedPrice: number;
    confidence: number; // 0-1
    trend: 'bullish' | 'bearish' | 'neutral';
    reasoning: string;
  }[];
  generatedAt: Date;
}

export interface UserPortfolioData {
  portfolio: Portfolio;
  metrics: PortfolioMetrics;
  aiPredictions: AIPrediction[];
}