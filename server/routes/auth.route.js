import express from "express";
import { googleAuth } from "../controller/auth.controller.js";
import { logOut } from "../controller/auth.controller.js";
const authRouter = express.Router();
authRouter.post("/google", googleAuth);
authRouter.get("/logout", logOut);
export default authRouter;