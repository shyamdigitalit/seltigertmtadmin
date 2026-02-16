import mongoose from "mongoose";
const { Schema, model, Types } = mongoose

const leadSchema = new Schema({
    leadNo: { type: String, required: true, trim: true },
    subCategory: { type: Types.ObjectId, ref: 'Purpose', trim: true },
    firmName: { type: String, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    state: { type: Types.ObjectId, ref: 'State', trim: true },
    city: { type: String, trim: true },
    pinCode: { type: String, trim: true },
    product: { type: Types.ObjectId, ref: 'Product', trim: true },
    requirementDetails: { type: String, trim: true },
    status: { type: String, required: true, enum: ['Open', 'Prospective', 'Active', 'Inactive', 'Closed'], default: 'Open' },
}, { timestamps: true })

const Lead = model('Lead', leadSchema)

export default Lead