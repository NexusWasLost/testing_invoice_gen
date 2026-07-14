import { Router } from "express";

import {

    renderInvoice

} from "../controllers/invoice.controller.js";

const invoiceRouter = Router();

invoiceRouter.get("/", renderInvoice);

export default invoiceRouter;
