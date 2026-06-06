import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useListing } from "../context/ListingContextProvider";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import UserImage from "../assets/user.png";
import Map from "../components/Map";


export default function ListingDetailsPage() {
  const { bookListing, getListingDetail, getReviews, addReview, editReview, deleteReview } = useListing();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      const data = await getListingDetail(id);
      setListing(data);
    };
    fetchListing();
  }, [id, getListingDetail]);

  useEffect(() => {
    const fetchReviews = async () => {
      setReviewsLoading(true);
      const data = await getReviews(id);
      setReviews(data);
      setReviewsLoading(false);
    };
    fetchReviews();
  }, [id, getReviews]);

  const [activeImage, setActiveImage] = useState(0);

  const handleBookingSubmit = async (detail) => {
    const { from, till, people, price } = detail;
    const payload = { from, till, people, price, listingId: listing._id };
    const result = await bookListing(payload);
    if (result) {
      toast.success("Listing reserved successfully!");
      navigate("/dashboard/mybookings");
    } else {
      toast.error("Listing not reserved!");
    }
  };

  const handleAddReview = async (payload) => {
    const review = await addReview({ ...payload, listingId: id });
    if (review) {
      setReviews((prev) => [review, ...prev]);
    }
  };

  const handleEditReview = async (reviewId, payload) => {
    const updated = await editReview({ reviewId, ...payload });
    if (updated) {
      setReviews((prev) => prev.map((r) => (r._id === reviewId ? updated : r)));
    }
  };

  const handleDeleteReview = async (reviewId) => {
    const ok = await deleteReview(reviewId);
    if (ok) {
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    }
  };

  // Average rating
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  // Check if current user already reviewed
  const myReview = user ? reviews.find((r) => r.author?._id === user._id) : null;

  if (!listing || !listing._id) {
    return (
      <section className="container-base py-10">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
        </div>
      </section>
    );
  }

  return (
    <section className="container-base py-10">
      <Helmet>
        <title>{listing.title} | Staynest</title>
      </Helmet>

      {/* Title + Rating */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-2">
        <h1 className="text-3xl font-semibold">{listing.title}</h1>
        {avgRating && (
          <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5">
            <StarIcon filled />
            <span className="font-semibold text-slate-800">{avgRating}</span>
            <span className="text-sm text-slate-500">({reviews.length} reviews)</span>
          </div>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Images */}
          <img
            src={listing.images?.[activeImage]?.imageUrl}
            alt={listing.title}
            className="h-80 w-full rounded-2xl object-cover"
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {listing.images &&
              listing.images.map((image, idx) => (
                <button
                  key={image.publicId || idx}
                  onClick={() => setActiveImage(idx)}
                  className={`overflow-hidden rounded-xl ring-2 transition ${
                    activeImage === idx ? "ring-brand-primary" : "ring-transparent"
                  }`}
                >
                  <img
                    src={image.imageUrl}
                    alt={`Preview ${idx + 1}`}
                    className="h-20 w-full object-cover"
                  />
                </button>
              ))}
          </div>

          {/* Description */}
          <p className="leading-relaxed text-slate-600">{listing.description}</p>

          {/* Amenities */}
          <div>
            <h3 className="mb-2 font-semibold">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {listing.amenities &&
                listing.amenities.map((a) => (
                  <span
                    key={a}
                    className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                  >
                    {a}
                  </span>
                ))}
            </div>
          </div>

          {/* Map placeholder */}
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <h3 className="mb-2 font-semibold">Map</h3>
            <div className="grid h-48 place-items-center rounded-xl bg-slate-100 text-slate-500">
            <Map place={listing.location}/>
            </div>
          </div>

          {/* ── Reviews Section ── */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-800">
                Reviews{" "}
                {reviews.length > 0 && (
                  <span className="ml-1 text-base font-normal text-slate-500">
                    ({reviews.length})
                  </span>
                )}
              </h3>
              {avgRating && (
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <StarIcon key={s} filled={s <= Math.round(avgRating)} size={16} />
                  ))}
                  <span className="ml-1 text-sm font-medium text-slate-600">{avgRating}</span>
                </div>
              )}
            </div>

            {/* Write a Review form — only if logged in and hasn't reviewed yet */}
            {user && !myReview && (
              <ReviewForm onSubmit={handleAddReview} />
            )}

            {/* No reviews yet */}
            {!reviewsLoading && reviews.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-200 py-10 text-center text-slate-400">
                No reviews yet. Be the first to share your experience!
              </div>
            )}

            {/* Review cards */}
            {reviewsLoading ? (
              <div className="flex justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
              </div>
            ) : (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {reviews.map((r) => (
                  <ReviewCard
                    key={r._id}
                    review={r}
                    isOwner={user && r.author?._id === user._id}
                    onEdit={(payload) => handleEditReview(r._id, payload)}
                    onDelete={() => handleDeleteReview(r._id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Reserve sidebar */}
        <Reserve listing={listing} onClick={handleBookingSubmit} />
      </div>
    </section>
  );
}

// ── Star Icon ────────────────────────────────────────────────────────────────
function StarIcon({ filled, size = 20, onClick, className = "" }) {
  return (
    <svg
      onClick={onClick}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "#f59e0b" : "none"}
      stroke={filled ? "#f59e0b" : "#d1d5db"}
      strokeWidth="1.5"
      className={`transition-colors ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
      />
    </svg>
  );
}

// ── Star Rating Input ────────────────────────────────────────────────────────
function StarRatingInput({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          size={24}
          filled={star <= (hovered || value)}
          onClick={() => onChange(star)}
          className="hover:scale-110"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
        />
      ))}
      {value > 0 && (
        <span className="ml-2 text-sm font-medium text-slate-600">
          {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][value]}
        </span>
      )}
    </div>
  );
}

// ── Review Form ──────────────────────────────────────────────────────────────
function ReviewForm({ onSubmit, initial = { rating: 0, comment: "" }, submitLabel = "Submit Review" }) {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.rating === 0) {
      toast.error("Please select a star rating.");
      return;
    }
    if (!form.comment.trim()) {
      toast.error("Please write a comment.");
      return;
    }
    setLoading(true);
    await onSubmit({ rating: form.rating, comment: form.comment });
    setForm({ rating: 0, comment: "" });
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <h4 className="mb-3 font-semibold text-slate-800">Write a Review</h4>
      <StarRatingInput
        value={form.rating}
        onChange={(v) => setForm((f) => ({ ...f, rating: v }))}
      />
      <textarea
        rows={3}
        value={form.comment}
        onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
        placeholder="Share your experience..."
        className="mt-3 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none ring-brand-primary transition focus:ring-2"
      />
      <button
        type="submit"
        disabled={loading}
        className="mt-3 rounded-xl bg-brand-primary px-5 py-2 text-sm font-medium text-white transition hover:bg-brand-dark disabled:opacity-60"
      >
        {loading ? "Submitting..." : submitLabel}
      </button>
    </form>
  );
}

// ── Review Card ──────────────────────────────────────────────────────────────
function ReviewCard({ review, isOwner, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const date = new Date(review.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const handleEditSubmit = async (payload) => {
    await onEdit(payload);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="rounded-2xl border border-brand-primary/30 bg-white p-5 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <p className="font-medium text-slate-700">Edit your review</p>
          <button
            onClick={() => setEditing(false)}
            className="text-sm text-slate-400 hover:text-slate-600"
          >
            Cancel
          </button>
        </div>
        <ReviewForm
          onSubmit={handleEditSubmit}
          initial={{ rating: review.rating, comment: review.comment }}
          submitLabel="Save Changes"
        />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-rose-400 font-bold text-white">
            <img src={review.author.image} className="rounded-full" alt="" />
          </div>
          <div>
            <p className="font-medium text-slate-800">{review.author?.username || "Anonymous"}</p>
            <p className="text-xs text-slate-400">{date}</p>
          </div>
        </div>
        {/* Star display */}
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <StarIcon key={s} filled={s <= review.rating} size={14} />
          ))}
        </div>
      </div>

      {/* Comment */}
      <p className="text-sm leading-relaxed text-slate-600">{review.comment}</p>

      {/* Owner actions */}
      {isOwner && (
        <div className="mt-3 flex items-center gap-3 border-t border-slate-100 pt-3">
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1 text-xs font-medium text-slate-500 transition hover:text-brand-primary"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          {confirmDelete ? (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Are you sure?</span>
              <button
                onClick={onDelete}
                className="font-medium text-red-500 hover:text-red-700"
              >
                Yes, delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-1 text-xs font-medium text-slate-500 transition hover:text-red-500"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Reserve Sidebar ──────────────────────────────────────────────────────────
const Reserve = ({ listing, onClick }) => {
  const [detail, setDetail] = useState({
    price: listing.price,
    from: null,
    till: null,
    people: 1,
  });

  const bookedDates = (
    listing.bookedDates || [
      "2026/05/22",
      "2026/05/23",
      "2026/05/24",
      "2026/05/25",
      "2026/06/01",
      "2026/06/02",
      "2026/06/03",
    ]
  ).map((d) => new Date(d));

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
      (d) => d >= detail.from && d <= detail.till,
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
          src={listing.host?.image || UserImage}
          alt={listing.host?.username || "unknown"}
          className="h-8 w-8 rounded-full object-cover"
        />
        Hosted by {listing.host?.username}
      </div>
    </aside>
  );
};
