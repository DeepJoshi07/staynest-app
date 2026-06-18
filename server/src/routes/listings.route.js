import express from "express";
import { wrapper } from "../utils/wrapper.js";
import {
  allListings,
  // bookedlisting,
  bookListing,
  deleteListing,
  editListing,
  listingDetail,
  myBookings,
  newListing,
} from "../controllers/listings.controller.js";
import { authUser } from "../middleware/auth.middleware.js";
import { upload } from "../config/multer.js";

const router = express.Router();

router.get("/all-listings", wrapper(allListings));
router.post("/add", authUser, upload.array("images", 5), wrapper(newListing));
router.post("/edit", authUser, upload.array("images", 5), wrapper(editListing));
router.delete("/delete", authUser, wrapper(deleteListing));
router.get("/detail", wrapper(listingDetail));
router.post("/booked", authUser, wrapper(bookListing));
router.get("/my-bookings", authUser, wrapper(myBookings));
// router.post("/booked-listing", authUser, wrapper(bookedlisting));

export default router;
