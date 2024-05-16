'use client'

import Confirming from "@/components/Confirming"
import { log } from "@/libs"
import { abi } from "@/libs/abi"
import { changeOrderStatus } from "@/libs/api"
import { IOrderType, OrderStatus } from "@/types"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Address } from "viem"
import { useAccount, useWriteContract } from "wagmi"

export function CancelButton({
  orderItem,
}: {
  orderItem: IOrderType
}) {
  const { writeContractAsync, isSuccess, isPending } = useWriteContract()
  const router = useRouter()

  useEffect(() => {
    const fn = async () => {
      if (isSuccess) {
        const res = await changeOrderStatus(orderItem.listId, OrderStatus.Canceled)
        const data = await res.json()
        if (data.data) {
          router.refresh()
        }
      }
    }
    fn()
  }, [isSuccess])

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

  return <>
    <Confirming isConfirmed={isSuccess} isConfirming={isPending} />
    <button
      disabled={orderItem.status !== OrderStatus.Listing}
      onClick={() => handleCancelOrder(orderItem)}
      className="btn btn-primary btn-outline w-full"
    >Cancel</button>
  </>
}
