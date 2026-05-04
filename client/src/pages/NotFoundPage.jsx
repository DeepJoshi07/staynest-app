import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="container-base grid min-h-[60vh] place-items-center py-16 text-center">
      <Helmet><title>Not Found | Staynest</title></Helmet>
      <div>
        <h1 className="mb-3 text-4xl font-bold">404</h1>
        <p className="mb-6 text-slate-600">The page you are looking for does not exist.</p>
        <Link to="/" className="rounded-xl bg-brand-primary px-5 py-3 text-white hover:bg-brand-dark">Back to Home</Link>
      </div>
    </section>
  );
}
