import { Router } from "express";

const orderRouter = Router();

import {

    createPendingOrder,
    verifyOrder,
    getOrderStatus,
    rzpWebhook

} from "../controllers/order.controller.js";

orderRouter.post("/create", createPendingOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/webhook", rzpWebhook);
orderRouter.get("/status/:orderId", getOrderStatus);

export default orderRouter;
