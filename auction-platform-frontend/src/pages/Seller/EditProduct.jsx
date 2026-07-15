import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import { getProductById, updateProduct, getCategories, createCategory } from "../../services/productService";
import { uploadImage } from "../../services/authService";
import { useRef } from "react";
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
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      category: "",
      auctionType: "traditional",
      startingPrice: "",
      auctionEnd: "",
      description: "",
    },
  });

  const [categoriesList, setCategoriesList] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const data = await getCategories();
        if (data.success && data.categories) {
          setCategoriesList(data.categories.map((c) => ({ value: c.name, label: c.name })));
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    fetchCategoriesData();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }
    try {
      setAddingCategory(true);
      const res = await createCategory({ name: newCategoryName.trim() });
      if (res.success && res.category) {
        toast.success("Category added successfully!");
        setCategoriesList((prev) => [
          ...prev,
          { value: res.category.name, label: res.category.name },
        ]);
        setValue("category", res.category.name);
        setNewCategoryName("");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add category");
    } finally {
      setAddingCategory(false);
    }
  };

  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    await uploadFiles(files);
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    await uploadFiles(files);
  };

  const uploadFiles = async (files) => {
    if (images.length + files.length > 5) {
      toast.error("You can upload a maximum of 5 images");
      return;
    }

    setUploading(true);
    const newImages = [...images];

    for (const file of files) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} is not a valid image format`);
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max size is 5MB.`);
        continue;
      }

      try {
        const res = await uploadImage(file);
        if (res.success) {
          newImages.push(res.url);
        }
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setImages(newImages);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

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
            auctionEnd: formattedDate,
            description: prod.description,
          });
          setImages(prod.images && prod.images.length > 0 ? prod.images : (prod.image ? [prod.image] : []));
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



  const auctionTypes = [
    { value: "traditional", label: "Traditional (Ascending)" },
    { value: "reverse", label: "Reverse (Descending)" },
    { value: "sealed", label: "Sealed Bid (Blind)" },
  ];

  const onSubmit = async (data) => {
    if (images.length === 0) {
      toast.error("Please upload at least one product image.");
      return;
    }

    try {
      setSubmitLoading(true);
      
      const payload = {
        ...data,
        startingPrice: parseFloat(data.startingPrice),
        auctionEnd: new Date(data.auctionEnd).toISOString(),
        images: images,
        image: images[0] || "",
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

          <div className="space-y-1">
            <Select
              label="Category"
              placeholder="Choose category"
              options={categoriesList}
              error={errors.category}
              {...register("category", {
                required: "Category is required",
              })}
            />
            <div className="pt-2 flex items-center gap-2">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Add new category..."
                className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 focus:border-blue-600 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                disabled={addingCategory}
                className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 px-3 py-1.5 rounded-lg shrink-0 transition-colors"
              >
                {addingCategory ? "Adding..." : "+ Add"}
              </button>
            </div>
          </div>
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

          {/* Product Images Drag & Drop */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">Product Images (1 to 5 images)</label>
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/10 transition-all flex flex-col items-center justify-center min-h-[120px]"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                multiple
                accept="image/*"
                className="hidden"
              />
              {uploading ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="h-6 w-6 border-2 border-blue-600 border-t-transparent animate-spin rounded-full" />
                  <span className="text-xs text-gray-500 font-semibold">Uploading images...</span>
                </div>
              ) : (
                <div>
                  <span className="text-2xl mb-1 block">📸</span>
                  <p className="text-sm font-semibold text-gray-600">
                    Drag & Drop images here, or <span className="text-blue-600 hover:underline">browse</span>
                  </p>
                  <p className="text-xxs font-medium text-gray-400 mt-1 uppercase">
                    Supports JPG, PNG, WEBP up to 5MB (Max 5 images)
                  </p>
                </div>
              )}
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-5 gap-3 mt-3">
                {images.map((imgUrl, index) => (
                  <div key={imgUrl} className="relative aspect-square border border-gray-200 rounded-lg overflow-hidden group">
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL.replace("/api", "")}${imgUrl}`}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-0 left-0 right-0 bg-blue-600/90 text-white text-[9px] font-bold text-center py-0.5 uppercase tracking-wider">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
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
