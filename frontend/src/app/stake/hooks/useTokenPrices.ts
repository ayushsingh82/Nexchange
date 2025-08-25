import { useState, useEffect, useCallback } from 'react';
import { fetchTokenPrice, fetchAllTokenPrices } from '../constant';

interface TokenPriceData {
  price: number;
  change24h: number;
  lastUpdated: number;
}

interface UseTokenPricesReturn {
  tokenPrices: Record<string, TokenPriceData>;
  loading: boolean;
  error: string | null;
  refreshPrices: () => Promise<void>;
  refreshSingleToken: (symbol: string) => Promise<void>;
}

export function useTokenPrices(): UseTokenPricesReturn {
  const [tokenPrices, setTokenPrices] = useState<Record<string, TokenPriceData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshSingleToken = useCallback(async (symbol: string) => {
    try {
      const priceData = await fetchTokenPrice(symbol);
      if (priceData) {
        setTokenPrices(prev => ({
          ...prev,
          [symbol]: {
            ...priceData,
            lastUpdated: Date.now(),
          },
        }));
      }
    } catch (err) {
      console.error(`Error refreshing ${symbol} price:`, err);
    }
  }, []);

  const refreshPrices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const prices = await fetchAllTokenPrices();
      const pricesWithTimestamp: Record<string, TokenPriceData> = {};
      
      Object.entries(prices).forEach(([symbol, data]) => {
        pricesWithTimestamp[symbol] = {
          ...data,
          lastUpdated: Date.now(),
        };
      });
      
      setTokenPrices(pricesWithTimestamp);
    } catch (err) {
      setError('Failed to fetch token prices');
      console.error('Error fetching token prices:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshPrices();
  }, [refreshPrices]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(refreshPrices, 30000);
    return () => clearInterval(interval);
  }, [refreshPrices]);

  return {
    tokenPrices,
    loading,
    error,
    refreshPrices,
    refreshSingleToken,
  };
}