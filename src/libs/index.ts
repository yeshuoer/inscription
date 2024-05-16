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
