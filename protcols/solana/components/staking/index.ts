// Solana liquid-staking deposit / withdraw functions barrel.

// Jito (JitoSOL) — SPL stake pool
export { stakeSOL, JITO_STAKE_POOL_ADDRESS, JITO_MINT_ADDRESS } from '../stake/staking'
export {
  unstakeJitoSOLInstant,
  unstakeJitoSOLToStakeAccount,
} from '../stake/unstaking'

// Marinade (mSOL)
export { stakeSOLMarinade, MSOL_MINT_ADDRESS } from '../marinade/staking'
export {
  liquidUnstakeMarinade,
  orderUnstakeMarinade,
  claimUnstakeMarinade,
} from '../marinade/unstaking'
