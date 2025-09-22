import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-[#97FBE4] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl mb-8">Page not found</p>
        <Link 
          href="/" 
          className="inline-block px-6 py-3 bg-[#97FBE4] text-black font-semibold hover:bg-[#5eead4] transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
