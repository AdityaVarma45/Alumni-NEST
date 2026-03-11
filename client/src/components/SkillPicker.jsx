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
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const wrapperRef = useRef(null);

  /* =========================
     Debounce input
  ========================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  /* =========================
     Fetch suggestions
  ========================= */
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const fetchData = async () => {
      try {
        const api =
          type === "interests"
            ? searchInterests
            : searchSkills;

        const res = await api(debouncedQuery);

        const filtered = res.data.filter(
          (item) => !value.includes(item)
        );

        setSuggestions(filtered);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [debouncedQuery, value, type]);

  /* =========================
     Close dropdown on outside click
  ========================= */
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

  /* =========================
     Add item
  ========================= */
  const addItem = (item) => {
    if (value.includes(item)) return;

    onChange([...value, item]);

    setQuery("");
    setSuggestions([]);
    setShowDropdown(false);
  };

  /* =========================
     Remove item
  ========================= */
  const removeItem = (item) => {
    onChange(value.filter((v) => v !== item));
  };

  /* =========================
     Keyboard support
  ========================= */
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && suggestions.length > 0) {
      e.preventDefault();
      addItem(suggestions[0]);
    }
  };

  return (
    <div ref={wrapperRef} className="w-full relative">

      {/* Selected chips */}
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((item) => (
          <div
            key={item}
            className="flex items-center gap-2 text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-700"
          >
            {item}

            <button
              onClick={() => removeItem(item)}
              className="text-blue-700 hover:text-blue-900"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Input */}
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowDropdown(true);
        }}
        onKeyDown={handleKeyDown}
        placeholder={`Search ${type}...`}
        className="
          w-full border border-slate-200
          rounded-lg px-3 py-2
          focus:outline-none
          focus:ring-2 focus:ring-blue-500/30
          focus:border-blue-500
        "
      />

      {/* Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div
          className="
            absolute z-10 mt-2 w-full
            bg-white border border-slate-200
            rounded-lg shadow-md
            max-h-52 overflow-y-auto
          "
        >
          {suggestions.map((item) => (
            <button
              key={item}
              onClick={() => addItem(item)}
              className="
                w-full text-left px-3 py-2
                text-sm text-slate-700
                hover:bg-blue-50
                transition
              "
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}