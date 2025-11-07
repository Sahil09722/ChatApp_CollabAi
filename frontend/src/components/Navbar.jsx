// src/components/Navbar.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ onCreateProject, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center px-6 py-3 bg-white shadow-sm border-b">
      <h1
        className="text-2xl font-bold text-blue-600 cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        CollabAI
      </h1>

      <div className="relative">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <img
            src="https://ui-avatars.com/api/?name=User"
            alt="Profile"
            className="w-8 h-8 rounded-full border"
          />
          <span className="font-medium text-gray-700 hover:text-blue-600">
            User
          </span>
        </div>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg border">
            <button
              onClick={() => {
                setDropdownOpen(false);
                navigate("/profile");
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              Profile
            </button>

            <button
              onClick={() => {
                setDropdownOpen(false);
                onCreateProject();
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              Create Project
            </button>

            <button
              onClick={() => {
                setDropdownOpen(false);
                onLogout();
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
    