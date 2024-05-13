'use client'

import { log } from "@/libs"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { sepolia } from "viem/chains"
import { useAccount, useChainId, useConnect, useSendTransaction, useSignTypedData, useSwitchChain } from "wagmi"
import { injected } from "wagmi/connectors"
import { InscriptionOp } from '@/types'
import { toHex } from "viem"
import toast, { Toaster } from "react-hot-toast"
import { useRouter } from "next/navigation"


export function Deploy() {
  const router = useRouter()

  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { sendTransactionAsync } = useSendTransaction()
  const { connectAsync } = useConnect()
  const { switchChainAsync } = useSwitchChain()
  const { signTypedDataAsync } = useSignTypedData()

  const [tick, setTick] = useState('')
  const [max, setMax] = useState('')
  const [limit, setLimit] = useState('')

  const openModal = () => {
    const dom = document.getElementById('my_modal_1') as any
    dom.showModal()
  }

  const getCalldataContent = () => {
    const o = {
      p: process.env.NEXT_PUBLIC_INSCRIPTION_PROTOCOL,
      op: InscriptionOp.Deploy,
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
    await sendTransactionAsync({
      to: currentAccount,
      value: BigInt(0),
      data: calldata,
    })

    toast.success('Deploy success!')
    router.refresh()
  }

  return <>
    <Toaster />
    {/* Open the modal using document.getElementById('ID').showModal() method */}
    <button className="btn btn-primary btn-sm" onClick={() => openModal()}>Deploy</button>

    <dialog id="my_modal_1" className="modal">
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
