import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import { Copy, Check, GraduationCap, User } from "lucide-react";

export default function DemoAccounts() {
  const [copied, setCopied] = useState("");

  const copy = (value, key) => {
    navigator.clipboard.writeText(value);
    setCopied(key);

    setTimeout(() => setCopied(""), 2000);
  };

  const demoAccounts = [
    {
      role: "Alumni",
      icon: <GraduationCap size={18} className="text-blue-600" />,
      email: "srinu@gmail.com",
      password: "9870",
    },
    {
      role: "Student",
      icon: <User size={18} className="text-indigo-600" />,
      email: "varma@gmail.com",
      password: "9870",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">

      {/* LOGO */}
      <div className="px-6 pt-6">
        <Logo size="text-3xl" />
      </div>

      {/* CENTER CONTENT */}
      <div className="flex flex-1 items-center justify-center px-4 sm:px-6 py-10">

        <div className="w-full max-w-3xl">

          <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6 sm:p-8">

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 text-center">
              Demo Accounts
            </h1>

            <p className="text-slate-500 text-center mt-2 mb-8 text-sm">
              Use these credentials to explore AlumniNest without creating an account.
            </p>

            {/* DEMO ACCOUNTS */}
            <div className="space-y-6">

              {demoAccounts.map((acc) => (
                <div
                  key={acc.role}
                  className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition"
                >

                  {/* ROLE HEADER */}
                  <div className="flex items-center gap-2 mb-4">

                    {acc.icon}

                    <span className="font-semibold text-slate-800">
                      {acc.role} Demo
                    </span>

                  </div>

                  {/* EMAIL */}
                  <div className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2 mb-3">

                    <span className="text-sm text-slate-700 break-all">
                      {acc.email}
                    </span>

                    <button
                      onClick={() => copy(acc.email, acc.email)}
                      className="text-slate-500 hover:text-blue-600 transition"
                    >
                      {copied === acc.email ? (
                        <Check size={16} />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>

                  </div>

                  {/* PASSWORD */}
                  <div className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">

                    <span className="text-sm text-slate-700">
                      {acc.password}
                    </span>

                    <button
                      onClick={() => copy(acc.password, acc.password)}
                      className="text-slate-500 hover:text-blue-600 transition"
                    >
                      {copied === acc.password ? (
                        <Check size={16} />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>

                  </div>

                </div>
              ))}

            </div>

            {/* LOGIN CTA */}
            <div className="mt-8 text-center">

              <Link
                to="/login"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition font-medium"
              >
                Go to Login
              </Link>

              <p className="text-sm text-slate-500 mt-3">
                Copy credentials and paste them into the login form
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}