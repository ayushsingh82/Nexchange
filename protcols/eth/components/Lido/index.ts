// Main Lido Integration Index
export { LidoStakingWidget } from './LidoStakingWidget';
export { LidoBanner } from './LidoBanner';
export { LidoContractService } from './LidoContractService';
export { LidoAPIService } from './LidoAPIService';

// Export types
export type {
  LidoConfig,
  LidoStakingStats,
  LidoUserStats,
  WithdrawalRequest,
  LidoTransaction,
  LidoEvent,
  LidoEventEmitter,
  LidoNetwork,
  LidoCurrency,
  LidoSortOrder,
  LidoTransactionStatus,
  LidoWithdrawalStatus,
  UseLidoAPYReturn,
  UseLidoBalanceReturn,
  UseLidoRewardsReturn,
  UseLidoTransactionsReturn,
} from './types';

// Export constants
export {
  LIDO_CONSTANTS,
  LIDO_API_CONSTANTS,
  LIDO_ERROR_TYPE,
  LidoError,
} from './types';

// Export API types
export type {
  APRResponse,
  RewardHistoryParams,
  RewardHistoryItem,
  RewardHistoryResponse,
  WithdrawalTimeParams,
  WithdrawalTimeResponse,
} from './LidoAPIService';

// Export contract types
export type {
  StakeWithLidoParams,
  StakeResult,
} from './LidoContractService';

// Default export for easy importing
export default {
  LidoStakingWidget,
  LidoBanner,
  LidoContractService,
  LidoAPIService,
};
