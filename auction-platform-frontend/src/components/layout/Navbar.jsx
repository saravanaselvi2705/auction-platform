import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-blue-600 font-bold border-b-2 border-blue-600 px-1 py-2 text-sm"
      : "text-gray-600 hover:text-blue-600 transition-colors duration-200 px-1 py-2 text-sm font-medium";

  const mobileNavLinkClass = ({ isActive }) =>
    isActive
      ? "text-blue-600 font-bold bg-blue-50 px-3 py-2 rounded-xl text-base"
      : "text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-all duration-200 px-3 py-2 rounded-xl text-base font-medium";

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="text-xl font-black text-blue-600 tracking-tight flex items-center gap-1.5">
          <span className="text-2xl">🏆</span>
          <span>AuctionHub</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/products" className={navLinkClass}>
            Browse Auctions
          </NavLink>

          {user ? (
            <>
              <Link
                to={user.role === "seller" ? "/seller-dashboard" : "/buyer-dashboard"}
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 px-1 py-2 text-sm font-medium"
              >
                Dashboard
              </Link>
              <div className="h-4 w-px bg-gray-200" />
              <div className="flex items-center gap-3">
                <Link to="/profile" className="flex items-center gap-2 group">
                  <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm group-hover:bg-blue-200 transition-colors">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                    {user.name}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="h-4 w-px bg-gray-200" />
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 hover:shadow-md hover:shadow-blue-100 transition-all duration-200"
              >
                Get Started
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile Button */}
        <button className="md:hidden p-1 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-t border-gray-100 bg-white md:hidden animate-in fade-in duration-200">
          <div className="flex flex-col space-y-2 px-6 py-5">
            <NavLink to="/" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/products" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>
              Browse Auctions
            </NavLink>

            {user ? (
              <>
                <NavLink
                  to={user.role === "seller" ? "/seller-dashboard" : "/buyer-dashboard"}
                  className={mobileNavLinkClass}
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </NavLink>
                <NavLink to="/profile" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>
                  My Profile
                </NavLink>
                <div className="h-px bg-gray-100 my-2" />
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 transition-all"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="h-px bg-gray-100 my-2" />
                <NavLink to="/login" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-bold text-white hover:bg-blue-700 transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;