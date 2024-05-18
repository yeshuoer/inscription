import { log, parseRequest } from "@/libs";

// proxy to avoid broswer https strict
export async function GET(request: Request) {
  let url = `${process.env.NEXT_PUBLIC_GO_INDEXER_API}/records?fromBlock=1&toBlock=100000000`
  log('url', url)
  const res = await fetch(url, {})
  const data = await res.json()
  log('debug 4', data)
  data.data = data.data.filter((record: any) => record.block > 0)
  return Response.json(data)
}
