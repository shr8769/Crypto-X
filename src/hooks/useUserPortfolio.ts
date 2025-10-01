import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Portfolio, PortfolioHolding, PortfolioMetrics, AIPrediction, UserPortfolioData } from '@/types/portfolio';
import { useCryptoPrices } from './useCryptoPrices';

// Mock AI prediction service - replace with actual API call
const generateAIPrediction = async (cryptoId: string, currentPrice: number): Promise<AIPrediction> => {
  // Simulate AI prediction generation
  const predictions = [
    {
      timeframe: '24h' as const,
      predictedPrice: currentPrice * (0.95 + Math.random() * 0.1), // ±5% variation
      confidence: 0.7 + Math.random() * 0.25, // 70-95% confidence
      trend: Math.random() > 0.5 ? 'bullish' as const : 'bearish' as const,
      reasoning: 'Based on technical analysis and market sentiment indicators.'
    },
    {
      timeframe: '7d' as const,
      predictedPrice: currentPrice * (0.9 + Math.random() * 0.2), // ±10% variation
      confidence: 0.6 + Math.random() * 0.25, // 60-85% confidence
      trend: Math.random() > 0.5 ? 'bullish' as const : 'neutral' as const,
      reasoning: 'Weekly trend analysis suggests moderate price movement.'
    },
    {
      timeframe: '30d' as const,
      predictedPrice: currentPrice * (0.8 + Math.random() * 0.4), // ±20% variation
      confidence: 0.5 + Math.random() * 0.25, // 50-75% confidence
      trend: Math.random() > 0.33 ? 'bullish' as const : Math.random() > 0.5 ? 'bearish' as const : 'neutral' as const,
      reasoning: 'Monthly outlook based on fundamental analysis and market cycles.'
    }
  ];

  return {
    cryptoId,
    symbol: cryptoId.toUpperCase(),
    currentPrice,
    predictions,
    generatedAt: new Date()
  };
};

export const useUserPortfolio = () => {
  const { user, isSignedIn } = useUser();
  const { prices: cryptoData } = useCryptoPrices();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [metrics, setMetrics] = useState<PortfolioMetrics | null>(null);
  const [aiPredictions, setAiPredictions] = useState<AIPrediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize portfolio for new users
  const initializePortfolio = useCallback(() => {
    if (!user) return null;

    const defaultPortfolio: Portfolio = {
      id: `portfolio_${user.id}`,
      userId: user.id,
      name: `${user.firstName || 'My'} Portfolio`,
      description: 'My crypto investment portfolio',
      createdAt: new Date(),
      updatedAt: new Date(),
      holdings: [
        // Default holdings for demo
        {
          id: `holding_${Date.now()}_1`,
          cryptoId: 'bitcoin',
          symbol: 'BTC',
          name: 'Bitcoin',
          quantity: 0.1,
          averageBuyPrice: 45000,
          totalInvested: 4500,
          purchaseDate: new Date('2024-01-15'),
          notes: 'Initial investment'
        },
        {
          id: `holding_${Date.now()}_2`,
          cryptoId: 'ethereum',
          symbol: 'ETH',
          name: 'Ethereum',
          quantity: 2,
          averageBuyPrice: 2500,
          totalInvested: 5000,
          purchaseDate: new Date('2024-02-01'),
          notes: 'DeFi exposure'
        }
      ]
    };

    return defaultPortfolio;
  }, [user]);

  // Calculate portfolio metrics
  const calculateMetrics = useCallback((portfolio: Portfolio): PortfolioMetrics => {
    if (!cryptoData || cryptoData.length === 0) {
      return {
        totalValue: 0,
        totalInvested: 0,
        totalGainLoss: 0,
        totalGainLossPercentage: 0,
        dayChange: 0,
        dayChangePercentage: 0,
        topPerformer: null,
        worstPerformer: null
      };
    }

    let totalValue = 0;
    let totalInvested = 0;
    let totalDayChange = 0;
    const performanceData: Array<{
      symbol: string;
      gainLoss: number;
      gainLossPercentage: number;
    }> = [];

    portfolio.holdings.forEach(holding => {
      const cryptoPrice = cryptoData.find(crypto => 
        crypto.id === holding.cryptoId || crypto.symbol.toLowerCase() === holding.symbol.toLowerCase()
      );
      
      if (cryptoPrice) {
        const currentValue = holding.quantity * cryptoPrice.price;
        const invested = holding.totalInvested;
        const gainLoss = currentValue - invested;
        const gainLossPercentage = (gainLoss / invested) * 100;
        const dayChange = holding.quantity * (cryptoPrice.price * (cryptoPrice.changePercent / 100));

        totalValue += currentValue;
        totalInvested += invested;
        totalDayChange += dayChange;

        performanceData.push({
          symbol: holding.symbol,
          gainLoss,
          gainLossPercentage
        });
      }
    });

    const totalGainLoss = totalValue - totalInvested;
    const totalGainLossPercentage = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;
    const dayChangePercentage = totalValue > 0 ? (totalDayChange / totalValue) * 100 : 0;

    // Find top and worst performers
    const sortedByPerformance = [...performanceData].sort((a, b) => b.gainLossPercentage - a.gainLossPercentage);
    const topPerformer = sortedByPerformance[0] || null;
    const worstPerformer = sortedByPerformance[sortedByPerformance.length - 1] || null;

    return {
      totalValue,
      totalInvested,
      totalGainLoss,
      totalGainLossPercentage,
      dayChange: totalDayChange,
      dayChangePercentage,
      topPerformer,
      worstPerformer
    };
  }, [cryptoData]);

  // Generate AI predictions for portfolio holdings
  const generatePortfolioPredictions = useCallback(async (portfolio: Portfolio): Promise<AIPrediction[]> => {
    if (!cryptoData || cryptoData.length === 0) return [];

    const predictions: AIPrediction[] = [];
    
    for (const holding of portfolio.holdings) {
      const cryptoPrice = cryptoData.find(crypto => 
        crypto.id === holding.cryptoId || crypto.symbol.toLowerCase() === holding.symbol.toLowerCase()
      );
      
      if (cryptoPrice) {
        try {
          const prediction = await generateAIPrediction(holding.cryptoId, cryptoPrice.price);
          predictions.push(prediction);
        } catch (error) {
          console.error(`Error generating prediction for ${holding.symbol}:`, error);
        }
      }
    }
    
    return predictions;
  }, [cryptoData]);

  // Add new holding to portfolio
  const addHolding = useCallback((newHolding: Omit<PortfolioHolding, 'id'>) => {
    if (!portfolio) return;

    const holding: PortfolioHolding = {
      ...newHolding,
      id: `holding_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    const updatedPortfolio = {
      ...portfolio,
      holdings: [...portfolio.holdings, holding],
      updatedAt: new Date()
    };

    setPortfolio(updatedPortfolio);
    
    // Save to localStorage (replace with actual API call)
    localStorage.setItem(`portfolio_${user?.id}`, JSON.stringify(updatedPortfolio));
  }, [portfolio, user]);

  // Remove holding from portfolio
  const removeHolding = useCallback((holdingId: string) => {
    if (!portfolio) return;

    const updatedPortfolio = {
      ...portfolio,
      holdings: portfolio.holdings.filter(h => h.id !== holdingId),
      updatedAt: new Date()
    };

    setPortfolio(updatedPortfolio);
    
    // Save to localStorage (replace with actual API call)
    localStorage.setItem(`portfolio_${user?.id}`, JSON.stringify(updatedPortfolio));
  }, [portfolio, user]);

  // Update holding quantity
  const updateHolding = useCallback((holdingId: string, updates: Partial<PortfolioHolding>) => {
    if (!portfolio) return;

    const updatedPortfolio = {
      ...portfolio,
      holdings: portfolio.holdings.map(h => 
        h.id === holdingId ? { ...h, ...updates } : h
      ),
      updatedAt: new Date()
    };

    setPortfolio(updatedPortfolio);
    
    // Save to localStorage (replace with actual API call)
    localStorage.setItem(`portfolio_${user?.id}`, JSON.stringify(updatedPortfolio));
  }, [portfolio, user]);

  // Load portfolio data
  useEffect(() => {
    if (!isSignedIn || !user) {
      setPortfolio(null);
      setMetrics(null);
      setAiPredictions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Try to load from localStorage (replace with actual API call)
      const savedPortfolio = localStorage.getItem(`portfolio_${user.id}`);
      let userPortfolio: Portfolio;

      if (savedPortfolio) {
        userPortfolio = JSON.parse(savedPortfolio);
        // Convert date strings back to Date objects
        userPortfolio.createdAt = new Date(userPortfolio.createdAt);
        userPortfolio.updatedAt = new Date(userPortfolio.updatedAt);
        userPortfolio.holdings.forEach(holding => {
          holding.purchaseDate = new Date(holding.purchaseDate);
        });
      } else {
        // Initialize new portfolio
        userPortfolio = initializePortfolio()!;
        localStorage.setItem(`portfolio_${user.id}`, JSON.stringify(userPortfolio));
      }

      setPortfolio(userPortfolio);
    } catch (error) {
      console.error('Error loading portfolio:', error);
      setError('Failed to load portfolio data');
    } finally {
      setLoading(false);
    }
  }, [isSignedIn, user, initializePortfolio]);

  // Calculate metrics when portfolio or crypto data changes
  useEffect(() => {
    if (portfolio && cryptoData && cryptoData.length > 0) {
      const calculatedMetrics = calculateMetrics(portfolio);
      setMetrics(calculatedMetrics);
    }
  }, [portfolio, cryptoData, calculateMetrics]);

  // Generate AI predictions when portfolio changes
  useEffect(() => {
    if (portfolio && cryptoData && cryptoData.length > 0) {
      generatePortfolioPredictions(portfolio).then(predictions => {
        setAiPredictions(predictions);
      });
    }
  }, [portfolio, cryptoData, generatePortfolioPredictions]);

  const portfolioData: UserPortfolioData | null = portfolio && metrics ? {
    portfolio,
    metrics,
    aiPredictions
  } : null;

  return {
    portfolioData,
    loading,
    error,
    addHolding,
    removeHolding,
    updateHolding,
    refreshPredictions: () => {
      if (portfolio) {
        generatePortfolioPredictions(portfolio).then(setAiPredictions);
      }
    }
  };
};