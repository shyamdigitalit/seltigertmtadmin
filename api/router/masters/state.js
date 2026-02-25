import express from "express";
import authMiddleware from "../../middleware/auth.js";
import state from '../../controller/masters/state.js'

const stateRouter = express.Router()

stateRouter.post('/', state.create)
stateRouter.get('/', state.read)
stateRouter.delete('/delete', authMiddleware, state.remove)

export default stateRouter