import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { getBuyerDashboard } from "../../services/dashboardService";
import { getImageUrl } from "../../utils/getImageUrl";
import { useAuth } from "../../context/AuthContext";
import PageTitle from "../../components/common/PageTitle";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import { EyeIcon } from "@heroicons/react/24/outline";

export default function MyBids() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchBids = async () => {
      try {
        const res = await getBuyerDashboard();
        if (active && res.success && res.dashboard) {
          setBids(res.dashboard.bids || []);
        }
      } catch (error) {
        console.error("Failed to load buyer bids:", error);
        if (active) toast.error("Error loading bids.");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchBids();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <Loader message="Updating bid history..." />;
  }

  const imageFallback = "https://images.unsplash.com/photo-1546213290-e1b7610339e5?q=80&w=600&auto=format&fit=crop";

  return (
    <div className="space-y-6">
      <PageTitle title="My Bidding History" />
      <Toaster position="top-center" />

      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">My Bids</h1>
        <p className="text-gray-500 font-semibold text-sm">
          Keep track of all auctions you have bid on and their current status.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {bids.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold text-xs uppercase">
                  <th className="px-6 py-4">Product Details</th>
                  <th className="px-6 py-4">Your Bid Amount</th>
                  <th className="px-6 py-4">Current Highest Bid</th>
                  <th className="px-6 py-4">Auction Status</th>
                  <th className="px-6 py-4">My Status</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bids.map((b) => {
                  const prod = b.product;
                  if (!prod) return null;

                  const isWinning = prod.highestBidder === user?.id;
                  const isClosed = prod.status === "closed";

                  const getMyStatus = () => {
                    if (isClosed) {
                      return prod.winner === user?.id
                        ? { label: "Won", variant: "success" }
                        : { label: "Lost", variant: "danger" };
                    }
                    return isWinning
                      ? { label: "Winning", variant: "success" }
                      : { label: "Outbid", variant: "warning" };
                  };

                  const { label: myStatusLabel, variant: myStatusVar } = getMyStatus();

                  return (
                    <tr key={b._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 min-w-[220px]">
                        <div className="flex items-center gap-3">
                          <img
                            src={getImageUrl(prod.image)}
                            alt={prod.title}
                            className="h-10 w-10 rounded-lg object-cover border"
                          />
                          <div>
                            <span className="font-extrabold text-gray-900 block">{prod.title}</span>
                            <span className="text-xxs text-gray-400 font-semibold">
                              Bid Date: {new Date(b.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-black text-blue-600">
                        ₹ {b.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 font-black text-gray-950">
                        ₹ {prod.highestBid.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 capitalize">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xxs font-semibold border ${
                            prod.status === "active"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          {prod.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xxs font-semibold border ${
                            myStatusVar === "success"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : myStatusVar === "warning"
                              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          {myStatusLabel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link
                          to={`/products/${prod._id}`}
                          title="View Auction Details"
                          className="p-1.5 inline-block hover:bg-gray-100 text-gray-500 hover:text-gray-900 rounded-lg transition-colors"
                        >
                          <EyeIcon className="h-4.5 w-4.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No bids placed"
            description="You haven't placed any bids on active auctions yet."
            actionText="Browse Live Auctions"
            onAction={() => navigate("/products")}
          />
        )}
      </div>
    </div>
  );
}
