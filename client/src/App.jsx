import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import LoaderSkeleton from "./components/LoaderSkeleton";
import ScrollToTop from "./components/ScrollToTop";

const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const ListingsPage = lazy(() => import("./pages/ListingsPage"));
const ListingDetailsPage = lazy(() => import("./pages/ListingDetailsPage"));
const ListingFormPage = lazy(() => import("./pages/ListingFormPage"));
const MyListingsPage = lazy(() => import("./pages/MyListingsPage"));
const MyBookingsPage = lazy(() => import("./pages/MyBookingsPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <ScrollToTop />
      <Navbar />
      <main className="min-h-[calc(100vh-160px)]">
        <Suspense fallback={<LoaderSkeleton variant="page" />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/listings" element={<ListingsPage />} />
            <Route path="/listings/:id" element={<ListingDetailsPage />} />
            <Route
              path="/host/add"
              element={
                <ProtectedRoute>
                  <ListingFormPage mode="add" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/host/edit/:id"
              element={
                <ProtectedRoute>
                  <ListingFormPage mode="edit" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/listings"
              element={
                <ProtectedRoute>
                  <MyListingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/mybookings"
              element={
                <ProtectedRoute>
                  <MyBookingsPage />
                </ProtectedRoute>
              }
            />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;
