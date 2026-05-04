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
        showDates ? (compact ? "md:grid-cols-4" : "md:grid-cols-5") : "md:grid-cols-3"
      }`}
    >
      <input
        value={filters.location}
        onChange={(e) => onChange("location", e.target.value)}
        placeholder="Location"
        className="rounded-xl border px-4 py-2 text-slate-800 placeholder:text-slate-400"
        aria-label="Location"
      />
      {showDates ? (
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600">From</label>
          <input
            type="date"
            className="w-full rounded-xl border px-4 py-2 text-slate-800"
            aria-label="From date"
          />
        </div>
      ) : null}
      {showDates ? (
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600">Till</label>
          <input
            type="date"
            className="w-full rounded-xl border px-4 py-2 text-slate-800"
            aria-label="Till date"
          />
        </div>
      ) : null}
      <input
        value={filters.guests}
        onChange={(e) => onChange("guests", e.target.value)}
        placeholder="Guests"
        type="number"
        min="1"
        className="rounded-xl border px-4 py-2 text-slate-800 placeholder:text-slate-400"
        aria-label="Guests"
      />
      <button className="rounded-xl bg-brand-primary px-4 py-2 font-medium text-white hover:bg-brand-dark">
        Search
      </button>
    </form>
  );
}
