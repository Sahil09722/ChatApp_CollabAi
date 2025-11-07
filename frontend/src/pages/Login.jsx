import { useState, useContext } from "react";
import API from "../api/api.js";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(""); // For showing error message
  const [loading, setLoading] = useState(false); // Optional loading state
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // reset error
    setLoading(true);

    try {
      if (!form.email || !form.password) {
        setError("Please fill in both email and password.");
        setLoading(false);
        return;
      }

      const { data } = await API.post("/auth/login", form);
      login(data);
      localStorage.setItem("userId", data.user._id);
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 shadow rounded w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        {error && (
          <p className="bg-red-100 text-red-700 p-2 rounded mb-3 text-center">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-3 rounded"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-3 rounded"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          type="submit"
          disabled={loading}
          className={`${
            loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          } text-white px-4 py-2 w-full rounded transition`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center mt-4 text-gray-600">
          Don’t have an account?{" "}
          <button
            type="button"
            onClick={goToRegister}
            className="text-blue-600 hover:underline font-medium"
          >
            Create one
          </button>
        </p>
      </form>
    </div>
  );
}
