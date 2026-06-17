import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useListing } from "../context/ListingContextProvider";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function MyListingsPage() {
  const { listings, deleteListing} = useListing();
  const { user } = useAuth();
  const [confirmId, setConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const myListings = listings.filter((l) => l.host._id === user._id);

  const handleDelete = async (listingId) => {
    setDeleting(true);
    await deleteListing(listingId);
    setConfirmId(null);
    setDeleting(false);
  };

  return (
    <section className="container-base py-10">
      <Helmet>
        <title>My Listings | Staynest</title>
      </Helmet>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">My Listings</h1>
        <Link
          to="/host/add"
          className="rounded-xl bg-brand-primary px-4 py-2 text-sm text-white hover:bg-brand-dark"
        >
          Add New Listing
        </Link>
      </div>

      {myListings.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 py-16 text-center text-slate-400">
          You have no listings yet.{" "}
          <Link to="/host/add" className="text-brand-primary hover:underline">
            Add one now.
          </Link>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {myListings.map((listing) => (
          <article
            key={listing._id}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
          >
            <img
              src={listing.images[0].imageUrl}
              alt={listing.title}
              className="h-48 w-full object-cover"
              loading="lazy"
            />
            <div className="space-y-2 p-4">
              <h2 className="font-semibold">{listing.title}</h2>
              <p className="text-sm text-slate-500">{listing.location}</p>
              <p className="text-sm text-slate-600">
                {listing.guests} guests · {listing.bedrooms} bedrooms ·{" "}
                {listing.bathrooms} bathrooms
              </p>
              <div className="pt-2 text-sm">
                <span className="font-medium text-slate-900">
                  ${listing.price}
                </span>
                <span className="text-slate-500"> / night</span>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Link
                  to={`/host/edit/${listing._id}`}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100"
                >
                  Edit
                </Link>
                <Link
                  to={`/listings/${listing._id}`}
                  className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm text-white hover:bg-slate-700"
                >
                  View
                </Link>

                {/* Delete with inline confirm */}
                {confirmId === listing._id ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDelete(listing._id)}
                      disabled={deleting}
                      className="rounded-lg bg-red-500 px-3 py-1.5 text-sm text-white hover:bg-red-600 disabled:opacity-60"
                    >
                      {deleting ? "Deleting..." : "Confirm"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmId(null)}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmId(listing._id)}
                    className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-500 transition hover:bg-red-50"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
