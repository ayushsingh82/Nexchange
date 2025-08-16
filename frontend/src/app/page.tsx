import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-[#97FBE4] font-sans">
      <div className="container mx-auto px-4 py-20">
        {/* Hero Section */}
        <div className="text-center mb-24">
          <h1 className="text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-[#97FBE4] to-[#5eead4] text-transparent bg-clip-text">
            NeXchange
          </h1>
          <p className="text-xl text-[#97FBE4]/80 mb-10 max-w-2xl mx-auto">
            Seamlessly connect NEAR with Solana and EVM chains through intent-based cross-chain execution
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-6 mb-16">
          <Link href="/" className="group">
            <button className="border border-[#97FBE4] text-[#97FBE4] px-8 py-3 rounded-2xl font-medium hover:bg-[#00150E] hover:text-[#5eead4] backdrop-blur-md transition">
              <span>Create Intent</span>
            </button>
          </Link>
          <Link href="/" className="group">
            <button className="border border-[#97FBE4] text-[#97FBE4] px-8 py-3 rounded-2xl font-medium hover:bg-[#00150E] hover:text-[#5eead4] backdrop-blur-md transition">
              <span>View Docs</span>
            </button>
          </Link>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {[
            {
              title: 'Intent-Based Execution',
              desc: 'Express your desired outcomes through simple intent messages, letting our network of agents handle the complex cross-chain execution.',
            },
            {
              title: 'NEAR ↔️ Solana',
              desc: 'Direct interaction between NEAR and Solana ecosystems, enabling seamless asset transfers, swaps, and DeFi operations.',
            },
            {
              title: 'NEAR ↔️ EVM',
              desc: 'Connect with the entire EVM ecosystem, from Ethereum mainnet to L2s, all through your NEAR wallet.',
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-[#00150E] bg-opacity-80 p-8 rounded-2xl border border-[#97FBE4]/30 hover:border-[#5eead4] transition duration-300 shadow-xl hover:shadow-[#97FBE4]/10 text-center"
            >
              <h3 className="text-xl font-semibold mb-3 text-[#97FBE4]">
                {feature.title}
              </h3>
              <p className="text-[#97FBE4]/80 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Architecture Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-[#97FBE4] to-[#5eead4] text-transparent bg-clip-text">
            Architecture
          </h2>
          <div className="flex justify-center">
            <div className="bg-[#00150E] bg-opacity-80 p-8 rounded-2xl border border-[#97FBE4]/30 w-full max-w-4xl h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="text-[#97FBE4] text-lg mb-2">📊</div>
                <p className="text-[#97FBE4] text-lg">Architecture Diagram</p>
                <p className="text-[#5eead4]/70 text-sm mt-2">Image placeholder - Add your architecture diagram here</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-[#00150E] bg-opacity-80 p-12 rounded-2xl border border-[#97FBE4]/30 shadow-xl">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-[#97FBE4] to-[#5eead4] text-transparent bg-clip-text">
            Start Building Cross-Chain
          </h2>
          <p className="text-[#97FBE4]/80 mb-8 max-w-xl mx-auto text-lg">
            Join our ecosystem and leverage the power of intent-based cross-chain execution between NEAR, Solana, and EVM chains.
          </p>
          <button className="bg-[#97FBE4] text-black px-10 py-3 rounded-2xl text-lg font-semibold hover:bg-[#5eead4] transition shadow-md hover:shadow-[#97FBE4]/30">
            Create Your First Intent
          </button>
        </div>
      </div>
    </main>
  )
}