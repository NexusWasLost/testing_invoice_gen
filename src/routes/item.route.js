import { Router } from "express";

const itemRouter = Router();

import {

    addItem,
    getAllItems

} from "../controllers/item.controller.js";

itemRouter.post("/add", addItem);
itemRouter.get("/fetch/all", getAllItems);

export default itemRouter;
