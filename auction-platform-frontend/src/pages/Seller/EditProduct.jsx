import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import { getProductById, updateProduct } from "../../services/productService";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import TextArea from "../../components/ui/TextArea";
import Button from "../../components/ui/Button";
import Loader from "../../components/common/Loader";
import PageTitle from "../../components/common/PageTitle";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductById(id);
        if (res.success && res.product) {
          const prod = res.product;
          
          // Format ISO date to local datetime input format: YYYY-MM-DDThh:mm
          let formattedDate = "";
          if (prod.auctionEnd) {
            const date = new Date(prod.auctionEnd);
            // offset timezone to match local input format
            const offset = date.getTimezoneOffset() * 60000;
            const localISODate = new Date(date.getTime() - offset).toISOString().slice(0, 16);
            formattedDate = localISODate;
          }

          reset({
            title: prod.title,
            category: prod.category,
            auctionType: prod.auctionType,
            startingPrice: prod.startingPrice,
            image: prod.image,
            auctionEnd: formattedDate,
            description: prod.description,
          });
        }
      } catch (error) {
        console.error("Failed to load product for editing:", error);
        toast.error("Error loading listing details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, reset]);

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
      setSubmitLoading(true);
      
      const payload = {
        ...data,
        startingPrice: parseFloat(data.startingPrice),
        auctionEnd: new Date(data.auctionEnd).toISOString(),
      };

      const response = await updateProduct(id, payload);
      if (response.success) {
        toast.success("Listing updated successfully!");
        setTimeout(() => {
          navigate("/seller-dashboard/my-products");
        }, 1500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update listing.");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return <Loader message="Loading listing data..." />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PageTitle title="Edit Product Listing" />
      <Toaster position="top-center" />

      <div className="flex items-center gap-3">
        <Link
          to="/seller-dashboard/my-products"
          className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100"
        >
          &larr; Listings
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Edit Listing</h1>
          <p className="text-gray-500 font-semibold text-sm">
            Modify details for your active auction product.
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
            loading={submitLoading}
          >
            Save Changes
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
