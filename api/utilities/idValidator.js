import mongoose, { isValidObjectId } from "mongoose"

export const idValidator = (id) => {
    if (isValidObjectId(id)) return new mongoose.Types.ObjectId(id)
    return null
}