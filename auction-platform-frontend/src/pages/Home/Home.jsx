import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  TrophyIcon,
  ShoppingBagIcon,
  SparklesIcon,
  ArrowRightIcon,
  BanknotesIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { getProducts } from "../../services/productService";
import ProductCard from "../../components/products/ProductCard";
import PageTitle from "../../components/common/PageTitle";
import Skeleton from "../../components/ui/Skeleton";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const data = await getProducts();
        if (data.success && data.products) {
          // Display active products first, limited to 3 items
          const activeAuctions = data.products
            .filter((p) => p.status === "active")
            .slice(0, 3);
          setProducts(activeAuctions);
        }
      } catch (error) {
        console.error("Error loading products for homepage:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const stats = [
    { label: "Total Volume Traded", value: "₹25.4 Lakhs+", icon: BanknotesIcon },
    { label: "Active Bidders", value: "8,500+", icon: UsersIcon },
    { label: "Successful Auctions", value: "12,000+", icon: TrophyIcon },
  ];

  const categories = [
    { name: "Electronics", count: "124 items", image: "https://picsum.photos/400/300?random=10" },
    { name: "Vehicles", count: "48 items", image: "https://picsum.photos/400/300?random=11" },
    { name: "Art & Antiques", count: "89 items", image: "https://picsum.photos/400/300?random=12" },
    { name: "Real Estate", count: "15 items", image: "https://picsum.photos/400/300?random=13" },
  ];

  const steps = [
    {
      title: "1. Create Account",
      desc: "Register as a Buyer or Seller in just a few steps to join our growing network.",
      icon: UsersIcon,
    },
    {
      title: "2. List or Bid",
      desc: "Sellers list items with description & dates; Buyers place bids in real-time.",
      icon: ShoppingBagIcon,
    },
    {
      title: "3. Win & Secure",
      desc: "When time expires, the highest bidder wins! Secure emails notify both parties.",
      icon: TrophyIcon,
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      <PageTitle title="Buy, Sell & Bid with Confidence" />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 text-white py-24 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 space-y-6 text-center md:text-left"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/30 text-blue-100 text-sm font-semibold">
              <SparklesIcon className="h-4 w-4" /> Seamless Real-time Auctions
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none">
              Bid, Win, and <br />
              <span className="text-blue-200">Sell Securely</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-xl">
              Experience the excitement of live bidding. List your products or compete for the best items at incredible prices on India's premier online auction platform.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
              <Link
                to="/products"
                className="rounded-xl bg-white px-6 py-3.5 font-bold text-blue-700 hover:bg-blue-50 hover:shadow-lg transition-all duration-200 flex items-center gap-2"
              >
                Explore Active Auctions <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-blue-700/50 border border-blue-500/30 px-6 py-3.5 font-bold text-white hover:bg-blue-700 transition-all duration-200"
              >
                Create an Account
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex-1 w-full max-w-md bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/10 relative shadow-2xl"
          >
            <div className="absolute -top-6 -right-6 h-12 w-12 rounded-full bg-yellow-400 text-gray-900 flex items-center justify-center font-bold text-lg rotate-12 shadow-lg">
              ✨
            </div>
            <h3 className="text-lg font-extrabold mb-4">🏆 Featured Item</h3>
            <img
              src="https://picsum.photos/400/250?random=15"
              alt="Featured Item"
              className="rounded-2xl w-full h-48 object-cover mb-4 shadow-inner"
            />
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold text-lg">Vintage Leather Chronograph</h4>
                <p className="text-xs text-blue-200">Current Bid: ₹15,000</p>
              </div>
              <Link
                to="/products"
                className="rounded-lg bg-white/20 hover:bg-white text-white hover:text-blue-700 px-3 py-2 text-xs font-bold transition-all"
              >
                Bid Now
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-gray-50 border-y border-gray-100 py-12">
        <div className="mx-auto max-w-7xl px-6 grid gap-8 md:grid-cols-3">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-gray-900">{stat.value}</div>
                  <div className="text-sm font-semibold text-gray-500">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured/Latest Auctions Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">Live Bidding</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-1">Featured Auctions</h2>
            </div>
            <Link to="/products" className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1.5 transition-colors">
              See All Auctions <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-8 md:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <Skeleton.Card key={n} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 font-medium">
              No live auctions available right now. Check back soon or list one yourself!
            </div>
          )}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="bg-gray-50/50 py-24 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">Browse by Interest</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-1">Popular Categories</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat, idx) => (
              <Link
                key={idx}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="group relative h-48 rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-900/30 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="font-bold text-lg">{cat.name}</h4>
                  <p className="text-xs text-gray-300 font-semibold">{cat.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">Simple Process</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-1">How It Works</h2>
          </div>

          <div className="grid gap-12 md:grid-cols-3 relative">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="flex flex-col items-center text-center p-4">
                  <div className="p-4 rounded-2xl bg-blue-50 text-blue-600 mb-6 shadow-sm border border-blue-100">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-extrabold text-xl text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-600/30 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto max-w-4xl px-6 text-center space-y-6 relative z-10">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-none">
            Ready to list your first item?
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Sellers get access to a powerful analytics panel, live bids tracking, and zero listing fees. Create your account today.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <Link
              to="/register"
              className="rounded-xl bg-blue-600 hover:bg-blue-700 px-8 py-4 font-bold text-white shadow-lg shadow-blue-900/30 hover:-translate-y-0.5 transition-all duration-200"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}