import React, { useState } from 'react';

interface LidoStakingWidgetProps {
  rewardsAddress: string;
  height?: number;
  width?: string;
  enableEarn?: boolean;
  className?: string;
}

export const LidoStakingWidget: React.FC<LidoStakingWidgetProps> = ({
  rewardsAddress,
  height = 500,
  width = '100%',
  enableEarn = false,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const buildWidgetUrl = () => {
    const baseUrl = 'https://stake.lido.fi/';
    const params = new URLSearchParams();
    
    if (rewardsAddress) {
      params.append('ref', rewardsAddress);
    }
    
    if (enableEarn) {
      params.append('earn', 'enabled');
    }
    
    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    console.error('Failed to load Lido staking widget');
  };

  return (
    <div className={`lido-staking-widget ${className}`}>
      {isLoading && (
        <div className="flex items-center justify-center" style={{ height }}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
      <iframe
        src={buildWidgetUrl()}
        title="Lido Staking App"
        height={height}
        width={width}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          border: 'none',
          borderRadius: '8px',
          display: isLoading ? 'none' : 'block'
        }}
        allow="clipboard-write"
      />
    </div>
  );
};

export default LidoStakingWidget;
