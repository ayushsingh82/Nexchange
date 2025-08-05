import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white font-sans">
      <div className="container mx-auto px-6 py-20">
        {/* Hero Section */}
        <div className="text-center mb-24">
          <h1 className="text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
            NeXchange
          </h1>
          <p className="text-xl text-emerald-100/90 mb-10 max-w-2xl mx-auto">
            Seamlessly connect NEAR with Solana and EVM chains through intent-based cross-chain execution
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-6 mb-16">
          <Link href="/" className="group">
            <button className="border border-green-500 text-green-400 px-8 py-3 rounded-lg font-medium hover:bg-green-900/60 backdrop-blur-md transition">
              <span>Create Intent</span>
            </button>
          </Link>
          <Link href="/" className="group">
            <button className="border border-green-500 text-green-400 px-8 py-3 rounded-lg font-medium hover:bg-green-900/60 backdrop-blur-md transition">
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
              className="bg-green-950/40 backdrop-blur-lg p-8 rounded-xl border border-green-800/50 hover:border-green-500 transition duration-300 shadow-lg hover:shadow-green-500/10 text-center"
            >
              <h3 className="text-xl font-semibold mb-3 text-green-400">
                {feature.title}
              </h3>
              <p className="text-emerald-100/90 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Architecture Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
            Architecture
          </h2>
          <div className="flex justify-center">
            <div className="bg-green-950/40 backdrop-blur-lg p-8 rounded-xl border border-green-800/50 w-full max-w-4xl h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="text-green-400 text-lg mb-2">📊</div>
                <p className="text-green-200 text-lg">Architecture Diagram</p>
                <p className="text-green-300/70 text-sm mt-2">Image placeholder - Add your architecture diagram here</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-green-950/40 backdrop-blur-lg p-12 rounded-2xl border border-green-800/50 shadow-lg">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
            Start Building Cross-Chain
          </h2>
          <p className="text-emerald-100/90 mb-8 max-w-xl mx-auto text-lg">
            Join our ecosystem and leverage the power of intent-based cross-chain execution between NEAR, Solana, and EVM chains.
          </p>
          <button className="bg-green-500 text-white px-10 py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition shadow-md hover:shadow-green-400/30">
            Create Your First Intent
          </button>
        </div>
      </div>
    </main>
  )
}