import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientLayout } from "@/components/ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NeXchange- Chain Abstraction & Intents",
  description:
    "Experience the future of Web3 with NEAR Protocol's chain abstraction, signatures, and intents framework",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <ClientLayout>{children}</ClientLayout>

        <footer className="bg-black border-t  border-[#97FBE4]/30  mt-auto">
          <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Company Info */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-[#97FBE4]">NeXchange</h3>

                <p className="text-[#97FBE4] text-sm">
                  Building the future of staking with NeXchange.
                </p>
                <p className="text-[#97FBE4] text-sm">
                © {new Date().getFullYear()} NeXchange. All rights reserved.
              </p>
              </div>
            </div> {/* ✅ closing grid div properly */}

            {/* Bottom Bar */}
            <div className="border-t  border-[#97FBE4]/30  mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
             
              <div className="flex gap-6 mt-4 md:mt-0">
                <a
                  href="https://twitter.com/NEARProtocol"
                  className="text-green-100/60 hover:text-green-300 transition-colors"
                >
                  Twitter
                </a>
                <a
                  href="https://github.com/near"
                  className="text-green-100/60 hover:text-green-300 transition-colors"
                >
                  GitHub
                </a>
                <a
                  href="https://discord.gg/near"
                  className="text-green-100/60 hover:text-green-300 transition-colors"
                >
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
