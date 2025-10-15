import React from 'react';
import { LidoStakingWidget, LidoBanner, LidoContractService, LidoAPIService } from './components/Lido';

// ETH Protocol Components
export const ETHProtocol: React.FC = () => {
  return (
    <div className="eth-protocol">
      <h1>Ethereum Protocol Integration</h1>
      <p>This module provides integration with Ethereum protocols including Lido staking.</p>
      
      {/* Lido Integration Example */}
      <div className="lido-integration">
        <h2>Lido Staking Integration</h2>
        <p>Stake your ETH with Lido to earn rewards while maintaining liquidity.</p>
        
        {/* Example usage - replace with actual rewards address */}
        <LidoBanner 
          rewardsAddress="0x1234567890123456789012345678901234567890"
          variant="compact"
          className="mb-4"
        />
        
        <LidoStakingWidget 
          rewardsAddress="0x1234567890123456789012345678901234567890"
          height={600}
          enableEarn={true}
          className="border rounded-lg"
        />
      </div>
    </div>
  );
};

// Export Lido components and services for external use
export {
  LidoStakingWidget,
  LidoBanner,
  LidoContractService,
  LidoAPIService,
};

export default ETHProtocol;
