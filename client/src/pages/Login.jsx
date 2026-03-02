import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import Logo from "../components/Logo";

import { FiMail, FiLock } from "react-icons/fi";

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

  const inputStyle = `
    w-full pl-10 pr-3 py-2.5 rounded-xl
    border border-slate-300 bg-white
    text-slate-700
    focus:outline-none focus:ring-2 focus:ring-blue-500/20
    focus:border-blue-500
    transition-all duration-200
  `;

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="absolute top-6 left-6">
        <Logo size="text-3xl" />
      </div>

      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
        <h2 className="text-2xl font-bold text-slate-800 text-center">
          Welcome Back
        </h2>

        <p className="text-sm text-slate-500 text-center mt-1 mb-6">
          Sign in to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="relative">
            <FiMail className="absolute left-3 top-3.5 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
              className={inputStyle}
            />
          </div>

          <div className="relative">
            <FiLock className="absolute left-3 top-3.5 text-slate-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className={inputStyle}
            />
          </div>

          <button
            type="submit"
            className="
              w-full bg-blue-600 text-white
              py-2.5 rounded-xl
              hover:bg-blue-700
              active:scale-[0.99]
              transition-all duration-200
            "
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center mt-5 text-slate-600">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>

        <p className="text-sm text-center mt-2">
          <Link to="/" className="text-slate-500 hover:underline">
            ← Back to Welcome
          </Link>
        </p>
      </div>
    </div>
  );
}