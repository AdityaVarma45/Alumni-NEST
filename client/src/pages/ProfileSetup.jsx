import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

import SkillPicker from "../components/SkillPicker";
import InterestDropdown from "../components/profile/InterestDropdown";
import { AuthContext } from "../context/AuthContext";

import {
  FiUser,
  FiStar,
  FiTarget,
  FiCheckCircle,
} from "react-icons/fi";

export default function ProfileSetup() {
  const navigate = useNavigate();
  const { updateUser } = useContext(AuthContext);

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [loading, setLoading] = useState(false);

  // simple progress score
  const progress = Math.min(
    100,
    selectedSkills.length * 10 +
      selectedInterests.length * 10
  );

  const handleSave = async () => {
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

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header Card */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <div className="flex items-start gap-4">

            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FiUser size={20} />
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800">
                Complete Your Profile
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                This helps us show smarter connections and recommendations in your dashboard.
              </p>

              {/* progress */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Profile Strength</span>
                  <span>{progress}%</span>
                </div>

                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Skills */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <FiStar className="text-blue-600" />
              <h2 className="font-semibold text-gray-800">
                Skills
              </h2>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Add your skills so the platform can match you with relevant people.
            </p>

            <SkillPicker
              value={selectedSkills}
              onChange={setSelectedSkills}
            />
          </div>

          {/* Interests */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <FiTarget className="text-blue-600" />
              <h2 className="font-semibold text-gray-800">
                Interests
              </h2>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Select areas you want to explore, learn, or contribute to.
            </p>

            <InterestDropdown
              value={selectedInterests}
              onChange={setSelectedInterests}
            />
          </div>

        </div>

        {/* Action Card */}
        <div className="bg-white border rounded-2xl p-5 shadow-sm flex justify-between items-center">

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiCheckCircle className="text-green-600" />
            Finish setup to unlock personalized recommendations
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="
              bg-blue-600 text-white
              px-6 py-2.5 rounded-lg
              hover:bg-blue-700
              transition
              disabled:opacity-60
            "
          >
            {loading ? "Saving..." : "Finish Setup"}
          </button>

        </div>

      </div>
    </div>
  );
}