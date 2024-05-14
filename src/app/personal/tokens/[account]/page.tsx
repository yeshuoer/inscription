import { formatDistanceToNow } from 'date-fns';
import { log } from "@/libs";
import { fetchAddress, fetchRecords } from "@/libs/api";
import { RefreshButton } from '@/components/RefreshButton';
import { ASC20Operation, ServerSideComponentProps } from '@/types';

interface ListItem {
  tick: string;
  amt: number;
}

export default async function PersonalInscriptionsPage({
  params,
}: {params: {account: string}}) {
  const data = await fetchAddress(params.account)
  const list = data.data as ListItem[]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 justify-between">
      {list.map((item: ListItem, index) => {
        return (
          <div key={item.tick} className="card bg-secondary bg-opacity-85 text-base-100 shadow-xl min-w-56 ring-2 ring-base-300 hover:ring-primary cursor-pointer">
            <div className="card-body w-full h-70 p-0">
              <pre className="p-6 h-full">
                {item.amt}
              </pre>
              <div className="bg-base-100 flex justify-between rounded-bl-2xl rounded-br-2xl py-4 px-6">
                <button>Transfer</button>
                <button>List</button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  );
}
