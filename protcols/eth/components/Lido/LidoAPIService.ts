// Lido API endpoints
export const LIDO_API_ENDPOINTS = {
  MAINNET: {
    APR_SMA: 'https://eth-api.lido.fi/v1/protocol/steth/apr/sma',
    APR_LAST: 'https://eth-api.lido.fi/v1/protocol/steth/apr/last',
    REWARD_HISTORY: 'https://reward-history-backend.lido.fi/',
    WITHDRAWALS: 'https://wq-api.lido.fi/v2/request-time'
  },
  TESTNET: {
    APR_SMA: 'https://eth-api-hoodi.testnet.fi/v1/protocol/steth/apr/sma',
    APR_LAST: 'https://eth-api-hoodi.testnet.fi/v1/protocol/steth/apr/last',
    REWARD_HISTORY: 'http://reward-history-backend-hoodi.testnet.fi/',
    WITHDRAWALS: 'https://wq-api-hoodi.testnet.fi/v2/request-time'
  }
};

// API Response Types
export interface APRResponse {
  apr: string;
  timestamp: number;
}

export interface RewardHistoryParams {
  address: string;
  currency?: 'USD' | 'EUR' | 'GBP';
  archiveRate?: boolean;
  onlyRewards?: boolean;
  sort?: 'asc' | 'desc';
  skip?: number;
  limit?: number;
}

export interface RewardHistoryItem {
  blockTime: number;
  transactionHash: string;
  type: string;
  amount: string;
  currencyAmount?: string;
  currency: string;
}

export interface RewardHistoryResponse {
  data: RewardHistoryItem[];
  total: number;
}

export interface WithdrawalTimeParams {
  ids?: number[];
  amount?: number;
}

export interface WithdrawalTimeResponse {
  requestTime: number;
  estimatedTime: number;
  queuePosition?: number;
}

export class LidoAPIService {
  private isTestnet: boolean;

  constructor(isTestnet: boolean = false) {
    this.isTestnet = isTestnet;
  }

  private getEndpoints() {
    return this.isTestnet ? LIDO_API_ENDPOINTS.TESTNET : LIDO_API_ENDPOINTS.MAINNET;
  }

  async getAPRSMA(): Promise<APRResponse> {
    const endpoints = this.getEndpoints();
    try {
      const response = await fetch(endpoints.APR_SMA);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching APR SMA:', error);
      throw error;
    }
  }

  async getAPRLast(): Promise<APRResponse> {
    const endpoints = this.getEndpoints();
    try {
      const response = await fetch(endpoints.APR_LAST);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching last APR:', error);
      throw error;
    }
  }

  async getRewardHistory(params: RewardHistoryParams): Promise<RewardHistoryResponse> {
    const endpoints = this.getEndpoints();
    const url = new URL(endpoints.REWARD_HISTORY);
    
    // Add query parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, value.toString());
      }
    });

    try {
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching reward history:', error);
      throw error;
    }
  }

  async getWithdrawalTime(params: WithdrawalTimeParams): Promise<WithdrawalTimeResponse> {
    const endpoints = this.getEndpoints();
    let url: string;

    if (params.ids && params.ids.length > 0) {
      // Calculate time for specific withdrawal IDs
      const idsParam = params.ids.map(id => `ids=${id}`).join('&');
      url = `${endpoints.WITHDRAWALS}?${idsParam}`;
    } else if (params.amount) {
      // Calculate time for withdrawal amount
      url = `${endpoints.WITHDRAWALS}/calculate?amount=${params.amount}`;
    } else {
      // Calculate time for current queue
      url = `${endpoints.WITHDRAWALS}/calculate`;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching withdrawal time:', error);
      throw error;
    }
  }

  async getCurrentAPY(): Promise<number> {
    try {
      const aprData = await this.getAPRSMA();
      return parseFloat(aprData.apr) * 100; // Convert to percentage
    } catch (error) {
      console.error('Error fetching current APY:', error);
      throw error;
    }
  }
}

export default LidoAPIService;
