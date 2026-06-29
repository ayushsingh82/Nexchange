'use client'

import dynamicImport from 'next/dynamic'

export const dynamic = 'force-dynamic';

const EtherFiPageContent = dynamicImport(() => import('./EtherFiPageContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-black flex items-center justify-center text-[#97FBE4]">
      Loading…
    </div>
  ),
})

export default function EtherFiPage() {
  return <EtherFiPageContent />
}
