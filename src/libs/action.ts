'use server'
import { log } from "."
import { connectToMongoDB } from "./db"
import { Order } from "./model"

export const fetchOrder = async (formData?: FormData) => {
  await connectToMongoDB()
  // const listId = formData.get('txhash')
  
  let a = await Order.find()
  log('aaa', a)
}
