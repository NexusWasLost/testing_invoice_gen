import ApiError from "../utils/ApiError.js";
import itemModel from "../models/items.model.js";

export async function addItem(req, res, next){
    try{
        const {
            name, SKU, MPR, taxApplicable, notes
        } = req.body;

        if(await itemModel.findOne({ SKU: SKU }))
            throw new ApiError(409, "Item with this SKU already exists");

        const item = new itemModel({
            name: name,
            SKU: SKU,
            MRP: MPR,
            taxApplicable: taxApplicable || 18,
            notes: notes || null
        });
        await item.save();

        return res.status(201).json({
            success: true,
            message: "Item added successfully",
            data: item
        });
    }
    catch(error){
        return next(error);
    }
}
