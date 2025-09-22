'use client'

import dynamicImport from 'next/dynamic'

// Disable static generation completely
export const dynamic = 'force-dynamic';

const JitoPageContent = dynamicImport(() => import('@/components/pages/JitoPageContent'), { 
  ssr: false,
  loading: () => <div className="min-h-screen bg-black flex items-center justify-center text-[#97FBE4]">Loading...</div>
})

export default function JitoPage() {
  return <JitoPageContent />
}