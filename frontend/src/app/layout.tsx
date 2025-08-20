import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
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

        <footer className="bg-black border-t border-[#97FBE4]/30 mt-auto py-6 h-[160px]">
          <div className="container mx-auto px-6 flex items-center justify-between h-full">
            <div className="flex flex-col items-start">
              <div className="text-[#97FBE4] text-xl font-bold">NeXchange</div>
              <p className="text-[#97FBE4] text-md mt-1">
                building the future of staking with NEAR
              </p>
            </div>
            <div className="flex gap-6">
              <a
                href="https://twitter.com/NEARProtocol"
                className="text-green-100/60 hover:text-green-300 transition-colors flex items-center gap-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/9/95/Twitter_new_X_logo.png"
                  alt="X Logo"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
              </a>
              <a
                href="https://github.com/near"
                className="text-green-100/60 hover:text-green-300 transition-colors flex items-center gap-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                  alt="GitHub Logo"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}