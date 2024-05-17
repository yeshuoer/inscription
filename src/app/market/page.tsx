'use client'

import { log } from "@/libs";
import { list } from "postcss";
import { useEffect, useState } from "react";
import { Address, formatEther } from "viem";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { abi } from '@/libs/abi'
import Link from "next/link";
import Image from "next/image";

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


interface IMarketToken {
  _id: string;
  floorPrice: `0x${string}`;
  listingNum: number;
  totalSale: number;
}

export default function MarketPage() {
  const [list, setList] = useState([])

  const { data: hash, writeContractAsync } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const res = await fetch('/api/market', {
      cache: 'no-store',
    })
    const data = await res.json()
    const list = data.data
    log('list', list)
    setList(list)
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

    <table className="table">
      <thead>
        <tr>
          <th>Token</th>
          <th>Floor Price(ETH)</th>
          <th>Total Sales</th>
          <th>Listed</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {
          list.map((item: IMarketToken, index: number) => {
            return <tr key={item._id}>
              <td className="text-primary font-bold italic text-l">{item._id}</td>
              <td>{formatEther(BigInt(item.floorPrice))}</td>
              <td>
                {item.totalSale}
              </td>
              <td>{item.listingNum}</td>
              <td>
                <Link href={`/market/${item._id}`}>
                  <Image src="/circle-right.svg" alt="arrow-right" width={20} height={20} />
                </Link>
              </td>
            </tr>
          })
        }
      </tbody>
    </table>
  </div>;
}
