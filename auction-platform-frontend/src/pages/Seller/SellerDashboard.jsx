import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { getSellerDashboard } from "../../services/dashboardService";
import { useAuth } from "../../context/AuthContext";
import PageTitle from "../../components/common/PageTitle";
import Loader from "../../components/common/Loader";
import StatsCard from "../../components/dashboard/StatsCars";
import {
  BanknotesIcon,
  ShoppingBagIcon,
  ClockIcon,
  TrophyIcon,
  PlusIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

export default function SellerDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchDashboard = async () => {
      try {
        const res = await getSellerDashboard();
        if (active && res.success && res.dashboard) {
          setData(res.dashboard);
        }
      } catch (error) {
        console.error("Failed to load seller dashboard:", error);
        if (active) toast.error("Error loading dashboard data.");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchDashboard();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <Loader message="Loading dashboard stats..." />;
  }

  const { totalProducts = 0, activeAuctions = 0, closedAuctions = 0, revenue = 0, products = [] } = data || {};

  const recentProducts = products.slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageTitle title="Seller Dashboard" />
      <Toaster position="top-center" />

      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Seller Dashboard</h1>
          <p className="text-gray-500 font-semibold text-sm">
            Welcome back, {user?.name}! Manage your listings and track your earnings.
          </p>
        </div>
        <Link
          to="/seller-dashboard/add-product"
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-100 hover:-translate-y-0.5 transition-all duration-200"
        >
          <PlusIcon className="h-4.5 w-4.5 stroke-[3]" /> Add New Product
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={`₹${revenue.toLocaleString()}`}
          icon={BanknotesIcon}
          description="From finalised auctions"
          className="border-l-4 border-l-green-500"
        />
        <StatsCard
          title="Total Products"
          value={totalProducts}
          icon={ShoppingBagIcon}
          description="Listed items overall"
        />
        <StatsCard
          title="Active Auctions"
          value={activeAuctions}
          icon={ClockIcon}
          description="Currently accepting bids"
          className="border-l-4 border-l-blue-500"
        />
        <StatsCard
          title="Closed Auctions"
          value={closedAuctions}
          icon={TrophyIcon}
          description="Finished auction listings"
        />
      </div>

      {/* Main Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Listings */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-900 text-lg">My Recent Listings</h3>
            <Link
              to="/seller-dashboard/my-products"
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              View All
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {recentProducts.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {recentProducts.map((p) => {
                  const displayPrice = p.highestBid > 0 ? p.highestBid : p.startingPrice;
                  const imageFallback = "https://images.unsplash.com/photo-1546213290-e1b7610339e5?q=80&w=600&auto=format&fit=crop";
                  return (
                    <div key={p._id} className="p-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-center gap-4 min-w-0">
                        <img
                          src={p.image || imageFallback}
                          alt={p.title}
                          className="h-12 w-12 rounded-xl object-cover border border-gray-100"
                        />
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-gray-900 text-sm truncate max-w-[200px] sm:max-w-[300px]">
                            {p.title}
                          </h4>
                          <span className="text-xxs font-semibold text-gray-400 capitalize block mt-0.5">
                            {p.category} • {p.auctionType}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <span className="text-xs font-black text-gray-900 block">
                            ₹ {displayPrice.toLocaleString()}
                          </span>
                          <span className="text-xxs font-bold text-gray-400 block">
                            {p.highestBid > 0 ? "Highest Bid" : "Starting Price"}
                          </span>
                        </div>

                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xxs font-semibold border ${
                            p.status === "active"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 font-medium space-y-4">
                <p>You haven't listed any products yet.</p>
                <Link
                  to="/seller-dashboard/add-product"
                  className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 font-bold px-4 py-2 rounded-xl text-sm"
                >
                  Create Your First Listing
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 text-lg">Quick Tips</h3>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
            <div className="flex gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg h-9 w-9 flex items-center justify-center shrink-0">
                <SparklesIcon className="h-5 w-5" />
              </div>
              <div>
                <h5 className="font-bold text-sm text-gray-900">Good Image Matters</h5>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  Items with clear photos receive 80% more bids. Use high-quality image URLs when creating listings.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg h-9 w-9 flex items-center justify-center shrink-0">
                <TrophyIcon className="h-5 w-5" />
              </div>
              <div>
                <h5 className="font-bold text-sm text-gray-900">Closing Auctions</h5>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  Closing an auction manually finalises the highest bidder immediately. Email notifications are triggered automatically to the winner.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
