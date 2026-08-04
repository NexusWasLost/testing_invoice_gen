import { randomBytes } from "crypto";

export const getInvoiceId = function () {
    const randomPart = randomBytes(4).toString("hex").toUpperCase();
    return `PX_INV-${ randomPart }`;
};

export const getOrderId = function () {
    const randomPart = randomBytes(4).toString("hex").toUpperCase();
    return `PX_ORD-${ randomPart }`;
}
