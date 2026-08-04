import ApiError from "../utils/ApiError.js";
import itemModel from "../models/items.model.js";
import orderModel from "../models/orders.model.js";
import conf, { razorpay } from "../config/config.js";
import { getInvoiceId, getOrderId } from "../utils/idGen.js";
import { validatePaymentVerification, validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils.js";

export async function createPendingOrder(req, res, next) {
    try {
        //orderItems is an array
        const { nameOnOrder, email, cartItems } = req.body;

        if (!nameOnOrder || !email)
            throw new ApiError(400, "Name on order and email is required !");

        if (!cartItems || cartItems.length === 0) throw new ApiError(400, "Cart is empty");

        let orderItems = [];
        let subtotal = 0;
        let total = 0;

        for (const i of cartItems) {
            const item = await itemModel.findById(i.itemId);
            if (!item) throw new ApiError(404, `Item ${i.itemName} not found !`);

            const baseAmount = item.MRP * i.quantity;
            const taxAmount = baseAmount * (item.taxApplicable / 100);
            const totalAmount = baseAmount + taxAmount;
            //update global subtotal
            subtotal += baseAmount;
            //update global total
            total += totalAmount;

            orderItems.push({
                item: item._id,
                itemName: item.name,
                itemSKU: item.SKU,
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
            orderId: getOrderId(),
            nameOnOrder: nameOnOrder,
            email: email,
            items: orderItems,
            subtotal: Math.round(subtotal * 100) / 100,
            total: Math.round(total * 100) / 100, //round to 2 decimal point
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

        const ord = await orderModel.findOne({ razorpayOrderId: razorpay_order_id }).select("_id");
        if (!ord) throw new ApiError(404, "No valid orders found with this razorpay order ID");

        // console.log(ord);
        const isValid = validatePaymentVerification(
            { order_id: razorpay_order_id, payment_id: razorpay_payment_id },
            razorpay_signature,
            conf.RZP_KEY_SECRET
        );

        if (!isValid)
            throw new ApiError(400, "Verification failed: Invalid Payment ID or signature provided !");

        return res.status(200).json({
            success: true,
            message: "Order verified successfully",
            data: { orderId: (ord._id).toString() || null }
        });
    }
    catch (error) {
        return next(error);
    }
}

export async function rzpWebhook(req, res, next) {
    try {
        const signature = req.headers["x-razorpay-signature"];
        const isValid = await validateWebhookSignature(
            JSON.stringify(req.body),
            signature,
            conf.RZP_WEBHOOK_SECRET
        );

        if (!isValid) throw new ApiError(500, "Webhook signature verification failed !");

        res.status(200).send("OK");

        try {
            const { event, payload } = req.body;
            switch (event) {
                case "payment.authorized":
                    break;

                case "payment.captured":
                    break;

                case "payment.failed":
                    break;

                case "order.paid":
                    const updatedOrd = await orderModel.findOneAndUpdate(
                        {
                            razorpayOrderId: payload.order.entity.id,
                            status: "PENDING"
                        },
                        {
                            status: "COMPLETE",
                            razorpayPaymentId: payload.payment.entity.id,
                            invoiceId: getInvoiceId(),
                            invoiceIssuedAt: new Date(),
                            paidUsing: payload.payment.entity.method
                        },
                        { returnDocument: "after", runValidators: true }
                    );

                    break;

                default:
                    break;
            }
        }
        catch (error) {
            console.error("ERROR OCCURED WHILE PROCESSING WEBHOOK:", error);
            return;
        }
    }
    catch (error) {
        return next(error);
    }
}

export async function getOrderStatus(req, res, next){
    try{
        const orderId = req.params["orderId"];
        if(!orderId) throw new ApiError(400, "A valid order ID is needed to check order status !");

        const ord = await orderModel.findById(orderId).select("status");
        if(!ord) throw new ApiError(404, "No valid orders found with this order ID !");

        let stat = "NOT_PAID";
        if(ord.status === "COMPLETE") stat = "PAID";

        return res.status(200).json({
            success: true,
            message: "Fetched order status successfully",
            data: stat
        });
    }
    catch(error){
        return next(error);
    }
}
