'use client'

import dynamic from 'next/dynamic'

// Disable static generation completely
export const dynamic = 'force-dynamic';

const ExplorePageContent = dynamic(() => import('@/components/pages/ExplorePageContent'), { 
  ssr: false,
  loading: () => <div className="min-h-screen bg-black flex items-center justify-center text-[#97FBE4]">Loading...</div>
})

export default function ExplorePage() {
  return <ExplorePageContent />
}
