import { Link } from "react-router-dom";
import { Star } from "lucide-react";

export default function ListingCard({ listing }) {
  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <Link
        to={`/listings/${listing.id}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
        aria-label={`View details for ${listing.title}`}
      >
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="h-56 w-full object-cover transition duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="space-y-2 p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{listing.title}</h3>
            <span className="flex items-center gap-1 text-sm">
              <Star size={14} className="fill-current" /> {listing.rating}
            </span>
          </div>
          <p className="text-sm text-slate-500">{listing.location}</p>
          <p className="font-medium">
            ${listing.price} <span className="text-sm font-normal text-slate-500">night</span>
          </p>
          <span className="inline-block text-sm text-brand-primary hover:underline">View details</span>
        </div>
      </Link>
    </article>
  );
}
