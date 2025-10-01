import { useCryptoPrices } from './useCryptoPrices';
import { useMemo } from 'react';

export interface PortfolioMetrics {
  totalMarketCap: number;
  totalVolume24h: number;
  averageChange: number;
  topGainer: {
    symbol: string;
    changePercent: number;
  } | null;
  topLoser: {
    symbol: string;
    changePercent: number;
  } | null;
  marketSentiment: 'bullish' | 'bearish' | 'neutral';
}

export const usePortfolioMetrics = (): { metrics: PortfolioMetrics | null; isLoading: boolean } => {
  const { prices, isLoading } = useCryptoPrices();

  const metrics = useMemo((): PortfolioMetrics | null => {
    if (!prices || prices.length === 0) return null;

    // Calculate total market cap (convert from string format like "$1.2T" to number)
    const totalMarketCap = prices.reduce((acc, crypto) => {
      const capString = crypto.marketCap.replace(/[$,]/g, '');
      let capValue = 0;
      
      if (capString.includes('T')) {
        capValue = parseFloat(capString.replace('T', '')) * 1000; // Convert T to B
      } else if (capString.includes('B')) {
        capValue = parseFloat(capString.replace('B', ''));
      } else if (capString.includes('M')) {
        capValue = parseFloat(capString.replace('M', '')) / 1000; // Convert M to B
      } else {
        capValue = parseFloat(capString) / 1000000000; // Convert raw number to B
      }
      
      return acc + capValue;
    }, 0);

    // Calculate total volume (similar conversion)
    const totalVolume24h = prices.reduce((acc, crypto) => {
      const volString = crypto.volume.replace(/[$,]/g, '');
      let volValue = 0;
      
      if (volString.includes('T')) {
        volValue = parseFloat(volString.replace('T', '')) * 1000;
      } else if (volString.includes('B')) {
        volValue = parseFloat(volString.replace('B', ''));
      } else if (volString.includes('M')) {
        volValue = parseFloat(volString.replace('M', '')) / 1000;
      } else {
        volValue = parseFloat(volString) / 1000000000;
      }
      
      return acc + volValue;
    }, 0);

    // Calculate average change
    const averageChange = prices.reduce((acc, crypto) => acc + crypto.changePercent, 0) / prices.length;

    // Find top gainer and loser
    const topGainer = prices.reduce((prev, current) => 
      prev.changePercent > current.changePercent ? prev : current
    );

    const topLoser = prices.reduce((prev, current) => 
      prev.changePercent < current.changePercent ? prev : current
    );

    // Determine market sentiment
    const positiveChanges = prices.filter(crypto => crypto.changePercent > 0).length;
    const negativeChanges = prices.filter(crypto => crypto.changePercent < 0).length;
    
    let marketSentiment: 'bullish' | 'bearish' | 'neutral';
    if (positiveChanges > negativeChanges * 1.5) {
      marketSentiment = 'bullish';
    } else if (negativeChanges > positiveChanges * 1.5) {
      marketSentiment = 'bearish';
    } else {
      marketSentiment = 'neutral';
    }

    return {
      totalMarketCap,
      totalVolume24h,
      averageChange,
      topGainer: {
        symbol: topGainer.symbol,
        changePercent: topGainer.changePercent
      },
      topLoser: {
        symbol: topLoser.symbol,
        changePercent: topLoser.changePercent
      },
      marketSentiment
    };
  }, [prices]);

  return { metrics, isLoading };
};