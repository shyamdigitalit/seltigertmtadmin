import Subcategory from "../../model/masters/subcategory.js";
import { idValidator } from "../../utilities/idValidator.js";

// Controller logics
const create = async (req, res) => {
    try {
        const subcategoryPayload = req.body
        const existingSubcategory = await Subcategory.findOne({ subcategoryCode: subcategoryPayload?.subcategoryCode })
        if (!existingSubcategory) {
            const newSubcategory = await Subcategory.create(subcategoryPayload)
            if (!newSubcategory) return res.status(401).json({ message: 'Subcategory details creation failed.' })
            return res.status(201).json({ message: 'Subcategory details created successfully.', data: newSubcategory })
        }
        else {
            ['_id', '__v', 'createdAt', 'updatedAt'].forEach(elm => delete subcategoryPayload[elm])
            const existingSubcategory = await Subcategory.findOneAndUpdate({ subcategoryCode: subcategoryPayload?.subcategoryCode }, subcategoryPayload, { new: true })
            if (!existingSubcategory) return res.status(401).json({ message: 'Existing Subcategory details update failed.' })
            return res.status(201).json({ message: 'Existing Subcategory details updated successfully.', data: existingSubcategory })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error.', data: error })
    }
}

const read = async (req, res) => {
    try {
        const subcategoryDetails = await Subcategory.find().lean()
        return res.status(200).json({ message: 'All Subcategory details fetched successfully.', data: subcategoryDetails })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error.', data: error })
    }
}

const remove = async (req, res) => {
    try {
        const subcategoryId = idValidator(req.query.id || '')
        if (subcategoryId === null) return res.status(400).json({ message: 'Received Id is Invalid.' })        
        const removedSubcategory = await Subcategory.findByIdAndDelete(subcategoryId)
        if (!removedSubcategory) return res.status(400).json({ message: 'Subcategory details removal failed.' })
        return res.status(200).json({ message: 'Subcategory details removed successfully.', data: removedSubcategory })
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