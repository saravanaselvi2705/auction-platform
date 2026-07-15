import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

import { registerUser } from "../../services/authService";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import PageTitle from "../../components/common/PageTitle";

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "buyer",
      password: "",
      confirmPassword: "",
    },
  });


  const onSubmit = async (data) => {
    try {
      // Destructure password and other fields
      const { name, email, password, role, phone } = data;
      const response = await registerUser({ name, email, password, role, phone });

      if (response.success) {
        toast.success("Registration Successful! Please sign in.");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed. Email might already exist.");
    }
  };

  return (
    <div className="flex min-h-[90vh] items-center justify-center bg-gray-50/50 px-6 py-12">
      <PageTitle title="Create an Account" />
      <Toaster position="top-center" reverseOrder={false} />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg rounded-2xl bg-white p-8 border border-gray-100 shadow-xl shadow-gray-100/50"
      >
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-black text-blue-600 tracking-tight">
            🏆 AuctionHub
          </Link>
          <h2 className="mt-4 text-2xl font-black text-gray-900">Create your Account</h2>
          <p className="mt-1.5 text-sm text-gray-500 font-semibold">
            Join us to buy or list premium products.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Full Name"
              placeholder="John Doe"
              error={errors.name}
              {...register("name", {
                required: "Full name is required",
              })}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              error={errors.email}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Phone Number"
              type="tel"
              placeholder="9876543210"
              error={errors.phone}
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9+() -]{10,15}$/,
                  message: "Please enter a valid phone number",
                },
              })}
            />

            <Select
              label="Register As"
              error={errors.role}
              options={[
                { value: "buyer", label: "Buyer (Bidding & Buying)" },
                { value: "seller", label: "Seller (Listing & Selling)" },
              ]}
              {...register("role", {
                required: "Role is required",
              })}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
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

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (val) => val === getValues("password") || "Passwords do not match",
              })}
            />
          </div>

          <Button
            type="submit"
            className="w-full mt-4"
            loading={isSubmitting}
          >
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500 font-medium">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}