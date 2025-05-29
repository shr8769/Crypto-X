"use client";
import { useEffect, useState } from "react";

type Coin = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
};

type GlobalData = {
  active_cryptocurrencies: number;
  total_market_cap: { usd: number };
  total_volume: { usd: number };
  market_cap_change_percentage_24h_usd: number;
};

export default function Dashboard() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [globalData, setGlobalData] = useState<GlobalData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCryptoData();
    fetchGlobalData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchCryptoData();
      fetchGlobalData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchCryptoData = async () => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=12&page=1&sparkline=false&price_change_percentage=24h"
      );
      const data = await response.json();
      setCoins(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching crypto data:", error);
      setLoading(false);
    }
  };

  const fetchGlobalData = async () => {
    try {
      const response = await fetch("https://api.coingecko.com/api/v3/global");
      const data = await response.json();
      setGlobalData(data.data);
    } catch (error) {
      console.error("Error fetching global data:", error);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-binanceYellow border-t-white rounded-full animate-spin"></div>
          <div className="mt-4 text-center text-gray-400 font-medium">Loading market data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-binanceDark transition-colors">
      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-binanceYellow mb-4">
            Live Crypto Markets
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Real-time cryptocurrency data with institutional-grade analytics
          </p>
        </div>

        {/* Global Market Stats */}
        {globalData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-binanceGray rounded-2xl p-6 border border-binanceDark shadow-xl">
              <div className="text-sm font-medium text-gray-400 mb-2">Total Market Cap</div>
              <div className="text-2xl font-bold text-binanceYellow">
                {formatNumber(globalData.total_market_cap.usd)}
              </div>
              <div className={`text-sm font-medium mt-1 ${
                globalData.market_cap_change_percentage_24h_usd >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {globalData.market_cap_change_percentage_24h_usd >= 0 ? '+' : ''}
                {globalData.market_cap_change_percentage_24h_usd.toFixed(2)}%
              </div>
            </div>
            <div className="bg-binanceGray rounded-2xl p-6 border border-binanceDark shadow-xl">
              <div className="text-sm font-medium text-gray-400 mb-2">24h Volume</div>
              <div className="text-2xl font-bold text-binanceYellow">
                {formatNumber(globalData.total_volume.usd)}
              </div>
              <div className="text-sm text-gray-400 mt-1">Trading Volume</div>
            </div>
            <div className="bg-binanceGray rounded-2xl p-6 border border-binanceDark shadow-xl">
              <div className="text-sm font-medium text-gray-400 mb-2">Active Cryptos</div>
              <div className="text-2xl font-bold text-binanceYellow">
                {globalData.active_cryptocurrencies.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400 mt-1">Tracked Coins</div>
            </div>
            <div className="bg-binanceGray rounded-2xl p-6 border border-binanceDark shadow-xl">
              <div className="text-sm font-medium text-gray-400 mb-2">Market Status</div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-2"></div>
                <span className="text-lg font-semibold text-white">Live</span>
              </div>
              <div className="text-sm text-gray-400 mt-1">Real-time data</div>
            </div>
          </div>
        )}
      </div>

      {/* Crypto Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {coins.map((coin, index) => (
            <div
              key={coin.id}
              className="group bg-binanceGray rounded-2xl p-6 border border-binanceDark shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              {/* Coin Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="w-10 h-10 rounded-full shadow-lg"
                  />
                  <div>
                    <h3 className="font-bold text-white group-hover:text-binanceYellow transition-colors">
                      {coin.symbol.toUpperCase()}
                    </h3>
                    <p className="text-sm text-gray-400 truncate max-w-20">{coin.name}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  coin.price_change_percentage_24h >= 0
                    ? "bg-green-900 text-green-400"
                    : "bg-red-900 text-red-400"
                }`}>
                  {coin.price_change_percentage_24h >= 0 ? "↗" : "↘"}
                </div>
              </div>

              {/* Price */}
              <div className="mb-4">
                <div className="text-2xl font-bold text-white mb-1">
                  ${coin.current_price.toLocaleString(undefined, { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: coin.current_price > 1 ? 2 : 6 
                  })}
                </div>
                <div className={`text-sm font-semibold ${
                  coin.price_change_percentage_24h >= 0 ? "text-green-400" : "text-red-400"
                }`}>
                  {coin.price_change_percentage_24h >= 0 ? "+" : ""}
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Market Cap</span>
                  <span className="font-medium">{formatNumber(coin.market_cap)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Volume 24h</span>
                  <span className="font-medium">{formatNumber(coin.total_volume)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">24h High</span>
                  <span className="font-medium text-green-400">${coin.high_24h.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">24h Low</span>
                  <span className="font-medium text-red-400">${coin.low_24h.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-binanceYellow rounded-3xl p-8 text-binanceDark">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Trading?</h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Join millions of users who trust CryptoX for their cryptocurrency investments
            </p>
            <button className="bg-binanceGray text-binanceYellow px-8 py-3 rounded-xl font-bold hover:bg-gray-800 hover:text-yellow-300 transition-all duration-200">
              Get Started Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
