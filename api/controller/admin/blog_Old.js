import Blog from "../../model/admin/blog.js";
import { idValidator } from "../../utilities/idValidator.js";
import { uploadFiles, getFiles, removeFile, deleteFiles } from "../../utilities/fileOperations.js";
// Controller logics
const create = async (req, res) => {
    try {
        const user = req.user || null
        /* ---------------------------------------------------
           Parse multipart form-data fields
        --------------------------------------------------- */
        const blogPayload = {
            ...req.body,
            meta: req.body.meta
                ? JSON.parse(req.body.meta)
                : {},
            blocks: req.body.blocks
                ? JSON.parse(req.body.blocks)
                : []
        };

        /* ---------------------------------------------------
           Uploaded multer files
        --------------------------------------------------- */
        const imageFiles = req.files?.images || [];
        /* ---------------------------------------------------
           Upload images using enterprise utility
        --------------------------------------------------- */
        const { uploaded } = await uploadFiles(imageFiles);
        /* ---------------------------------------------------
           Inject uploaded image info into img blocks
        --------------------------------------------------- */
        const updatedBlocks = blogPayload.blocks.map((block) => {
            if (block.type !== 'img') {
                return block;
            }
            const uploadedFile = uploaded[block.imageIndex];
            if (!uploadedFile) {
                return block;
            }
            return {
                ...block,
                src: uploadedFile.filPath,
                image: {
                    filId: uploadedFile.filId,
                    filName: uploadedFile.filName,
                    filContentType: uploadedFile.filContentType,
                    filContentSize: uploadedFile.filContentSize,
                    filPath: uploadedFile.filPath,
                    filUploadStatus: uploadedFile.filUploadStatus
                }
            };
        });

        /* ---------------------------------------------------
           Final payload
        --------------------------------------------------- */
        const newPayload = { ...blogPayload, blocks: updatedBlocks, status: 'Active', createdBy: user?._id };

        /* ---------------------------------------------------
           Save blog
        --------------------------------------------------- */
        const blogDetails = await Blog.create(newPayload);
        if (!blogDetails) {
            return res.status(400).json({ success: false, message: 'Blog creation failed.' });
        }
        return res.status(201).json({ success: true, message: 'Blog created successfully.', data: blogDetails });
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error', success: false })
    }
}

const read = async (req, res) => {
    try {
        const blogDetails = await Blog.find().populate(['createdBy', 'updatedBy']).lean()
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
        const blogDetails = await Blog.findById(blogId).populate(['createdBy', 'updatedBy']).lean()
        return res.status(200).json({ message: 'Blog details fetched successfully.', success: true, data: blogDetails })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error', success: false })
    }
}

const readBySlug = async (req, res) => {
    try {
        const blogSlug = String(req.query.slug || '').trim()
        if (!blogSlug) return res.status(400).json({ message: 'Invalid Blog Slug', success: false })
        const blogDetails = await Blog.findOne({ slug: blogSlug }).populate(['createdBy', 'updatedBy']).lean()
        return res.status(200).json({ message: 'Blog details fetched successfully.', success: true, data: blogDetails })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error', success: false })
    }
}

const update = async (req, res) => {
    try {
        /* ---------------------------------------------------
           Validate ID
        --------------------------------------------------- */
        const blogId = idValidator(req.query.id || null);
        if (!blogId) {
            return res.status(400).json({ success: false, message: 'Invalid Blog Id' });
        }
        const user = req.user || null;

        /* ---------------------------------------------------
           Existing Blog
        --------------------------------------------------- */
        const existingBlog = await Blog.findById(blogId).lean();
        if (!existingBlog) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }

        /* ---------------------------------------------------
           Parse multipart/form-data safely
        --------------------------------------------------- */
        const blogPayload = {
            ...req.body,
            meta:
                typeof req.body.meta === 'string'
                    ? JSON.parse(req.body.meta)
                    : req.body.meta || {},

            blocks:
                typeof req.body.blocks === 'string'
                    ? JSON.parse(req.body.blocks)
                    : req.body.blocks || []
        };

        /* ---------------------------------------------------
           Uploaded image files
        --------------------------------------------------- */
        const imageFiles = req.files?.images || [];
        /* ---------------------------------------------------
           Upload newly added images
        --------------------------------------------------- */
        let uploaded = [];
        if (imageFiles.length > 0) {
            const uploadResult = await uploadFiles(imageFiles);
            uploaded = uploadResult?.uploaded || [];
        }

        /* ---------------------------------------------------
           Create updated blocks
        --------------------------------------------------- */
        const updatedBlocks = blogPayload.blocks.map((block) => {
            /*
                Non-image block
            */
            if (block.type !== 'img') return block;
            /*
                Existing image block
                (No new upload)
            */
            if (block.src && !Number.isInteger(block.imageIndex)) return block;

            /*
                Newly uploaded image
            */
            const uploadedFile = uploaded[block.imageIndex];
            if (!uploadedFile) return block;
            return {
                ...block,
                src: uploadedFile.filPath,
                image: {
                    filId: uploadedFile.filId,
                    filName: uploadedFile.filName,
                    filContentType: uploadedFile.filContentType,
                    filContentSize: uploadedFile.filContentSize,
                    filPath: uploadedFile.filPath,
                    filUploadStatus: uploadedFile.filUploadStatus
                }
            };
        });

        /* ---------------------------------------------------
           Detect removed images
        --------------------------------------------------- */
        const oldImageIds = new Set(
            existingBlog.blocks
                ?.filter(
                    block =>
                        block.type === 'img' &&
                        block.image?.filId
                )
                .map(
                    block =>
                        String(block.image.filId)
                )
        );
        const newImageIds = new Set(
            updatedBlocks
                ?.filter(
                    block =>
                        block.type === 'img' &&
                        block.image?.filId
                )
                .map(
                    block =>
                        String(block.image.filId)
                )
        );
        const removedImageIds = [...oldImageIds].filter(id => !newImageIds.has(id));

        /* ---------------------------------------------------
           Remove deleted images from storage
        --------------------------------------------------- */
        if (removedImageIds.length > 0) {
            await Promise.allSettled(removedImageIds.map(id =>removeFile(id)));
        }

        /* ---------------------------------------------------
           Final payload
        --------------------------------------------------- */
        const updatedPayload = {
            slug: String(blogPayload.slug || '').trim(),
            meta: blogPayload.meta || {},
            blocks: updatedBlocks,
            status: blogPayload.status || 'Active',
            updatedBy: user?._id
        };

        /* ---------------------------------------------------
           Update blog
        --------------------------------------------------- */
        const blogUpdated = await Blog.findByIdAndUpdate(blogId, updatedPayload, { new: true, lean: true });
        return res.status(200).json({ success: true, message: 'Blog updated successfully.', data: blogUpdated });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const remove = async (req, res) => {
    try {
        /* ---------------------------------------------------
           Validate ID
        --------------------------------------------------- */
        const blogId = idValidator(req.query.id || null);
        if (!blogId) {
            return res.status(400).json({ success: false, message: 'Invalid Blog Id' });
        }

        /* ---------------------------------------------------
           Fetch blog
        --------------------------------------------------- */
        const blogDetails = await Blog.findById(blogId).lean();
        if (!blogDetails) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }

        /* ---------------------------------------------------
           Extract all uploaded image IDs
        --------------------------------------------------- */
        const fileIds = blogDetails.blocks
            ?.filter(
                block =>
                    block.type === 'img' &&
                    block.image?.filId
            ).map(
                block =>
                    block.image.filId
            ) || [];

        /* ---------------------------------------------------
           Delete all uploaded images
        --------------------------------------------------- */
        if (fileIds.length > 0) await deleteFiles(fileIds);

        /* ---------------------------------------------------
           Delete blog
        --------------------------------------------------- */
        await Blog.findByIdAndDelete(blogId);
        return res.status(200).json({ success: true, message: 'Blog deleted successfully.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export default {
    create,
    read,
    readById,
    readBySlug,
    update,
    remove
}