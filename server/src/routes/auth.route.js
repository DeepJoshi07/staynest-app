import express from "express";
import { login, logout, logoutAll, refreshToken, register } from "../controllers/auth.controller.js";
import {wrapper} from "../utils/wrapper.js"

const router = express.Router();

router.post("/register",wrapper(register))
router.post("/login",wrapper(login))
router.get("/logout",wrapper(logout))
router.get("/logout-all",wrapper(logoutAll))
router.get("/refresh-token",wrapper(refreshToken))



export default router;