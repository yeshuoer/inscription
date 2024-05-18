import { log, parseRequest } from "@/libs";

// proxy to avoid broswer https strict
export async function GET(request: Request) {
  const {
    service,
    queryString,
  } = parseRequest(request)

  let url = `${process.env.GO_INDEXER_API}/${service}?${queryString}`
  log('url', url)
  const res = await fetch(url, {
    cache: 'no-store',
  })
  return res
}
