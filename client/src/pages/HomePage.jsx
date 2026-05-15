import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ListingCard from "../components/ListingCard";
import SearchBar from "../components/SearchBar";
import { mockListings } from "../utils/mockData";

export default function HomePage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ location: "", guests: "" });

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (filters.location) params.set("location", filters.location);
    if (filters.guests) params.set("guests", filters.guests);
    navigate(`/listings?${params.toString()}`);
  };

  return (
    <>
      <Helmet>
        <title>Staynest | Home</title>
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1400&q=80"
          alt="Hero"
          className="h-[480px] w-full object-cover sm:h-[520px] md:h-[580px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-black/25" />

        <div className="absolute inset-0 flex flex-col justify-center">
          <div className="container-base flex flex-col gap-5">
            {/* Headline */}
            <div className="max-w-lg">
              <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl md:text-6xl">
                Find your next stay
              </h1>
              <p className="mt-2 text-sm text-slate-200 sm:text-base">
                Explore unique homes, cozy cabins, and luxury villas around the
                world.
              </p>
            </div>

            {/* Search form */}
            <div className="w-full max-w-3xl">
              <SearchBar
                filters={filters}
                showDates={true}
                onChange={(key, value) =>
                  setFilters((prev) => ({ ...prev, [key]: value }))
                }
                onSubmit={handleSearch}
              />
            </div>

            {/* CTA */}
            <div>
              <Link
                to="/host/add"
                className="inline-flex rounded-xl border border-white/60 bg-white/15 px-5 py-2.5 text-sm font-medium text-white backdrop-blur hover:bg-white/25 transition"
              >
                Become a host
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured listings */}
      <section className="container-base py-8 sm:py-12">
        <h2 className="mb-5 text-xl font-semibold sm:text-2xl">Featured stays</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {mockListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>
    </>
  );
}
