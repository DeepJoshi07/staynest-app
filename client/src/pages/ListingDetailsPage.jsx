import { Helmet } from "react-helmet-async";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { mockListings, reviews } from "../utils/mockData";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useListing } from "../context/ListingContextProvider";

// const from = "2026-05-14"; // input.value
// const till = "2026-05-20"; // input.value

// // Convert to Date objects
// const fromDate = new Date(from);
// const tillDate = new Date(till);

// // Difference in milliseconds
// const diffMs = tillDate - fromDate;

// // Convert to days
// const diffDays = diffMs / (1000 * 60 * 60 * 24);

// console.log(diffDays);

export default function ListingDetailsPage() {
  const {bookListing} = useListing()
  const { id } = useParams();
  const listing = useMemo(
    () => mockListings.find((item) => item.id === id) || mockListings[0],
    [id],
  );
  const [activeImage, setActiveImage] = useState(0);

  const handleSubmit = async(detail) => {
    const {from,till,people,price} = detail;
    // const newTill = new Date(till).toLocaleDateString("en-US");
    // const newFrom = new Date(from).toLocaleDateString("en-US");
    // detail = {...detail,till:newTill,from:newFrom}
    const formData = new FormData()
    formData.append("from",from)
    formData.append("till",till)
    formData.append("people",people)
    formData.append("price",price)
    // formData.append("listingId",listing._id)
    const result = await bookListing(formData);

    // console.log(detail);
    
  };

  return (
    <section className="container-base py-10">
      <Helmet>
        <title>{listing.title} | Staynest</title>
      </Helmet>
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
              {reviews.map((r) => (
                <Reviews key={r.id} review={r} />
              ))}
            </div>
          </div>
        </div>
        <Reserve listing={listing} onClick={handleSubmit} />
      </div>
    </section>
  );
}

const Reviews = ({ review }) => {
  return (
    <div
      key={review.id}
      className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100"
    >
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-600">
          {review.author.charAt(0)}
        </div>
        <div>
          <p className="font-medium text-slate-800">{review.author}</p>
          <p className="text-sm text-slate-500">October 2023</p>
        </div>
      </div>
      <p className="text-slate-600">{review.comment}</p>
    </div>
  );
};

const Reserve = ({
  listing,
  onClick,
}) => {
  const [detail, setDetail] = useState({
    price: listing.price,
    from: null,
    till: null,
    people: 1,
  });

  const bookedDates = (listing.bookedDates || [
    "2026/05/22",
    "2026/05/23",
    "2026/05/24",
    "2026/05/25",
    "2026/06/01",
    "2026/06/02",
    "2026/06/03",
  ]).map((d) => new Date(d));

  let maxDateForTill = null;
  if (detail.from) {
    const futureDates = bookedDates.filter((d) => d > detail.from);
    if (futureDates.length > 0) {
      maxDateForTill = new Date(Math.min(...futureDates));
    }
  }

  const handleSubmit = () => {
    if (!detail.from || !detail.till) {
      alert("Please select both start and end dates.");
      return;
    }
    if (detail.from >= detail.till) {
      alert("End date must be after start date.");
      return;
    }
    const hasBooked = bookedDates.some(
      (d) => d >= detail.from && d <= detail.till
    );
    if (hasBooked) {
      alert("Your selected dates include days that are already booked.");
      return;
    }
    onClick(detail);
  };

  return (
    <aside className="h-fit rounded-xl bg-white p-5 shadow-soft">
      <style>{`
        .react-datepicker-wrapper {
          width: 100%;
        }
        .react-datepicker__day--selected,
        .react-datepicker__day--keyboard-selected {
          background-color: #ff385c !important;
          color: white !important;
        }
        .react-datepicker__day--highlighted-custom-1 {
          background-color: #ffe4e6 !important;
          color: #ff385c !important;
          text-decoration: line-through;
          border-radius: 0.3rem;
        }
        .react-datepicker__day--highlighted-custom-1:hover {
          background-color: #ffe4e6 !important;
        }
      `}</style>
      <p className="text-2xl font-semibold">
        ${listing.price}{" "}
        <span className="text-sm font-normal text-slate-500">night</span>
      </p>

      <div className="mt-4 w-full space-y-3">
        <DatePicker
          selected={detail.from}
          onChange={(date) => setDetail({ ...detail, from: date, till: null })}
          minDate={new Date()}
          excludeDates={bookedDates}
          placeholderText="Select start date"
          wrapperClassName="w-full"
          highlightDates={[
            { "react-datepicker__day--highlighted-custom-1": bookedDates },
          ]}
          className="w-full rounded-xl border px-3 py-2 text-slate-800"
        />
        <DatePicker
          selected={detail.till}
          onChange={(date) => setDetail({ ...detail, till: date })}
          minDate={detail.from || new Date()}
          maxDate={maxDateForTill}
          excludeDates={bookedDates}
          wrapperClassName="w-full"
          highlightDates={[
            { "react-datepicker__day--highlighted-custom-1": bookedDates },
          ]}
          placeholderText="Select end date"
          className="w-full rounded-xl border px-3 py-2 text-slate-800"
        />
        <input
          type="number"
          min="1"
          value={detail.people}
          onChange={(e) => setDetail({ ...detail, people: e.target.value })}
          className="w-full rounded-xl border px-3 py-2 text-slate-800"
          placeholder="For how many people?"
        />
      </div>

      <button
        className="mt-4 w-full rounded-xl bg-brand-primary py-3 text-white hover:bg-brand-dark"
        onClick={handleSubmit}
      >
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
  );
};
