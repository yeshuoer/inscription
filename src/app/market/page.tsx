'use client'

import { log } from "@/libs";
import { list } from "postcss";
import { useEffect, useState } from "react";
import { Address, parseEther, toHex } from "viem";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import {abi} from '@/libs/abi'

interface IOrderType {
  seller: Address;
  creator: Address;
  listId: Address;
  ticker: string;
  amount: string;
  price: string;
  nonce: string;
  listingTime: number;
  expirationTime: number;
  creatorFeeRate: number;
  salt: number;
  extraParams: `0x${string}`;
  vrs: {
    v: number;
    r: `0x${string}`;
    s: `0x${string}`;
  }
}

export default function MarketPage() {
  const [list, setList] = useState([])
  const {address} = useAccount()

  const {data: hash, writeContractAsync} = useWriteContract()
  const {isLoading: isConfirming, isSuccess: isConfirmed} = useWaitForTransactionReceipt({
    hash
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const res = await fetch('/api/order')
    const data = await res.json()
    const list = data.data
    log('list', list)
    setList(list)
  }

  const handleExcuteOrder = async (item: IOrderType) => {
    if (!address) {
      return
    }

    const {
      seller,
      creator,
      listId,
      ticker,
      amount,
      price,
      nonce,
      listingTime,
      expirationTime,
      creatorFeeRate,
      salt,
      extraParams,
      vrs: {
        v,
        r,
        s,
      },
    } = item

    const sendWei = BigInt(amount) * BigInt(price)
    
    const txhash = await writeContractAsync({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address,
      abi,
      functionName: 'executeOrder',
      args: [{
        seller,
        creator,
        listId,
        ticker,
        amount: BigInt(amount),
        price: BigInt(price),
        nonce: BigInt(nonce),
        listingTime: BigInt(listingTime),
        expirationTime: BigInt(expirationTime),
        creatorFeeRate,
        salt,
        extraParams,
        v,
        r,
        s,
      }, address as Address],
      value: sendWei,
    })
    log('交易哈希', txhash)

    // todo change status
  }

  const handleCancelOrder = async (item: IOrderType) => {
    const {
      seller,
      creator,
      listId,
      ticker,
      amount,
      price,
      nonce,
      listingTime,
      expirationTime,
      creatorFeeRate,
      salt,
      extraParams,
      vrs: {
        v,
        r,
        s,
      },
    } = item
    
    const txhash = await writeContractAsync({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address,
      abi,
      functionName: 'cancelOrder',
      args: [{
        seller,
        creator,
        listId,
        ticker,
        amount: BigInt(amount),
        price: BigInt(price),
        nonce: BigInt(nonce),
        listingTime: BigInt(listingTime),
        expirationTime: BigInt(expirationTime),
        creatorFeeRate,
        salt,
        extraParams,
        v,
        r,
        s,
      }],
    })
    log('交易哈希', txhash)

    // todo change status
  }


  return <div>
    <div className="toast toast-top toast-center z-10">
      {
        isConfirming && <div className="alert alert-info">Waiting for confirmation...</div>
      }
      {
        isConfirmed && <div className="alert alert-success">Transaction confirmed.</div>
      }
    </div>

    <ul>
      {
        list.map((item: any, index: number) => {
          return <li className="w-1/2 bg-pink-100 p-2 m-2" key={item.listId}>
            <div className="bg-primary text-white">{index}</div>
            <button className="btn" onClick={() => handleCancelOrder(item)}>cancel</button>
            <button className="btn" onClick={() => handleExcuteOrder(item)}>execute</button>
            <pre>
              {JSON.stringify(item, null, 2)}
            </pre>
          </li>
        })
      }
    </ul>
  </div>;
}
