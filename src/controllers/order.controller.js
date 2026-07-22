import ApiError from "../utils/ApiError.js";
import itemModel from "../models/items.model.js";
import orderModel from "../models/orders.model.js";
import conf, { razorpay } from "../config/config.js";
import { getInvoiceId } from "../utils/invoiceIdGen.js";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";

export async function createPendingOrder(req, res, next) {
    try {
        //orderItems is an array
        const { cartItems } = req.body;

        if (!cartItems || cartItems.length === 0) throw new ApiError(400, "Cart is empty");

        let orderItems = [];
        let total = 0;

        for (const i of cartItems) {
            const item = await itemModel.findById(i.itemId);
            if (!item) throw new ApiError(404, `Item ${i.itemName} not found !`);

            const baseAmount = item.MRP * i.quantity;
            const taxAmount = baseAmount * (item.taxApplicable / 100);
            const totalAmount = baseAmount + taxAmount;
            //update global total
            total += totalAmount;

            orderItems.push({
                item: item._id,
                quantity: i.quantity,
                sellingPrice: item.MRP,
                taxAtTimeOfPurchase: item.taxApplicable || 18,
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
            total: Math.round(total * 100) / 100, //round to 2 decimal point
            invoiceId: getInvoiceId(),
            razorpayOrderId: orders.id
        });
        try {
            await ord.save();
        }
        catch (saveError) {
            console.error("ORPHANED RAZORPAY ORDER: Failed to save order to DB after razorpay order created: ", {
                razorpayOrderId: orders.id,
                amount: options.amount,
                cartItems: orderItems,
                DB_ERR: saveError.message
            });
            throw new ApiError(500, "Order was Not placed !");
        }

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

export async function verifyOrder(req, res, next) {
    try {
        const {
            razorpay_order_id, razorpay_payment_id, razorpay_signature
        } = req.body;

        if(!await orderModel.findOne({ razorpayOrderId: razorpay_order_id }))
            throw new ApiError(404, "No valid orders found with this razorpay order ID");

        const isValid = validatePaymentVerification(
            { order_id: razorpay_order_id, payment_id: razorpay_payment_id },
            razorpay_signature,
            conf.RZP_KEY_SECRET
        );

        if(!isValid)
            throw new ApiError(400, "Verification failed: Invalid Payment ID or signature provided !");

        return res.status(200).json({
            success: true,
            message: "Order verified successfully"
        });
    }
    catch (error) {
        return next(error);
    }
}
