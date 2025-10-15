import Web3 from 'web3';

// Lido contract ABI (partial for submit function)
export const LIDO_ABI = [
  {
    constant: false,
    inputs: [{ name: "_referral", type: "address" }],
    name: "submit",
    outputs: [{ name: "", type: "uint256" }],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "sender", type: "address" },
      { indexed: false, name: "amount", type: "uint256" },
      { indexed: true, name: "referral", type: "address" }
    ],
    name: "Submitted",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: false, name: "value", type: "uint256" }
    ],
    name: "Transfer",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: false, name: "sharesValue", type: "uint256" }
    ],
    name: "TransferShares",
    type: "event"
  }
];

export const LIDO_CONTRACT_ADDRESS = "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84";

export interface StakeWithLidoParams {
  web3: Web3;
  userAddress: string;
  amount: string; // in ETH
  referralAddress: string;
}

export interface StakeResult {
  transactionHash: string;
  stETHAmount: string;
  sharesAmount: string;
}

export class LidoContractService {
  private web3: Web3;
  private contract: any;

  constructor(web3: Web3) {
    this.web3 = web3;
    this.contract = new web3.eth.Contract(LIDO_ABI, LIDO_CONTRACT_ADDRESS);
  }

  async stakeWithReferral(params: StakeWithLidoParams): Promise<StakeResult> {
    const { userAddress, amount, referralAddress } = params;
    
    try {
      // Convert ETH to Wei
      const amountInWei = this.web3.utils.toWei(amount, 'ether');
      
      // Submit stake transaction
      const tx = await this.contract.methods
        .submit(referralAddress)
        .send({ 
          from: userAddress, 
          value: amountInWei 
        });

      // Parse the transaction receipt to get stETH amount
      const receipt = tx;
      const submittedEvent = receipt.events?.Submitted;
      
      if (!submittedEvent) {
        throw new Error('Submitted event not found in transaction receipt');
      }

      return {
        transactionHash: tx.transactionHash,
        stETHAmount: this.web3.utils.fromWei(submittedEvent.returnValues.amount, 'ether'),
        sharesAmount: submittedEvent.returnValues.amount
      };
    } catch (error) {
      console.error('Error staking with Lido:', error);
      throw error;
    }
  }

  async getStakeEvents(userAddress: string, fromBlock: number = 0) {
    try {
      const submittedEvents = await this.contract.getPastEvents('Submitted', {
        filter: { sender: userAddress },
        fromBlock: fromBlock,
        toBlock: 'latest'
      });

      const transferEvents = await this.contract.getPastEvents('Transfer', {
        filter: { from: '0x0000000000000000000000000000000000000000', to: userAddress },
        fromBlock: fromBlock,
        toBlock: 'latest'
      });

      return {
        submittedEvents,
        transferEvents
      };
    } catch (error) {
      console.error('Error fetching stake events:', error);
      throw error;
    }
  }

  async estimateGas(params: StakeWithLidoParams): Promise<string> {
    const { userAddress, amount, referralAddress } = params;
    const amountInWei = this.web3.utils.toWei(amount, 'ether');
    
    try {
      const gasEstimate = await this.contract.methods
        .submit(referralAddress)
        .estimateGas({ 
          from: userAddress, 
          value: amountInWei 
        });
      
      return gasEstimate.toString();
    } catch (error) {
      console.error('Error estimating gas:', error);
      throw error;
    }
  }
}

export default LidoContractService;
