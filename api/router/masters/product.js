import express from "express";
import authMiddleware from "../../middleware/auth.js";
import product from '../../controller/masters/product.js'

const productRouter = express.Router()

productRouter.post('/', product.create)
productRouter.get('/', product.read)
productRouter.delete('/delete', authMiddleware, product.remove)

export default productRouter