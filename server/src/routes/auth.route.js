import express from "express";
import { login, logout, refreshToken, register, updateImage } from "../controllers/auth.controller.js";
import {wrapper} from "../utils/wrapper.js"
import { authUser } from "../middleware/auth.middleware.js";
import { upload } from "../config/multer.js";

const router = express.Router();

router.post("/register",wrapper(register))
router.post("/login",wrapper(login))
router.post("/logout",wrapper(logout))
// router.post("/logout-all",wrapper(logoutAll))
router.post("/refresh-token",authUser,wrapper(refreshToken))
router.post("/update-user-image",upload.single("image"),authUser,wrapper(updateImage))


export default router;