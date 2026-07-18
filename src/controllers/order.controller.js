import ApiError from "../utils/ApiError.js";
import itemModel from "../models/items.model.js";
import orderModel from "../models/orders.model.js";
import { razorpay } from "../config/config.js";

export async function createPendingOrder(req, res, next) {
    try {
        //orderItems is an array
        const { cartItems } = req.body;

        if (!cartItems || cartItems.length === 0) throw new ApiError(400, "Cart is empty");

        let orderItems = [];
        let total = 0;

        for (const i of cartItems) {
            const item = await itemModel.findById(i.itemId);
            if (!item) throw new ApiError(404, `Item ${ i.itemName } not found !`);

            console.log(item);
            const baseAmount = item.MRP * i.quantity;
            const taxAmount = baseAmount * (item.taxApplicable / 100);
            const totalAmount = baseAmount + taxAmount;
            //update global total
            total += totalAmount;

            orderItems.push({
                item: item._id,
                quantity: i.quantity,
                sellingPrice: item.MRP,
                taxAtTimeOfpurchase: item.taxApplicable || 18,
                MRPAtTimeOfPurchase: item.MRP
            });
        }

        console.log(orderItems);
        const options = {
            amount: total * 100,
            currency: "INR",
            invoice: "INV-001"
        }

        const orders = await razorpay.orders.create(options);
        if (!orders) throw new ApiError(500, "Failed to create Razorpay order !");

        return res.status(201).json({
            success: true,
            message: "Created razorpay order successfully",
            data: orders
        });
    }
    catch (error) {
        return next(error);
    }
}
