import State from "../../model/masters/state.js";
import { idValidator } from "../../utilities/idValidator.js";

// Controller logics
const create = async (req, res) => {
    try {
        const statePayload = req.body
        const existingState = await State.findOne({ stateCode: statePayload?.stateCode })
        if (!existingState) {
            const newState = await State.create(statePayload)
            if (!newState) return res.status(401).json({ message: 'State details creation failed.' })
            return res.status(201).json({ message: 'State details created successfully.', data: newState })
        }
        else {
            ['_id', '__v', 'createdAt', 'updatedAt'].forEach(elm => delete statePayload[elm])
            const existingState = await State.findOneAndUpdate({ stateCode: statePayload?.stateCode }, statePayload, { new: true })
            if (!existingState) return res.status(401).json({ message: 'Existing State details update failed.' })
            return res.status(201).json({ message: 'Existing State details updated successfully.', data: existingState })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error.', data: error })
    }
}

const read = async (req, res) => {
    try {
        const stateDetails = await State.find().lean()
        return res.status(200).json({ message: 'All State details fetched successfully.', data: stateDetails })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error.', data: error })
    }
}

const remove = async (req, res) => {
    try {
        const stateId = idValidator(req.query.id || '')
        if (stateId === null) return res.status(400).json({ message: 'Received Id is Invalid.' })        
        const removedState = await State.findByIdAndDelete(stateId)
        if (!removedState) return res.status(400).json({ message: 'State details removal failed.' })
        return res.status(200).json({ message: 'State details removed successfully.', data: removedState })
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