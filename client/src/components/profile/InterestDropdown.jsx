import { useEffect, useState } from "react";
import { searchInterests } from "../../services/skillService";

/*
  Interest dropdown
  - loads interests from backend
  - simple select dropdown (no typing required)
*/

export default function InterestDropdown({
  value = [],
  onChange,
}) {
  const [options, setOptions] = useState([]);

  // load interests once
  useEffect(() => {
    const fetchInterests = async () => {
      try {
        // empty query returns default list
        const res = await searchInterests("");

        setOptions(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchInterests();
  }, []);

  // add selected interest
  const handleSelect = (e) => {
    const selected = e.target.value;
    if (!selected) return;

    if (!value.includes(selected)) {
      onChange([...value, selected]);
    }

    // reset dropdown after select
    e.target.value = "";
  };

  // remove selected interest
  const removeInterest = (interest) => {
    onChange(value.filter((i) => i !== interest));
  };

  return (
    <div className="w-full">
      {/* selected chips */}
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((interest) => (
          <div
            key={interest}
            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
          >
            {interest}

            <button
              onClick={() => removeInterest(interest)}
              className="text-blue-500 hover:text-red-500"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* dropdown */}
      <select
        onChange={handleSelect}
        className="w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select interests...</option>

        {options.map((interest) => (
          <option key={interest} value={interest}>
            {interest}
          </option>
        ))}
      </select>
    </div>
  );
}