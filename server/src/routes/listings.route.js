import express from "express";
import { wrapper } from "../utils/wrapper.js";
import { allListings, bookedListing, editListing, listingDetail, myListing, newListing } from "../controllers/listings.controller.js";
import {authUser} from "../middleware/auth.middleware.js"

const router = express.Router();

router.get("/all-listings",wrapper(allListings));
router.get("/my/listings",authUser,wrapper(myListing));
router.post("/add",authUser,wrapper(newListing));
router.post("/edit",authUser,wrapper(editListing));
router.get("/detail",wrapper(listingDetail));
router.post("/booked",authUser,wrapper(bookedListing));



export default router;