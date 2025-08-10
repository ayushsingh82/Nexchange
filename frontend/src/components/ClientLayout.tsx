'use client';

import { WalletConfig } from './WalletConfig';
import NearWalletProvider from '../provider/wallet';
import WalletSelector from './WalletSelector';
import { WalletButton } from './WalletButton';
import Link from 'next/link';
import { useState } from 'react';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isStakeOpen, setIsStakeOpen] = useState(false);

  return (
    <WalletConfig>
      <NearWalletProvider>
        <nav className="bg-black border-b border-green-800/50">
          <div className="container mx-auto px-6">
            <div className="flex items-center h-16">
              {/* Logo/Name - Left */}
              <div className="flex-shrink-0">
                <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
                  NeXchange
                </Link>
              </div>

              {/* Navigation Links - Center */}
              <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-6">
                  <Link 
                    href="/protocol" 
                    className="text-green-400 hover:text-green-300 transition-colors"
                  >
                    Protocol
                  </Link>
                  <Link 
                    href="/dashboard" 
                    className="text-green-400 hover:text-green-300 transition-colors"
                  >
                    Dashboard
                  </Link>
                 
                  <Link 
                    href="/evm" 
                    className="text-green-400 hover:text-green-300 transition-colors"
                  >
                    EVM
                  </Link>
                  
                  {/* Stake Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setIsStakeOpen(!isStakeOpen)}
                      className="text-green-400 hover:text-green-300 transition-colors flex items-center gap-1"
                    >
                      Stake
                      <svg 
                        className={`w-4 h-4 transition-transform ${isStakeOpen ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Dropdown Menu */}
                    {isStakeOpen && (
                      <div className="absolute top-full left-0 mt-2 w-32 bg-green-950/90 backdrop-blur-lg border border-green-800/50 rounded-lg shadow-lg z-50">
                        <div className="py-2">
                          <Link
                            href="/stake/near"
                            className="block px-4 py-2 text-green-300 hover:bg-green-800/50 hover:text-green-200 transition-colors"
                            onClick={() => setIsStakeOpen(false)}
                          >
                            NEAR
                          </Link>
                          <Link
                            href="/stake/sol"
                            className="block px-4 py-2 text-green-300 hover:bg-green-800/50 hover:text-green-200 transition-colors"
                            onClick={() => setIsStakeOpen(false)}
                          >
                            SOL
                          </Link>
                          <Link
                            href="/stake/eth"
                            className="block px-4 py-2 text-green-300 hover:bg-green-800/50 hover:text-green-200 transition-colors"
                            onClick={() => setIsStakeOpen(false)}
                          >
                            ETH
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Wallet Selectors - Right */}
              <div className="flex-shrink-0 flex items-center gap-4">
                <WalletSelector />
           
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-grow">
          {children}
        </main>
      </NearWalletProvider>
    </WalletConfig>
  );
} 