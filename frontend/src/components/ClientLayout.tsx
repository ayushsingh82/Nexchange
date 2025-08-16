'use client';

import { WalletConfig } from './WalletConfig';
import NearWalletProvider from '../provider/wallet';
import WalletSelector from './WalletSelector';
import { WalletButton } from './WalletButton';
import Link from 'next/link';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <WalletConfig>
      <NearWalletProvider>
        <nav className="bg-black border-b border-green-800/50">
          <div className="container mx-auto px-6">
            <div className="flex items-center h-16">
              {/* Logo/Name - Left */}
              <div className="flex-shrink-0">
                <Link href="/" className="text-2xl font-bold text-[#97FBE4]">
                  NeXchange
                </Link>
              </div>

              {/* Navigation Links - Center */}
              <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-6">
                  <Link 
                    href="/protocol" 
                    className="text-[#97FBE4] transition-colors"
                  >
                    Protocol
                  </Link>
                  <Link 
                    href="/dashboard" 
                    className="text-[#97FBE4] transition-colors"
                  >
                    Dashboard
                  </Link>
                  
                  {/* Stake Link */}
                  <Link 
                    href="/stake" 
                    className="text-[#97FBE4] transition-colors"
                  >
                    Stake
                  </Link>
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