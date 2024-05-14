'use client'

import { log } from "@/libs"
import { useState } from "react"
import { useSendTransaction, useSignTypedData } from "wagmi"
import { ASC20Operation } from '@/types'
import { toHex } from "viem"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { useAutoConnectForTransaction } from "@/hooks/useAutoConnectForTransaction"


export function Deploy() {
  const router = useRouter()

  const { sendTransactionAsync } = useSendTransaction()
  const { signTypedDataAsync } = useSignTypedData()
  const {ensureConnected} = useAutoConnectForTransaction()

  const [tick, setTick] = useState('')
  const [max, setMax] = useState('')
  const [limit, setLimit] = useState('')

  const openModal = () => {
    const dom = document.getElementById('deploy_btn_modal') as any
    dom.showModal()
  }

  const getCalldataContent = () => {
    const o = {
      p: process.env.NEXT_PUBLIC_INSCRIPTION_PROTOCOL,
      op: ASC20Operation.Deploy,
      tick: tick,
      max: max,
      lim: limit,
    }
    let s = JSON.stringify(o)
    s = `data:,${s}`
    return s
  }

  const handleDeploy = async () => {
    if (!tick || !max || !limit) {
      return
    }

    const {
      connected,
      account,
    } = await ensureConnected()

    if (!connected || !account) {
      toast.error('Please connect your wallet.')
      return
    }

    const calldataContent = getCalldataContent()
    const calldata = toHex(calldataContent)

    // eip712 sign
    const signature = await signTypedDataAsync({
      types: {
        Address: [
          {name: 'address', type: 'address'},
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
          address: account,
        },
        'Interact with': {
          address: account,
        },
        data: calldata,
        utf8: calldataContent,
      },
    })

    // send tx
    const txhash = await sendTransactionAsync({
      to: account,
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

  return <>
    {/* Open the modal using document.getElementById('ID').showModal() method */}
    <button className="btn btn-primary btn-sm" onClick={() => openModal()}>Deploy</button>

    <dialog id="deploy_btn_modal" className="modal">
      <div className="modal-box">

        <div className="modal-action w-full">
          <form method="dialog" className="w-full" onSubmit={(e) => handleDeploy()}>
            <section className="flex items-center mb-6">
              <p className="w-1/2 text-xl">Protocol</p>
              <p className="w-full">ASC-20</p>
            </section>
            <section className="flex items-center mb-6">
              <p className="w-1/2 text-xl">Tick</p>
              <input required type="text" value={tick} onChange={(e) => setTick(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
            </section>
            <section className="flex items-center mb-6">
              <p className="w-1/2 text-xl">Total Supply</p>
              <input required type="number" value={max} onChange={(e) => setMax(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
            </section>
            <section className="flex items-center mb-6">
              <p className="w-1/2 text-xl">Limit Per Mint</p>
              <input required type="number" value={limit} onChange={(e) => setLimit(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
            </section>

            <div className="grid grid-cols-2 gap-3 w-full">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-outline mr-2 w-full">Cancel</button>
              <button type="submit" className="btn btn-primary w-full">Deploy</button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  </>
}
