import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { mockBookings, mockListings } from "../utils/mockData";

export default function MyBookingsPage() {
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
        {mockBookings.map((booking) => {
          const listing = mockListings.find(
            (item) => item.id === booking.listingId,
          );
          const image = listing?.images?.[0];
          const location = listing?.location || "Location not available";
          const price = listing?.price;

          return (
            <article
              key={booking.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
            >
              <img
                src={image}
                alt={booking.listingTitle}
                className="h-48 w-full object-cover"
                loading="lazy"
              />
              <div className="space-y-2 p-4">
                <h2 className="font-semibold">{booking.listingTitle}</h2>
                <p className="text-sm text-slate-500">{location}</p>
                <p className="text-sm text-slate-600">Dates: {booking.dates}</p>
                <p className="text-sm text-slate-600">
                  Guests: {booking.guests}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    {booking.status}
                  </span>
                  {price ? (
                    <p className="text-sm">
                      <span className="font-medium text-slate-900">
                        ${price}
                      </span>
                      <span className="text-slate-500"> / night</span>
                    </p>
                  ) : null}
                </div>
                {listing ? (
                  <Link
                    to={`/listings/${listing.id}`}
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
