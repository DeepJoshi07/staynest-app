import express from "express";
import { wrapper } from "../utils/wrapper.js";
import { allListings, bookedListing, editListing, listingDetail, myListing, newListing } from "../controllers/listings.controller.js";

const router = express.Router();

router.get("/all-listings",wrapper(allListings));
router.get("/my/listings",wrapper(myListing));
router.get("/add",wrapper(newListing));
router.get("/edit",wrapper(editListing));
router.get("/detail",wrapper(listingDetail));
router.get("/booked",wrapper(bookedListing));



export default router;