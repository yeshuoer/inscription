'use client'

import { RefreshButton } from "@/components/RefreshButton"
import { log } from "@/libs"
import { usePathname, useRouter } from "next/navigation"

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const activeClassName = (link: string) => {
    return pathname.startsWith(link) ? 'tab tab-active' : 'tab'
  }

  return <div>
    <header className="flex justify-between items-center">
      <ul role='tablist' className='tabs tabs-boxed'>
        <li role='tab' className={activeClassName('/personal/tokens')} onClick={() => router.push('/personal/tokens')}>Tokens</li>
        <li role='tab' className={activeClassName('/personal/inscriptions')} onClick={() => router.push('/personal/inscriptions')}>Inscriptions</li>
      </ul>
      <RefreshButton />
    </header>

    <div className="pt-8">
      {children}
    </div>

  </div>
}
