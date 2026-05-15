import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { mockBookings, mockListings } from "../utils/mockData";

export default function DashboardPage() {
  return (
    <section className="container-base py-10">
      <Helmet>
        <title>Dashboard | Staynest</title>
      </Helmet>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Bookings</h1>
        <Link
          to="/host/add"
          className="rounded-xl bg-brand-primary px-4 py-2 text-white hover:bg-brand-dark"
        >
          Add Listing
        </Link>
      </div>

      <article className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">My Booked Listings</h2>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
            {mockBookings.length} bookings
          </span>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockBookings.map((booking) => {
            const listing = mockListings.find(
              (item) => item.id === booking.listingId,
            );
            return (
              <article
                key={booking.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-soft"
              >
                <img
                  src={listing?.images?.[0]}
                  alt={booking.listingTitle}
                  className="h-44 w-full object-cover"
                  loading="lazy"
                />
                <div className="space-y-2 p-4">
                  <h3 className="font-semibold">{booking.listingTitle}</h3>
                  <p className="text-sm text-slate-500">{listing?.location}</p>
                  <p className="text-sm text-slate-600">
                    Dates: {booking.dates}
                  </p>
                  <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    {booking.status}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </article>
    </section>
  );
}
