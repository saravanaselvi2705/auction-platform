import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { forgotPassword } from "../../services/authService";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import PageTitle from "../../components/common/PageTitle";

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await forgotPassword(data.email);
      if (response.success) {
        toast.success(response.message || "Reset link sent to your email!");
        reset();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center bg-gray-50/50 px-6 py-12">
      <PageTitle title="Forgot Password" />
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
          <h2 className="mt-4 text-2xl font-black text-gray-900">Forgot Password</h2>
          <p className="mt-1.5 text-sm text-gray-500 font-semibold">
            Enter your email and we'll send you a password reset link.
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

          <Button
            type="submit"
            className="w-full mt-2"
            loading={isSubmitting}
          >
            Send Reset Link
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500 font-medium">
          Remember your password?{" "}
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
