import { useEffect, useState, useRef } from "react";
import {
  searchSkills,
  searchInterests,
} from "../services/skillService";

export default function SkillPicker({
  value = [],
  onChange,
  type = "skills",
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const wrapperRef = useRef(null);

  // fetch suggestions
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const fetchData = async () => {
      try {
        const api =
          type === "interests"
            ? searchInterests
            : searchSkills;

        const res = await api(query);

        const filtered = res.data.filter(
          (item) => !value.includes(item)
        );

        setSuggestions(filtered);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [query, value, type]);

  // close dropdown outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!wrapperRef.current?.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const addItem = (item) => {
    if (value.includes(item)) return;

    onChange([...value, item]);
    setQuery("");
    setSuggestions([]);
    setShowDropdown(false);
  };

  const removeItem = (item) => {
    onChange(value.filter((v) => v !== item));
  };

  return (
    <div ref={wrapperRef} className="w-full">
      {/* selected chips */}
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((item) => (
          <div
            key={item}
            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
          >
            {item}

            <button onClick={() => removeItem(item)}>
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* input */}
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowDropdown(true);
        }}
        placeholder={`Search ${type}...`}
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div className="mt-2 bg-white border rounded-lg shadow max-h-52 overflow-y-auto">
          {suggestions.map((item) => (
            <button
              key={item}
              onClick={() => addItem(item)}
              className="w-full text-left px-3 py-2 hover:bg-blue-50"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}