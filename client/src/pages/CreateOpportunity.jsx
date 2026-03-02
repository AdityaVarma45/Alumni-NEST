import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

import {
  FiBriefcase,
  FiMapPin,
  FiLink,
  FiTag,
  FiFileText,
} from "react-icons/fi";

const OPPORTUNITY_TYPES = [
  "internship",
  "job",
  "referral",
  "guidance",
  "hackathon",
  "freelance",
];

export default function CreateOpportunity() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState({
    title: "",
    description: "",
    company: "",
    type: "internship",
    location: "Remote",
    applyLink: "",
    compensation: "",
    skills: "",
  });

  const [loading, setLoading] = useState(false);

  /* ===============================
     update form field
  =============================== */
  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /* ===============================
     submit
  =============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.company) {
      alert("Please fill required fields");
      return;
    }

    try {
      setLoading(true);

      await axios.post("/opportunities", {
        ...form,
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });

      navigate("/dashboard/opportunities");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to create opportunity"
      );
    } finally {
      setLoading(false);
    }
  };

  /* alumni/admin only */
  if (user?.role !== "alumni" && user?.role !== "admin") {
    return (
      <div className="p-6">
        <p className="text-slate-500">
          Only alumni can post opportunities.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">

        <h1 className="text-2xl font-bold text-slate-800 mb-1">
          Post Opportunity
        </h1>

        <p className="text-sm text-slate-500 mb-6">
          Share jobs, internships or guidance with students.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* title */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Title *
            </label>
            <input
              value={form.title}
              onChange={(e) =>
                handleChange("title", e.target.value)
              }
              className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Frontend Internship"
            />
          </div>

          {/* company */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Company *
            </label>
            <input
              value={form.company}
              onChange={(e) =>
                handleChange("company", e.target.value)
              }
              className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Google / Startup name"
            />
          </div>

          {/* type + location */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Type
              </label>
              <select
                value={form.type}
                onChange={(e) =>
                  handleChange("type", e.target.value)
                }
                className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2"
              >
                {OPPORTUNITY_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Location
              </label>
              <input
                value={form.location}
                onChange={(e) =>
                  handleChange("location", e.target.value)
                }
                className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2"
                placeholder="Remote / Hyderabad"
              />
            </div>
          </div>

          {/* apply link */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Apply Link
            </label>
            <input
              value={form.applyLink}
              onChange={(e) =>
                handleChange("applyLink", e.target.value)
              }
              className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2"
              placeholder="https://..."
            />
          </div>

          {/* compensation */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Compensation
            </label>
            <input
              value={form.compensation}
              onChange={(e) =>
                handleChange("compensation", e.target.value)
              }
              className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2"
              placeholder="₹20k stipend / 8 LPA"
            />
          </div>

          {/* skills */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Skills (comma separated)
            </label>
            <input
              value={form.skills}
              onChange={(e) =>
                handleChange("skills", e.target.value)
              }
              className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2"
              placeholder="React, Node.js, MongoDB"
            />
          </div>

          {/* description */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Description *
            </label>
            <textarea
              rows={5}
              value={form.description}
              onChange={(e) =>
                handleChange("description", e.target.value)
              }
              className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 resize-none"
              placeholder="Explain opportunity details..."
            />
          </div>

          {/* submit */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full bg-blue-600 text-white
              py-2.5 rounded-xl
              hover:bg-blue-700 transition
              disabled:opacity-60
            "
          >
            {loading ? "Posting..." : "Post Opportunity"}
          </button>

        </form>
      </div>
    </div>
  );
}