import express from "express";
import { loginAccount, refreshToken, logoutAccount } from "../controller/auth";

const authRouter = express.Router()

authRouter.post('/login', loginAccount);
authRouter.post('/refresh-token', refreshToken);
authRouter.post('/logout', logoutAccount);

export default authRouter;