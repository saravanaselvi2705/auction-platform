import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import PageTitle from "../../components/common/PageTitle";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data);
      if (response.success) {
        login(response.user, response.token);
        toast.success("Welcome back! Login Successful.");
        
        // Role based redirect
        setTimeout(() => {
          if (response.user.role === "seller") {
            navigate("/seller-dashboard");
          } else {
            navigate("/buyer-dashboard");
          }
        }, 1000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid email or password.");
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center bg-gray-50/50 px-6 py-12">
      <PageTitle title="Login to your account" />
      <Toaster position="top-center" reverseOrder={false} />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md rounded-2xl bg-white p-8 border border-gray-100 shadow-xl shadow-gray-100/50"
      >
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-black text-blue-600 tracking-tight">
            🏆 AuctionHub
          </Link>
          <h2 className="mt-4 text-2xl font-black text-gray-900">Welcome Back</h2>
          <p className="mt-1.5 text-sm text-gray-500 font-semibold">
            Access your auctions, bids, and profile.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            error={errors.email}
            {...register("email", {
              required: "Email address is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Please enter a valid email address",
              },
            })}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />

          <Button
            type="submit"
            className="w-full mt-2"
            loading={isSubmitting}
          >
            Sign In
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500 font-medium">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}