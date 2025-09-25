"use client"

import HomePageContent from "@/components/pages/HomePageContent"

// import dynamicImport from 'next/dynamic'

// // Disable static generation completely
// export const dynamic = 'force-dynamic';

// const HomePageContent = dynamicImport(() => import('@/components/pages/HomePageContent'), { 
//   ssr: false,
//   loading: () => <div className="min-h-screen bg-black flex items-center justify-center text-[#97FBE4]">Loading...</div>
// })

export default function Home() {
  return <HomePageContent />
}