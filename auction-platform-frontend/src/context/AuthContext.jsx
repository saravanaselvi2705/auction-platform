/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import { getProfile } from "../services/authService";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("token", jwtToken);
  };

  useEffect(() => {
    let active = true;
    const autoLogin = async () => {
      if (token) {
        try {
          const response = await getProfile();
          if (active) {
            if (response.success && response.user) {
              setUser(response.user);
            } else {
              logout();
            }
          }
        } catch (error) {
          console.error("Auto-login failed:", error);
          if (active) {
            logout();
          }
        }
      }
      if (active) {
        setLoading(false);
      }
    };

    autoLogin();
    return () => {
      active = false;
    };
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider };
export const useAuth = () => useContext(AuthContext);