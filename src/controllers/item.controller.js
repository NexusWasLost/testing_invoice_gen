import ApiError from "../utils/ApiError.js";
import itemModel from "../models/items.model.js";

export async function addItem(req, res, next){
    try{
        const {
            name, SKU, MRP, taxApplicable, notes
        } = req.body;

        if(await itemModel.findOne({ SKU: SKU }))
            throw new ApiError(409, "Item with this SKU already exists");

        const item = new itemModel({
            name: name,
            SKU: SKU,
            MRP: MRP,
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

export async function getAllItems(req, res, next){
    try{
        const allItems = await itemModel.find({})
            .select("-__v -createdAt -updatedAt");

        if(allItems.length === 0) throw new ApiError(500, "No items found !");

        return res.status(200).json({
            success: true,
            message: "All items fetched",
            data: allItems
        });
    }
    catch(error){
        return next(error);
    }
}
