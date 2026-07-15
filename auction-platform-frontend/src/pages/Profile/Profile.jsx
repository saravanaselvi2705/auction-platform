import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PageTitle from "../../components/common/PageTitle";
import Card from "../../components/ui/Card";
import {
  EnvelopeIcon,
  PhoneIcon,
  ShieldCheckIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      <PageTitle title="My Profile" />

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
          {/* Avatar */}
          <div className="absolute -top-16 left-8 h-28 w-28 rounded-full border-4 border-white bg-blue-100 text-blue-600 flex items-center justify-center font-black text-4xl shadow-md">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

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
