export type ServerSideComponentProps = {
  searchParams?: Record<string, string | string[] | undefined>;
}

export enum ASC20Operation {
  Deploy = 'deploy',
  Mint = 'mint',
  Transfer = 'transfer',
  List = 'list',
}
