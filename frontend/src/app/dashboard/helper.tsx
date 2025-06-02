import { decimalToBigInt } from "../utils/DecimalToBigInt";
import { bigIntToDecimal } from "../utils/bigIntToDecimal";
import { SIGNET_CONTRACT } from "../utils/config";
import { Connection as SolanaConnection } from '@solana/web3.js'

const connection = new SolanaConnection("https://api.devnet.solana.com");