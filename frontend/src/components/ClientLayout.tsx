'use client';

// import { WalletConfig } from './WalletConfig';
import { useState } from 'react';
import NearWalletProvider from '../provider/wallet';
import WalletSelector from './WalletSelector';

import Link from 'next/link';

const NAV_LINKS = [
  { href: '/explore', label: 'Explore' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/docs', label: 'Docs' },
];

function NavbarContent() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-black border-b border-[#97FBE4]/25">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-13">
            {/* Logo/Name - Left */}
            <div className="flex-shrink-0">
              <Link href="/" className="text-lg sm:text-xl font-light tracking-[-0.02em] text-[#97FBE4]">
                <span className="tracking-[-0.04em]">NeX</span><span>change</span>
              </Link>
            </div>

            {/* Navigation Links - Center (desktop) */}
            <div className="hidden md:flex flex-1 justify-center">
              <div className="flex items-center gap-6">
                {NAV_LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="text-sm text-[#97FBE4] hover:text-[#5eead4] transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right cluster */}
            <div className="flex-shrink-0 flex items-center gap-2 sm:gap-4">
              <WalletSelector />
              {/* Hamburger - mobile only */}
              <button
                onClick={() => setMobileOpen((o) => !o)}
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
                className="md:hidden p-2 text-[#97FBE4] hover:text-[#5eead4] transition-colors"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  {mobileOpen ? (
                    <path d="M6 18 18 6M6 6l12 12" />
                  ) : (
                    <path d="M3 6h18M3 12h18M3 18h18" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-green-800/50 bg-black">
            <div className="container mx-auto px-4 py-2 flex flex-col">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-[#97FBE4] hover:text-[#5eead4] hover:bg-[#97FBE4]/5 transition-colors py-3 px-2"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    // <WalletConfig>
      <NearWalletProvider>
        <NavbarContent />
        <main className="flex-grow">
          {children}
        </main>
      </NearWalletProvider>
    // </WalletConfig>
  );
} 