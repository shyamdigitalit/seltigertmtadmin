import Blog from "../../model/admin/blog.js";
import { idValidator } from "../../utilities/idValidator.js";
// import { codeGen } from "../../utilities/codeGen.js";

// Reusable functions

// Controller logics
const create = async (req, res) => {
    try {
        const blogPayload = req.body
        const user = req.user || null

        const newPayload = { ...blogPayload, status: 'Active', createdBy: user?._id }
        const blogDetails = await Blog.create(newPayload)
        if (!blogDetails) return res.status(401).json({ message: 'Blog creation failed.', success: false })
        return res.status(201).json({ message: 'Blog created successfully.', success: true, data: blogDetails })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error', success: false })
    }
}

const read = async (req, res) => {
    try {
        const blogDetails = await Blog.find().populate(['blocks', 'createdBy', 'updatedBy']).lean()
        return res.status(200).json({ message: 'All Blog data fetched successfully.', success: true, data: blogDetails })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error', success: false })
    }
}

const readById = async (req, res) => {
    try {
        const blogId = idValidator(req.query.id || null)
        if (!blogId) return res.status(400).json({ message: 'Invalid Blog Id', success: false })
        const blogDetails = await Blog.findById(blogId).populate(['blocks', 'createdBy', 'updatedBy']).lean()
        return res.status(200).json({ message: 'Blog details fetched successfully.', success: true, data: blogDetails })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error', success: false })
    }
}

const update = async (req, res) => {
    try {
        const blogId = idValidator(req.query.id || null)
        const blogPayload = req.body
        const user = req.user || null
        if (!blogId) return res.status(401).json({ message: 'Invalid Blog Id', success: false })

        ['_id', '__V', 'createdBy'].forEach(itm => delete blogPayload[itm])
        const updatedPayload = { ...blogPayload, status: 'Active', updatedBy: user?._id }
        
        const blogUpdated = await Blog.findByIdAndUpdate(blogId, updatedPayload, { new: true })
        if (!blogUpdated) return res.status(401).json({ message: 'Blog update failed.', success: false })
        return res.status(201).json({ message: 'Blog updated successfully.', success: true, data: blogUpdated })
    } catch (error) {
        console.error(error)
    }
}

const remove = async (req, res) => {
    try {
        const blogId = idValidator(req.query.id || null)
        if (!blogId) return res.status(400).json({ message: 'Invalid Blog Id', success: false })
        const blogRemoved = await Blog.findByIdAndDelete(blogId)
        if (!blogRemoved) return res.status(400).json({ message: 'Blog details removal failed.', success: false })
        return res.status(200).json({ message: 'Blog details removed successfully.', success: true, data: blogRemoved })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error', success: false })
    }
}

export default {
    create,
    read,
    readById,
    update,
    remove
}