'use client'

import { useAutoConnectForTransaction } from "@/hooks/useAutoConnectForTransaction"
import { log } from "@/libs";
import { ASC20Operation, OrderStatus } from "@/types"
import clsx from "clsx";
import { useState } from "react";
import toast from "react-hot-toast";
import { Address, numberToHex, parseEther, parseSignature, toBytes, toHex } from "viem";
import { sepolia } from "viem/chains";
import { useSendTransaction, useSignTypedData } from "wagmi"

interface Props {
  tick: string;
  amt: number;
}

export function List({
  tick,
  amt,
}: Props) {
  const { ensureConnected, accountRef } = useAutoConnectForTransaction()
  const { sendTransactionAsync } = useSendTransaction()
  const { signTypedDataAsync } = useSignTypedData()

  const [price, setPrice] = useState('')
  const [amount, setAmount] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const getCalldataContent = () => {
    const o = {
      p: process.env.NEXT_PUBLIC_INSCRIPTION_PROTOCOL,
      op: ASC20Operation.List,
      tick,
      amt: amount,
    }
    let s = JSON.stringify(o)
    s = `data:,${s}`
    return s
  }

  const handleSignature = async (txhash: Address) => {
    const listingTime = BigInt(Math.floor(Date.now() / 1000))
    const expirationTime = BigInt(4871333268)
    log('listing seller is', accountRef.current.address)

    const message = {
      seller: accountRef.current.address as Address,
      creator: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address,
      listId: txhash,
      ticker: tick,
      amount: BigInt(amount),
      price: BigInt(parseEther(price)),
      nonce: BigInt(0),
      listingTime,
      expirationTime,
      creatorFeeRate: 200,
      salt: 0,
      extraParams: toHex(0),
    }

    // eip712 sign
    const signature = await signTypedDataAsync({
      domain:{
          "name": "ASC20Market",
          "version": "1.0",
          "chainId": sepolia.id,
          "verifyingContract": process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address,
      },
      types: {
        ASC20Order: [
          { name: 'seller', type: 'address' },
          { name: 'creator', type: 'address' },
          { name: 'listId', type: 'bytes32' },
          { name: 'ticker', type: 'string' },
          { name: 'amount', type: 'uint256' },
          { name: 'price', type: 'uint256' },
          { name: 'nonce', type: 'uint256' },
          { name: 'listingTime', type: 'uint64' },
          { name: 'expirationTime', type: 'uint64' },
          { name: 'creatorFeeRate', type: 'uint16' },
          { name: 'salt', type: 'uint32' },
          { name: 'extraParams', type: 'bytes' },
        ]
      },
      primaryType: 'ASC20Order',
      message,
    })

    return {
      signature,
      message,
    }
  }

  const handleCreateOrder = async (listId: Address, signature: `0x${string}`, message: Record<string, any>) => {
    log('create p', listId, parseSignature(signature))
    log('message', message)
    const {
      v,
      r,
      s,
    } = parseSignature(signature)
    const inputJson = {
      ...message,
      amount: toHex(message.amount),
      expirationTime: Number(message.expirationTime),
      listingTime: Number(message.listingTime),
      nonce: '0',
      price: toHex(message.price),
    }
    const input = JSON.stringify(inputJson)
    const postData = {
      ...inputJson,
      status: OrderStatus.Listing,
      signature,
      input,
      vrs: {
        v: Number(v),
        r,
        s,
      },
    }

    const res = await fetch('/api/order', {
      method: 'POST',
      body: JSON.stringify(postData)
    })
    const data = await res.json()
    log('final data', data)
    if (data) {
      toast.success('List success!')
    }
  }

  const handleList = async () => {
    if (Number(amount) > amt) {
      toast.error('Token is not enough!')
      return
    }

    await ensureConnected()

    if (!accountRef.current.isConnected || !accountRef.current.address) {
      toast.error('Please connect your wallet.')
      return
    }

    const calldataContent = getCalldataContent()
    const calldata = toHex(calldataContent)

    // send tx
    const txhash = await sendTransactionAsync({
      to: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address,
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

    const {
      message,
      signature
    } = await handleSignature(txhash)

    handleCreateOrder(txhash, signature, message)

    setIsOpen(false)
  }

  return <>
    <button className="btn btn-outline btn-primary ml-2" onClick={() => setIsOpen(true)}>List</button>

    <dialog 
      className={clsx([
        'modal',
        isOpen && 'modal-open',
      ])}
    >
      <div className="modal-box">
        <div className="flex justify-start items-center text-xl">
          List
          <div className="text-xl text-primary ml-2">{tick}</div>
          <div className="badge mx-2">asc-20</div>
          for sale
        </div>

        <div className="w-full flex justify-center items-center pt-6 pb-10">
          <div className="border-2 border-secondary rounded-2xl px-4 pt-2">
            <p className="badge text-primary border-primary">{tick}</p>
            <p className="text-3xl font-bold m-8 text-primary">{amt}</p>
          </div>
        </div>

        <form method="dialog" className="w-full" onSubmit={() => handleList()}>
          <section className="flex items-center mb-6">
            <p className="w-1/2 text-xl">Price</p>
            <label className="input input-bordered flex items-center gap-2 w-full">
              <input required={isOpen} type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="grow" placeholder="" />
              ETH
            </label>
          </section>
          <section className="flex items-center mb-6">
            <p className="w-1/2 text-xl">Amount</p>
            <input required={isOpen} type="number" value={amount} max={amt} onChange={(e) => setAmount(e.target.value)} placeholder="" className="input input-bordered w-full max-w-xs" />
          </section>

          <section className="flex items-center mb-6">
            <p className="w-1/2 text-xl">Total Revenue</p>
            <p className="text-right text-2xl text-primary">{Number(price) * Number(amount)} ETH</p>
          </section>

          <div className="grid grid-cols-2 gap-3 w-full">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-outline mr-2 w-full" onClick={() => setIsOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary w-full">List</button>
          </div>
        </form>
      </div>
    </dialog>
  </>
}
