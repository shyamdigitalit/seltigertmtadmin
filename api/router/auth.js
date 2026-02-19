import express from "express";
import { loginAccount, checkSession, refreshToken, logoutAccount } from "../controller/auth";

const authRouter = express.Router()

authRouter.post('/login', loginAccount);
authRouter.get('/session', checkSession);
authRouter.post('/refresh-token', refreshToken);
authRouter.post('/logout', logoutAccount);

export default authRouter;