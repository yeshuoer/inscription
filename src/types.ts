export type ServerSideComponentProps = {
  searchParams?: Record<string, string | string[] | undefined>;
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
