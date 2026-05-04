import { Helmet } from "react-helmet-async";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import { mockListings } from "../utils/mockData";

export default function ListingDetailsPage() {
  const { id } = useParams();
  const listing = useMemo(
    () => mockListings.find((item) => item.id === id) || mockListings[0],
    [id],
  );
  const [activeImage, setActiveImage] = useState(0);

  return (
    <section className="container-base py-10">
      <Helmet>
        <title>{listing.title} | Staynest</title>
      </Helmet>
      <div className="mb-4">
        <BackButton />
      </div>
      <h1 className="mb-5 text-3xl font-semibold">{listing.title}</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <img
            src={listing.images[activeImage]}
            alt={listing.title}
            className="h-80 w-full rounded-2xl object-cover"
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {listing.images.map((image, idx) => (
              <button
                key={image}
                onClick={() => setActiveImage(idx)}
                className="overflow-hidden rounded-xl"
              >
                <img
                  src={image}
                  alt={`Preview ${idx + 1}`}
                  className="h-20 w-full object-cover"
                />
              </button>
            ))}
          </div>
          <p>{listing.description}</p>
          <div>
            <h3 className="mb-2 font-semibold">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {listing.amenities.map((a) => (
                <span
                  key={a}
                  className="rounded-full bg-slate-100 px-3 py-1 text-sm"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <h3 className="mb-2 font-semibold">Map</h3>
            <div className="grid h-48 place-items-center rounded-xl bg-slate-100 text-slate-500">
              Map placeholder
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-xl font-semibold text-slate-800">
              Reviews
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {listing.reviews.map((r) => (
                <div
                  key={r.id}
                  className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-600">
                      {r.author.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{r.author}</p>
                      <p className="text-sm text-slate-500">October 2023</p>
                    </div>
                  </div>
                  <p className="text-slate-600">{r.comment}</p>
                </div>
              ))}
              <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-600">
                    J
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">John Doe</p>
                    <p className="text-sm text-slate-500">September 2023</p>
                  </div>
                </div>
                <p className="text-slate-600">
                  This was an absolutely fantastic experience. The place was
                  clean, and the location could not be better. Highly recommend!
                </p>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-600">
                    E
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">Emily Smith</p>
                    <p className="text-sm text-slate-500">August 2023</p>
                  </div>
                </div>
                <p className="text-slate-600">
                  Great value for the price. The amenities were exactly as
                  described. Will definitely book again when we are in town.
                </p>
              </div>
            </div>
          </div>
        </div>
        <aside className="h-fit rounded-2xl bg-white p-5 shadow-soft">
          <p className="text-2xl font-semibold">
            ${listing.price}{" "}
            <span className="text-sm font-normal text-slate-500">night</span>
          </p>
          <div className="mt-4 space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">From</label>
              <input
                type="date"
                className="w-full rounded-xl border px-3 py-2"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">Till</label>
              <input
                type="date"
                className="w-full rounded-xl border px-3 py-2"
              />
            </div>
            <input
              type="number"
              min="1"
              defaultValue="1"
              className="w-full rounded-xl border px-3 py-2"
            />
          </div>
          <button className="mt-4 w-full rounded-xl bg-brand-primary py-3 text-white hover:bg-brand-dark">
            Reserve
          </button>
          <div className="mt-4 flex items-center gap-3 text-sm">
            <img
              src={listing.host.avatar}
              alt={listing.host.name}
              className="h-8 w-8 rounded-full"
            />
            Hosted by {listing.host.name}
          </div>
        </aside>
      </div>
    </section>
  );
}
