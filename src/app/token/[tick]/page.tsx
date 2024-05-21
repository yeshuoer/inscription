import { log } from "@/libs";
import { fetchToken } from "@/libs/api";
import Image from "next/image";
import Link from "next/link";
import { Mint } from "./Mint";
import { formatDistanceToNow } from "date-fns";
import { RefreshButton } from "@/components/RefreshButton";


export default async function TokenDetialPage({params}: {params: {tick: string}}) {
  const data = await fetchToken(params.tick)
  const detail = data.data

  return <div className="w-full">
    <header className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        <Link href='/token'>
          <Image src='/arrow-back.svg' width={18} height={18} alt={'token'} />
        </Link>
        <p className="text-primary font-bold italic text-3xl ml-4">{detail.tick}</p>
      </div>
      <div className="flex items-center">
        <RefreshButton />
        <div className="w-4"></div>
        <Mint detail={detail} />
      </div>
    </header>

    <div className="flex items-center justify-between mb-12">
      <progress className="progress progress-secondary flex-grow" value={detail.minted} max={detail.max}></progress>
      <p className="text-secondary text-l w-32 text-right">{Number(detail.minted / detail.max * 100).toFixed(2)} %</p>
    </div>

    <div className="card w-full bg-secondary bg-opacity-85 text-base-100 shadow-xl p-4">
      <div className="flex justify-between items-center">
        <p className="text-2xl font-bold">Overview</p>
      </div>
      <hr className="my-6 border-white border-opacity-50" />

      <div>
        <div className="flex items-center justify-between mb-6">
          <p>Inscription ID</p>
          <p>{detail.hash}</p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <p>Total Supply</p>
          <p>{detail.max}</p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <p>Minted</p>
          <p>{detail.minted}</p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <p>Limit Per Mint</p>
          <p>{detail.limit}</p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <p>Deploy Time</p>
          <p>{formatDistanceToNow(detail.created_at * 1000, { addSuffix: true })}</p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <p>Holders</p>
          <p>{detail.holders}</p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <p>Total Trasactions</p>
          <p>{detail.trxs}</p>
        </div>
      </div>

    </div>

  </div>
}
