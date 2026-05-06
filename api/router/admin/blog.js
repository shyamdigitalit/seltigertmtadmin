import express from "express";
import blog from "../../controller/admin/blog.js";
import authMiddleware from "../../middleware/auth.js";
import fileUpload from "../../middleware/fileUpload.js";
const blogRouter = express.Router()

blogRouter.post('/', authMiddleware, fileUpload.single('image'), blog.create);
blogRouter.get('/', authMiddleware, blog.read);
blogRouter.get('/byid', blog.readById);
blogRouter.get('/byslug', blog.readBySlug);
blogRouter.patch('/update', authMiddleware, fileUpload.single('image'), blog.update);
blogRouter.put('/delete', authMiddleware, fileUpload.single('image'), blog.remove);

export default blogRouter