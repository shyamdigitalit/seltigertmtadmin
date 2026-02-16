import mongoose from "mongoose";
const { Schema, model } = mongoose

const stateSchema = new Schema({
    stateCode: { type: String, required: true, trim: true },
    stateName: { type: String, trim: true },
    stateCountry: { type: String, trim: true },
    status: { type: String, required: true, enum: ['Active', 'Inactive'], default: 'Active' },
}, { timestamps: true })

const State = model('State', stateSchema)

export default State