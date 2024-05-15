import mongoose, { Document, Model, model } from 'mongoose'
import { orderSchema } from './schema'

// unused
export interface IOrder {
  id: mongoose.Types.ObjectId;
  seller: `0x${string}`;
  creator: `0x${string}`;
  listId: `0x${string}`;
  ticker: string;
  amount: `0x${string}`;
  price: `0x${string}`;
  nonce: string;
  listingTime: number;
  expirationTime: number;
  creatorFeeRate: number;
  salt: number;
  extraParams: `0x${string}`;
  input: string;
  status: number;
  signature: string;
  vrs: {
    v: number;
    r: string;
    s: string;
  }
}

export const Order = mongoose.models?.order || model('order', orderSchema, 'orders')
