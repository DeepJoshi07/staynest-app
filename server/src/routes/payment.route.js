import express from "express";
import { wrapper } from "../utils/wrapper.js";
import { createCheckoutSession, stripeWebhook } from "../controllers/payment.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const router = express.Router();

// Stripe webhook must receive the raw body — mounted before express.json() in index.js
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  wrapper(stripeWebhook)
);

// Create a Stripe Checkout Session for a pending booking
router.post("/create-checkout-session", authUser, wrapper(createCheckoutSession));

export default router;
