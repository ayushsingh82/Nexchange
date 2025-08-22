'use client';

import React from 'react';
import Image from 'next/image';
import { TokenInfo, formatPrice, formatChange, getPriceChangeColor } from '../constant';
import { useTokenPrices } from '../hooks/useTokenPrices';

interface TokenPriceDisplayProps {
  token: TokenInfo;
  className?: string;
  showChange?: boolean;
  compact?: boolean;
}

export function TokenPriceDisplay({ 
  token, 
  className = '', 
  showChange = true, 
  compact = false 
}: TokenPriceDisplayProps) {
  const { tokenPrices, loading } = useTokenPrices();
  const priceData = tokenPrices[token.symbol];

  if (loading && !priceData) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="w-6 h-6 bg-gray-300 rounded-full animate-pulse" />
        <div className="h-4 bg-gray-300 rounded w-16 animate-pulse" />
      </div>
    );
  }

  if (!priceData) {
    return (
      <div className={`flex items-center space-x-2 text-gray-500 ${className}`}>
        <span>Price unavailable</span>
      </div>
    );
  }

  const { price, change24h } = priceData;

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Token Logo */}
      <div className="relative w-6 h-6">
        <Image
          src={token.logo}
          alt={token.name}
          width={24}
          height={24}
          className="rounded-full"
        />
      </div>

      {/* Token Info */}
      <div className="flex flex-col">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-sm">{token.symbol}</span>
          {!compact && (
            <span className="text-xs text-gray-500">{token.name}</span>
          )}
        </div>
        
        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-lg">
            ${formatPrice(price)}
          </span>
          
          {/* 24h Change */}
          {showChange && (
            <span className={`text-sm font-medium ${getPriceChangeColor(change24h)}`}>
              {formatChange(change24h)}
            </span>
          )}
        </div>
      </div>

      {/* Live Indicator */}
      <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-xs text-green-500">LIVE</span>
      </div>
    </div>
  );
}

// Compact version for token selection dropdowns
export function TokenPriceCompact({ token }: { token: TokenInfo }) {
  const { tokenPrices } = useTokenPrices();
  const priceData = tokenPrices[token.symbol];

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center space-x-2">
        <div className="relative w-5 h-5">
          <Image
            src={token.logo}
            alt={token.name}
            width={20}
            height={20}
            className="rounded-full"
          />
        </div>
        <span className="font-medium text-sm">{token.symbol}</span>
      </div>
      
      {priceData && (
        <div className="text-right">
          <div className="font-semibold text-sm">
            ${formatPrice(priceData.price)}
          </div>
          <div className={`text-xs ${getPriceChangeColor(priceData.change24h)}`}>
            {formatChange(priceData.change24h)}
          </div>
        </div>
      )}
    </div>
  );
}
