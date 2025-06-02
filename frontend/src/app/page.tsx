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
            Experience the Future of Web3 with Chain Abstraction and Intents
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-6 mb-16 ">
          <Link href="/create-gig" className="group">
            <button className="border border-green-500 text-green-400 px-8 py-3 rounded-lg font-medium hover:bg-green-900/60 backdrop-blur-md transition">
              <span>Get Started</span>
            </button>
          </Link>
          <Link href="/register-skill" className="group">
            <button className="border border-green-500 text-green-400 px-8 py-3 rounded-lg font-medium hover:bg-green-900/60 backdrop-blur-md transition">
              <span>Learn More</span>
            </button>
          </Link>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {[
            {
              title: 'Chain Abstraction',
              desc: 'Seamlessly interact with multiple blockchains through a unified interface, making Web3 accessible to everyone.',
            },
            {
              title: 'Chain Signatures',
              desc: 'Secure and efficient cross-chain transactions with our advanced signature verification system.',
            },
            {
              title: 'Intents Framework',
              desc: 'Express your desired outcomes and let the protocol handle the complex execution details.',
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

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6 mb-20 text-center">
          {[
            ['1M+', 'Daily Transactions'],
            ['50+', 'Supported Chains'],
            ['99.9%', 'Uptime'],
            ['$100M+', 'TVL'],
          ].map(([num, label], i) => (
            <div
              key={i}
              className="bg-green-950/40 p-6 rounded-lg border border-green-800/50 backdrop-blur-sm shadow-sm hover:border-green-500 transition duration-300"
            >
              <div className="text-3xl font-bold text-green-400 mb-1">
                {num}
              </div>
              <div className="text-emerald-100/80 text-sm">{label}</div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-green-950/40 backdrop-blur-lg p-12 rounded-2xl border border-green-800/50 shadow-lg">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
            Ready to Build on NEAR?
          </h2>
          <p className="text-emerald-100/90 mb-8 max-w-xl mx-auto text-lg">
            Join our ecosystem and leverage the power of chain abstraction and intents.
          </p>
          <button className="bg-green-500 text-white px-10 py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition shadow-md hover:shadow-green-400/30">
            Start Building
          </button>
        </div>
      </div>
    </main>
  )
}