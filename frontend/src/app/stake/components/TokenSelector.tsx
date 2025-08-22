'use client';

import React, { useState, useRef, useEffect } from 'react';
import { TokenInfo, SUPPORTED_TOKENS } from '../constant';
import { TokenPriceCompact } from './TokenPriceDisplay';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useTokenPrices } from '../hooks/useTokenPrices';
import { formatPrice, formatChange, getPriceChangeColor } from '../constant';

interface TokenSelectorProps {
  selectedToken: TokenInfo | null;
  onTokenSelect: (token: TokenInfo) => void;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
}

export function TokenSelector({
  selectedToken,
  onTokenSelect,
  className = '',
  disabled = false,
  placeholder = 'Select Token'
}: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTokenSelect = (token: TokenInfo) => {
    onTokenSelect(token);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Selected Token Display */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 
          rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'}
          transition-colors duration-200
        `}
      >
        <div className="flex items-center justify-between">
          {selectedToken ? (
            <TokenPriceCompact token={selectedToken} />
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
          <ChevronDownIcon 
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
          {SUPPORTED_TOKENS.map((token) => (
            <button
              key={token.id}
              onClick={() => handleTokenSelect(token)}
              className={`
                w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 
                transition-colors duration-150 border-b border-gray-100 dark:border-gray-700 last:border-b-0
                ${selectedToken?.id === token.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
              `}
            >
              <TokenPriceCompact token={token} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Token Display Card for showing selected token info
export function TokenDisplayCard({ token }: { token: TokenInfo }) {
  const { tokenPrices } = useTokenPrices();
  const priceData = tokenPrices[token.symbol];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="relative w-10 h-10">
            <Image
              src={token.logo}
              alt={token.name}
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{token.name}</h3>
            <p className="text-sm text-gray-500">{token.chain}</p>
          </div>
        </div>
        
        {priceData && (
          <div className="text-right">
            <div className="text-2xl font-bold">${formatPrice(priceData.price)}</div>
            <div className={`text-sm ${getPriceChangeColor(priceData.change24h)}`}>
              {formatChange(priceData.change24h)} (24h)
            </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>Symbol: {token.symbol}</span>
        <span>CMC ID: {token.cmcId}</span>
      </div>
    </div>
  );
}
