import mongoose from "mongoose";
const { Schema, model } = mongoose

const productSchema = new Schema({
    productCode: { type: String, required: true, trim: true },
    productName: { type: String, trim: true },
    status: { type: String, required: true, enum: ['Active', 'Inactive'], default: 'Active' },
}, { timestamps: true })

const Product = model('Product', productSchema)

export default Product