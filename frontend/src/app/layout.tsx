import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

import NearWalletProvider from "../provider/wallet";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NeXchange- Chain Abstraction & Intents",
  description: "Experience the future of Web3 with NEAR Protocol's chain abstraction, signatures, and intents framework",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
      <NearWalletProvider>
        <nav className="bg-black border-b border-green-800/50">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              {/* Logo/Name */}
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
              NeXchange
              </Link>

              {/* Navigation Links */}
              <div className="flex items-center gap-6">
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
              </div>
            </div>
          </div>
        </nav>


        <main className="flex-grow">
          {children}
        </main>

        </NearWalletProvider>

        <footer className="bg-black border-t border-green-800/50 mt-auto">
          <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Company Info */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
                NeXchange
                </h3>
                <p className="text-green-100/80 text-sm">
                  Building the future of Web3 through chain abstraction and intents.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-green-400 font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/developers" className="text-green-100/80 hover:text-green-300 transition-colors text-sm">
                      Developer Portal
                    </Link>
                  </li>
                  <li>
                    <Link href="/docs" className="text-green-100/80 hover:text-green-300 transition-colors text-sm">
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link href="/ecosystem" className="text-green-100/80 hover:text-green-300 transition-colors text-sm">
                      Ecosystem
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h4 className="text-green-400 font-semibold mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/learn" className="text-green-100/80 hover:text-green-300 transition-colors text-sm">
                      Learn
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className="text-green-100/80 hover:text-green-300 transition-colors text-sm">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="/grants" className="text-green-100/80 hover:text-green-300 transition-colors text-sm">
                      Grants
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Community */}
              <div>
                <h4 className="text-green-400 font-semibold mb-4">Community</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="https://discord.gg/near" className="text-green-100/80 hover:text-green-300 transition-colors text-sm">
                      Discord
                    </Link>
                  </li>
                  <li>
                    <Link href="https://twitter.com/NEARProtocol" className="text-green-100/80 hover:text-green-300 transition-colors text-sm">
                      Twitter
                    </Link>
                  </li>
                  <li>
                    <Link href="https://github.com/near" className="text-green-100/80 hover:text-green-300 transition-colors text-sm">
                      GitHub
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-green-800/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-green-100/60 text-sm">
                © {new Date().getFullYear()} NeXchange. All rights reserved.
              </p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <Link href="https://twitter.com/NEARProtocol" className="text-green-100/60 hover:text-green-300 transition-colors">
                  Twitter
                </Link>
                <Link href="https://github.com/near" className="text-green-100/60 hover:text-green-300 transition-colors">
                  GitHub
                </Link>
                <Link href="https://discord.gg/near" className="text-green-100/60 hover:text-green-300 transition-colors">
                  Discord
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}