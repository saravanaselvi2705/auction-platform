import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { getSellerDashboard } from "../../services/dashboardService";
import { deleteProduct, closeAuction } from "../../services/productService";
import { getImageUrl } from "../../utils/getImageUrl";
import PageTitle from "../../components/common/PageTitle";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import {
  PencilIcon,
  TrashIcon,
  XCircleIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

export default function MyProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      try {
        const res = await getSellerDashboard();
        if (active && res.success && res.dashboard) {
          setProducts(res.dashboard.products || []);
        }
      } catch (error) {
        console.error("Failed to load seller's products:", error);
        if (active) toast.error("Error loading products list.");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadData();
    return () => {
      active = false;
    };
  }, [refreshTrigger]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing? This action cannot be undone.")) return;

    try {
      setLoading(true);
      const res = await deleteProduct(id);
      if (res.success) {
        toast.success("Listing deleted successfully.");
        setRefreshTrigger((prev) => !prev);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete product.");
      setLoading(false);
    }
  };

  const handleClose = async (id) => {
    if (!window.confirm("Are you sure you want to manually close this auction?")) return;

    try {
      setLoading(true);
      const res = await closeAuction(id);
      if (res.success) {
        toast.success("Auction closed successfully.");
        setRefreshTrigger((prev) => !prev);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to close auction.");
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader message="Updating listing catalog..." />;
  }

  const imageFallback = "https://images.unsplash.com/photo-1546213290-e1b7610339e5?q=80&w=600&auto=format&fit=crop";

  return (
    <div className="space-y-6">
      <PageTitle title="My Auction Listings" />
      <Toaster position="top-center" />

      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">My Listings</h1>
        <p className="text-gray-500 font-semibold text-sm">
          Track and manage your products listed for bidding.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold text-xs uppercase">
                  <th className="px-6 py-4">Product Details</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Auction Type</th>
                  <th className="px-6 py-4">Starting Price</th>
                  <th className="px-6 py-4">Highest Bid</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 min-w-[220px]">
                      <div className="flex items-center gap-3">
                        <img
                          src={getImageUrl(p.image)}
                          alt={p.title}
                          className="h-10 w-10 rounded-lg object-cover border"
                        />
                        <div>
                          <span className="font-extrabold text-gray-900 block">{p.title}</span>
                          <span className="text-xxs text-gray-400 font-semibold">
                            Listed: {new Date(p.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-700">{p.category}</td>
                    <td className="px-6 py-4 font-semibold text-gray-700 capitalize">{p.auctionType}</td>
                    <td className="px-6 py-4 font-black text-gray-900">₹ {p.startingPrice.toLocaleString()}</td>
                    <td className="px-6 py-4 font-black text-blue-600">
                      {p.highestBid > 0 ? `₹ ${p.highestBid.toLocaleString()}` : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xxs font-semibold border ${
                          p.status === "active"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/products/${p._id}`}
                          title="View Page"
                          className="p-1.5 hover:bg-gray-100 text-gray-500 hover:text-gray-900 rounded-lg transition-colors"
                        >
                          <EyeIcon className="h-4.5 w-4.5" />
                        </Link>
                        {p.status === "active" && (
                          <>
                            <Link
                              to={`/seller-dashboard/edit-product/${p._id}`}
                              title="Edit Listing"
                              className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                            >
                              <PencilIcon className="h-4.5 w-4.5" />
                            </Link>
                            <button
                              onClick={() => handleClose(p._id)}
                              title="Close Auction"
                              className="p-1.5 hover:bg-amber-50 text-amber-600 rounded-lg transition-colors"
                            >
                              <XCircleIcon className="h-4.5 w-4.5" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(p._id)}
                          title="Delete Listing"
                          className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                        >
                          <TrashIcon className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No listings found"
            description="You have not created any auction listings yet. Get started by creating your first listing."
            actionText="Create Listing"
            onAction={() => navigate("/seller-dashboard/add-product")}
          />
        )}
      </div>
    </div>
  );
}
