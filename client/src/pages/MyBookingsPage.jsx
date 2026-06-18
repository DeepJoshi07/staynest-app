import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import { useListing } from "../context/ListingContextProvider";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CreditCard, CalendarDays, Users, MapPin, ExternalLink } from "lucide-react";

export default function MyBookingsPage() {
  const [myBookings, setMyBookings] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const { getMyBookings, createCheckoutSession } = useListing();

  // Handle Stripe redirect back to this page
  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    if (paymentStatus === "success") {
      
      toast.success("🎉 Payment successful! Your booking is confirmed.");
      setSearchParams({});
    } else if (paymentStatus === "cancelled") {
      toast.error("Payment was cancelled. You can try again anytime.");
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const data = async () => {
      const bookings = await getMyBookings();
      setMyBookings(bookings || []);
    };
    data();
  }, []);

  const handlePayment = async (bookingId) => {
    setLoadingId(bookingId);
    await createCheckoutSession(bookingId);
    setLoadingId(null);
  };

  const isPending = (booking) => {
    const p = booking.payment;
    return Array.isArray(p) ? p.includes("pendding") : p === "pendding";
  };

  const isConfirmed = (booking) => {
    const p = booking.payment;
    return Array.isArray(p) ? p.includes("conformed") : p === "conformed";
  };

  const getNights = (from, till) => {
    return Math.max(
      1,
      Math.round((new Date(till) - new Date(from)) / (1000 * 60 * 60 * 24))
    );
  };

  return (
    <section className="container-base py-10">
      <Helmet>
        <title>My Bookings | Staynest</title>
      </Helmet>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">My Booked Stays</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage and complete payments for your reservations
          </p>
        </div>
        <Link
          to="/listings"
          className="rounded-xl bg-brand-primary px-4 py-2 text-sm text-white hover:bg-brand-dark transition-colors"
        >
          Book Another Stay
        </Link>
      </div>

      {myBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <CalendarDays className="mb-4 h-12 w-12 text-slate-300" />
          <p className="text-lg font-medium text-slate-600">No bookings yet</p>
          <p className="mt-1 text-sm text-slate-400">
            Start exploring stays and make your first booking!
          </p>
          <Link
            to="/listings"
            className="mt-5 rounded-xl bg-brand-primary px-5 py-2.5 text-sm text-white hover:bg-brand-dark transition-colors"
          >
            Browse Listings
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {myBookings.map((booking) => {
            const nights = getNights(booking.from, booking.till);
            const totalPrice = booking.price * nights;
            const pending = isPending(booking);
            const confirmed = isConfirmed(booking);
            const isLoading = loadingId === booking._id;

            return (
              <article
                key={booking._id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {/* Image */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={booking.listingId?.images?.[0]?.imageUrl || ""}
                    alt={booking.listingId?.title || "Listing"}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  {/* Payment status badge */}
                  <span
                    className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold shadow ${
                      confirmed
                        ? "bg-emerald-500 text-white"
                        : "bg-amber-400 text-amber-900"
                    }`}
                  >
                    {confirmed ? "✓ Confirmed" : "⏳ Payment Pending"}
                  </span>
                </div>

                <div className="space-y-3 p-4">
                  {/* Title & location */}
                  <div>
                    <h2 className="font-semibold text-slate-900 leading-tight">
                      {booking.listingId?.title || "Unknown Listing"}
                    </h2>
                    {booking.listingId?.location && (
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="h-3 w-3" />
                        {booking.listingId.location}
                      </p>
                    )}
                  </div>

                  {/* Dates & guests */}
                  <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                      <span>
                        {new Date(booking.from).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        →{" "}
                        {new Date(booking.till).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-slate-400" />
                      <span>
                        {booking.people} guest{booking.people > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  {/* Price summary */}
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="text-slate-500">
                      ${booking.price} × {nights} night{nights > 1 ? "s" : ""}
                    </span>
                    <span className="text-base font-bold text-slate-900">
                      ${totalPrice.toLocaleString()}
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    {/* View Stay */}
                    {booking.listingId && (
                      <Link
                        to={`/listings/${booking.listingId._id}`}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        View Stay
                      </Link>
                    )}

                    {/* Complete Payment — only for pending bookings */}
                    {pending && (
                      <button
                        id={`pay-btn-${booking._id}`}
                        onClick={() => handlePayment(booking._id)}
                        disabled={isLoading}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-brand-primary px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-dark active:scale-95 transition-all disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {isLoading ? (
                          <>
                            <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Redirecting…
                          </>
                        ) : (
                          <>
                            <CreditCard className="h-3.5 w-3.5" />
                            Complete Payment
                          </>
                        )}
                      </button>
                    )}

                    {/* Already paid indicator */}
                    {confirmed && !pending && (
                      <span className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
                        ✓ Payment Complete
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
