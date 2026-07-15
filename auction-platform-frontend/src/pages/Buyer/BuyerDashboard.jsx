import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { getBuyerDashboard } from "../../services/dashboardService";
import { useAuth } from "../../context/AuthContext";
import PageTitle from "../../components/common/PageTitle";
import Loader from "../../components/common/Loader";
import StatsCard from "../../components/dashboard/StatsCars";
import {
  ClipboardDocumentListIcon,
  ClockIcon,
  TrophyIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export default function BuyerDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchDashboard = async () => {
      try {
        const res = await getBuyerDashboard();
        if (active && res.success && res.dashboard) {
          setData(res.dashboard);
        }
      } catch (error) {
        console.error("Failed to load buyer dashboard:", error);
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
    return <Loader message="Loading dashboard statistics..." />;
  }

  const { totalBids = 0, activeBids = 0, wonAuctions = 0, bids = [] } = data || {};

  // Get distinct latest bids per product to avoid duplicates in overview
  const uniqueBids = [];
  const seenProducts = new Set();
  
  bids.forEach((bid) => {
    if (bid.product && !seenProducts.has(bid.product._id)) {
      seenProducts.add(bid.product._id);
      uniqueBids.push(bid);
    }
  });

  const recentBids = uniqueBids.slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageTitle title="Buyer Dashboard" />
      <Toaster position="top-center" />

      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Buyer Dashboard</h1>
          <p className="text-gray-500 font-semibold text-sm">
            Welcome back, {user?.name}! Keep track of your bids and winnings.
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-100 hover:-translate-y-0.5 transition-all duration-200"
        >
          <MagnifyingGlassIcon className="h-4.5 w-4.5 stroke-[3]" /> Browse Auctions
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Total Bids Placed"
          value={totalBids}
          icon={ClipboardDocumentListIcon}
          description="Total bids in history"
        />
        <StatsCard
          title="Active Bids"
          value={activeBids}
          icon={ClockIcon}
          description="On live running auctions"
          className="border-l-4 border-l-blue-500"
        />
        <StatsCard
          title="Won Auctions"
          value={wonAuctions}
          icon={TrophyIcon}
          description="Successful bid winnings"
          className="border-l-4 border-l-green-500"
        />
      </div>

      {/* Main Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Bidding Activity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-900 text-lg">My Recent Bids</h3>
            <Link
              to="/buyer-dashboard/my-bids"
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              View All Bids
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {recentBids.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {recentBids.map((b) => {
                  const prod = b.product;
                  if (!prod) return null;

                  const isWinning = prod.highestBidder === user?.id;
                  const isClosed = prod.status === "closed";
                  const imageFallback = "https://images.unsplash.com/photo-1546213290-e1b7610339e5?q=80&w=600&auto=format&fit=crop";

                  const getBidStatus = () => {
                    if (isClosed) {
                      return prod.winner === user?.id
                        ? { label: "Won", variant: "success" }
                        : { label: "Ended", variant: "danger" };
                    }
                    return isWinning
                      ? { label: "Winning", variant: "success" }
                      : { label: "Outbid", variant: "warning" };
                  };

                  const { label: bidStatusLabel, variant: bidStatusVar } = getBidStatus();

                  return (
                    <div key={b._id} className="p-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-center gap-4 min-w-0">
                        <img
                          src={prod.image || imageFallback}
                          alt={prod.title}
                          className="h-12 w-12 rounded-xl object-cover border border-gray-100"
                        />
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-gray-900 text-sm truncate max-w-[200px] sm:max-w-[300px]">
                            {prod.title}
                          </h4>
                          <span className="text-xxs font-semibold text-gray-400 block mt-0.5">
                            Category: {prod.category}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <span className="text-xs font-black text-blue-600 block">
                            ₹ {b.amount.toLocaleString()}
                          </span>
                          <span className="text-xxs font-bold text-gray-400 block">
                            Your Bid
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-black text-gray-900 block">
                            ₹ {prod.highestBid.toLocaleString()}
                          </span>
                          <span className="text-xxs font-bold text-gray-400 block">
                            Highest Bid
                          </span>
                        </div>

                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xxs font-semibold border ${
                            bidStatusVar === "success"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : bidStatusVar === "warning"
                              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          {bidStatusLabel}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 font-medium space-y-4">
                <p>You haven't placed any bids yet.</p>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 font-bold px-4 py-2 rounded-xl text-sm"
                >
                  Find Auctions & Place a Bid
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick guidelines */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 text-lg">Bidding Rules</h3>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4 text-xs leading-relaxed text-gray-500 font-medium">
            <p>
              <strong className="text-gray-900 block mb-1">1. Keep Bids Incremental</strong>
              Your bid must always exceed the current highest bid.
            </p>
            <p>
              <strong className="text-gray-900 block mb-1">2. Non-Retractable Bids</strong>
              Once placed, bids cannot be retracted. If you win, you are contractually obligated to pay the seller.
            </p>
            <p>
              <strong className="text-gray-900 block mb-1">3. Notification Emails</strong>
              Upon winning an auction, you'll receive a confirmation email with seller details to finalise transaction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
