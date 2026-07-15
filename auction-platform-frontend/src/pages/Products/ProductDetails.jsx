import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { getProductById, closeAuction } from "../../services/productService";
import { getBidHistory, placeBid } from "../../services/bidService";
import { useAuth } from "../../context/AuthContext";
import PageTitle from "../../components/common/PageTitle";
import Loader from "../../components/common/Loader";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import Card from "../../components/ui/Card";
import {
  CalendarIcon,
  UserIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [biddingLoading, setBiddingLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: "",
    },
  });

  // Derive expiration status
  const isExpired = product?.status === "closed" ||
    (product?.auctionEnd && new Date(product.auctionEnd) <= new Date());

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      try {
        const prodRes = await getProductById(id);
        if (active && prodRes.success && prodRes.product) {
          setProduct(prodRes.product);
        }

        const bidsRes = await getBidHistory(id);
        if (active && bidsRes.success && bidsRes.bids) {
          setBids(bidsRes.bids);
        }
      } catch (error) {
        console.error("Failed to load product details:", error);
        if (active) toast.error("Error loading product details.");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadData();
    return () => {
      active = false;
    };
  }, [id, refreshTrigger]);

  useEffect(() => {
    if (!product || product.status === "closed") {
      const t = setTimeout(() => setTimeLeft("Auction Closed"), 0);
      return () => clearTimeout(t);
    }

    if (!product.auctionEnd) {
      const t = setTimeout(() => setTimeLeft("No date set"), 0);
      return () => clearTimeout(t);
    }

    const updateTime = () => {
      const difference = new Date(product.auctionEnd) - new Date();
      if (difference <= 0) {
        setTimeLeft("Ended");
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        if (days > 0) {
          setTimeLeft(`${days} days, ${hours} hours`);
        } else if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        } else {
          setTimeLeft(`${minutes}m ${seconds}s`);
        }
      }
    };

    const initialT = setTimeout(updateTime, 0);
    const interval = setInterval(updateTime, 1000);

    return () => {
      clearTimeout(initialT);
      clearInterval(interval);
    };
  }, [product]);

  const onBidSubmit = async (data) => {
    if (!user) {
      toast.error("Please login to place a bid.");
      navigate("/login");
      return;
    }

    if (user.role !== "buyer") {
      toast.error("Only buyers can place bids.");
      return;
    }

    const bidVal = parseFloat(data.amount);
    const minBid = product.highestBid > 0 ? product.highestBid : product.startingPrice;

    if (bidVal <= minBid) {
      toast.error(`Bid must be greater than current highest bid/starting price (₹${minBid})`);
      return;
    }

    try {
      setBiddingLoading(true);
      const res = await placeBid(product._id, bidVal);
      if (res.success) {
        toast.success("Bid placed successfully!");
        reset();
        setRefreshTrigger((prev) => !prev);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place bid.");
    } finally {
      setBiddingLoading(false);
    }
  };

  const handleCloseAuction = async () => {
    if (!window.confirm("Are you sure you want to close this auction? This will finalise the winner.")) return;

    try {
      setBiddingLoading(true);
      const res = await closeAuction(product._id);
      if (res.success) {
        toast.success("Auction closed successfully!");
        setRefreshTrigger((prev) => !prev);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to close auction.");
    } finally {
      setBiddingLoading(false);
    }
  };

  if (loading) {
    return <Loader message="Loading auction details..." />;
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
        <h2 className="text-2xl font-black text-gray-900 mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-6">The auction product you are looking for does not exist or has been removed.</p>
        <Link to="/products" className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white">
          Back to Browse
        </Link>
      </div>
    );
  }

  const currentPrice = product.highestBid > 0 ? product.highestBid : product.startingPrice;
  const isSeller = user && user.id === product.seller?._id;
  const imageFallback = "https://images.unsplash.com/photo-1546213290-e1b7610339e5?q=80&w=600&auto=format&fit=crop";

  return (
    <div className="bg-gray-50/50 min-h-screen py-10 px-6">
      <PageTitle title={product.title} />
      <Toaster position="top-center" />

      <div className="mx-auto max-w-6xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link to="/products" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
            &larr; Back to Browse
          </Link>
          <button
            onClick={() => setRefreshTrigger((prev) => !prev)}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 border bg-white rounded-lg px-2.5 py-1.5 shadow-sm"
          >
            <ArrowPathIcon className="h-4 w-4" /> Refresh
          </button>
        </div>

        {/* Closed Winner Banner */}
        {product.status === "closed" && (
          <div className="mb-8 rounded-2xl bg-amber-50 border border-amber-200 p-6 flex flex-col sm:flex-row items-center gap-4 text-amber-800">
            <div className="p-3 bg-amber-100 rounded-full">
              <TrophyIcon className="h-8 w-8 text-amber-700 animate-bounce" />
            </div>
            <div className="text-center sm:text-left flex-grow">
              <h4 className="font-extrabold text-lg">Auction Closed</h4>
              <p className="text-sm text-amber-700 font-semibold mt-0.5">
                {product.highestBidder ? (
                  <span>
                    Winner: Bidder (₹{product.highestBid.toLocaleString()})
                  </span>
                ) : (
                  "This auction closed with no bids."
                )}
              </p>
            </div>
          </div>
        )}

        {/* Main Details Panel */}
        <div className="grid gap-8 lg:grid-cols-3 items-start">
          {/* Images & Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <img
                src={product.image || imageFallback}
                alt={product.title}
                className="w-full h-96 object-cover"
              />
              <Card.Body className="space-y-4">
                <div className="flex gap-2">
                  <Badge variant={product.status === "active" ? "success" : "danger"}>
                    {product.status === "active" ? "Active" : "Closed"}
                  </Badge>
                  <Badge variant="neutral" className="uppercase">
                    {product.category}
                  </Badge>
                  <Badge variant="info" className="capitalize">
                    {product.auctionType} Auction
                  </Badge>
                </div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">
                  {product.title}
                </h1>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line pt-2">
                  {product.description}
                </p>
              </Card.Body>
            </Card>

            {/* Bids History Card */}
            <Card>
              <Card.Header className="flex justify-between items-center">
                <h3 className="font-bold text-gray-900">Bid History ({bids.length})</h3>
                <span className="text-xs text-gray-400 font-bold">Highest to lowest</span>
              </Card.Header>
              <Card.Body className="p-0">
                {bids.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold text-xs uppercase">
                          <th className="px-6 py-3">Bidder</th>
                          <th className="px-6 py-3">Bid Amount</th>
                          <th className="px-6 py-3">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {bids.map((bid, index) => (
                          <tr key={bid._id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 font-semibold text-gray-800">
                              {index === 0 && product.status === "closed" ? (
                                <span className="inline-flex items-center gap-1">
                                  👑 {bid.bidder?.name}
                                </span>
                              ) : (
                                bid.bidder?.name
                              )}
                            </td>
                            <td className="px-6 py-4 font-black text-blue-600">
                              ₹ {bid.amount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-xs font-semibold text-gray-500">
                              {new Date(bid.createdAt).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-500 font-medium">
                    No bids have been placed yet. Be the first to place a bid!
                  </div>
                )}
              </Card.Body>
            </Card>
          </div>

          {/* Sidebar controls */}
          <div className="space-y-6">
            {/* Bid Panel Card */}
            <Card className="border-t-4 border-t-blue-600">
              <Card.Body className="space-y-5">
                <div className="pb-3 border-b border-gray-100">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">
                    {product.highestBid > 0 ? "Current Highest Bid" : "Starting Price"}
                  </span>
                  <span className="text-3xl font-black text-blue-600 mt-1 block">
                    ₹ {currentPrice.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">
                    Time Remaining
                  </span>
                  <span
                    className={`text-xl font-extrabold block ${
                      isExpired ? "text-red-500 animate-pulse" : "text-gray-900"
                    }`}
                  >
                    {timeLeft}
                  </span>
                  {!isExpired && product.auctionEnd && (
                    <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" /> End: {new Date(product.auctionEnd).toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Seller view close control */}
                {isSeller && product.status === "active" && (
                  <Button
                    variant="danger"
                    onClick={handleCloseAuction}
                    className="w-full py-3 mt-4"
                    loading={biddingLoading}
                  >
                    Close Auction Manually
                  </Button>
                )}

                {/* Buyer view place bid */}
                {!isSeller && product.status === "active" && (
                  <form onSubmit={handleSubmit(onBidSubmit)} className="space-y-4 pt-2 border-t border-gray-100">
                    <Input
                      label="Bid Amount (₹)"
                      type="number"
                      placeholder={`Enter ₹${(currentPrice + 1).toLocaleString()} or more`}
                      error={errors.amount}
                      {...register("amount", {
                        required: "Bid amount is required",
                        validate: (val) =>
                          parseFloat(val) > currentPrice ||
                          `Bid must be greater than current price (₹${currentPrice})`,
                      })}
                    />

                    <Button
                      type="submit"
                      variant="primary"
                      className="w-full py-3"
                      loading={biddingLoading}
                    >
                      Place Bid
                    </Button>
                    <p className="text-xs text-gray-400 font-semibold text-center leading-snug">
                      Your bid must be in whole numbers. Once placed, bids cannot be retracted.
                    </p>
                  </form>
                )}

                {product.status === "closed" && (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-start gap-3">
                    <ShieldCheckIcon className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-bold text-xs text-gray-700">Protected Auction Finished</h5>
                      <p className="text-xxs text-gray-400 mt-0.5 leading-snug">
                        Winning details have been saved, and notifications are sent out.
                      </p>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Seller Info Card */}
            <Card>
              <Card.Header>
                <h4 className="font-bold text-gray-900">Seller Information</h4>
              </Card.Header>
              <Card.Body className="space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-gray-800">{product.seller?.name}</h5>
                    <p className="text-xs font-semibold text-gray-400">Verified Seller</p>
                  </div>
                </div>
                <div className="pt-2.5 border-t border-gray-100 text-xs font-semibold text-gray-500 space-y-1">
                  <div>Email: {product.seller?.email}</div>
                  <div>Listed: {new Date(product.createdAt).toLocaleDateString()}</div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
