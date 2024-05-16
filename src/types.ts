import { Address } from "viem";

export type ServerSideComponentProps<T=undefined, K=undefined> = {
  params?: T,
  searchParams?: K;
}

export enum ASC20Operation {
  Deploy = 'deploy',
  Mint = 'mint',
  Transfer = 'transfer',
  List = 'list',
}

export enum OrderStatus {
  Pending = 0,
  Listing = 1,
  Sold = 2,
  Canceled = 3,
}

export interface IOrderType {
  seller: Address;
  creator: Address;
  listId: Address;
  ticker: string;
  amount: string;
  price: string;
  nonce: string;
  listingTime: number;
  expirationTime: number;
  creatorFeeRate: number;
  salt: number;
  extraParams: `0x${string}`;
  vrs: {
    v: number;
    r: `0x${string}`;
    s: `0x${string}`;
  }
}
