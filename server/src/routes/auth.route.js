import express from "express";
import { login, logout, refreshToken, register } from "../controllers/auth.controller.js";
import {wrapper} from "../utils/wrapper.js"

const router = express.Router();

router.post("/register",wrapper(register))
router.post("/login",wrapper(login))
router.post("/logout",wrapper(logout))
// router.post("/logout-all",wrapper(logoutAll))
router.post("/refresh-token",wrapper(refreshToken))



export default router;