'use client'

import Loading from "@/components/Loading";
import { log } from "@/utils";
import { fetchRecords } from "@/utils/api";
import Image from "next/image";
import { useEffect, useState } from "react";
import {formatDistanceToNow} from 'date-fns';

enum ASC20Operation {
  Deploy = 'deploy',
  Mint = 'mint',
  Transfer = 'transfer',
  List = 'list',
}

interface IASC20Protocol {
  tick: string;
  operation: ASC20Operation;
  amount: number;
  limit?: number;
}

type ASC20Record = IASC20Protocol & {
  id: number;
  timestamp: number
}

const formatContent = (item: ASC20Record) => {
  let o = {
    p: 'asc-20',
    op: item.operation,
    tick: item.tick,
    amt: item.amount,
  }
  type Protocal = typeof o & { limit?: number }
  const o1 = o as Protocal
  if (item.operation === ASC20Operation.Deploy) {
    o1.limit = item.limit
  }
  let r = JSON.stringify(o1, null, 2)
  return r
}

export default function Home() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    handleRefresh()
  }, [])

  const handleRefresh = () => {
    setLoading(true)
    fetchRecords(100000000).then(data => {
      setList(data.data)
      setLoading(false)
    }).catch(err => {
      setLoading(false)
    })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-primary text-xl font-bold">Latest Inscriptions</p>
        <button className="flex items-center cursor-pointer" onClick={handleRefresh} disabled={loading}>
          <div className="mr-2 text-primary">Refresh</div>
          <Image src="/sync.svg" alt="refresh" width={18} height={18} />
        </button>
      </div>

      {loading && <Loading />}

      {
        !loading && (
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 justify-between">
            {list.map((item: ASC20Record, index) => {
              return (
                <div key={item.id} className="card bg-stone-100 min-w-56 ring-2 ring-base-300 hover:ring-primary cursor-pointer">
                  <div className="card-body w-full h-70 p-0">
                    <pre className="p-6 h-full">
                      {formatContent(item)}
                    </pre>
                    <div className="bg-stone-200 rounded-bl-2xl rounded-br-2xl py-4 px-6">
                      {formatDistanceToNow(item.timestamp * 1000)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )
      }
    </div>
  );
}
