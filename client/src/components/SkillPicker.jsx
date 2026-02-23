import { useEffect, useState, useRef } from "react";
import { searchSkills } from "../services/skillService";

/* =====================================================
   LinkedIn Style Skill Picker
   - live autocomplete
   - chip system
   - controlled by parent
===================================================== */

export default function SkillPicker({ value = [], onChange }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const wrapperRef = useRef(null);

  /* ---------------------------------------
     fetch suggestions when user types
  --------------------------------------- */
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const fetchSkills = async () => {
      try {
        const res = await searchSkills(query);

        // remove already selected skills
        const filtered = res.data.filter(
          (skill) => !value.includes(skill)
        );

        setSuggestions(filtered);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSkills();
  }, [query, value]);

  /* ---------------------------------------
     close dropdown when clicking outside
  --------------------------------------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!wrapperRef.current?.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------------------------------
     add skill
  --------------------------------------- */
  const addSkill = (skill) => {
    if (value.includes(skill)) return;

    onChange([...value, skill]);
    setQuery("");
    setSuggestions([]);
    setShowDropdown(false);
  };

  /* ---------------------------------------
     remove skill
  --------------------------------------- */
  const removeSkill = (skill) => {
    onChange(value.filter((s) => s !== skill));
  };

  return (
    <div ref={wrapperRef} className="w-full">

      {/* ---------- selected chips ---------- */}
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((skill) => (
          <div
            key={skill}
            className="
              bg-blue-100 text-blue-700
              px-3 py-1 rounded-full
              text-sm flex items-center gap-2
            "
          >
            {skill}

            <button
              onClick={() => removeSkill(skill)}
              className="text-blue-500 hover:text-red-500"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* ---------- input ---------- */}
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowDropdown(true);
        }}
        placeholder="Search skills..."
        className="
          w-full border rounded-lg px-3 py-2
          focus:outline-none focus:ring-2 focus:ring-blue-500
        "
      />

      {/* ---------- dropdown ---------- */}
      {showDropdown && suggestions.length > 0 && (
        <div
          className="
            mt-2 bg-white border rounded-lg shadow-lg
            max-h-52 overflow-y-auto z-20
          "
        >
          {suggestions.map((skill) => (
            <button
              key={skill}
              onClick={() => addSkill(skill)}
              className="
                w-full text-left px-3 py-2
                hover:bg-blue-50 transition
              "
            >
              {skill}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}