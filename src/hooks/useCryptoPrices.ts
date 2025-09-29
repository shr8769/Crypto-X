import { useState, useEffect } from 'react';
import { CryptoPrice } from '@/types/crypto';

// Mock data for demonstration
const mockCryptoPrices: CryptoPrice[] = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 52291,
    change: 1234.56,
    changePercent: 2.34,
    volume: '$84.42B',
    marketCap: '$1.02T',
    rank: 1,
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    price: 2980.81,
    change: 54.23,
    changePercent: 1.87,
    volume: '$32.15B',
    marketCap: '$358.2B',
    rank: 2,
  },
  {
    id: 'cardano',
    name: 'Cardano',
    symbol: 'ADA',
    price: 0.52,
    change: -0.0023,
    changePercent: -0.45,
    volume: '$804.42M',
    marketCap: '$18.2B',
    rank: 8,
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    price: 98.45,
    change: 5.58,
    changePercent: 5.67,
    volume: '$2.34B',
    marketCap: '$43.8B',
    rank: 5,
  },
];

export const useCryptoPrices = () => {
  const [prices, setPrices] = useState<CryptoPrice[]>(mockCryptoPrices);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate real-time price updates
    const interval = setInterval(() => {
      setPrices((prevPrices) =>
        prevPrices.map((crypto) => {
          const randomChange = (Math.random() - 0.5) * 0.02; // ±1% change
          const newPrice = crypto.price * (1 + randomChange);
          const change = newPrice - crypto.price;
          const changePercent = (change / crypto.price) * 100;
          
          return {
            ...crypto,
            price: newPrice,
            change: change,
            changePercent: changePercent,
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const refreshPrices = async () => {
    setIsLoading(true);
    try {
      // In a real app, you would fetch from an API here
      // await fetch('/api/crypto-prices');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setError(null);
    } catch (err) {
      setError('Failed to fetch crypto prices');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    prices,
    isLoading,
    error,
    refreshPrices,
  };
};