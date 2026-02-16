import express from "express";
import authMiddleware from "../../middleware/auth.js";
import subcategory from "../../controller/masters/subcategory.js";

const subcategoryRouter = express.Router()

subcategoryRouter.post('/', subcategory.create)
subcategoryRouter.get('/', subcategory.read)
subcategoryRouter.delete('/delete', subcategory.remove)

export default subcategoryRouter