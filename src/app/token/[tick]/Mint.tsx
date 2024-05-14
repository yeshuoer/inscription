'use client'

import { log } from "@/libs"
import { useSendTransaction, useSignTypedData } from "wagmi"
import { ASC20Operation } from '@/types'
import { toHex } from "viem"
import toast from "react-hot-toast"
import { useAutoConnectForTransaction } from "@/hooks/useAutoConnectForTransaction"

interface Props {
  detail: {
    limit: number,
    tick: string,
    max: number,
    minted: number,
  }
}

export function Mint({ detail }: Props) {
  const { sendTransactionAsync } = useSendTransaction()
  const { signTypedDataAsync } = useSignTypedData()
  const {ensureConnected, accountRef} = useAutoConnectForTransaction()

  const getCalldataContent = () => {
    const amt = detail.max - detail.minted > detail.limit ? detail.limit : detail.max - detail.minted
    const o = {
      p: process.env.NEXT_PUBLIC_INSCRIPTION_PROTOCOL,
      op: ASC20Operation.Mint,
      tick: detail.tick,
      amt: String(amt),
    }
    let s = JSON.stringify(o)
    s = `data:,${s}`
    return s
  }

  const handleMint = async () => {
    await ensureConnected()

    if (!accountRef.current.isConnected || !accountRef.current.address) {
      toast.error('Please connect your wallet.')
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
          address: accountRef.current.address,
        },
        'Interact with': {
          address: accountRef.current.address,
        },
        data: calldata,
        utf8: calldataContent,
      },
    })
    
    // send tx
    const txhash = await sendTransactionAsync({
      to: accountRef.current.address,
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
        <span>Follow your transaction on </span>
        <a className="link link-info" href={url} target="_blank">{txhash}</a>
      </div>, {
      duration: 5000,
    })
  }

  return <div>
    <button className="btn btn-primary" onClick={() => handleMint()}>Mint Directly</button>
  </div>
}
