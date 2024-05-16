'use client'

import { log } from "@/libs"
import { abi } from "@/libs/abi"
import { IOrderType } from "@/types"
import { Address } from "viem"
import { useAccount, useWriteContract } from "wagmi"

export function BuyButton() {
  const { address } = useAccount()
  const { data: hash, writeContractAsync } = useWriteContract()

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

  return <button className="btn btn-primary btn-outline w-full">Buy</button>
}