import { Schema, model } from "mongoose";

const orderItemSchema = new Schema({
    item: {
        type: Schema.ObjectId,
        ref: "item",
        required: true
    },
    quantity:{
        type: Number,
        min: 1,
        required: true
    },
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
    MRPAtTimeOfPurchase: {
        type: Number,
        min: 0,
        required: true
    },
    notes: {
        type: String
    }
},
{
    timestamps: true, _id: false
});

const orderSchema = new Schema({
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
    total: {
        type: Number,
        min: 0
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
