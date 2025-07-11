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
            <div className="flex items-center justify-between h-16">
              {/* Logo/Name */}
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
                NeXchange
              </Link>

              {/* Wallet Selectors */}
              <div className="flex items-center gap-4">
                <WalletSelector />
           
              </div>

              {/* Navigation Links */}
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
                  href="/try" 
                  className="text-green-400 hover:text-green-300 transition-colors"
                >
                  Try
                </Link>
                <Link 
                  href="/evm" 
                  className="text-green-400 hover:text-green-300 transition-colors"
                >
                  EVM
                </Link>
                <Link 
                  href="/chat" 
                  className="text-green-400 hover:text-green-300 transition-colors"
                >
                  Chat
                </Link>
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