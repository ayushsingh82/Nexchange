import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientLayout } from "@/components/ClientLayout";

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
        <ClientLayout>
          {children}
        </ClientLayout>

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
                    <a href="/developers" className="text-green-100/80 hover:text-green-300 transition-colors text-sm">
                      Developer Portal
                    </a>
                  </li>
                  <li>
                    <a href="/docs" className="text-green-100/80 hover:text-green-300 transition-colors text-sm">
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="/ecosystem" className="text-green-100/80 hover:text-green-300 transition-colors text-sm">
                      Ecosystem
                    </a>
                  </li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h4 className="text-green-400 font-semibold mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="/learn" className="text-green-100/80 hover:text-green-300 transition-colors text-sm">
                      Learn
                    </a>
                  </li>
                  <li>
                    <a href="/blog" className="text-green-100/80 hover:text-green-300 transition-colors text-sm">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="/grants" className="text-green-100/80 hover:text-green-300 transition-colors text-sm">
                      Grants
                    </a>
                  </li>
                </ul>
              </div>

              {/* Community */}
              <div>
                <h4 className="text-green-400 font-semibold mb-4">Community</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="https://discord.gg/near" className="text-green-100/80 hover:text-green-300 transition-colors text-sm">
                      Discord
                    </a>
                  </li>
                  <li>
                    <a href="https://twitter.com/NEARProtocol" className="text-green-100/80 hover:text-green-300 transition-colors text-sm">
                      Twitter
                    </a>
                  </li>
                  <li>
                    <a href="https://github.com/near" className="text-green-100/80 hover:text-green-300 transition-colors text-sm">
                      GitHub
                    </a>
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
                <a href="https://twitter.com/NEARProtocol" className="text-green-100/60 hover:text-green-300 transition-colors">
                  Twitter
                </a>
                <a href="https://github.com/near" className="text-green-100/60 hover:text-green-300 transition-colors">
                  GitHub
                </a>
                <a href="https://discord.gg/near" className="text-green-100/60 hover:text-green-300 transition-colors">
                  Discord
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}