import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

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

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

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

  if (user?.role !== "alumni" && user?.role !== "admin") {
    return (
      <div>
        <p className="text-slate-500">
          Only alumni can post opportunities.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800">
          Post an Opportunity
        </h1>

        <p className="text-slate-500 mt-1">
          Help students by sharing internships, referrals, or career guidance.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Title + Company */}
          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="text-sm font-medium text-slate-700">
                Opportunity Title *
              </label>

              <input
                value={form.title}
                onChange={(e) =>
                  handleChange("title", e.target.value)
                }
                className="mt-2 w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Frontend Developer Internship"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Company *
              </label>

              <input
                value={form.company}
                onChange={(e) =>
                  handleChange("company", e.target.value)
                }
                className="mt-2 w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Google / Startup name"
              />
            </div>

          </div>

          {/* Type + Location */}
          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="text-sm font-medium text-slate-700">
                Opportunity Type
              </label>

              <select
                value={form.type}
                onChange={(e) =>
                  handleChange("type", e.target.value)
                }
                className="mt-2 w-full border border-slate-200 rounded-xl px-4 py-3"
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
                className="mt-2 w-full border border-slate-200 rounded-xl px-4 py-3"
                placeholder="Remote / Hyderabad"
              />
            </div>

          </div>

          {/* Apply Link + Compensation */}
          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="text-sm font-medium text-slate-700">
                Apply Link
              </label>

              <input
                value={form.applyLink}
                onChange={(e) =>
                  handleChange("applyLink", e.target.value)
                }
                className="mt-2 w-full border border-slate-200 rounded-xl px-4 py-3"
                placeholder="https://job-link.com"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Compensation
              </label>

              <input
                value={form.compensation}
                onChange={(e) =>
                  handleChange("compensation", e.target.value)
                }
                className="mt-2 w-full border border-slate-200 rounded-xl px-4 py-3"
                placeholder="₹20k stipend / 8 LPA"
              />
            </div>

          </div>

          {/* Skills */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Skills Required
            </label>

            <input
              value={form.skills}
              onChange={(e) =>
                handleChange("skills", e.target.value)
              }
              className="mt-2 w-full border border-slate-200 rounded-xl px-4 py-3"
              placeholder="React, Node.js, MongoDB"
            />

            <p className="text-xs text-slate-400 mt-1">
              Separate skills using commas.
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Opportunity Description *
            </label>

            <textarea
              rows={6}
              value={form.description}
              onChange={(e) =>
                handleChange("description", e.target.value)
              }
              className="mt-2 w-full border border-slate-200 rounded-xl px-4 py-3 resize-none"
              placeholder="Explain the role, requirements, and application process..."
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-2">

            <button
              type="submit"
              disabled={loading}
              className="
                bg-blue-600 text-white
                px-6 py-3 rounded-xl
                font-medium
                hover:bg-blue-700
                transition
                disabled:opacity-60
              "
            >
              {loading ? "Posting..." : "Post Opportunity"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}