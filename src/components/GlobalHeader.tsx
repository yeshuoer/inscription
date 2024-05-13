'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function GlobalHeader() {
  const pathname = usePathname()

  const activeClassName = (link: string) => {
    return pathname.startsWith(link) ? 'tab tab-active' : 'tab'
  }

  return <header className='box-border px-6 fixed left-0 top-0 z-10 w-full border-b-2 bg-base-100'>
    <div className="navbar">
      <div className="flex-1">
        <Link href='/' className='text-xl font-bold italic text-primary'>Inscription Market</Link>
      </div>

      <ul role='tablist' className='tabs tabs-boxed flex-1'>
        <li role='tab' className={activeClassName('/inscription')}><Link href="/inscription">Inscriptions</Link></li>
        <li role='tab' className={activeClassName('/token')}><Link href="/token">Tokens</Link></li>
        <li role='tab' className={activeClassName('/market')}><Link href="/market">Marketplace</Link></li>
      </ul>

      <div className='flex-1 justify-end'>
        <ConnectButton showBalance={false} />
      </div>
    </div>

  </header>
}
