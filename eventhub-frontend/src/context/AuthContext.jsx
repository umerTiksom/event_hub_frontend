import { createContext, useContext, useState } from "react";

// Create Context
const AuthContext = createContext(null);

// Create Provider
export const AuthProvider = ({ children }) => {
  // Get saved user from localStorage
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  // Get saved token from localStorage
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  // Login function
  const login = (userData, authToken) => {
    localStorage.setItem("token", authToken);

    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
    }

    setToken(authToken);
    setUser(userData || null);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
