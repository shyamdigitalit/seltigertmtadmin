import Product from "../../model/masters/product.js";
import { idValidator } from "../../utilities/idValidator.js";

// Controller logics
const create = async (req, res) => {
    try {
        const productPayload = req.body
        const existingProduct = await Product.findOne({ productCode: productPayload?.productCode })
        if (!existingProduct) {
            const newProduct = await Product.create(productPayload)
            if (!newProduct) return res.status(401).json({ message: 'Product details creation failed.' })
            return res.status(201).json({ message: 'Product details created successfully.', data: newProduct })
        }
        else {
            ['_id', '__v', 'createdAt', 'updatedAt'].forEach(elm => delete productPayload[elm])
            const existingProduct = await Product.findOneAndUpdate({ productCode: productPayload?.productCode }, productPayload, { new: true })
            if (!existingProduct) return res.status(401).json({ message: 'Existing Product details update failed.' })
            return res.status(201).json({ message: 'Existing Product details updated successfully.', data: existingProduct })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error.', data: error })
    }
}

const read = async (req, res) => {
    try {
        const productDetails = await Product.find().lean()
        return res.status(200).json({ message: 'All Product details fetched successfully.', data: productDetails })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error.', data: error })
    }
}

const remove = async (req, res) => {
    try {
        const productId = idValidator(req.query.id || '')
        if (productId === null) return res.status(400).json({ message: 'Received Id is Invalid.' })        
        const removedProduct = await Product.findByIdAndDelete(productId)
        if (!removedProduct) return res.status(400).json({ message: 'Product details removal failed.' })
        return res.status(200).json({ message: 'Product details removed successfully.', data: removedProduct })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error.', data: error })
    }
}

export default {
    create,
    read,
    remove
}