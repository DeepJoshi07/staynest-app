import express from "express";
import { wrapper } from "../utils/wrapper.js";
import {
  allListings,
  bookListing,
  editListing,
  listingDetail,
  myListing,
  newListing,
} from "../controllers/listings.controller.js";
import { authUser } from "../middleware/auth.middleware.js";
import { upload } from "../config/multer.js";

const router = express.Router();

router.get("/all-listings", wrapper(allListings));
// router.get("/my/listings",authUser,wrapper(myListing));
router.post("/add", authUser, upload.array("images", 5), wrapper(newListing));
router.post("/edit", authUser, upload.array("images", 5), wrapper(editListing));
router.get("/detail", wrapper(listingDetail));
router.post("/booked", authUser, wrapper(bookListing));

export default router;
