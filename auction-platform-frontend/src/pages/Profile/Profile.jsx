import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PageTitle from "../../components/common/PageTitle";
import Card from "../../components/ui/Card";
import toast, { Toaster } from "react-hot-toast";
import {
  EnvelopeIcon,
  PhoneIcon,
  ShieldCheckIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline";
import { CameraIcon, TrashIcon } from "@heroicons/react/24/solid";
import { uploadImage, updateProfile } from "../../services/authService";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload an image (JPG, PNG, or WEBP)");
      return;
    }

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    try {
      setUploading(true);
      const uploadRes = await uploadImage(file);
      if (uploadRes.success) {
        const updateRes = await updateProfile({ profileImage: uploadRes.url });
        if (updateRes.success) {
          updateUser(updateRes.user);
          toast.success("Profile image updated successfully!");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload image");
    } finally {
      setUploading(false);
      e.target.value = ""; // Reset file input
    }
  };

  const handleRemoveImage = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to remove your profile image?")) return;

    try {
      setUploading(true);
      const updateRes = await updateProfile({ profileImage: "" });
      if (updateRes.success) {
        updateUser(updateRes.user);
        toast.success("Profile image removed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove image");
    } finally {
      setUploading(false);
    }
  };

  const backendUrl = import.meta.env.VITE_API_BASE_URL.replace("/api", "");

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      <PageTitle title="My Profile" />
      <Toaster position="top-center" reverseOrder={false} />

      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">My Profile</h1>
        <p className="text-gray-500 font-semibold text-sm">
          Manage your personal details and account settings.
        </p>
      </div>

      <Card className="overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600" />

        {/* Profile Details */}
        <div className="px-8 pb-8 relative">
          {/* Avatar container */}
          <div className="absolute -top-16 left-8 h-28 w-28 rounded-full border-4 border-white shadow-md group cursor-pointer relative overflow-hidden bg-blue-100">
            {uploading && (
              <div className="absolute inset-0 bg-black/50 z-20 flex items-center justify-center rounded-full">
                <div className="h-6 w-6 border-2 border-white border-t-transparent animate-spin rounded-full" />
              </div>
            )}
            
            {user?.profileImage ? (
              <img
                src={`${backendUrl}${user.profileImage}`}
                alt={user?.name}
                className="h-full w-full rounded-full object-cover"
                onClick={handleAvatarClick}
              />
            ) : (
              <div
                className="h-full w-full rounded-full text-blue-600 flex items-center justify-center font-black text-4xl"
                onClick={handleAvatarClick}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Hover overlay */}
            <div
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full z-10"
              onClick={handleAvatarClick}
            >
              <CameraIcon className="h-6 w-6 text-white" />
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Remove Image Button */}
          {user?.profileImage && (
            <button
              onClick={handleRemoveImage}
              disabled={uploading}
              className="absolute -top-4 left-32 bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-full border border-red-200 transition-colors shadow-sm"
              title="Remove profile image"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          )}

          <div className="pt-16 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">{user?.name}</h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase mt-1">
                {user?.role}
              </span>
            </div>
            <Link
              to={user?.role === "seller" ? "/seller-dashboard" : "/buyer-dashboard"}
              className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
            >
              Go to Dashboard &rarr;
            </Link>
          </div>

          {/* Details list */}
          <div className="grid gap-6 sm:grid-cols-2 mt-8 pt-6 border-t border-gray-100">
            <div className="flex gap-3">
              <EnvelopeIcon className="h-5 w-5 text-gray-400 shrink-0" />
              <div>
                <span className="text-xxs font-bold text-gray-400 block uppercase">Email Address</span>
                <span className="text-sm font-semibold text-gray-800">{user?.email}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <PhoneIcon className="h-5 w-5 text-gray-400 shrink-0" />
              <div>
                <span className="text-xxs font-bold text-gray-400 block uppercase">Phone Number</span>
                <span className="text-sm font-semibold text-gray-800">{user?.phone || "Not provided"}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <IdentificationIcon className="h-5 w-5 text-gray-400 shrink-0" />
              <div>
                <span className="text-xxs font-bold text-gray-400 block uppercase">User ID</span>
                <span className="text-sm font-mono text-gray-500 break-all">{user?.id || user?._id}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <ShieldCheckIcon className="h-5 w-5 text-gray-400 shrink-0" />
              <div>
                <span className="text-xxs font-bold text-gray-400 block uppercase">Account Status</span>
                <span className="text-sm font-semibold text-green-600 flex items-center gap-1">
                  Active & Verified
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
