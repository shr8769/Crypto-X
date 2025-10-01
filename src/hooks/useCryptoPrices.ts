import { useState, useEffect } from 'react';
import { CryptoPrice } from '@/types/crypto';

// CoinGecko API service
const COINGECKO_API = 'https://api.coingecko.com/api/v3';

const fetchCryptoPrices = async (): Promise<CryptoPrice[]> => {
  try {
    const response = await fetch(
      `${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch crypto data');
    }
    
    const data = await response.json();
    
    return data.map((coin: any, index: number) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      price: coin.current_price,
      change: coin.price_change_24h || 0,
      changePercent: coin.price_change_percentage_24h || 0,
      volume: `$${(coin.total_volume / 1e9).toFixed(2)}B`,
      marketCap: `$${(coin.market_cap / 1e12).toFixed(2)}T`,
      rank: coin.market_cap_rank || index + 1,
      image: coin.image,
    }));
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    // Fallback to mock data if API fails
    return mockCryptoPrices;
  }
};

// Fallback mock data for when API is unavailable
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
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  const loadPrices = async () => {
    setIsLoading(true);
    try {
      const cryptoData = await fetchCryptoPrices();
      setPrices(cryptoData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch crypto prices');
      setPrices(mockCryptoPrices); // Fallback to mock data
    } finally {
      setIsLoading(false);
    }
  };

  const refreshPrices = () => {
    loadPrices();
  };

  // Load prices on component mount
  useEffect(() => {
    loadPrices();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(loadPrices, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    prices,
    isLoading,
    error,
    refreshPrices,
  };
};