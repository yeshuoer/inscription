'use client'

import { log } from "@/libs"
import { useState } from "react"
import { sepolia } from "viem/chains"
import { useAccount, useChainId, useConnect, useSendTransaction, useSignTypedData, useSwitchChain } from "wagmi"
import { injected } from "wagmi/connectors"
import { InscriptionOp } from '@/types'
import { toHex } from "viem"
import toast, { ToastBar, Toaster } from "react-hot-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Props {
  detail: {
    limit: number,
    tick: string,
    max: number,
    minted: number,
  }
}

export function Mint({ detail }: Props) {
  const router = useRouter()

  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { sendTransactionAsync } = useSendTransaction()
  const { connectAsync } = useConnect()
  const { switchChainAsync } = useSwitchChain()
  const { signTypedDataAsync } = useSignTypedData()

  const [scanurl, setScanurl] = useState<string>('')

  const getCalldataContent = () => {
    const amt = detail.max - detail.minted > detail.limit ? detail.limit : detail.max - detail.minted
    const o = {
      p: process.env.NEXT_PUBLIC_INSCRIPTION_PROTOCOL,
      op: InscriptionOp.Mint,
      tick: detail.tick,
      amt: String(amt),
    }
    let s = JSON.stringify(o)
    s = `data:,${s}`
    return s
  }

  const handleMint = async () => {
    // check all vilad
    let currentChainId = chainId
    let currentAccount = address

    if (!isConnected) {
      const connectedData = await connectAsync({
        connector: injected(),
        chainId: sepolia.id,
      })
      currentChainId = connectedData.chainId
      currentAccount = connectedData.accounts[0]
    }

    if (currentChainId !== sepolia.id) {
      await switchChainAsync({
        chainId: sepolia.id,
      })
    }

    if (!currentAccount) {
      return
    }

    const calldataContent = getCalldataContent()
    const calldata = toHex(calldataContent)

    // eip712 sign
    const signature = await signTypedDataAsync({
      types: {
        Address: [
          { name: 'address', type: 'address' },
        ],
        Confirm: [
          { name: 'Wallet used', type: 'Address' },
          { name: 'Interact with', type: 'Address' },
          { name: 'data', type: 'string' },
          { name: 'utf8', type: 'string' },
        ]
      },
      primaryType: 'Confirm',
      message: {
        'Wallet used': {
          address: currentAccount,
        },
        'Interact with': {
          address: currentAccount,
        },
        data: calldata,
        utf8: calldataContent,
      },
    })

    // send tx
    const txhash = await sendTransactionAsync({
      to: currentAccount,
      value: BigInt(0),
      data: calldata,
    }, {
      onError: error => {
        toast.error(error.message)
      },
    })
    const url = process.env.NEXT_PUBLIC_ETHERSCAN_URL + txhash
    toast.custom(
      <div role="alert" className="alert w-auto mt-16">
        <a className="link link-info" href={url} target="_blank">{txhash}</a>
      </div>, {
      duration: 5000,
    })
  }

  return <div>
    <button className="btn btn-primary" onClick={() => handleMint()}>Mint Directly</button>
  </div>
}
