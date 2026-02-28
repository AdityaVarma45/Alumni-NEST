import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import Logo from "../components/Logo";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/auth/login", { email, password });
      login(res.data);
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100 px-4">

      {/* ===== TOP LEFT LOGO ===== */}
      <div className="absolute top-6 left-6">
        <Logo size="text-3xl" />
      </div>

      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Login to AlumniNest
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>

        <p className="text-sm text-center mt-2">
          <Link to="/" className="text-gray-500 hover:underline">
            ← Back to Welcome
          </Link>
        </p>
      </div>
    </div>
  );
}