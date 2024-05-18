import { OrderStatus } from "@/types";

export const log = console.log.bind(console, '🚗')

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// export const host = process.env.
export function orderStatusName(status: OrderStatus) {
  const mapper = new Map()
  mapper.set(OrderStatus.Pending, 'Pending')
  mapper.set(OrderStatus.Listing, 'Listing')
  mapper.set(OrderStatus.Canceled, 'Canceled')
  mapper.set(OrderStatus.Sold, 'Sold')
  return mapper.get(status)
}

export function parseRequest(request: Request): {
  service: string;
  queryString: string;
} {
  let service = ''
  let queryString = ''
  const { searchParams, pathname } = new URL(request.url)
  searchParams.forEach((v, k) => {
    queryString += `&${k}=${v}`
  })
  queryString = queryString.slice(1)
  service = pathname.split('/').reverse()[0]

  return {
    service,
    queryString,
  }
}
