'use client'

import { log } from "@/libs"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { sepolia } from "viem/chains"
import { useAccount, useChainId, useClient, useConnect, useSendTransaction, useSwitchChain } from "wagmi"
import { injected } from "wagmi/connectors"
import { InscriptionOp } from '@/types'
import { toHex } from "viem"


export function Deploy() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { sendTransactionAsync, sendTransaction } = useSendTransaction()
  const client = useClient()
  const queryClient = useQueryClient()
  const { connectAsync } = useConnect()
  const { switchChainAsync } = useSwitchChain()

  const [tick, setTick] = useState('')
  const [max, setMax] = useState('')
  const [limit, setLimit] = useState('')

  const openModal = () => {
    const dom = document.getElementById('my_modal_1') as any
    dom.showModal()
  }

  const getCalldata = () => {
    if (!tick || !max || !limit) {
      return undefined
    }
    const o = {
      p: process.env.NEXT_PUBLIC_INSCRIPTION_PROTOCOL,
      op: InscriptionOp.Deploy,
      tick: tick,
      max: max,
      lim: limit,
    }
    let s = JSON.stringify(o)
    s = `data:,${s}`
    log('raw', s)
    return toHex(s)
  }

  const handleDeploy = async () => {
    const calldata = getCalldata()
    if (!calldata) {
      return
    }

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

    if (currentAccount) {
      sendTransaction({
        to: currentAccount,
        value: BigInt(0),
        data: calldata,
      })
    }
  }

  return <>
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
