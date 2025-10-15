# Lido Integration Documentation

## Overview
This module provides comprehensive integration with Lido staking protocol, including widgets, banners, direct contract interaction, and API services.

## Components

### LidoStakingWidget
Embeddable iframe widget for staking ETH with Lido.

```tsx
import { LidoStakingWidget } from './components/Lido';

<LidoStakingWidget 
  rewardsAddress="0x1234567890123456789012345678901234567890"
  height={500}
  width="100%"
  enableEarn={true}
  className="custom-class"
/>
```

**Props:**
- `rewardsAddress`: Your Lido referral address
- `height`: Widget height in pixels (default: 500)
- `width`: Widget width (default: "100%")
- `enableEarn`: Enable Earn page (default: false)
- `className`: Additional CSS classes

### LidoBanner
Clickable banner that redirects users to Lido staking.

```tsx
import { LidoBanner } from './components/Lido';

<LidoBanner 
  rewardsAddress="0x1234567890123456789012345678901234567890"
  variant="compact"
  className="mb-4"
/>
```

**Props:**
- `rewardsAddress`: Your Lido referral address
- `variant`: "default" or "compact" (default: "default")
- `className`: Additional CSS classes

## Services

### LidoContractService
Direct interaction with Lido smart contracts.

```tsx
import Web3 from 'web3';
import { LidoContractService } from './components/Lido';

const web3 = new Web3(window.ethereum);
const lidoService = new LidoContractService(web3);

// Stake ETH with referral
const result = await lidoService.stakeWithReferral({
  web3,
  userAddress: '0x...',
  amount: '1.0', // ETH amount
  referralAddress: '0x...'
});
```

### LidoAPIService
Access to Lido APIs for APR, rewards, and withdrawal data.

```tsx
import { LidoAPIService } from './components/Lido';

const apiService = new LidoAPIService(false); // false for mainnet

// Get current APY
const apy = await apiService.getCurrentAPY();

// Get reward history
const rewards = await apiService.getRewardHistory({
  address: '0x...',
  currency: 'USD',
  limit: 100
});

// Get withdrawal time estimate
const withdrawalTime = await apiService.getWithdrawalTime({
  amount: 32 // stETH amount
});
```

## API Endpoints

### APR Data
- **SMA APR**: `https://eth-api.lido.fi/v1/protocol/steth/apr/sma`
- **Last APR**: `https://eth-api.lido.fi/v1/protocol/steth/apr/last`

### Reward History
- **Endpoint**: `https://reward-history-backend.lido.fi/`
- **Parameters**: address, currency, archiveRate, onlyRewards, sort, skip, limit

### Withdrawals
- **Calculate Time**: `https://wq-api.lido.fi/v2/request-time/calculate`
- **Specific Requests**: `https://wq-api.lido.fi/v2/request-time?ids=1&ids=2`

## Integration Options

### 1. Banner Integration
Add a banner to redirect users to Lido staking widget:

```tsx
<a href="https://stake.lido.fi/?ref=YOUR_REWARDS_ADDRESS">
  <LidoBanner rewardsAddress="YOUR_REWARDS_ADDRESS" />
</a>
```

### 2. Widget Embedding
Embed the staking widget directly in your app:

```tsx
<LidoStakingWidget 
  rewardsAddress="YOUR_REWARDS_ADDRESS"
  height={500}
  enableEarn={true}
/>
```

### 3. Direct Contract Interaction
Interact with Lido contracts directly:

```tsx
const lidoService = new LidoContractService(web3);
await lidoService.stakeWithReferral({
  web3,
  userAddress: userAddress,
  amount: '1.0',
  referralAddress: 'YOUR_REWARDS_ADDRESS'
});
```

## Referral Program

To participate in Lido Rewards-Share Program:

1. Register your Ethereum address with Lido
2. Use your address as the referral parameter
3. Users who stake through your link will automatically set your address as their referral
4. Earn rewards from referred users

## Error Handling

The integration includes comprehensive error handling:

```tsx
import { LidoError, LidoErrorType } from './components/Lido';

try {
  await lidoService.stakeWithReferral(params);
} catch (error) {
  if (error instanceof LidoError) {
    switch (error.type) {
      case LidoErrorType.INSUFFICIENT_BALANCE:
        // Handle insufficient balance
        break;
      case LidoErrorType.TRANSACTION_FAILED:
        // Handle transaction failure
        break;
    }
  }
}
```

## Types

All TypeScript types are exported for type safety:

```tsx
import type {
  LidoConfig,
  LidoStakingStats,
  LidoUserStats,
  WithdrawalRequest,
  LidoTransaction,
  APRResponse,
  RewardHistoryResponse,
  WithdrawalTimeResponse
} from './components/Lido';
```

## Testing

For testing, use the testnet endpoints:

```tsx
const apiService = new LidoAPIService(true); // true for testnet
```

Testnet endpoints:
- APR: `https://eth-api-hoodi.testnet.fi/v1/protocol/steth/apr/sma`
- Rewards: `http://reward-history-backend-hoodi.testnet.fi/`
- Withdrawals: `https://wq-api-hoodi.testnet.fi/v2/request-time`
