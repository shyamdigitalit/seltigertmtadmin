import express from "express";
import authMiddleware from "../../middleware/auth.js";
import product from '../../controller/masters/product.js'

const productRouter = express.Router()

productRouter.post('/', authMiddleware, product.create)
productRouter.get('/', authMiddleware, product.read)
productRouter.delete('/delete', authMiddleware, product.remove)

export default productRouter