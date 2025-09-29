// TypeScript interfaces for crypto data
export interface CryptoPrice {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap: string;
  rank: number;
}

export interface UserPortfolio {
  totalValue: number;
  totalChange: number;
  totalChangePercent: number;
  holdings: CryptoHolding[];
}

export interface CryptoHolding {
  cryptoId: string;
  amount: number;
  averagePrice: number;
  currentValue: number;
  totalChange: number;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
}