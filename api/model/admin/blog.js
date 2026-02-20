import mongoose from "mongoose";
const { Schema, model, Types } = mongoose

const blogSchema = new Schema({
    title: { type: String, required: true, trim: true },
    meta: {
        description: { type: String, trim: true },
        url: { type: String, trim: true },
        type: { type: String, trim: true },
        site_name: { type: String, trim: true },
        image: { type: String, trim: true },
    },
    blocks: [{ type: Schema.Types.Mixed, required: true, trim: true }],
    status: { type: String, required: true, enum: ['Active', 'Inactive'], default: 'Active' },
    createdBy: { type: Types.ObjectId, ref: 'Account', required: true },
    updatedBy: { type: Types.ObjectId, ref: 'Account' }
}, { timestamps: true })

const Blog = model('Blog', blogSchema)

export default Blog