import { Router } from "express";

const itemRouter = Router();

import {

    addItem

} from "../controllers/item.controller.js";

itemRouter.post("/add", addItem);

export default itemRouter;
