'use client'

import { log } from "@/libs";
import { useEffect } from "react";
import { useAccount } from "wagmi";

export default function MarketPage() {
  const {address} = useAccount({
    
  })

  useEffect(() => {
    log('newnew', address)
    setTimeout(() => {
      log('hehe', address)
    }, 2000);
  }, [])

  return <div>market</div>;
}
