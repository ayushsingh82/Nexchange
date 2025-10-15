// Lido Integration Types and Constants

export interface LidoConfig {
  rewardsAddress: string;
  isTestnet?: boolean;
  enableEarn?: boolean;
}

export interface LidoStakingStats {
  currentAPY: number;
  totalStaked: string;
  totalRewards: string;
  stETHPrice: number;
}

export interface LidoUserStats {
  stETHBalance: string;
  totalStaked: string;
  totalRewards: string;
  pendingRewards: string;
  withdrawalRequests: WithdrawalRequest[];
}

export interface WithdrawalRequest {
  id: number;
  amount: string;
  status: 'pending' | 'claimable' | 'claimed';
  requestTime: number;
  estimatedCompletionTime?: number;
}

export interface LidoTransaction {
  hash: string;
  type: 'stake' | 'unstake' | 'claim' | 'transfer';
  amount: string;
  timestamp: number;
  blockNumber: number;
  status: 'pending' | 'confirmed' | 'failed';
}

// Lido Contract Constants
export const LIDO_CONSTANTS = {
  CONTRACT_ADDRESS: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
  STETH_ADDRESS: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
  WSTETH_ADDRESS: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
  MIN_STAKE_AMOUNT: '0.001', // Minimum ETH amount to stake
  MAX_STAKE_AMOUNT: '1000000', // Maximum ETH amount per transaction
  REFERRAL_FEE: 0.05, // 5% referral fee
  PROTOCOL_FEE: 0.1, // 10% protocol fee
} as const;

// Lido API Constants
export const LIDO_API_CONSTANTS = {
  DEFAULT_CURRENCY: 'USD',
  DEFAULT_SORT: 'desc' as const,
  DEFAULT_LIMIT: 100,
  MAX_LIMIT: 1000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // milliseconds
} as const;

// Lido Error Types
export enum LidoErrorType {
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  INVALID_AMOUNT = 'INVALID_AMOUNT',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  API_ERROR = 'API_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  CONTRACT_ERROR = 'CONTRACT_ERROR',
}

export class LidoError extends Error {
  constructor(
    public type: LidoErrorType,
    message: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'LidoError';
  }
}

// Lido Event Types
export interface LidoEvent {
  type: 'stake' | 'unstake' | 'claim' | 'transfer' | 'reward';
  data: any;
  timestamp: number;
}

export interface LidoEventEmitter {
  on(event: string, listener: (data: LidoEvent) => void): void;
  off(event: string, listener: (data: LidoEvent) => void): void;
  emit(event: string, data: LidoEvent): void;
}

// Utility Types
export type LidoNetwork = 'mainnet' | 'testnet';
export type LidoCurrency = 'USD' | 'EUR' | 'GBP';
export type LidoSortOrder = 'asc' | 'desc';
export type LidoTransactionStatus = 'pending' | 'confirmed' | 'failed';
export type LidoWithdrawalStatus = 'pending' | 'claimable' | 'claimed';

// Hook Return Types
export interface UseLidoAPYReturn {
  apy: number | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseLidoBalanceReturn {
  balance: string | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseLidoRewardsReturn {
  rewards: string | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseLidoTransactionsReturn {
  transactions: LidoTransaction[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  loadMore: () => Promise<void>;
  hasMore: boolean;
}
