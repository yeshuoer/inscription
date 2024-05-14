'use client'

import { formatDistanceToNow } from 'date-fns';
import { log } from "@/libs";
import { fetchAddress, fetchRecords } from "@/libs/api";
import { RefreshButton } from '@/components/RefreshButton';
import { Transfer } from './Tansfer'
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useAutoConnectForTransaction } from '@/hooks/useAutoConnectForTransaction';

interface ListItem {
  tick: string;
  amt: number;
}

export default function PersonalInscriptionsPage() {
  const [list, setList] = useState<ListItem[]>([])
  const {ensureConnected} = useAutoConnectForTransaction()

  useEffect(() => {
    init()
  }, [])
  
  const init = async () => {
    const {
      connected,
      account,
    } = await ensureConnected()
    if (account) {
      const data = await fetchAddress(account)
      setList(data.data)
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 justify-between">
      {list.map((item: ListItem, index) => {
        return (
          <div key={item.tick} className="card bg-secondary bg-opacity-85 shadow-xl min-w-56 ring-base-100 hover:ring-primary hover:ring-2 cursor-pointer">
            <div className="card-body w-full h-70 p-0">
              <div className='px-6 py-4'>
                <p className='badge p-3'>{item.tick}</p>
                <p className='w-full text-center my-8 text-3xl font-bold text-base-100'>{item.amt}</p>
              </div>

              <div className="bg-base-100 flex justify-between rounded-bl-2xl rounded-br-2xl py-4 px-6">
                <Transfer tick={item.tick} amt={item.amt} />
                <button>List</button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  );
}
