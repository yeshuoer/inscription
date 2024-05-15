'use client'

import { log } from "@/libs";
import { list } from "postcss";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export default function MarketPage() {
  const [list, setList] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const res = await fetch('/api/order')
    const data = await res.json()
    const list = data.data
    log('list', list)
    setList(list)
  }

  return <div>
    <ul>
      {
        list.map((item: any, index: number) => {
          return <li className="w-1/2 bg-pink-100 p-2 m-2" key={item.listId}>
            <div className="bg-primary text-white">{index}</div>
            <pre>
              {JSON.stringify(item, null, 2)}
            </pre>
          </li>
        })
      }
    </ul>
  </div>;
}
