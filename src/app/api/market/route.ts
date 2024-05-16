import { log, sleep } from "@/libs"
import { connectToMongoDB } from "@/libs/db"
import { Order } from "@/libs/model"
import { OrderStatus } from "@/types"

export async function GET(request: Request) {
  await connectToMongoDB()
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') || ''

  const matchOption = {}

  const data = await Order.aggregate([
    {
      $match: matchOption,
    },
    {
      $group: {
        _id: "$ticker",
        floorPrice: {
          $min: '$price',
        },
        highPrice: {
          $max: '$price',
        },
        listingNum: {
          $sum: {
            $cond: {
              if: {
                $eq: ["$status", OrderStatus.Listing],
              },
              then: 1,
              else: 0,
            }
          }
        },
        totalSale: {
          $sum: {
            $cond: {
              if: {
                $eq: ["$status", OrderStatus.Sold],
              },
              then: 1,
              else: 0,
            }
          }
        },
      },
    }
  ])
  return Response.json({ data })
}
