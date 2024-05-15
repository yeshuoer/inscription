'use client'

import { useAutoConnectForTransaction } from "@/hooks/useAutoConnectForTransaction"
import { ASC20Operation } from "@/types"
import clsx from "clsx";
import { useState } from "react";
import toast from "react-hot-toast";
import { toHex } from "viem";
import { useSendTransaction, useSignTypedData } from "wagmi"

interface Props {
  tick: string;
  amt: number;
}

export function Transfer({
  tick,
  amt,
}: Props) {
  const { ensureConnected, accountRef } = useAutoConnectForTransaction()
  const { sendTransactionAsync } = useSendTransaction()
  const { signTypedDataAsync } = useSignTypedData()

  const [toAddress, setToAddress] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const getCalldataContent = () => {
    const o = {
      p: process.env.NEXT_PUBLIC_INSCRIPTION_PROTOCOL,
      op: ASC20Operation.Transfer,
      tick,
      amt: toAmount,
    }
    let s = JSON.stringify(o)
    s = `data:,${s}`
    return s
  }

  const handleTransfer = async () => {
    if (Number(toAmount) > amt) {
      toast.error('Token is not enough!')
      return
    }

    if (!toAddress) {
      return
    }

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
        Transfer: [
          { name: 'Wallet used', type: 'Address' },
          { name: 'Transfer to', type: 'Address' },
          { name: 'data', type: 'string' },
          { name: 'utf8', type: 'string' },
        ]
      },
      primaryType: 'Transfer',
      message: {
        'Wallet used': {
          address: accountRef.current.address,
        },
        'Transfer to': {
          address: toAddress as `0x${string}`,
        },
        data: calldata,
        utf8: calldataContent,
      },
    })

    // send tx
    const txhash = await sendTransactionAsync({
      to: toAddress as `0x${string}`,
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

    setIsOpen(false)
  }

  return <>
    <button className="btn btn-outline btn-primary" onClick={() => setIsOpen(true)}>Transfer</button>

    <dialog 
      className={clsx([
        'modal',
        isOpen && 'modal-open',
      ])}
    >
      <div className="modal-box">
        <div className="flex justify-start items-center text-xl">
          Transfer
          <div className="text-xl text-primary ml-2">{tick}</div>
          <div className="badge mx-2">asc-20</div>
          to address
        </div>

        <div className="w-full flex justify-center items-center pt-6 pb-10">
          <div className="border-2 border-secondary rounded-2xl px-4 pt-2">
            <p className="badge text-primary border-primary">{tick}</p>
            <p className="text-3xl font-bold m-8 text-primary">{amt}</p>
          </div>
        </div>

        <form method="dialog" className="w-full" onSubmit={() => handleTransfer()}>
          <section className="flex items-center mb-6">
            <p className="w-1/2 text-xl">Amount</p>
            <input required={isOpen} type="number" value={toAmount} max={amt} onChange={(e) => setToAmount(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
          </section>
          <section className="flex items-center mb-6">
            <p className="w-1/2 text-xl">To</p>
            <input required={isOpen} type="text" value={toAddress} onChange={(e) => setToAddress(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
          </section>

          <div className="grid grid-cols-2 gap-3 w-full">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-outline mr-2 w-full" onClick={() => setIsOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary w-full">Transfer</button>
          </div>
        </form>
      </div>
    </dialog>
  </>
}
