import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useListing } from "../context/ListingContextProvider";
import { useEffect, useState } from "react";

export default function MyBookingsPage() {
  const [myBookings, setMyBookings] = useState([]);

  const { getMyBookings } = useListing();

  useEffect(() => {
    const data = async () => {
      const bookings = await getMyBookings();
      setMyBookings(bookings);
    };
    data();
  }, []);

  return (
    <section className="container-base py-10">
      <Helmet>
        <title>My Bookings | Staynest</title>
      </Helmet>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">My Booked Listings</h1>
        <Link
          to="/listings"
          className="rounded-xl bg-brand-primary px-4 py-2 text-sm text-white hover:bg-brand-dark"
        >
          Book Another Stay
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {myBookings.map((booking) => {
          return (
            <article
              key={booking._id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
            >
              <img
                src={booking.listingId?.images?.[0]?.imageUrl || ""}
                alt={booking.listingId?.title || "Listing"}
                className="h-48 w-full object-cover"
                loading="lazy"
              />
              <div className="space-y-2 p-4">
                <h2 className="font-semibold">
                  {booking.listingId?.title || "Unknown Listing"}
                </h2>
                <p className="text-sm text-slate-500">
                  {booking.listingId?.location}
                </p>
                <p className="text-sm text-slate-600">
                  Date: {new Date(booking.from).toLocaleDateString()} to{" "}
                  {new Date(booking.till).toLocaleDateString()}
                </p>
                <p className="text-sm text-slate-600">
                  Guests: {booking.people}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    {booking.payment?.[0] || booking.payment}
                  </span>
                  {booking.price ? (
                    <p className="text-sm">
                      <span className="font-medium text-slate-900">
                        ${booking.price}
                      </span>
                      <span className="text-slate-500"> / night</span>
                    </p>
                  ) : null}
                </div>
                {booking.listingId ? (
                  <Link
                    to={`/listings/${booking.listingId._id}`}
                    className="inline-block rounded-lg bg-slate-900 px-3 py-1.5 text-sm text-white hover:bg-slate-700"
                  >
                    View Stay
                  </Link>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
