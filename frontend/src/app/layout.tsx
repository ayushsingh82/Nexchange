import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { ClientLayout } from "@/components/ClientLayout";

const inter = Inter({ subsets: ["latin"] });
const syne = Syne({ subsets: ["latin"], weight: ["700", "800"] });

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

        <footer className="bg-black border-t border-[#97FBE4]/30 mt-auto py-10">
          <div className="container mx-auto px-6 flex flex-col md:flex-row md:items-start md:justify-between gap-8">
            {/* Brand */}
            <div className="flex flex-col items-start max-w-sm">
              <div className="text-[#97FBE4] text-xl font-bold">NeXchange</div>
              <p className="text-[#97FBE4]/70 text-sm mt-2 leading-relaxed">
                Cross-chain liquid staking from a single NEAR wallet. No bridges, no wallet
                switching — just stake.
              </p>
            </div>

            {/* Nav links */}
            <div className="flex flex-col gap-2 text-sm">
              <p className="text-[#97FBE4]/40 text-xs uppercase tracking-wider mb-1">Product</p>
              <Link href="/explore" className="text-[#97FBE4]/70 hover:text-[#97FBE4] transition-colors">Explore</Link>
              <Link href="/portfolio" className="text-[#97FBE4]/70 hover:text-[#97FBE4] transition-colors">Portfolio</Link>
              <Link href="/stake" className="text-[#97FBE4]/70 hover:text-[#97FBE4] transition-colors">Stake</Link>
              <Link href="/docs" className="text-[#97FBE4]/70 hover:text-[#97FBE4] transition-colors">Docs</Link>
            </div>

            {/* Socials */}
            <div className="flex flex-col gap-3">
              <p className="text-[#97FBE4]/40 text-xs uppercase tracking-wider">Community</p>
              <div className="flex gap-3">
                <a
                  href="https://x.com/nexchange_near"
                  aria-label="Follow NeXchange on X"
                  className="w-10 h-10 flex items-center justify-center border border-[#97FBE4]/30 text-[#97FBE4]/70 hover:text-black hover:bg-[#97FBE4] transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://github.com/ayushsingh82/Nexchange"
                  aria-label="NeXchange on GitHub"
                  className="w-10 h-10 flex items-center justify-center border border-[#97FBE4]/30 text-[#97FBE4]/70 hover:text-black hover:bg-[#97FBE4] transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                    <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.27 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="container mx-auto px-6 mt-8 pt-6 border-t border-[#97FBE4]/10">
            <p className="text-[#97FBE4]/40 text-xs">© 2026 NeXchange · Built on NEAR</p>
          </div>
        </footer>

        {/* NeXchange wordmark */}
        <div className="relative w-full overflow-hidden bg-black flex items-center justify-center py-6 sm:py-8">
          <h2
            className={`${syne.className} select-none text-6xl sm:text-7xl md:text-8xl lg:text-9xl 2xl:text-[11rem] font-extrabold w-full text-center bg-gradient-to-b from-white via-[#97FBE4] to-[#0a3b32] text-transparent bg-clip-text`}
            style={{
              letterSpacing: '-0.02em',
              filter: 'drop-shadow(0 0 34px rgba(151,251,228,0.3))',
            }}
          >
            NeXchange
          </h2>
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black to-transparent" />
        </div>
      </body>
    </html>
  );
}