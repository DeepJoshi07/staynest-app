import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function HostRoute({ children }) {
  const { user } = useAuth();
  if (user?.role !== "host") return <Navigate to="/dashboard/bookings" replace />;
  return children;
}
