import { log, sleep } from "@/libs"
import { connectToMongoDB } from "@/libs/db"
import { Order } from "@/libs/model"

export async function POST(request: Request) {
  await connectToMongoDB()
  const body = await request.json()

  const a = await Order.updateOne({
    listId: body.listId
  }, body)

  return Response.json({
    data: a.acknowledged
  })
}
