import { Schema, model } from "mongoose";

const itemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    SKU: {
        type: String,
        unique: true
    },
    MRP: {
        type: Number,
        min: 0
    },
    taxApplicable: {
        type: Number,
        min: 0
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
