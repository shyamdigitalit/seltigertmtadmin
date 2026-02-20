import express from "express";
import blog from "../../controller/admin/blog.js";
import authMiddleware from "../../middleware/auth.js";
const blogRouter = express.Router()

blogRouter.post('/', authMiddleware, blog.create);
blogRouter.get('/', authMiddleware, blog.read);
blogRouter.get('/', authMiddleware, blog.readById);
blogRouter.patch('/update', authMiddleware, blog.update);
blogRouter.put('/delete', authMiddleware, blog.remove);

export default blogRouter