import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Badge from "../ui/Badge";
import Card from "../ui/Card";
import { getImageUrl } from "../../utils/getImageUrl";
import { useAuth } from "../../context/AuthContext";

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const [timeLeft, setTimeLeft] = useState("");

  const imageFallback = "https://images.unsplash.com/photo-1546213290-e1b7610339e5?q=80&w=600&auto=format&fit=crop";

  useEffect(() => {
    if (product.status === "closed") {
      const t = setTimeout(() => setTimeLeft("Auction Ended"), 0);
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
          setTimeLeft(`${days}d ${hours}h`);
        } else if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m`);
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
  }, [product.auctionEnd, product.status]);

  const displayPrice = product.highestBid > 0 ? product.highestBid : product.startingPrice;
  const isHighest = product.highestBid > 0;

  return (
    <Card className="flex flex-col h-full">
      <div className="relative">
        <img
          src={getImageUrl(product.image)}
          alt={product.title}
          className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          <Badge variant={product.status === "active" ? "success" : "danger"}>
            {product.status === "active" ? "Active" : "Closed"}
          </Badge>
          <Badge variant="info" className="capitalize">
            {product.auctionType}
          </Badge>
        </div>
      </div>

      <Card.Body className="flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            {product.category}
          </span>
          <h3 className="text-lg font-extrabold text-gray-900 line-clamp-1">
            {product.title}
          </h3>
          <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-gray-400 font-bold block mb-0.5">
              {isHighest ? "Current Highest Bid" : "Starting Price"}
            </span>
            <span className="text-lg font-black text-blue-600 block">
              ₹ {displayPrice.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-xs text-gray-400 font-bold block mb-0.5">
              Time Remaining
            </span>
            <span
              className={`text-sm font-extrabold block mt-0.5 ${
                timeLeft === "Auction Ended" || timeLeft === "Ended"
                  ? "text-red-500"
                  : "text-gray-900"
              }`}
            >
              {timeLeft}
            </span>
          </div>
        </div>
      </Card.Body>

      <Card.Footer className="bg-white pt-0">
        <Link
          to={`/products/${product._id}`}
          className="w-full text-center block rounded-xl bg-blue-600 hover:bg-blue-700 py-3 font-bold text-white transition-all text-sm"
        >
          {product.status === "active"
            ? (user?.role === "seller" ? "View Auction" : "Bid & View Auction")
            : "View Results"}
        </Link>
      </Card.Footer>
    </Card>
  );
}