# NeXchange — Technical Architecture & Stack

## Overview

This repository contains the cross-chain intent execution protocol and frontend for NeXchange, enabling users to manage assets across multiple blockchains directly from their NEAR wallet. The system is built on intent-based architecture with cross-chain signature derivation and automated execution.

**Core Components:**
- **Frontend**: Next.js/React application with NEAR wallet integration
- **Intents Engine**: TypeScript-based intent processing and execution
- **Cross-chain Signatures**: Derived address generation and transaction signing
- **Swap Integration**: 1Click API integration for cross-chain swaps
- **Withdrawal System**: Multi-chain asset withdrawal via intents contract

---

## Runtime and Tooling Stack

**Frontend Stack:**
- **Framework**: Next.js 15.3.3 with App Router
- **Language**: TypeScript 5.x
- **UI Library**: React 19.0.0 with Tailwind CSS 4.x
- **Wallet Integration**: @near-wallet-selector/react-hook 9.x
- **State Management**: React hooks and context

**Cross-chain Infrastructure:**
- **Signature Derivation**: chainsig.js 1.1.6
- **Solana Integration**: @solana/web3.js
- **NEAR Integration**: near-api-js 6.0.2
- **Intent Processing**: Custom TypeScript modules

**Testing & Development:**
- **Unit Tests**: Jest with React Testing Library
- **Integration Tests**: near-workspaces 0.19.0
- **Build Tooling**: Next.js built-in optimization
- **Package Manager**: npm with pnpm support

---

## Core Architecture

### 1. Frontend Application (`frontend/`)

**Purpose**: User interface for cross-chain asset management and staking operations.

**Key Components:**
- **Wallet Integration**: NEAR wallet connection and management
- **Derived Address UI**: Solana address derivation and transaction signing
- **Swap Interface**: Cross-chain swap execution via 1Click API
- **Staking Dashboard**: Multi-chain staking pool integration

**Key Features:**
- **Single Wallet Experience**: Use NEAR wallet for all cross-chain operations
- **Real-time Balance Tracking**: Cross-chain asset balance monitoring
- **Transaction History**: Unified view of all cross-chain transactions
- **Responsive Design**: Mobile-first approach with Tailwind CSS

**Technical Implementation:**
```typescript
// Wallet Provider Integration
const { accountId, callMethods } = useNearWallet()

// Cross-chain Address Derivation
const { publicKey } = await Solana.deriveAddressAndPublicKey(
  accountId,
  "solana-1"
)

// Swap Execution
const quote = await requestSwapQuote({
  originAsset: "nep141:wrap.near",
  destinationAsset: "nep141:sol.omft.near",
  amount: "1000000000000000000000000" // 1 NEAR
})
```

### 2. Intents Engine (`intents/`)

**Purpose**: Processes user intents and executes cross-chain operations.

**Key Components:**
- **Swap Engine**: 1Click API integration for cross-chain swaps
- **Withdrawal System**: Multi-chain asset withdrawal via intents contract
- **Intent Validation**: Ensures intent safety and execution feasibility
- **Execution Pipeline**: Automated cross-chain transaction execution

**Core Interfaces:**
```typescript
interface SwapQuoteRequest {
  dry: boolean;
  depositMode: "SIMPLE" | "MEMO";
  swapType: "EXACT_INPUT" | "EXACT_OUTPUT" | "FLEX_INPUT";
  slippageTolerance: number;
  originAsset: string;
  destinationAsset: string;
  amount: string;
  recipient: string;
  recipientType: "DESTINATION_CHAIN" | "INTENTS";
  // ... additional fields
}
```

**Supported Operations:**
- **Cross-chain Swaps**: NEAR ↔ SOL ↔ ETH ↔ USDC
- **Asset Withdrawals**: Withdraw assets from intents contract to target chains
- **Staking Operations**: Direct staking on multiple chains
- **Liquidity Management**: Automated liquidity provision and management

### 3. Cross-chain Signatures (`signature/`)

**Purpose**: Derives cross-chain addresses and manages transaction signing.

**Key Components:**
- **Address Derivation**: Deterministic address generation for multiple chains
- **Transaction Signing**: Cross-chain transaction signature generation
- **Chain Integration**: Support for NEAR, Solana, and EVM chains
- **Signature Validation**: Ensures transaction authenticity

**Supported Chains:**
- **NEAR**: Native chain with NEAR wallet integration
- **Solana**: Derived address generation and transaction signing
- **EVM Chains**: Ethereum, Base, BNB Chain, Avalanche, Polygon, Arbitrum

**Technical Implementation:**
```typescript
// Solana Address Derivation
const { publicKey } = await Solana.deriveAddressAndPublicKey(
  nearAccountId,
  derivationPath
)

// Cross-chain Transaction Signing
const signature = await SIGNET_CONTRACT.sign({
  payload: transactionPayload,
  accountId: nearAccountId
})
```

---

## Smart Contracts & Protocols

### 1. NEAR Smart Contracts (`signature/near-sig/`)

**Purpose**: NEAR blockchain integration and cross-chain signature management.

**Key Features:**
- **Cross-chain Signature Generation**: MPC-signed payloads for other chains
- **Intent Processing**: Validates and executes cross-chain intents
- **Asset Management**: Handles wrapped tokens and cross-chain assets
- **Security**: Multi-signature validation and access control

**Contract Methods:**
```typescript
@call
sign_transaction(payload: string): Promise<string>

@view
get_derived_address(chain: string, path: string): string

@call
execute_intent(intent: Intent): Promise<ExecutionResult>
```

### 2. Intents Contract Integration

**Purpose**: Manages cross-chain asset transfers and withdrawals.

**Key Features:**
- **Asset Withdrawal**: Withdraw assets from intents contract to target chains
- **Multi-chain Support**: Handles assets from multiple blockchains
- **Fee Management**: Automated fee calculation and collection
- **Security**: Access control and transaction validation

**Withdrawal Operations:**
```typescript
// SOL Withdrawal to Solana
const proposal = {
  description: "Transfer SOL to Solana recipient",
  kind: {
    FunctionCall: {
      receiver_id: intentsContract.accountId,
      actions: [{
        method_name: "ft_withdraw",
        args: Buffer.from(JSON.stringify({
          token: "nep141:sol.omft.near",
          receiver_id: solanaAddress,
          amount: solAmount
        })).toString("base64")
      }]
    }
  }
}
```

---

## Data Flow & Architecture

### 1. Intent Creation Flow
1. **User Initiates Intent**: User creates intent via frontend (e.g., "Swap NEAR to SOL")
2. **Intent Validation**: System validates intent parameters and feasibility
3. **Route Optimization**: AI determines optimal execution path
4. **Address Derivation**: Generate cross-chain addresses if needed
5. **Execution Planning**: Create execution plan with required transactions

### 2. Cross-chain Execution Flow
1. **Signature Generation**: Generate cross-chain signatures using NEAR wallet
2. **Transaction Preparation**: Prepare transactions for target chains
3. **Execution**: Execute transactions on target chains
4. **Confirmation**: Monitor and confirm transaction completion
5. **State Update**: Update frontend with execution results

### 3. Asset Management Flow
1. **Balance Tracking**: Monitor balances across all supported chains
2. **Asset Swapping**: Execute cross-chain swaps via 1Click API
3. **Staking Operations**: Direct staking on multiple chains
4. **Withdrawal Processing**: Handle asset withdrawals from intents contract

---

## Security & Safety Considerations

### 1. Access Control
- **Wallet Integration**: All operations require NEAR wallet authentication
- **Intent Validation**: Comprehensive validation of all user intents
- **Transaction Signing**: Multi-signature validation for cross-chain operations
- **Rate Limiting**: Protection against spam and abuse

### 2. Cross-chain Security
- **Address Derivation**: Deterministic and secure address generation
- **Signature Validation**: Cryptographic verification of all transactions
- **Asset Custody**: Non-custodial design with user-controlled assets
- **Audit Trail**: Complete transaction history and logging

### 3. Error Handling
- **Transaction Failures**: Graceful handling of failed transactions
- **Network Issues**: Robust error handling for network connectivity
- **User Feedback**: Clear error messages and recovery options
- **State Recovery**: Automatic state recovery after failures

---

## Build & Deployment

### 1. Frontend Build
```bash
cd frontend
npm install
npm run build
npm start
```

### 2. Contract Deployment
```bash
cd signature/near-sig
npm run build
near deploy <contract-account> build/hello_near.wasm
```

### 3. Testing
```bash
# Frontend tests
cd frontend
npm test

# Contract tests
cd signature/near-sig
npm test

# Integration tests
cd intents
npm test
```

---

## Integration Notes

### 1. Wallet Integration
- **NEAR Wallet Selector**: Primary wallet connection method
- **Hot Wallet**: Development and testing support
- **Cross-chain Signatures**: Derived address generation for other chains

### 2. External APIs
- **1Click API**: Cross-chain swap execution
- **Chain RPCs**: Direct blockchain interaction
- **Price Feeds**: Real-time asset pricing

### 3. Monitoring & Analytics
- **Transaction Tracking**: Real-time transaction monitoring
- **Performance Metrics**: System performance and reliability tracking
- **User Analytics**: Usage patterns and optimization insights

---

## Versioning & Compatibility

**Current Version**: v1.0.0-alpha
**NEAR SDK**: 5.11.0
**Next.js**: 15.3.3
**React**: 19.0.0
**TypeScript**: 5.x

**Supported Chains:**
- NEAR (Mainnet/Testnet)
- Solana (Mainnet/Devnet)
- Ethereum (Mainnet/Sepolia)
- EVM Chains (Base, BNB Chain, Avalanche, Polygon, Arbitrum)

---

## Appendix: Key Files

**Frontend:**
- `frontend/src/app/page.tsx` — Main application entry point
- `frontend/src/app/derived-address/solana/page.tsx` — Solana address derivation
- `frontend/src/provider/wallet.tsx` — NEAR wallet provider
- `frontend/src/components/ClientLayout.tsx` — Application layout

**Intents:**
- `intents/components/swap.ts` — Cross-chain swap logic
- `intents/components/sol_withdrawal.ts` — SOL withdrawal system
- `intents/components/withdrawl.ts` — General withdrawal examples

**Cross-chain Signatures:**
- `signature/derived-address/components/Solana.tsx` — Solana integration
- `signature/near-sig/src/contract.ts` — NEAR smart contract
- `signature/near-sig/config.js` — Chain configuration

**Documentation:**
- `data_md/technical-roadmap.md` — Development roadmap
- `data_md/value-flow-diagram.md` — System architecture diagrams
- `data_md/lean-canva.md` — Business model and value proposition
