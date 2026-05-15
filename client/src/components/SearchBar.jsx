export default function SearchBar({
  filters,
  onChange,
  onSubmit,
  compact = false,
  showDates = true,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className={`grid gap-3 rounded-2xl bg-white p-4 shadow-soft ${
        showDates
          ? compact
            ? "grid-cols-2 md:grid-cols-4"
            : "grid-cols-2 md:grid-cols-5"
          : "grid-cols-1 sm:grid-cols-3"
      }`}
    >
      {/* Location — full width on mobile, normal on md+ */}
      <input
        value={filters.location}
        onChange={(e) => onChange("location", e.target.value)}
        placeholder="Location"
        className={`rounded-xl border px-4 py-2.5 text-slate-800 placeholder:text-slate-400 ${showDates ? "col-span-2 md:col-span-1" : ""}`}
        aria-label="Location"
      />

      {showDates ? (
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500">From</label>
          <input
            type="date"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-400"
            aria-label="From date"
          />
        </div>
      ) : null}

      {showDates ? (
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500">Till</label>
          <input
            type="date"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-400"
            aria-label="Till date"
          />
        </div>
      ) : null}

      {/* Guests */}
      <input
        value={filters.guests}
        onChange={(e) => onChange("guests", e.target.value)}
        placeholder="Guests"
        type="number"
        min="1"
        className="rounded-xl border px-4 py-2.5 text-slate-800 placeholder:text-slate-400"
        aria-label="Guests"
      />

      {/* Search button — full width on mobile */}
      <button
        className={`rounded-xl bg-brand-primary px-4 py-2.5 font-medium text-white hover:bg-brand-dark transition ${showDates ? "col-span-2 md:col-span-1" : ""}`}
      >
        Search
      </button>
    </form>
  );
}
