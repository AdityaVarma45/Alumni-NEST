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
    w-full pl-11 pr-3 py-3 rounded-xl
    border border-slate-300 bg-white
    text-slate-700
    focus:outline-none focus:ring-2 focus:ring-blue-500/20
    focus:border-blue-500
    transition
  `;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">

      {/* Logo */}
      <div className="px-6 pt-6 sm:absolute sm:top-6 sm:left-8">
        <Logo size="text-2xl sm:text-3xl" />
      </div>

      {/* Center */}
      <div className="flex flex-1 items-center justify-center px-4 sm:px-6">

        <div className="w-full max-w-xl">

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-10">

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 text-center">
              Welcome Back
            </h1>

            <p className="text-slate-500 text-center mt-2 mb-6 sm:mb-8 text-sm sm:text-base">
              Sign in to continue to AlumniNest
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

              <div className="relative">
                <FiMail className="absolute left-3 top-3.5 text-slate-400" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={inputStyle}
                />
              </div>

              <div className="relative">
                <FiLock className="absolute left-3 top-3.5 text-slate-400" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={inputStyle}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition"
              >
                Login
              </button>

            </form>

            <p className="text-sm text-center mt-6 text-slate-600">
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
      </div>
    </div>
  );
}