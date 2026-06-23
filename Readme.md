# NeXchange

**NeXchange** is a decentralized, intent-based cross-chain execution protocol. It allows users to swap and stake assets across Solana, Ethereum, and NEAR — staking into protocols such as Jito and Marinade on Solana or Lido and Ether.fi on Ethereum — directly from a single **NEAR wallet**. No bridging, no wallet switching, no friction.

Built as a public good for the NEAR ecosystem, NeXchange provides seamless, AI-optimized, and verifiable cross-chain functionality for users and developers.

---

## Overview

NeXchange enables NEAR users to:

- Swap NEAR to SOL, ETH, USDC, and more via AI-optimized execution.
- Stake directly into Solana, Ethereum, and NEAR staking pools from a NEAR wallet.
- Interact across multiple ecosystems using a single wallet.
- Automate treasury and DAO operations with verifiable results (planned).
- Execute cross-chain DeFi actions such as lending, borrowing, and yield farming (planned).

All actions are powered by signed **intents**, which are interpreted and settled by a decentralized network of **solver nodes**.

---

## Why It Matters

NeXchange is a modular, open-source public good that prioritizes:

- **Transparency** — fully auditable, on-chain execution.
- **Interoperability** — seamless NEAR to Solana and EVM integration.
- **Modularity** — built to be extended and forked by the community.
- **User Experience** — no wallet switching and no cross-chain gas management.

---

## How It Works

1. **Intent Creation** — a user signs an intent from their NEAR wallet (for example, swapping NEAR for SOL and staking it).
2. **AI Optimization** — the intent is interpreted, the optimal route is selected, and execution safety is verified.
3. **Broadcast to Solvers** — the request is broadcast to a decentralized network of solver nodes.
4. **Execution and Verification** — the winning solver executes the transaction on the destination chain and provides verifiable proof.

---

## Key Features

- **NEAR-First UX** — all cross-chain interactions begin from NEAR.
- **Intent-Based Execution** — signed messages, combined with chain signatures, unlock cross-chain actions.
- **AI-Powered Routing** — best price, speed, and reliability without manual route selection.
- **Non-Custodial and Secure** — no bridges, no wrapped tokens, no central intermediaries.

---

## Architecture

The protocol is organized into four modules:

| Module | Description |
|--------|-------------|
| **Frontend** | Next.js dApp: wallet connection, staking UI, intents panel, and documentation. |
| **Intents Engine** | Wraps the 1Click / defuse SDK for the deposit, quote, swap, and withdraw lifecycle. |
| **Chain Signatures** | `chainsig.js` adapters to derive and sign Solana and EVM transactions from a NEAR account. |
| **Staking Protocols** | Jito and Marinade (Solana); Lido and Ether.fi (Ethereum). |

---

## Supported Chains and Protocols

| Chain | Protocols | Status |
|-------|-----------|--------|
| Solana | Jito (JitoSOL) | Live |
| Solana | Marinade (mSOL) | Planned |
| Ethereum | Lido (stETH), Ether.fi (eETH) | Planned |
| NEAR | Meta Pool, LiNEAR | Planned |

---

## Use Cases

- **Stake** on Solana or Ethereum directly from NEAR.
- **Swap** assets such as NEAR to ETH or USDC to SOL in a single flow.
- **Use DeFi** across ecosystems without leaving the NEAR environment.
- **Build** cross-chain functionality natively inside NEAR dApps.
- **Manage** multi-chain DAO treasuries via intent-based automation (planned).

---

## Tech Stack

- AI-powered intent parser.
- NEAR smart contracts for intent signing and management.
- Cross-chain signatures via NEAR MPC.
- On-chain proof system for verifiable results.

---

## Security

- No bridging or wrapping of assets across chains.
- On-chain verification of solver execution.
- Replay protection and deadlines for all intents.
- Non-custodial design with MPC-derived addresses.
- Permissionless solver participation.

---

## Roadmap

- MVP with token swaps and staking flows (live).
- Developer documentation and SDKs.
- Support for additional chains such as Cosmos, Aptos, and TON.
- DAO registry and governance flows.
- Cross-chain DeFi: lending, borrowing, and yield.

---

## Documentation

Full protocol documentation is available in-app at the `/docs` route.

---

## Contributing

Contributions from developers, protocol teams, and researchers are welcome. Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

---

## License

Released under the MIT License.

---

## Links

- Twitter / X: https://x.com/nexchange_near
- GitHub: https://github.com/ayushsingh82/Nexchange
