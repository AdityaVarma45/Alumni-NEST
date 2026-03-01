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

  // LOGIN (safe + instant)
  const login = (data) => {
    localStorage.setItem("token", data.token);

    // instant UI login
    setUser({
      ...data.user,
      id: data.user._id,
    });

    // fetch full profile in background
    axios
      .get("/users/profile")
      .then((res) => {
        setUser({
          ...res.data,
          id: res.data._id,
        });
      })
      .catch(() => {});
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

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