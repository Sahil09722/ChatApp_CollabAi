import { useState } from "react";
import API from "../api/api.js";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/register", form);
      alert("Account created successfully! Please log in.");
      navigate("/login");
    } catch (err) {
      console.error("Registration failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Registration failed. Try again.");
    }
  };

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow rounded w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Create Account</h2>

        <input
          type="text"
          placeholder="Full Name"
          className="border p-2 w-full mb-3 rounded"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-3 rounded"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-3 rounded"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 w-full rounded hover:bg-green-700 transition"
        >
          Register
        </button>

        <p className="text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={goToLogin}
            className="text-blue-600 hover:underline font-medium"
          >
            Login here
          </button>
        </p>
      </form>
    </div>
  );
}
