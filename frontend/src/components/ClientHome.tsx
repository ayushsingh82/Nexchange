'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'

const HomePageContent = dynamic(() => import('./pages/HomePageContent'), { 
  ssr: false,
  loading: () => <div className="min-h-screen bg-black flex items-center justify-center text-[#97FBE4]">Loading...</div>
})

export default function ClientHome() {
  useEffect(() => {
    const root = document.getElementById('home-root')
    if (root) {
      root.innerHTML = ''
      const container = document.createElement('div')
      root.appendChild(container)
    }
  }, [])

  return <HomePageContent />
}
