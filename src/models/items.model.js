import { Schema, model } from "mongoose";

const itemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    SKU: {
        type: String,
        unique: true,
        required: true
    },
    MRP: {
        type: Number,
        min: 0,
        default: 0
    },
    taxApplicable: {
        type: Number,
        min: 0,
        default: 18
    },
    notes:{
        type: String
    }
},
{
    timestamps: true
});

const itemModel = model("item", itemSchema);
export default itemModel;
