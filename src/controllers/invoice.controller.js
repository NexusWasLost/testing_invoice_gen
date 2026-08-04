import ApiError from "../utils/ApiError.js";
import orderModel from "../models/orders.model.js";

export async function renderInvoice(req, res, next) {
    try {
        const { orderId } = req.query;
        if (!orderId) throw new ApiError(400, "Order ID is required to generate Invoice !");

        //find the order
        const ord = await orderModel.findById(orderId);
        if (!ord) throw new ApiError(404, "No valid orders found with this order ID !");

        if (ord.status === "PENDING" || ord.status === "FAILED")
            throw new ApiError(400, "Order is either pending or failed completely ! Cannot generated invoice for pending or failed orders !");

        const context = {
            name: ord.nameOnOrder,
            email: ord.email,
            items: ord.items.map(function (item) {
                const base = item.sellingPrice * item.quantity;
                const tax = base * (item.taxAtTimeOfPurchase / 100);

                return {
                    name: item.itemName,
                    SKU: item.itemSKU,
                    quantity: item.quantity,
                    price: item.sellingPrice,
                    taxApplicable: item.taxAtTimeOfPurchase,
                    lineTotal: Math.round((base + tax) * 100) / 100
                }
            }),
            sub_total: ord.subtotal,
            total: ord.total,
            invoiceId: ord.invoiceId,
            orderId: ord.orderId,
            orderDate: ord.invoiceIssuedAt,
            paidUsing: ord.paidUsing
        }

        return res.render("invoice", context);
    }
    catch (error) {
        return next(error);
    }
}
