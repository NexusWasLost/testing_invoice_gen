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
            throw new ApiError(400, "Order is either pending or failed completely ! Cannot generate invoice for pending or failed orders !");

        const context = {
            name: ord.nameOnOrder,
            email: ord.email,
            items: ord.items.map(function (item) {
                const basePaise = item.sellingPrice * item.quantity;
                const taxPaise = Math.round(basePaise * (item.taxAtTimeOfPurchase / 100));
                const lineTotalPaise = basePaise + taxPaise;

                return {
                    name: item.itemName,
                    SKU: item.itemSKU,
                    quantity: item.quantity,
                    price: item.sellingPrice / 100,
                    taxApplicable: item.taxAtTimeOfPurchase,
                    taxAmount: taxPaise / 100,
                    lineTotal: lineTotalPaise / 100
                };
            }),
            //convert main totals from paise to rupees
            sub_total: ord.subtotal / 100,
            tax_total: ord.taxtotal / 100,
            total: ord.total / 100,
            invoiceId: ord.invoiceId,
            orderId: ord.orderId,
            orderDate: new Date(ord.invoiceIssuedAt || ord.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                timeZone: "Asia/Kolkata"
            }),
            paidUsing: ord.paidUsing
        };

        return res.render("invoice", context);
    }
    catch (error) {
        return next(error);
    }
}
