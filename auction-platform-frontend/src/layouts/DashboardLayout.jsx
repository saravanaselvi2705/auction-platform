import { Outlet, Navigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/common/Loader";

export default function DashboardLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader message="Loading dashboard..." />;
  }

  // Double check auth
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Dashboard Pages */}
        <main className="flex-1 p-8 max-w-7xl overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
