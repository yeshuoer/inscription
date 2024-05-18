import { log, sleep } from "@/libs"
import { connectToMongoDB } from "@/libs/db"
import { Order } from "@/libs/model"
import { OrderStatus } from "@/types";
import { Address } from "viem"

interface IFilter {
  ticker?: string;
  seller?: Address;
  status?: OrderStatus;
}

export async function GET(request: Request) {
  await connectToMongoDB()
  const { searchParams } = new URL(request.url)
  const o: IFilter = {}
  const ticker = searchParams.get('ticker')
  if (ticker) {
    o.ticker = ticker
  }
  const seller = searchParams.get('seller')
  if (seller) {
    o.seller = seller as Address
  }
  const status = searchParams.get('status')
  if (status) {
    o.status = Number(status)
  }
  log('o', o)
  const data = await Order.find(o)
  return Response.json({ data })
}

const keepLookUntilExist = async (listId: Address, times: number): Promise<boolean> => {
  if (times > 50) {
    return false
  }

  const data = await Order.findOne({
    listId,
  })

  if (data) {
    return true
  } else {
    await sleep(5000)
    log('refetch', times)
    return keepLookUntilExist(listId, times+1)
  }
}

export async function POST(request: Request) {
  await connectToMongoDB()
  const body = await request.json()
  const existed = await keepLookUntilExist(body.listId, 0)
  let r = false
  if (existed) {
    log('存在')
    const a = await Order.updateOne({
      listId: body.listId
    }, body)
    r = a.acknowledged
  }

  return Response.json({
    data: r
  })
}

export const config = {
  maxDuration: 60,
};
