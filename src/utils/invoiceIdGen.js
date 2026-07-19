import { randomBytes } from "crypto";

export const getInvoiceId = function () {
    const randomPart = randomBytes(3).toString("hex").toUpperCase();
    return `INV-${randomPart}`;
};
