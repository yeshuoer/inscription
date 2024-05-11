'use client'

import { log } from "@/utils";
import { fetchRecords } from "@/utils/api";
import { useEffect, useState } from "react";

enum ASC20Operation {
  Deploy='deploy',
  Mint='mint',
  Transfer='transfer',
  List='list',
}

interface IASC20Protocol {
  tick: string;
  operation: ASC20Operation;
  amount: number;
  limit?: number;
}

type ASC20Record = IASC20Protocol & {
  id: number;
}

export default function Home() {
  const [list, setList] = useState([])

  useEffect(() => {
    fetchRecords(100000000).then(data => {
      setList(data.data)
    })
  }, [])

  return (
    <main className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 justify-between p-4">
      {list.map((item: ASC20Record, index) => {
        return (
          <div key={item.id} className="card bg-stone-100 min-w-56 ring-2 ring-base-300 hover:ring-primary cursor-pointer">
            <div className="card-body w-full p-0">
              <div className="p-6">

              {item.id}
              </div>
              <div className="bg-stone-200 rounded-bl-2xl rounded-br-2xl py-4 px-6">465</div>
            </div>
          </div>
        )
      })}
    </main>
  );
}
