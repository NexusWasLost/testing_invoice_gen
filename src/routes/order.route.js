import { Router } from "express";

const orderRouter = Router();

import {

    createPendingOrder,
    verifyOrder,
    rzpWebhook

} from "../controllers/order.controller.js";

orderRouter.post("/create", createPendingOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/webhook", rzpWebhook);

export default orderRouter;
