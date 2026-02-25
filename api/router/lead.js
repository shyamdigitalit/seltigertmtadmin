import express from "express";
import authMiddleware from "../middleware/auth.js";
import lead from "../controller/lead.js";

const leadRouter = express.Router()

leadRouter.post('/', lead.create)
leadRouter.get('/', authMiddleware, lead.read)
leadRouter.delete('/delete', authMiddleware, lead.remove)

export default leadRouter