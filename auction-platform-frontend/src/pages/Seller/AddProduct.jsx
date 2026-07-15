import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import { addProduct } from "../../services/productService";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import TextArea from "../../components/ui/TextArea";
import Button from "../../components/ui/Button";
import PageTitle from "../../components/common/PageTitle";

export default function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      category: "",
      auctionType: "traditional",
      startingPrice: "",
      image: "",
      auctionEnd: "",
      description: "",
    },
  });

  const categories = [
    { value: "Electronics", label: "Electronics" },
    { value: "Vehicles", label: "Vehicles" },
    { value: "Art & Antiques", label: "Art & Antiques" },
    { value: "Real Estate", label: "Real Estate" },
    { value: "Fashion", label: "Fashion & Lifestyle" },
    { value: "Collectibles", label: "Collectibles" },
  ];

  const auctionTypes = [
    { value: "traditional", label: "Traditional (Ascending)" },
    { value: "reverse", label: "Reverse (Descending)" },
    { value: "sealed", label: "Sealed Bid (Blind)" },
  ];

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      // Map and construct data
      const payload = {
        ...data,
        startingPrice: parseFloat(data.startingPrice),
        auctionStart: new Date().toISOString(),
        auctionEnd: new Date(data.auctionEnd).toISOString(),
      };

      const response = await addProduct(payload);
      if (response.success) {
        toast.success("Listing created successfully!");
        setTimeout(() => {
          navigate("/seller-dashboard/my-products");
        }, 1500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create product listing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PageTitle title="List a New Product" />
      <Toaster position="top-center" />

      <div className="flex items-center gap-3">
        <Link
          to="/seller-dashboard/my-products"
          className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100"
        >
          &larr; Listings
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Create Listing</h1>
          <p className="text-gray-500 font-semibold text-sm">
            Fill in the details to publish a new auction.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <Input
            label="Product Title"
            placeholder="e.g. Vintage Rolex Chronograph 1978"
            error={errors.title}
            {...register("title", {
              required: "Title is required",
            })}
          />

          <Select
            label="Category"
            placeholder="Choose category"
            options={categories}
            error={errors.category}
            {...register("category", {
              required: "Category is required",
            })}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Select
            label="Auction Type"
            options={auctionTypes}
            error={errors.auctionType}
            {...register("auctionType", {
              required: "Auction type is required",
            })}
          />

          <Input
            label="Starting Price (₹)"
            type="number"
            placeholder="e.g. 50000"
            error={errors.startingPrice}
            {...register("startingPrice", {
              required: "Starting price is required",
              min: {
                value: 1,
                message: "Price must be greater than 0",
              },
            })}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Input
            label="Auction End Date & Time"
            type="datetime-local"
            error={errors.auctionEnd}
            {...register("auctionEnd", {
              required: "Auction end date is required",
              validate: (val) =>
                new Date(val) > new Date() || "Auction end date must be in the future",
            })}
          />

          <Input
            label="Image URL"
            placeholder="e.g. https://domain.com/photo.jpg"
            error={errors.image}
            {...register("image", {
              pattern: {
                value: /^https?:\/\/.+/i,
                message: "Please enter a valid HTTP/HTTPS URL",
              },
            })}
          />
        </div>

        <TextArea
          label="Product Description"
          placeholder="Describe the condition, size, history, shipping details, and items included in the auction..."
          error={errors.description}
          {...register("description", {
            required: "Description is required",
          })}
        />

        <div className="flex gap-4 pt-4 border-t border-gray-100">
          <Button
            type="submit"
            variant="primary"
            className="flex-1 py-3"
            loading={loading}
          >
            Publish Auction
          </Button>
          <Link
            to="/seller-dashboard/my-products"
            className="flex-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 text-center transition-colors text-sm"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
