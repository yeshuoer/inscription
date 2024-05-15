import { log, sleep } from "@/libs"
import { connectToMongoDB } from "@/libs/db"
import { Order } from "@/libs/model"
import { Address } from "viem"

export async function GET(request: Request) {
  await connectToMongoDB()
  const { searchParams } = new URL(request.url)
  // const data = await Order.findOne({
  //   listId: searchParams.get('listId')
  // })
  const data = await Order.find({})
  return Response.json({ data })
}

const keepLookUntilExist = async (listId: Address, times: number): Promise<boolean> => {
  if (times > 100) {
    return false
  }

  const data = await Order.findOne({
    listId,
  })

  if (data) {
    return true
  } else {
    await sleep(3000)
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
