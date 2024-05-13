export type ServerSideComponentProps = {
  searchParams?: Record<string, string | undefined>;
}

export enum InscriptionOp {
  Deploy='deploy',
  Mint='mint',
  Transfer='transfer',
  List='list',
}
