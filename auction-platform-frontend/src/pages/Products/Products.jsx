import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../../services/productService";
import ProductCard from "../../components/products/ProductCard";
import PageTitle from "../../components/common/PageTitle";
import EmptyState from "../../components/common/EmptyState";
import Skeleton from "../../components/ui/Skeleton";
import Select from "../../components/ui/Select";
import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [auctionType, setAuctionType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    let active = true;
    const fetchAllProducts = async () => {
      try {
        const data = await getProducts();
        if (active && data.success && data.products) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Failed to load products list:", error);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchAllProducts();
    return () => {
      active = false;
    };
  }, []);

  // Compute filtered listings
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (category) {
      result = result.filter((p) => p.category === category);
    }

    // Status filter
    if (status !== "all") {
      result = result.filter((p) => p.status === status);
    }

    // AuctionType filter
    if (auctionType !== "all") {
      result = result.filter((p) => p.auctionType === auctionType);
    }

    // Sorting
    if (sortBy === "price_asc") {
      result.sort((a, b) => {
        const pA = a.highestBid > 0 ? a.highestBid : a.startingPrice;
        const pB = b.highestBid > 0 ? b.highestBid : b.startingPrice;
        return pA - pB;
      });
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => {
        const pA = a.highestBid > 0 ? a.highestBid : a.startingPrice;
        const pB = b.highestBid > 0 ? b.highestBid : b.startingPrice;
        return pB - pA;
      });
    } else if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [products, search, category, status, auctionType, sortBy]);

  const categories = [
    { value: "Electronics", label: "Electronics" },
    { value: "Vehicles", label: "Vehicles" },
    { value: "Art & Antiques", label: "Art & Antiques" },
    { value: "Real Estate", label: "Real Estate" },
    { value: "Fashion", label: "Fashion & Lifestyle" },
    { value: "Collectibles", label: "Collectibles" },
  ];

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setAuctionType("all");
    setSortBy("newest");
    setSearchParams({});
  };

  return (
    <div className="bg-gray-50/50 min-h-screen py-10 px-6">
      <PageTitle title="Browse Active Auctions" />

      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Active Auctions</h1>
          <p className="text-gray-500 font-semibold mt-1">
            Discover unique collectibles, vehicles, electronics and place your bid in real-time.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6 mb-10">
          <div className="grid gap-4 md:grid-cols-4 items-end">
            <div className="md:col-span-2 relative">
              <label className="text-sm font-medium text-gray-700 block mb-1">Search Keywords</label>
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by title, keywords, tags..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 transition-all duration-200"
                />
              </div>
            </div>

            <Select
              label="Category"
              value={category}
              placeholder="All Categories"
              onChange={(e) => {
                setSearchParams(e.target.value ? { category: e.target.value } : {});
              }}
              options={categories}
            />

            <Select
              label="Auction Type"
              value={auctionType}
              placeholder="All Types"
              onChange={(e) => setAuctionType(e.target.value)}
              options={[
                { value: "traditional", label: "Traditional (Ascending)" },
                { value: "reverse", label: "Reverse (Descending)" },
                { value: "sealed", label: "Sealed Bid (Blind)" },
              ]}
            />
          </div>

          <div className="flex flex-wrap justify-between items-center border-t border-gray-100 pt-4 gap-4">
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                <FunnelIcon className="h-4 w-4" /> Filter Status
              </div>
              <div className="flex bg-gray-100 rounded-lg p-0.5 border border-gray-200">
                {[
                  { value: "all", label: "All" },
                  { value: "active", label: "Active" },
                  { value: "closed", label: "Closed" },
                ].map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setStatus(tab.value)}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                      status === tab.value
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <Select
                placeholder="Sort By"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-48"
                options={[
                  { value: "newest", label: "Newest Listed" },
                  { value: "price_asc", label: "Price: Low to High" },
                  { value: "price_desc", label: "Price: High to Low" },
                ]}
              />
              <button
                onClick={clearFilters}
                className="text-sm font-bold text-red-600 hover:text-red-700 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <Skeleton.Card key={n} />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No auctions found"
            description="We couldn't find any products matching your search criteria. Try modifying your search or filters."
            actionText="Reset Filters"
            onAction={clearFilters}
          />
        )}
      </div>
    </div>
  );
}