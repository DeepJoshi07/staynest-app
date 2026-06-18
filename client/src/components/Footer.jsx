import { Facebook, Instagram, Twitter, Youtube, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Newsletter signup placeholder logic
    alert("Thank you for subscribing to Staynest!");
  };

  return (
    <footer className="relative overflow-hidden border-t border-slate-100 bg-white text-slate-600">
      {/* Top Brand Gradient Line */}
      <div className="h-[3px] w-full bg-gradient-to-r from-brand-primary via-pink-500 to-violet-600" />

      {/* Decorative background glow */}
      <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-brand-primary/5 blur-[120px]" />
      <div className="absolute -bottom-40 right-20 h-80 w-80 rounded-full bg-violet-600/3 blur-[120px]" />

      <div className="container-base relative z-10 py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand & Slogan Column */}
          <div className="space-y-4 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-brand-primary to-pink-500 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
                Staynest
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-slate-500">
              Discover unique stays and find your perfect home away from home. Explore a world of comfort, privacy, and authentic local experiences.
            </p>
            {/* Newsletter form */}
            <div className="pt-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-800">
                Join our newsletter
              </h4>
              <form onSubmit={handleSubmit} className="mt-3 flex max-w-sm gap-2">
                <div className="relative flex-grow">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-brand-primary focus:bg-white focus:ring-1 focus:ring-brand-primary"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-primary/20 hover:bg-brand-dark active:scale-95 transition-all"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Column 1: Explore */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link to="/listings" className="hover:text-brand-primary transition-colors">
                  All Listings
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-brand-primary transition-colors">
                  Popular Stays
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-primary transition-colors">
                  Special Offers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-primary transition-colors">
                  Travel Articles
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Hosting */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Hosting
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a href="#" className="hover:text-brand-primary transition-colors">
                  Host your Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-primary transition-colors">
                  Hosting Resources
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-primary transition-colors">
                  Community Forum
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-primary transition-colors">
                  Trust & Safety
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Support
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a href="#" className="hover:text-brand-primary transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-primary transition-colors">
                  Cancellation Options
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-primary transition-colors">
                  Safety Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-primary transition-colors">
                  Report Concern
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col gap-6 border-t border-slate-100 pt-8 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p className="text-slate-400">
            © {new Date().getFullYear()} Staynest, Inc. All rights reserved.
          </p>
          
          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              aria-label="Twitter"
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-slate-500 hover:-translate-y-0.5 hover:border-brand-primary/30 hover:bg-brand-primary/[0.04] hover:text-brand-primary transition-all"
            >
              <Twitter size={15} />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-slate-500 hover:-translate-y-0.5 hover:border-brand-primary/30 hover:bg-brand-primary/[0.04] hover:text-brand-primary transition-all"
            >
              <Instagram size={15} />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-slate-500 hover:-translate-y-0.5 hover:border-brand-primary/30 hover:bg-brand-primary/[0.04] hover:text-brand-primary transition-all"
            >
              <Facebook size={15} />
            </a>
            <a
              href="#"
              aria-label="Youtube"
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-slate-500 hover:-translate-y-0.5 hover:border-brand-primary/30 hover:bg-brand-primary/[0.04] hover:text-brand-primary transition-all"
            >
              <Youtube size={15} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
