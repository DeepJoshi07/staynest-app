import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ListingCard from "../components/ListingCard";
import LoaderSkeleton from "../components/LoaderSkeleton";
import useListings from "../hooks/useListings";
import { useListing } from "../context/ListingContextProvider";

export default function ListingsPage() {
  const [filters, setFilters] = useState({
    location: "",
    maxPrice: "",
    guests: "",
  });
  const [page, setPage] = useState(1);
  const [searchParams] = useSearchParams();
  const { listings} = useListing();
  const loading = !listings === true ? true :false;
  
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      location: searchParams.get("location") || "",
      guests: searchParams.get("guests") || "",
    }));
  }, [searchParams]);

  return (
    <section className="container-base py-10">
      <Helmet>
        <title>Listings | Staynest</title>
      </Helmet>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Explore stays</h1>
        <Link
          to="/host/add"
          className="rounded-xl bg-brand-primary px-4 py-2 text-sm text-white hover:bg-brand-dark"
        >
          Add listing
        </Link>
      </div>
      <div className="mb-6 grid gap-3 rounded-2xl bg-white p-4 shadow-sm sm:grid-cols-3">
        <input
          placeholder="Location"
          value={filters.location}
          className="rounded-xl border px-4 py-2"
          onChange={(e) =>
            setFilters((p) => ({ ...p, location: e.target.value }))
          }
        />
        <input
          placeholder="Max price"
          value={filters.maxPrice}
          type="number"
          className="rounded-xl border px-4 py-2"
          onChange={(e) =>
            setFilters((p) => ({ ...p, maxPrice: e.target.value }))
          }
        />
        <input
          placeholder="Guests"
          value={filters.guests}
          type="number"
          className="rounded-xl border px-4 py-2"
          onChange={(e) =>
            setFilters((p) => ({ ...p, guests: e.target.value }))
          }
        />
      </div>
      {loading ? (
        <LoaderSkeleton />
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
          
        </>
      )}
    </section>
  );
}
