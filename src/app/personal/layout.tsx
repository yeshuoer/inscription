'use client'

import { RefreshButton } from "@/components/RefreshButton"
import { log } from "@/libs"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { useAccount } from "wagmi"

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { isConnected } = useAccount()
  const [refreshKey, setRefreshKey] = useState(Date.now())

  const activeClassName = (link: string) => {
    return pathname.startsWith(link) ? 'tab tab-active' : 'tab'
  }

  return <div>
    <header className="flex justify-between items-center">
      <ul role='tablist' className='tabs tabs-boxed'>
        <li role='tab' className={activeClassName('/personal/tokens')} onClick={() => router.push('/personal/tokens')}>Tokens</li>
        <li role='tab' className={activeClassName('/personal/inscriptions')} onClick={() => router.push('/personal/inscriptions')}>Inscriptions</li>
      </ul>
      <RefreshButton onClick={() => setRefreshKey(Date.now())} />
    </header>

    {/* {
      !isConnected && <div role="alert" className="alert alert-warning w-1/3 text-white mx-auto">Please connect wallet!</div>
    } */}
    <div className="pt-8" key={refreshKey}>
      {children}
    </div>
  </div>
}
