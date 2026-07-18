import { Router } from "express";

const orderRouter = Router();

import {

    createPendingOrder

} from "../controllers/order.controller.js";

orderRouter.post("/create", createPendingOrder);

export default orderRouter;
