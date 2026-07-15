import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Squares2X2Icon,
  PlusCircleIcon,
  ListBulletIcon,
  TrophyIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const sellerLinks = [
    {
      to: "/seller-dashboard",
      label: "Dashboard",
      icon: Squares2X2Icon,
      end: true,
    },
    {
      to: "/seller-dashboard/my-products",
      label: "My Auctions",
      icon: ListBulletIcon,
    },
    {
      to: "/seller-dashboard/add-product",
      label: "Add Product",
      icon: PlusCircleIcon,
    },
    {
      to: "/profile",
      label: "My Profile",
      icon: UserIcon,
    },
  ];

  const buyerLinks = [
    {
      to: "/buyer-dashboard",
      label: "Dashboard",
      icon: Squares2X2Icon,
      end: true,
    },
    {
      to: "/buyer-dashboard/my-bids",
      label: "My Bids",
      icon: ClipboardDocumentListIcon,
    },
    {
      to: "/buyer-dashboard/won-auctions",
      label: "Won Auctions",
      icon: TrophyIcon,
    },
    {
      to: "/profile",
      label: "My Profile",
      icon: UserIcon,
    },
  ];

  const links = user?.role === "seller" ? sellerLinks : buyerLinks;

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-[calc(100vh-4rem)] sticky top-16">
      {/* User Info Card */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="font-bold text-gray-900 truncate max-w-[150px]">{user?.name}</h4>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout Action */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all duration-200"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
