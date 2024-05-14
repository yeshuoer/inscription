'use client'

import { useAccount } from "wagmi"

export function TransferButton() {
  const {address, isConnected} = useAccount()

  const handleTransfer = () => {
    
  }

  return <button className="btn btn-outline btn-primary" onClick={() => handleTransfer()}>Transfer</button>
}
