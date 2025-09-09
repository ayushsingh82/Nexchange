# Value Flow Diagram : NeXchange

## Overview
This document illustrates how value and actions flow between users, liquidity providers, NeXchange Protocol, cross-chain networks, and the underlying blockchain infrastructure (NEAR, Solana, Ethereum, etc.).
It includes both a high-level flowchart and a swimlane diagram for clarity.

## Actors
- **End User (NEAR Account Holder)**: Wants to swap, trade, or manage assets across multiple chains without leaving NEAR.
- **Liquidity Provider (Cross-chain DeFi)**: Provides assets on various chains for cross-chain swaps via intents.
- **NeXchange Protocol (Execution Layer)**: Middleware that derives cross-chain addresses, manages intents, and executes cross-chain transactions using derived signatures.
- **AI Agents (NEAR AI)**: Invoke NeXchange Protocol to automate cross-chain actions and asset management.
- **Cross-chain Networks**: Settlement layers for various blockchain transactions (NEAR, Solana, Ethereum, etc.).

## Key Value Flows

### 1. Asset Flow
**NEAR → Target Chain**: User → NeXchange Protocol → Derived Address → Cross-chain Signature → Target Chain → Recipient

### 2. Intent Flow
**User/AI → Execution**: User/AI → NEAR Intents → NeXchange Protocol → Cross-chain Execution

### 3. Liquidity Flow
**Cross-chain Swaps**: NEAR Intents → Liquidity Pools → Swap execution → User receives target asset

### 4. AI Flow
**Automated Actions**: AI agents → NeXchange Protocol → Trigger cross-chain action → Results returned

## Detailed Value Flow Process

### Phase 1: Intent Creation
1. **User Initiates Intent**
   - User has NEAR in hot wallet
   - User creates intent: "Swap NEAR to Token A on Chain A"
   - Intent includes: source asset (NEAR), target asset (Token A), target chain, amount, slippage

2. **Intent Processing**
   - NeXchange Protocol receives intent
   - Validates intent parameters and user permissions
   - Checks liquidity availability across chains
   - Generates unique intent ID and stores intent state

### Phase 2: Address Derivation
3. **Cross-chain Address Derivation**
   - Protocol derives target chain address from user's NEAR account
   - Uses deterministic derivation algorithm (BIP44/HD wallet standards)
   - Generates address for Chain A where Token A will be received
   - Address is derived but not yet funded

4. **Signature Preparation**
   - Protocol prepares cross-chain signature for derived address
   - Uses NEAR account as master key for cross-chain operations
   - Generates transaction payload for target chain

### Phase 3: Cross-chain Execution
5. **Liquidity Provision**
   - Protocol identifies liquidity pools on target chain
   - Coordinates with liquidity providers for Token A
   - Ensures sufficient liquidity for swap execution

6. **Cross-chain Transaction**
   - Protocol uses derived signature to execute transaction on Chain A
   - Swaps NEAR (via bridge) to Token A on target chain
   - Sends Token A to derived address on Chain A
   - Transaction is signed using cross-chain signature mechanism

### Phase 4: Settlement & Confirmation
7. **Transaction Confirmation**
   - Target chain confirms transaction
   - Token A is received at derived address
   - Protocol updates intent status to "completed"

8. **User Notification**
   - User receives confirmation of successful swap
   - Token A is now available in derived address on Chain A
   - User can manage Token A using same NEAR account credentials

## Technical Implementation Flow

### 1. Intent Creation
```typescript
// User creates intent
const intent = {
  id: generateIntentId(),
  user: userAccount,
  sourceAsset: "NEAR",
  targetAsset: "USDC",
  targetChain: "Ethereum",
  amount: "1000000000000000000000000", // 1 NEAR
  slippage: 100, // 1%
  status: "pending"
}
```

### 2. Address Derivation
```typescript
// Derive cross-chain address
const derivedAddress = deriveAddress({
  masterAccount: userAccount,
  targetChain: "Ethereum",
  derivationPath: "m/44'/60'/0'/0/0"
})
```

### 3. Cross-chain Signature
```typescript
// Generate cross-chain signature
const signature = generateCrossChainSignature({
  transaction: targetChainTx,
  derivedAddress: derivedAddress,
  masterAccount: userAccount
})
```

### 4. Execution
```typescript
// Execute cross-chain transaction
const result = await executeCrossChain({
  intent: intent,
  derivedAddress: derivedAddress,
  signature: signature,
  targetChain: "Ethereum"
})
```

## Value Flow Diagram

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   End User      │    │  NeXchange       │    │  Target Chain   │
│   (NEAR Wallet) │    │  Protocol        │    │  (Chain A)      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                        │
         │ 1. Create Intent       │                        │
         │ "Swap NEAR→Token A"    │                        │
         ├───────────────────────►│                        │
         │                        │                        │
         │                        │ 2. Derive Address      │
         │                        │    for Chain A         │
         │                        ├───────────────────────►│
         │                        │                        │
         │                        │ 3. Generate Signature  │
         │                        │    for Cross-chain     │
         │                        ├───────────────────────►│
         │                        │                        │
         │                        │ 4. Execute Swap        │
         │                        │    NEAR→Token A        │
         │                        ├───────────────────────►│
         │                        │                        │
         │ 5. Confirmation        │                        │
         │ Token A received       │                        │
         ◄────────────────────────┤                        │
         │                        │                        │
```

## Swimlane Diagram

```
User          NeXchange Protocol    Target Chain    Liquidity Provider
│                    │                    │                    │
│ Create Intent      │                    │                    │
├───────────────────►│                    │                    │
│                    │                    │                    │
│                    │ Derive Address     │                    │
│                    ├───────────────────►│                    │
│                    │                    │                    │
│                    │ Generate Signature │                    │
│                    ├───────────────────►│                    │
│                    │                    │                    │
│                    │ Request Liquidity  │                    │
│                    ├───────────────────────────────────────►│
│                    │                    │                    │
│                    │ Execute Swap       │                    │
│                    ├───────────────────►│                    │
│                    │                    │                    │
│                    │ Confirm Transaction│                    │
│                    ◄────────────────────┤                    │
│                    │                    │                    │
│ Receive Confirmation│                    │                    │
◄────────────────────┤                    │                    │
│                    │                    │                    │
```

## Key Benefits

1. **Unified Experience**: Users manage all assets through single NEAR account
2. **Cross-chain Security**: Derived addresses maintain security across chains
3. **Intent-based**: Natural language-like intent creation and execution
4. **AI Integration**: Seamless integration with AI agents for automation
5. **Liquidity Efficiency**: Optimal routing through cross-chain liquidity pools

## Security Considerations

1. **Derived Address Security**: Addresses are cryptographically derived from master account
2. **Signature Validation**: Cross-chain signatures are validated on target chains
3. **Intent Validation**: All intents are validated before execution
4. **Liquidity Verification**: Liquidity availability is confirmed before execution
5. **Settlement Guarantees**: Atomic execution ensures either full success or complete rollback

---

*This document outlines the core value flows for NeXchange Protocol's cross-chain intent and signature system.*