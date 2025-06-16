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
              className="bg-green-950/40 backdrop-blur-lg p-8 rounded-xl border border-green-800/50 hover:border-green-500 transition duration-300 shadow-lg hover:shadow-green-500/10"
            >
              <h3 className="text-xl font-semibold mb-3 text-green-400">
                {feature.title}
              </h3>
              <p className="text-emerald-100/90 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* How It Works Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Create Intent',
                desc: 'Sign an intent message on NEAR specifying your desired cross-chain action'
              },
              {
                step: '02',
                title: 'Agent Network',
                desc: 'Our network of agents receives and processes your intent'
              },
              {
                step: '03',
                title: 'Cross-Chain Execution',
                desc: 'Agents execute your intent on Solana or EVM chains'
              },
              {
                step: '04',
                title: 'Verification',
                desc: 'Cross-chain proof verification ensures secure execution'
              }
            ].map((step, idx) => (
              <div
                key={idx}
                className="bg-green-950/40 p-6 rounded-lg border border-green-800/50 backdrop-blur-sm"
              >
                <div className="text-2xl font-bold text-green-400 mb-2">{step.step}</div>
                <h3 className="text-lg font-semibold mb-2 text-white">{step.title}</h3>
                <p className="text-emerald-100/80 text-sm">{step.desc}</p>
              </div>
            ))}
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