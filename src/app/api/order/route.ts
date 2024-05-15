import { log, sleep } from "@/libs"
import { connectToMongoDB } from "@/libs/db"
import { Order } from "@/libs/model"
import { Address } from "viem"

export async function GET(request: Request) {
  await connectToMongoDB()
  const { searchParams } = new URL(request.url)
  const data = await Order.findOne({
    listId: searchParams.get('listId')
  })
  return Response.json({ data })
}

const fetchUntilGot = async (listId: Address, times: number): Promise<null | Record<string, any>> => {
  if (times > 5) {
    return null
  }

  const data = await Order.findOne({
    listId,
  })

  if (data) {
    return data
  } else {
    await sleep(3000)
    log('refetch', times)
    return fetchUntilGot(listId, times+1)
  }
}

export async function POST(request: Request) {
  await connectToMongoDB()
  const body = await request.json()
  const data = await fetchUntilGot(body.listId, 0)
  log('post data', data)

  return Response.json({
    data
  })
}
