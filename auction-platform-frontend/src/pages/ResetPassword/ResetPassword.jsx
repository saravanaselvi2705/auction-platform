import { useForm } from "react-hook-form";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { resetPassword } from "../../services/authService";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import PageTitle from "../../components/common/PageTitle";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("password");

  const onSubmit = async (data) => {
    try {
      const response = await resetPassword(token, data.password);
      if (response.success) {
        toast.success(response.message || "Password reset successful!");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid or expired password reset link."
      );
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center bg-gray-50/50 px-6 py-12">
      <PageTitle title="Reset Password" />
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
          <h2 className="mt-4 text-2xl font-black text-gray-900">Reset Password</h2>
          <p className="mt-1.5 text-sm text-gray-500 font-semibold">
            Please enter your new secure password below.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="New Password"
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
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword}
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === newPassword || "Passwords do not match",
            })}
          />

          <Button
            type="submit"
            className="w-full mt-2"
            loading={isSubmitting}
          >
            Reset Password
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
