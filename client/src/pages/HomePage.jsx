import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ListingCard from "../components/ListingCard";
import SearchBar from "../components/SearchBar";
import { mockListings } from "../utils/mockData";

export default function HomePage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ location: "", guests: "" });

  return (
    <>
      <Helmet><title>Staynest | Home</title></Helmet>
      <section className="relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1400&q=80"
          alt="Hero"
          className="h-[520px] w-full object-cover md:h-[560px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/30 to-black/25" />
        <div className="container-base absolute inset-0 flex flex-col justify-center gap-6 text-white">
          <h1 className="max-w-2xl text-4xl font-bold leading-tight md:text-6xl">
            Find your next stay
          </h1>
          <p className="max-w-xl text-sm text-slate-100 md:text-base">
            Explore unique homes, cozy cabins, and luxury villas around the world.
          </p>
          <SearchBar
            filters={filters}
            showDates={false}
            onChange={(key, value) => setFilters((prev) => ({ ...prev, [key]: value }))}
            onSubmit={(e) => {
              e.preventDefault();
              const params = new URLSearchParams();
              if (filters.location) params.set("location", filters.location);
              if (filters.guests) params.set("guests", filters.guests);
              navigate(`/listings?${params.toString()}`);
            }}
          />
          <div>
            <Link
              to="/host/add"
              className="inline-flex rounded-xl border border-white/60 bg-white/15 px-5 py-3 text-sm font-medium backdrop-blur hover:bg-white/25"
            >
              Become a host
            </Link>
          </div>
        </div>
      </section>

      <section className="container-base py-10">
        <h2 className="mb-5 text-2xl font-semibold">Featured stays</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockListings.map((listing) => <ListingCard key={listing.id} listing={listing} />)}
        </div>
      </section>
    </>
  );
}
