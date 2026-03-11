import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { Briefcase } from "lucide-react";

/* Skeleton */
function EditOpportunitySkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 space-y-6 animate-pulse">

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-200 rounded-xl" />
          <div className="space-y-2">
            <div className="h-4 w-40 bg-slate-200 rounded" />
            <div className="h-3 w-60 bg-slate-200 rounded" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
        <div className="h-10 bg-slate-200 rounded" />
        <div className="h-24 bg-slate-200 rounded" />
        <div className="h-10 bg-slate-200 rounded" />
        <div className="h-10 bg-slate-200 rounded" />
        <div className="h-10 bg-slate-200 rounded" />
        <div className="h-10 bg-slate-200 rounded" />
        <div className="h-10 bg-slate-200 rounded" />
        <div className="h-10 w-40 bg-slate-200 rounded mt-3" />
      </div>

    </div>
  );
}

export default function EditOpportunity() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    company: "",
    type: "internship",
    location: "",
    applyLink: "",
    skills: "",
    compensation: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const res = await axios.get(`/opportunities/${id}`);
        const op = res.data;

        setForm({
          title: op.title,
          description: op.description,
          company: op.company,
          type: op.type,
          location: op.location || "",
          applyLink: op.applyLink || "",
          skills: op.skills?.join(", ") || "",
          compensation: op.compensation || "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunity();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await axios.put(`/opportunities/${id}`, {
        ...form,
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });

      navigate("/dashboard/opportunities");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <EditOpportunitySkeleton />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 space-y-6">

      {/* HEADER */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Briefcase size={18} />
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-800">
              Edit Opportunity
            </h1>

            <p className="text-sm text-slate-500">
              Update the opportunity details for students.
            </p>
          </div>

        </div>

      </div>

      {/* FORM */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            rows="4"
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="Company"
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="Skills (comma separated)"
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="applyLink"
            value={form.applyLink}
            onChange={handleChange}
            placeholder="Apply Link"
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="compensation"
            value={form.compensation}
            onChange={handleChange}
            placeholder="Compensation"
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2.5 rounded-lg shadow-sm hover:bg-blue-700 transition disabled:opacity-60"
          >
            {saving ? "Updating..." : "Update Opportunity"}
          </button>

        </form>

      </div>

    </div>
  );
}