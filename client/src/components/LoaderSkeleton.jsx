export default function LoaderSkeleton({ variant = "grid" }) {
  if (variant === "page") {
    return <div className="container-base py-10"><div className="h-72 animate-pulse rounded-2xl bg-slate-200" /></div>;
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div key={idx} className="overflow-hidden rounded-2xl bg-white p-4">
          <div className="mb-3 h-48 animate-pulse rounded-xl bg-slate-200" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
        </div>
      ))}
    </div>
  );
}
