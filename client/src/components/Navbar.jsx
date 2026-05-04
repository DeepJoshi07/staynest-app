import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { HomeIcon, Menu, Search, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container-base flex h-20 items-center justify-between gap-4">
        <Link to="/" className="flex gap-1 text-xl font-bold text-brand-primary">
          <HomeIcon/>staynest
        </Link>
        <button
          className="hidden items-center gap-2 rounded-full border px-4 py-2 text-sm shadow-sm transition hover:shadow md:flex"
          onClick={() => navigate("/listings")}
        >
          <Search size={16} /> Anywhere · Any week · Add guests
        </button>
        <nav className="hidden items-center gap-2 md:flex">
          <NavLink to="/listings" className="rounded-full px-3 py-2 text-sm hover:bg-slate-100">
            Explore
          </NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className="rounded-full px-3 py-2 text-sm hover:bg-slate-100">
                My Bookings
              </NavLink>
              <NavLink to="/host/add" className="rounded-full px-3 py-2 text-sm hover:bg-slate-100">
                Add listing
              </NavLink>
              <NavLink to="/dashboard/listings" className="rounded-full px-3 py-2 text-sm hover:bg-slate-100">
                My Listings
              </NavLink>
              <button
                className="rounded-full bg-brand-primary px-4 py-2 text-sm text-white hover:bg-brand-dark"
                onClick={logout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="rounded-full px-3 py-2 text-sm hover:bg-slate-100">
                Become a host
              </NavLink>
              <NavLink to="/login" className="rounded-full px-3 py-2 text-sm hover:bg-slate-100">
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className="rounded-full bg-brand-primary px-4 py-2 text-sm text-white hover:bg-brand-dark"
              >
                Sign Up
              </NavLink>
            </>
          )}
        </nav>
        <button
          type="button"
          className="rounded-full border p-2 md:hidden"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {isMobileMenuOpen ? (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="container-base flex flex-col gap-2 py-4">
            <NavLink
              to="/listings"
              className="rounded-lg px-3 py-2 text-sm hover:bg-slate-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Explore
            </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/dashboard"
                  className="rounded-lg px-3 py-2 text-sm hover:bg-slate-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Bookings
                </NavLink>
                <NavLink
                  to="/host/add"
                  className="rounded-lg px-3 py-2 text-sm hover:bg-slate-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Add listing
                </NavLink>
                <NavLink
                  to="/dashboard/listings"
                  className="rounded-lg px-3 py-2 text-sm hover:bg-slate-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Listings
                </NavLink>
                <button
                  className="rounded-lg bg-brand-primary px-3 py-2 text-left text-sm text-white hover:bg-brand-dark"
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="rounded-lg px-3 py-2 text-sm hover:bg-slate-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Become a host
                </NavLink>
                <NavLink
                  to="/login"
                  className="rounded-lg px-3 py-2 text-sm hover:bg-slate-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className="rounded-lg bg-brand-primary px-3 py-2 text-sm text-white hover:bg-brand-dark"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
