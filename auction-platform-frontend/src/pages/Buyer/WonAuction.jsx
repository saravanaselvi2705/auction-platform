import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { getBuyerDashboard } from "../../services/dashboardService";
import { getImageUrl } from "../../utils/getImageUrl";
import { useAuth } from "../../context/AuthContext";
import PageTitle from "../../components/common/PageTitle";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import { EyeIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

export default function WonAuction() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [wonProducts, setWonProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchWonAuctions = async () => {
      try {
        const res = await getBuyerDashboard();
        if (active && res.success && res.dashboard) {
          const bids = res.dashboard.bids || [];
          
          // Filter to closed auctions where the bidder matches product.winner
          const wonItems = [];
          const seenProducts = new Set();

          bids.forEach((bid) => {
            const prod = bid.product;
            if (
              prod &&
              prod.status === "closed" &&
              prod.winner === user?.id &&
              !seenProducts.has(prod._id)
            ) {
              seenProducts.add(prod._id);
              wonItems.push({
                product: prod,
                winningBid: bid.amount,
                wonAt: prod.updatedAt,
              });
            }
          });

          // Sort wonItems by newest date
          wonItems.sort((a, b) => new Date(b.wonAt) - new Date(a.wonAt));
          setWonProducts(wonItems);
        }
      } catch (error) {
        console.error("Failed to load won auctions:", error);
        if (active) toast.error("Error loading won auctions.");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchWonAuctions();
    return () => {
      active = false;
    };
  }, [user]);

  if (loading) {
    return <Loader message="Retrieving your trophy room..." />;
  }

  const imageFallback = "https://images.unsplash.com/photo-1546213290-e1b7610339e5?q=80&w=600&auto=format&fit=crop";

  return (
    <div className="space-y-6">
      <PageTitle title="My Won Auctions" />
      <Toaster position="top-center" />

      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Won Auctions</h1>
        <p className="text-gray-500 font-semibold text-sm">
          Congratulations! These are the auctions you won. Contact the sellers to finalise the handovers.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {wonProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold text-xs uppercase">
                  <th className="px-6 py-4">Product Details</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Starting Price</th>
                  <th className="px-6 py-4">Your Winning Bid</th>
                  <th className="px-6 py-4">Ended Date</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {wonProducts.map(({ product, winningBid, wonAt }) => (
                  <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 min-w-[220px]">
                      <div className="flex items-center gap-3">
                        <img
                          src={getImageUrl(product.image)}
                          alt={product.title}
                          className="h-10 w-10 rounded-lg object-cover border"
                        />
                        <div>
                          <span className="font-extrabold text-gray-900 block">{product.title}</span>
                          <span className="text-xxs text-gray-400 font-semibold">
                            ID: {product._id}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-700">{product.category}</td>
                    <td className="px-6 py-4 font-black text-gray-400">
                      ₹ {product.startingPrice.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-black text-green-600">
                      ₹ {winningBid.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-gray-500">
                      {new Date(wonAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/products/${product._id}`}
                          title="View Auction Details"
                          className="p-1.5 hover:bg-gray-100 text-gray-500 hover:text-gray-900 rounded-lg transition-colors"
                        >
                          <EyeIcon className="h-4.5 w-4.5" />
                        </Link>
                        {product.seller?.email && (
                          <a
                            href={`mailto:${product.seller.email}?subject=Won Auction: ${product.title}`}
                            title="Contact Seller"
                            className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                          >
                            <EnvelopeIcon className="h-4.5 w-4.5" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No winnings yet"
            description="You have not won any auctions yet. Keep bidding to win your first item!"
            actionText="Find Running Auctions"
            onAction={() => navigate("/products")}
          />
        )}
      </div>
    </div>
  );
}
