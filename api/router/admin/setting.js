import express from "express";
import { getSettings, upsertSettings } from "../../controller/admin/setting.js";
import authMiddleware from "../../middleware/auth.js";

const settingRouter = express.Router();

settingRouter.get("/", authMiddleware, getSettings);
settingRouter.post("/", authMiddleware, upsertSettings);

export default settingRouter;
