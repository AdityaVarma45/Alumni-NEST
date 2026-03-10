import { useEffect, useState } from "react";
import { searchInterests } from "../../services/skillService";

/*
  Interest dropdown
  - loads interests from backend
  - scrollable dropdown list
*/

export default function InterestDropdown({
  value = [],
  onChange,
}) {
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);

  // load interests once
  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const res = await searchInterests("");
        setOptions(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchInterests();
  }, []);

  const handleSelect = (interest) => {
    if (!value.includes(interest)) {
      onChange([...value, interest]);
    }

    setOpen(false);
  };

  const removeInterest = (interest) => {
    onChange(value.filter((i) => i !== interest));
  };

  return (
    <div className="w-full relative">

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

      {/* dropdown trigger */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full border rounded-lg px-3 py-2 bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Select interests...
      </button>

      {/* dropdown list */}
      {open && (
        <div
          className="
          absolute z-20
          mt-2 w-full
          bg-white border rounded-lg shadow
          max-h-56 overflow-y-auto
        "
        >
          {options.map((interest) => (
            <button
              key={interest}
              onClick={() => handleSelect(interest)}
              className="w-full text-left px-3 py-2 hover:bg-blue-50 text-sm"
            >
              {interest}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}