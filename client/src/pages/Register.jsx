import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";
import Logo from "../components/Logo";

import { FiUser, FiMail, FiLock } from "react-icons/fi";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/auth/register", {
        username,
        email,
        password,
        role,
      });

      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
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
          Create Account
        </h2>

        <p className="text-sm text-slate-500 text-center mt-1 mb-6">
          Start your journey with AlumniNest
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="relative">
            <FiUser className="absolute left-3 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={inputStyle}
            />
          </div>

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

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="
              w-full px-3 py-2.5 rounded-xl
              border border-slate-300 bg-white
              text-slate-700
              focus:outline-none focus:ring-2 focus:ring-blue-500/20
              focus:border-blue-500
              transition-all duration-200
            "
          >
            <option value="student">Student</option>
            <option value="alumni">Alumni</option>
          </select>

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
            Register
          </button>
        </form>

        <p className="text-sm text-center mt-5 text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
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