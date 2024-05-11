import { log } from "."

export const fetchRecords = async (toBlock: number) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_GO_API}/records?fromBlock=1&toBlock=${toBlock}`)
  const data = await res.json()
  return data
}
