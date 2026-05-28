import express from 'express';
import { authUser } from '../middleware/auth.middleware.js';
import { addReview, deleteReview, editReview, getAllReview } from '../controllers/reviews.controller.js';

const router = express.Router();

router.get("/get-all", getAllReview);
router.post("/add", authUser, addReview);
router.put("/edit", authUser, editReview);
router.delete("/delete", authUser, deleteReview);

export default router;