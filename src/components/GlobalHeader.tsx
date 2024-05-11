'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function GlobalHeader() {
  const pathname = usePathname()

  const activeClassName = (link: string) => {
    return link === pathname ? 'tab tab-active' : 'tab'
  }

  return <header>
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl italic text-primary">Inscription Market</a>
      </div>

      <ul role='tablist' className='tabs tabs-boxed flex-1'>
        <li role='tab' className={activeClassName('/')}><Link href="/">Inscriptions</Link></li>
        <li role='tab' className={activeClassName('/tokens')}><Link href="/tokens">Tokens</Link></li>
        <li role='tab' className={activeClassName('/market')}><Link href="/market">Marketplace</Link></li>
      </ul>

      <div className='flex-1 justify-end'>
        <ConnectButton showBalance={false} />
      </div>
    </div>

  </header>
}
