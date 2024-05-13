'use client'

import { RefreshButton } from "@/components/RefreshButton"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const activeClassName = (link: string) => {
    return pathname.startsWith(link) ? 'tab tab-active' : 'tab'
  }
  
  return <div>
    <header className="flex justify-between items-center">
      <ul role='tablist' className='tabs tabs-boxed'>
        <li role='tab' className={activeClassName('/personal/tokens')}><Link href="/personal/tokens">Tokens</Link></li>
        <li role='tab' className={activeClassName('/personal/inscriptions')}><Link href="/personal/inscriptions">Inscriptions</Link></li>
      </ul>
      <RefreshButton />
    </header>

    <div className="pt-8">
      {children}
    </div>

  </div>
}
