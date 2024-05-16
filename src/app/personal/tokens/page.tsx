'use client'

import { formatDistanceToNow } from 'date-fns';
import { log } from "@/libs";
import { fetchAddress, fetchRecords } from "@/libs/api";
import { Transfer } from './Tansfer'
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { List } from './List';

interface ListItem {
  tick: string;
  amt: number;
}

export default function PersonalInscriptionsPage() {
  const {address, isConnected} = useAccount()
  const [list, setList] = useState<ListItem[]>([])

  useEffect(() => {
    init()
  }, [address, isConnected])

  const init = async () => {
    if (isConnected && address) {
      const data = await fetchAddress(address)
      setList(data.data)
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 justify-between">
      {list.map((item: ListItem, index) => {
        return (
          <div key={item.tick} className="card bg-secondary bg-opacity-85 shadow-xl min-w-56 ring-base-100">
            <div className="card-body w-full h-70 p-0">
              <div className='px-6 py-4'>
                <p className='badge p-3 text-primary'>{item.tick}</p>
                <p className='w-full text-center my-8 text-3xl font-bold text-base-100'>{item.amt}</p>
              </div>

              <div className="bg-base-100 grid grid-cols-2 justify-between rounded-bl-2xl rounded-br-2xl py-4 px-4">
                <Transfer tick={item.tick} amt={item.amt} />
                <List tick={item.tick} amt={item.amt} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  );
}
