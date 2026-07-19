import ApiError from "../utils/ApiError.js";
import itemModel from "../models/items.model.js";
import orderModel from "../models/orders.model.js";
import { razorpay } from "../config/config.js";
import { getInvoiceId } from "../utils/invoiceIdGen.js";

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

        const options = {
            amount: Math.round(total * 100),
            currency: "INR"
        }

        const orders = await razorpay.orders.create(options);
        if (!orders) throw new ApiError(500, "Failed to create Razorpay order !");

        const ord = new orderModel({
            items: orderItems,
            total: Math.round(total),
            invoiceId: getInvoiceId(),
            razorpayOrderId: orders.id
        });
        await ord.save();

        return res.status(201).json({
            success: true,
            message: "Created razorpay order successfully",
            data: ord
        });
    }
    catch (error) {
        return next(error);
    }
}
