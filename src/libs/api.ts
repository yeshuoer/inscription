'use server'

import { Address } from "viem"
import { log } from "."
import { OrderStatus } from "@/types"

export const fetchRecords = async (toBlock: number) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_GO_INDEXER_API}/records?fromBlock=1&toBlock=${toBlock}`, {
    cache: 'no-store',
  })
  const data = await res.json()
  data.data = data.data.filter((record: any) => record.block > 0)
  return data
}

export const fetchTokens = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_GO_INDEXER_API}/tokens`, {
    cache: 'no-store',
  })
  const data = await res.json()
  return data
}

export const fetchToken = async (tick: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_GO_INDEXER_API}/token/${tick}`, {
    cache: 'no-store',
  })
  const data = await res.json()
  return data
}

export const fetchAddress = async (address: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_GO_INDEXER_API}/address/${address}`, {
    cache: 'no-store',
  })
  const data = await res.json()
  let list: any[] = []
  Object.entries(data.data).map(([key, value]) => {
    if (Number(value) > 0) {
      list.push({
        tick: key,
        amt: value,
      })
    }
  })
  data.data = list
  return data
}

export const changeOrderStatus = async (listId: Address, status: OrderStatus) => {
  const res = await fetch('/api/market/status', {
   method: 'POST',
   body: JSON.stringify({
     listId,
     status,
   })
 })
 return res
}