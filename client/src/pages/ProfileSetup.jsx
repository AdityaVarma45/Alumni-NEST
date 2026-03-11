import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

import SkillPicker from "../components/SkillPicker";
import InterestDropdown from "../components/profile/InterestDropdown";
import { AuthContext } from "../context/AuthContext";

import { FiUser, FiStar, FiTarget, FiCheckCircle } from "react-icons/fi";

export default function ProfileSetup() {
  const navigate = useNavigate();
  const { user, updateUser } = useContext(AuthContext);

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    setSelectedSkills(user.skills || []);
    setSelectedInterests(user.interests || []);
  }, [user]);

  const progress = Math.min(
    100,
    selectedSkills.length * 10 + selectedInterests.length * 10
  );

  const handleSave = async () => {
    if (selectedSkills.length < 3) {
      alert("Please add at least 3 skills.");
      return;
    }

    if (selectedInterests.length < 1) {
      alert("Please select at least 1 interest.");
      return;
    }

    try {
      setLoading(true);

      await axios.put("/users/profile/setup", {
        skills: selectedSkills,
        interests: selectedInterests,
      });

      updateUser({
        profileCompleted: true,
        skills: selectedSkills,
        interests: selectedInterests,
      });

      navigate("/dashboard/my-profile");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 space-y-6">

      {/* HEADER */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex items-start gap-4">

          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <FiUser size={20} />
          </div>

          <div className="flex-1">

            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
              Update Profile
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Keep your skills and interests updated for smarter alumni recommendations.
            </p>

            {/* PROGRESS */}
            <div className="mt-4">

              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Profile Strength</span>
                <span>{progress}%</span>
              </div>

              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">

                <div
                  className="h-full bg-blue-600 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* GRID */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* SKILLS */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center gap-2 mb-4">
            <FiStar className="text-blue-600" />
            <h2 className="font-semibold text-slate-800">Skills</h2>
          </div>

          <SkillPicker
            value={selectedSkills}
            onChange={setSelectedSkills}
          />

        </div>

        {/* INTERESTS */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center gap-2 mb-4">
            <FiTarget className="text-blue-600" />
            <h2 className="font-semibold text-slate-800">Interests</h2>
          </div>

          <InterestDropdown
            value={selectedInterests}
            onChange={setSelectedInterests}
          />

        </div>

      </section>

      {/* ACTION */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <FiCheckCircle className="text-green-600" />
          Changes update your recommendations instantly
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-60 shadow-sm w-full sm:w-auto"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>

      </section>

    </div>
  );
}