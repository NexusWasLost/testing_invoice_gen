import { Router } from "express";

const orderRouter = Router();

import {

    createPendingOrder,
    verifyOrder

} from "../controllers/order.controller.js";

orderRouter.post("/create", createPendingOrder);
orderRouter.post("/verify", verifyOrder);

export default orderRouter;
