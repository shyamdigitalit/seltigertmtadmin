import Lead from '../model/lead.js';
import { idValidator } from "../utilities/idValidator.js";
import { codeGen } from '../utilities/codeGen.js';
import Subcategory from '../model/masters/subcategory.js';

// Reusables Functions
export const leadNoGen = async (subCategoryId, firmName, phone) => {
    const subCategoryDetails = await Subcategory.findById(subCategoryId).lean()
    const leadNo = `${subCategoryDetails?.subcategoryCode}${codeGen(`${subCategoryDetails?.subcategoryCode}${firmName}${phone}`)}`
    // console.log(leadNo);
    return leadNo;
}

// Controller logics
const create = async (req, res) => {
    try {
        const leadPayload = req.body
        // console.log(leadPayload);
        Object.assign(leadPayload, {
            leadNo: await leadNoGen(leadPayload?.subCategory || null, leadPayload?.firmName || '', leadPayload?.phone || ''),
            subCategory: idValidator(leadPayload?.subCategory),
            state: idValidator(leadPayload?.state),
            product: idValidator(leadPayload?.product)
        })
        const existingLead = await Lead.findOne({ leadNo: leadPayload?.leadNo })
        if (!existingLead) {
            const newLead = await Lead.create(leadPayload)
            if (!newLead) return res.status(401).json({ message: 'Lead details creation failed.' })
            return res.status(201).json({ message: 'Lead details created successfully.', data: newLead })
        }
        else {
            ['_id', '__v', 'createdAt', 'updatedAt'].forEach(elm => delete leadPayload[elm])
            const existingLead = await Lead.findOneAndUpdate({ leadNo: leadPayload?.leadNo }, leadPayload, { new: true })
            if (!existingLead) return res.status(401).json({ message: 'Existing Lead details update failed.' })
            return res.status(201).json({ message: 'Existing Lead details updated successfully.', data: existingLead })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error.', data: error })
    }
}

const read = async (req, res) => {
    try {
        const leadDetails = await Lead.find().populate(['subCategory', 'state', 'product']).lean()
        return res.status(200).json({ message: 'All Lead details fetched successfully.', data: leadDetails })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error.', data: error })
    }
}

const remove = async (req, res) => {
    try {
        const leadId = idValidator(req.query.id || '')
        if (leadId === null) return res.status(400).json({ message: 'Received Id is Invalid.' })        
        const removedLead = await Lead.findByIdAndDelete(leadId)
        if (!removedLead) return res.status(400).json({ message: 'Lead details removal failed.' })
        return res.status(200).json({ message: 'Lead details removed successfully.', data: removedLead })
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