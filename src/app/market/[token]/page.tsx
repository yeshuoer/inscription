import { log, orderStatusName } from "@/libs"
import { IOrderType, OrderStatus, ServerSideComponentProps } from "@/types"
import { Address, formatEther, hexToBigInt } from "viem";
import { BuyButton } from "./Buy";
import Link from "next/link";
import Image from "next/image";
import { RefreshButton } from "@/components/RefreshButton";

interface ITokenItem {
  ticker: string;
  listId: Address;
  amount: `0x${string}`;
  price: `0x${string}`;
  status: OrderStatus;
}

const totalEther = (item: ITokenItem) => {
  let r = BigInt(item.price) * BigInt(item.amount)
  return formatEther(r)
}

export default async function MarketTokenPage({
  params: {
    token
  }
}: {
  params: {
    token: string;
  }
}) {
  const res = await fetch(`${process.env.API_BASE_URL}/api/order?ticker=${token}`, {
    method: 'GET',
    cache: 'no-store',
  })
  const data = await res.json()
  const list = data.data as any[]
  log('list', list)
  return <div>
    <header className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href='/market'>
            <Image src='/arrow-back.svg' width={18} height={18} alt={'token'} />
          </Link>
          <p className="text-primary font-bold italic text-3xl ml-4">{token}</p>
        </div>
        <RefreshButton />
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 justify-between">
        {list.map((item: ITokenItem, index) => {
          return (
            <div key={item.listId} className="card bg-secondary bg-opacity-85 shadow-xl min-w-56 ring-base-100">
              <div className="card-body w-full h-70 p-0 text-white">
                <div className="p-4">
                  <p className='badge p-3 text-primary'>{orderStatusName(item.status)}</p>
                  <p className="text-center text-3xl my-6">{Number(item.amount)}</p>
                  <p className="text-center">{formatEther(BigInt(item.price))} ETH / Per Mint</p>
                  <div>
                  </div>
                </div>

                <div className="bg-base-100 rounded-bl-2xl rounded-br-2xl py-4 px-4">
                  <div className="text-primary flex justify-between items-center mb-4">
                    <p>Total</p>
                    <p className="text-right font-bold">{totalEther(item)} ETH</p>
                  </div>
                  <BuyButton orderItem={item as IOrderType} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
  </div>

}
