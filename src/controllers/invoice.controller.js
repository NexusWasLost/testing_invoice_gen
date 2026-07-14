import ApiError from "../utils/apiError.js";

export async function renderInvoice(req, res, next) {
    try {
        const { name, price } = req.query;

        const basePrice = parseFloat(price || "100");
        const increasedPrice = basePrice + 50;
        const totalPrice = basePrice + increasedPrice;

        const context = {
            name: name || "Client Name",
            price: basePrice,
            increasedPrice,
            totalPrice
        };

        return res.render("invoice", context);
    }
    catch (error) {
        return next(error);
    }
}
