import { formatDistanceToNow } from 'date-fns';
import { log } from "@/libs";
import { fetchRecords } from "@/libs/api";
import { RefreshButton } from '@/components/RefreshButton';
import { auth } from '@/auth';

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

export default async function InscriptionPage() {
  const session = await auth()
  log('sss', session)
  const data = await fetchRecords(100000000)
  const list = data.data as ASC20Record[]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-primary text-xl font-bold">Latest Inscriptions</p>
        <RefreshButton />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 justify-between">
        {list.map((item: ASC20Record, index) => {
          return (
            <div key={item.id} className="card bg-stone-100 min-w-56 ring-2 ring-base-300 hover:ring-primary cursor-pointer">
              <div className="card-body w-full h-70 p-0">
                <pre className="p-6 h-full">
                  {formatContent(item)}
                </pre>
                <div className="bg-stone-200 rounded-bl-2xl rounded-br-2xl py-4 px-6">
                  {formatDistanceToNow(item.timestamp * 1000, { addSuffix: true })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}