export interface TokenInfo {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  chain: string;
  cmcId: string;
  price?: number;
  change24h?: number;
}

export const SUPPORTED_TOKENS: TokenInfo[] = [
  {
    id: 'near',
    name: 'NEAR Protocol',
    symbol: 'NEAR',
    logo: 'https://s3.coinmarketcap.com/static-gravity/image/ef3ad80e423a4449ab8e961b0d1edea4.png',
    chain: 'NEAR',
    cmcId: '6535',
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    logo: 'https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png',
    chain: 'Solana',
    cmcId: '5426',
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/langfr-250px-Ethereum-icon-purple.svg.png',
    chain: 'Ethereum',
    cmcId: '1027',
  },
];

export const CMC_API_BASE = 'https://pro-api.coinmarketcap.com/v1';
export const CMC_API_KEY = process.env.NEXT_PUBLIC_CMC_API_KEY || '';

// Fallback prices from CoinMarketCap public data (updated manually)
export const FALLBACK_PRICES = {
  NEAR: 2.45,
  SOL: 183.49,
  ETH: 4290.25,
};

export const FALLBACK_CHANGES = {
  NEAR: -3.44,
  SOL: -2.32,
  ETH: 0.56,
};

// Function to fetch live prices from CoinMarketCap
export async function fetchTokenPrice(symbol: string): Promise<{ price: number; change24h: number } | null> {
  try {
    if (!CMC_API_KEY) {
      // Use fallback data if no API key
      const token = SUPPORTED_TOKENS.find(t => t.symbol === symbol);
      if (token) {
        const fallbackSymbol = token.symbol as keyof typeof FALLBACK_PRICES;
        return {
          price: FALLBACK_PRICES[fallbackSymbol],
          change24h: FALLBACK_CHANGES[fallbackSymbol],
        };
      }
      return null;
    }

    const response = await fetch(
      `${CMC_API_BASE}/cryptocurrency/quotes/latest?symbol=${symbol}&CMC_PRO_API_KEY=${CMC_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch price data');
    }

    const data = await response.json();
    const tokenData = data.data[symbol];
    
    if (tokenData) {
      return {
        price: tokenData.quote.USD.price,
        change24h: tokenData.quote.USD.percent_change_24h,
      };
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error);
    
    // Return fallback data on error
    const token = SUPPORTED_TOKENS.find(t => t.symbol === symbol);
    if (token) {
      const fallbackSymbol = token.symbol as keyof typeof FALLBACK_PRICES;
      return {
        price: FALLBACK_PRICES[fallbackSymbol],
        change24h: FALLBACK_CHANGES[fallbackSymbol],
      };
    }
    
    return null;
  }
}

// Function to fetch all token prices
export async function fetchAllTokenPrices(): Promise<Record<string, { price: number; change24h: number }>> {
  const prices: Record<string, { price: number; change24h: number }> = {};
  
  for (const token of SUPPORTED_TOKENS) {
    const priceData = await fetchTokenPrice(token.symbol);
    if (priceData) {
      prices[token.symbol] = priceData;
    }
  }
  
  return prices;
}

// Function to format price with proper decimals
export function formatPrice(price: number): string {
  if (price >= 1) {
    return price.toFixed(2);
  } else if (price >= 0.01) {
    return price.toFixed(4);
  } else {
    return price.toFixed(8);
  }
}

// Function to format percentage change
export function formatChange(change: number): string {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}%`;
}

// Function to get price change color class
export function getPriceChangeColor(change: number): string {
  if (change > 0) return 'text-green-500';
  if (change < 0) return 'text-red-500';
  return 'text-gray-500';
}
