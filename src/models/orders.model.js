import { Schema, model } from "mongoose";

const orderItemSchema = new Schema({
    item: {
        type: Schema.ObjectId,
        ref: "item",
        required: true
    },
    itemName: {
        type: String,
        required: true
    },
    itemSKU: {
        type: String,
        required: true
    },
    quantity:{
        type: Number,
        min: 1,
        required: true
    },
    //SELLING PRICE IS TAX EXCLUSIVE (DOES NOT INCLUDE TAX)
    sellingPrice: {
        type: Number,
        min: 0,
        required: true
    },
    //populated from item model when the purchase is made
    taxAtTimeOfPurchase: {
        type: Number,
        min: 0,
        required: true
    },
    //populated from item model when the purchase is made
    basePriceAtTimeOfPurchase: {
        type: Number,
        min: 0,
        required: true
    },
    notes: {
        type: String
    }
},
{
    timestamps: false, _id: false
});

const orderSchema = new Schema({
    orderId: {
        type: String,
        required: true,
        unique: true,
        sparse: true
    },
    nameOnOrder: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    items: {
        type: [orderItemSchema],
    },
    subtotal: {
        type: Number,
        min: 0,
        required: true
    },
    taxtotal: {
        type: Number,
        min: 0,
        required: true
    },
    total: {
        type: Number,
        min: 0,
        required: true
    },
    status: {
        type: String,
        enum: ["PENDING", "CANCELLED", "COMPLETE"],
        default: "PENDING"
    },
    invoiceId:{
        type: String,
        unique: true,
        sparse: true
    },
    invoiceIssuedAt:{
        type: Date
    },
    paidUsing:{
        type: String,
        enum: ["netbanking", "card", "wallet"],
        default: null
    },
    razorpayOrderId: {
        type: String,
        unique: true
    },
    razorpayPaymentId: {
        type: String,
        unique: true,
        sparse: true
    }
},
{
    timestamps: true
});

const orderModel = model("order", orderSchema);
export default orderModel;
