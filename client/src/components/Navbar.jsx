import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { HomeIcon, Menu, Search, X, LogOut, Camera, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Navbar() {
  const { accessToken, user, logout, updateImage } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const profileRef = useRef(null);
  const fileInputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync avatar from user object
  useEffect(() => {
    if (user?.image) setAvatarPreview(user.image);
  }, [user?.image]);

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Show local preview immediately
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      // POST to your upload endpoint — adjust URL as needed
      const res = await updateImage(formData);
      if(res.message){
        toast.success(res.message)
      }
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const getInitials = () => {
    if (!user?.username && !user?.name) return "U";
    const name = user.username || user.name;
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = user?.username || user?.name || "User";
  const displayEmail = user?.email || "";

  const ProfileAvatar = ({ size = "h-9 w-9", textSize = "text-sm" }) =>
    avatarPreview ? (
      <img
        src={avatarPreview}
        alt="Profile"
        className={`${size} rounded-full object-cover border-2 border-brand-primary`}
      />
    ) : (
      <span
        className={`${size} rounded-full bg-brand-primary text-white flex items-center justify-center font-semibold ${textSize}`}
      >
        {getInitials()}
      </span>
    );

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      {/* Single hidden file input — lives outside any hidden container so it always works */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleImageChange}
        aria-label="Upload profile photo"
      />
      <div className="container-base flex h-20 items-center justify-between gap-4">
        <Link
          to="/"
          className="flex gap-1 text-xl font-bold text-brand-primary"
        >
          <HomeIcon />
          staynest
        </Link>
        <button
          className="hidden items-center gap-2 rounded-full border px-4 py-2 text-sm shadow-sm transition hover:shadow md:flex"
          onClick={() => navigate("/listings")}
        >
          <Search size={16} /> Anywhere · Any week · Add guests
        </button>
        <nav className="hidden items-center gap-2 md:flex">
          <NavLink
            to="/listings"
            className="rounded-full px-3 py-2 text-sm hover:bg-slate-100"
          >
            Explore
          </NavLink>
          {accessToken ? (
            <>
              <NavLink
                to="/dashboard/mybookings"
                className="rounded-full px-3 py-2 text-sm hover:bg-slate-100"
              >
                My Bookings
              </NavLink>
              <NavLink
                to="/host/add"
                className="rounded-full px-3 py-2 text-sm hover:bg-slate-100"
              >
                Add listing
              </NavLink>
              <NavLink
                to="/dashboard/listings"
                className="rounded-full px-3 py-2 text-sm hover:bg-slate-100"
              >
                My Listings
              </NavLink>

              {/* Profile dropdown trigger */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen((p) => !p)}
                  className="flex items-center gap-2 rounded-full border border-slate-200 px-2 py-1.5 text-sm shadow-sm transition hover:shadow-md"
                  aria-label="Open profile menu"
                >
                  <ProfileAvatar />
                  <span className="hidden max-w-[100px] truncate font-medium lg:block">
                    {displayName}
                  </span>
                </button>

                {/* Dropdown panel */}
                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-slate-200 bg-white shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2">
                    {/* Profile header */}
                    <div className="flex flex-col items-center gap-3 px-5 py-5 border-b border-slate-100">
                      {/* Avatar + upload overlay */}
                      <div className="relative group">
                        {avatarPreview ? (
                          <img
                            src={avatarPreview}
                            alt="Profile"
                            className="h-20 w-20 rounded-full object-cover border-2 border-brand-primary"
                          />
                        ) : (
                          <span className="h-20 w-20 rounded-full bg-brand-primary text-white flex items-center justify-center text-2xl font-bold">
                            {getInitials()}
                          </span>
                        )}
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                          className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          aria-label="Upload profile photo"
                        >
                          {uploading ? (
                            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Camera size={20} className="text-white" />
                          )}
                        </button>
                      </div>

                      {/* Name & email */}
                      <div className="text-center">
                        <p className="font-semibold text-slate-800 text-base leading-tight">
                          {displayName}
                        </p>
                        {displayEmail && (
                          <p className="text-slate-500 text-sm mt-0.5 break-all">
                            {displayEmail}
                          </p>
                        )}
                      </div>

                      {/* Upload button */}
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 transition"
                      >
                        <Camera size={13} />
                        {uploading ? "Uploading…" : "Change photo"}
                      </button>
                    </div>

                    {/* Logout */}
                    <div className="px-3 py-3">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          logout();
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition font-medium"
                      >
                        <LogOut size={16} />
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="rounded-full px-3 py-2 text-sm hover:bg-slate-100"
              >
                Become a host
              </NavLink>
              <NavLink
                to="/login"
                className="rounded-full px-3 py-2 text-sm hover:bg-slate-100"
              >
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

      {/* Mobile menu */}
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
            {accessToken ? (
              <>
                {/* Mobile profile card */}
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 mb-1">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="relative shrink-0 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    aria-label="Upload profile photo"
                  >
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Profile"
                        className="h-12 w-12 rounded-full object-cover border-2 border-brand-primary"
                      />
                    ) : (
                      <span className="h-12 w-12 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-base">
                        {getInitials()}
                      </span>
                    )}
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm">
                      {uploading ? (
                        <div className="h-3 w-3 border border-brand-primary border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Camera size={11} className="text-slate-600" />
                      )}
                    </span>
                  </button>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 text-sm truncate">
                      {displayName}
                    </p>
                    {displayEmail && (
                      <p className="text-slate-500 text-xs truncate">
                        {displayEmail}
                      </p>
                    )}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-1 text-xs text-brand-primary hover:underline flex items-center gap-1"
                    >
                      <Camera size={11} /> Change photo
                    </button>
                  </div>
                </div>

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
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 font-medium"
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LogOut size={15} />
                  Log out
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
