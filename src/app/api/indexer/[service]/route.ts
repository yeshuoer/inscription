import { log, parseRequest } from "@/libs";

// proxy to avoid broswer https strict
export async function GET(request: Request) {
  log('debug 1')
  const {
    service,
    queryString,
  } = parseRequest(request)
  log('debug 2')

  let url = `${process.env.NEXT_PUBLIC_GO_INDEXER_API}/${service}?${queryString}`
  log('url', url)
  const res = await fetch(url, {
    cache: 'no-store',
  })
  return res
}
