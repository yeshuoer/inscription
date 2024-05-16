import mongoose from 'mongoose'

export const orderSchema = new mongoose.Schema({
    // id: {
    //     type: String,
    //     // 唯一索引
    //     unique: true
    // },
    seller: String, // 0x
    creator: String,    // 0x contract address
    listId: {
        type: String,
        unique: true,
    }, // 0x txid
    ticker: String,
    amount: String,    // 0xa hex
    price: {
        type: String,
        default: '0',
    },  // 0xa32ef4 hex wei
    nonce: {
        type: String,
        default: '0',
    }, // '0'
    listingTime: Number,    // seconds
    expirationTime: {
        type: Number,
        default: 4871333268,
    },   // seconds
    updateDate: {
        type: Date,
        default: Date.now,
    },
    creatorFeeRate: {
        type: Number,
        default: 0,
    },  // 200 = 0.2%
    salt: Number,
    extraParams: {
        type: String,
        default: '0x00',
    },
    input: String,
    status: {
        type: Number,
        default: 0,
    },
    signature: String,
    vrs: {
        v: Number,
        r: String,
        s: String,
    }
});