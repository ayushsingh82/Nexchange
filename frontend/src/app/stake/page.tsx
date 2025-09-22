"use client";

import dynamicImport from "next/dynamic";

// Disable static generation completely
export const dynamic = 'force-dynamic';

const StakePageContent = dynamicImport(() => import('@/components/pages/StakePageContent'), { 
  ssr: false,
  loading: () => <div className="min-h-screen bg-black flex items-center justify-center text-[#97FBE4]">Loading...</div>
});

export default function StakePage() {
  return <StakePageContent />
}