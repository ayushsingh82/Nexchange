# 👤 User Persona & Flow – NeXchange

## 🎯 User Personas

### 1. DeFi Power User
- **Profile:**  
  - 25–40 years old, active crypto trader & yield farmer  
  - Manages assets across Solana, Ethereum, and NEAR  
  - Comfortable with wallets and DeFi tools  
- **Goals:**  
  - Access best staking yields across multiple chains  
  - Simplify multi-chain DeFi management  
  - Minimize bridging costs and delays  
- **Pain Points:**  
  - Managing multiple wallets/private keys  
  - High fees & risks of manual bridging  
  - Fragmented experience across ecosystems  

---

### 2. NEAR Ecosystem User
- **Profile:**  
  - Primarily active in NEAR ecosystem  
  - Interested in exploring Solana, Ethereum, and other chains  
  - Uses NEAR wallet as main identity  
- **Goals:**  
  - Expand DeFi opportunities beyond NEAR  
  - Use a single wallet for cross-chain actions  
  - Earn yield without leaving NEAR’s ecosystem  
- **Pain Points:**  
  - Lack of easy cross-chain staking from NEAR  
  - Complexity in interacting with multiple protocols  
  - Fear of losing funds due to bridging issues  

---

## 🔄 User Flow

### 1. Onboarding & Wallet Connection
- User visits **NeXchange DApp**  
- Connects **NEAR Wallet** (only once)  
- Authentication secured through **cross-chain signatures**  

---

### 2. Expressing Intents
- User states intent in plain terms, e.g.:  
  - “Move my 2 SOL from NEAR chain to Solana chain”  
  - “Stake my SOL in Solana staking pool”  
- The **Intent Layer** interprets the request and finds the best execution path  

---

### 3. Asset Movement Example
- User has **2 SOL wrapped on NEAR**  
- With **one click intent**, NeXchange moves assets → **2 SOL on Solana chain**  
- No manual bridging or private key handling needed  

---

### 4. Staking via Cross-Chain Signature
- User checks **Solana staking pool on NeXchange**  
- Chooses to stake their **2 SOL**  
- Signs once with **NEAR wallet**  
- **Cross-chain signature** executes staking directly on Solana pool  

---

### 5. Dashboard & Tracking
- User accesses **Unified Dashboard**:  
  - Portfolio overview across all chains  
  - Real-time staking yields & rewards  
  - Automated yield optimization suggestions  

---

## 🧩 Summary Flow Diagram (Textual)

flowchart 
    A[User has 2 SOL on NEAR] --> B[Swap: SOL on NEAR → SOL on Solana]
    B --> C[Check Solana Staking Pools on NeXchange]
    C --> D[Cross-Chain Signature to Approve Spending]
    D --> E[Stake 2 SOL in Solana Pool]
    E --> F[Rewards & Balance Shown on Dashboard]
