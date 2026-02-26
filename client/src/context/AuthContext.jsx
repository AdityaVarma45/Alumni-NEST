import { createContext, useState, useEffect } from "react";
import axios from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // fetch profile when app loads
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("/users/profile");

        setUser({
          ...res.data,
          id: res.data._id,
        });
      } catch {
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // login handler
  const login = (data) => {
    localStorage.setItem("token", data.token);
    setUser(data.user);
  };

  // logout handler
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // NEW: update user manually (used after profile setup)
  const updateUser = (newData) => {
    setUser((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, updateUser, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};