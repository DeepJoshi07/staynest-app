import stripe from "../config/stripe.js";
import Booking from "../models/booked.model.js";
import { addBookedDatesToListing } from "./listings.controller.js";

/**
 * POST /api/payment/create-checkout-session
 * Body: { bookingId }
 * Creates a Stripe Checkout Session for the given pending booking.
 */
export const createCheckoutSession = async (req, res) => {
  const { bookingId } = req.body;

  if (!bookingId) {
    return res.status(400).json({ message: "bookingId is required" });
  }

  const booking = await Booking.findById(bookingId).populate("listingId");

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  // Only allow payment for pending bookings owned by the requester
  const isPending =
    Array.isArray(booking.payment)
      ? booking.payment.includes("pendding")
      : booking.payment === "pendding";

  if (!isPending) {
    return res.status(400).json({ message: "Booking is already paid or not pending" });
  }

  if (booking.guestId.toString() !== req.userId.toString()) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const listingTitle = booking.listingId?.title || "Stay Booking";
  const nights = Math.max(
    1,
    Math.round(
      (new Date(booking.till) - new Date(booking.from)) / (1000 * 60 * 60 * 24)
    )
  );

  const clientBaseUrl =
    process.env.CLIENT_BASE_URL || "http://localhost:5173";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: listingTitle,
            description: `${nights} night${nights > 1 ? "s" : ""} · ${booking.people} guest${booking.people > 1 ? "s" : ""}`,
            images: booking.listingId?.images?.[0]?.imageUrl
              ? [booking.listingId.images[0].imageUrl]
              : [],
          },
          // Stripe expects amount in the smallest currency unit (cents)
          unit_amount: Math.round(booking.price * nights * 100),
        },
        quantity: 1,
      },
    ],
    metadata: {
      bookingId: booking._id.toString(),
    },
    success_url: `${clientBaseUrl}/dashboard/mybookings?payment=success`,
    cancel_url: `${clientBaseUrl}/dashboard/mybookings?payment=cancelled`,
  });

  return res.status(200).json({ url: session.url });
};

/**
 * POST /api/payment/webhook
 * Stripe webhook – updates booking payment status to "conformed" on success.
 * Must be registered with raw body (express.raw middleware).
 */
export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const bookingId = session.metadata?.bookingId;

    if (bookingId) {
      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        { payment: ["conformed"] },
        { new: true }
      );
      if (booking) {
        await addBookedDatesToListing(booking.listingId, booking.from, booking.till);
        // Delete other pending bookings that overlap with this confirmed booking's dates
        await Booking.deleteMany({
          listingId: booking.listingId,
          _id: { $ne: booking._id },
          payment: "pendding",
          from: { $lte: booking.till },
          till: { $gte: booking.from },
        });
      }
    }
  }

  return res.status(200).json({ received: true });
};
