import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

import SkillPicker from "../components/SkillPicker";

export default function ProfileSetup() {
  const navigate = useNavigate();

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);

  const [loading, setLoading] = useState(false);

  // save profile setup
  const handleSave = async () => {
    try {
      setLoading(true);

      await axios.put("/users/profile/setup", {
        skills: selectedSkills,
        interests: selectedInterests,
      });

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Complete Your Profile
        </h1>

        {/* Skills picker */}
        <div>
          <h2 className="font-semibold mb-2">Select Skills</h2>

          <SkillPicker
            value={selectedSkills}
            onChange={setSelectedSkills}
          />
        </div>

        {/* Interests picker (same component reuse) */}
        <div>
          <h2 className="font-semibold mb-2">Select Interests</h2>

          <SkillPicker
            value={selectedInterests}
            onChange={setSelectedInterests}
            type="interests"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Finish Setup"}
        </button>
      </div>
    </div>
  );
}