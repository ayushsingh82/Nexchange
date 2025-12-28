// Local config for SIGNET_CONTRACT to avoid external path resolution issues
import { contracts } from "chainsig.js";

export const NetworkId = "mainnet";
export const MPC_CONTRACT = "v1.signer";

export const SIGNET_CONTRACT = new contracts.ChainSignatureContract({
  networkId: NetworkId,
  contractId: MPC_CONTRACT,
});

