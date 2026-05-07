import express from "express";
import blog from "../../controller/admin/blog.js";
import authMiddleware from "../../middleware/auth.js";
const blogRouter = express.Router()

blogRouter.post('/', authMiddleware, blog.create);
blogRouter.get('/', authMiddleware, blog.read);
blogRouter.get('/byid', blog.readById);
blogRouter.get('/byslug', blog.readBySlug);
blogRouter.patch('/update', authMiddleware, blog.update);
blogRouter.put('/delete', authMiddleware, blog.remove);

export default blogRouter