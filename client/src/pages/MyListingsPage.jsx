import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import BackButton from "../components/BackButton";
import { mockListings } from "../utils/mockData";

export default function MyListingsPage() {
  return (
    <section className="container-base py-10">
      <Helmet><title>My Listings | Staynest</title></Helmet>
      <div className="mb-4">
        <BackButton label="Dashboard" />
      </div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">My Listings</h1>
        <Link to="/host/add" className="rounded-xl bg-brand-primary px-4 py-2 text-sm text-white hover:bg-brand-dark">
          Add New Listing
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mockListings.map((listing) => (
          <article
            key={listing.id}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
          >
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="h-48 w-full object-cover"
              loading="lazy"
            />
            <div className="space-y-2 p-4">
              <h2 className="font-semibold">{listing.title}</h2>
              <p className="text-sm text-slate-500">{listing.location}</p>
              <p className="text-sm text-slate-600">
                {listing.guests} guests · {listing.bedrooms} bedrooms · {listing.bathrooms} bathrooms
              </p>
              <div className="pt-2 text-sm">
                <span className="font-medium text-slate-900">${listing.price}</span>
                <span className="text-slate-500"> / night</span>
              </div>
              <div className="flex gap-2 pt-2">
                <Link to={`/host/edit/${listing.id}`} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100">
                  Edit
                </Link>
                <Link to={`/listings/${listing.id}`} className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm text-white hover:bg-slate-700">
                  View
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
