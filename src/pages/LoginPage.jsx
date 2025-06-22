import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import logo from "../assets/meditrack-logo.png";
import { loginDoctor, loginPatient } from "../api/auth";
import Modal from "../components/Modal";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get("role") || "patient";
  const [role, setRole] = useState(defaultRole);

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const [modal, setModal] = useState({ show: false, message: "", success: false });
  const navigate = useNavigate();
  const { login } = useAuth(); // ← from AuthContext

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let data;
      if (role === "patient") {
        data = await loginPatient(form);
      } else {
        data = await loginDoctor(form);
      }

      login({ email: form.email, role }); // ✅ Store in context

      setModal({ show: true, message: "Login successful!", success: true });

      // Navigate to respective dashboard after a brief delay
      setTimeout(() => {
        navigate(role === "patient" ? "/patient-dashboard" : "/doctor-dashboard");
      }, 1000);
    } catch (err) {
      setModal({ show: true, message: err.message || "Login failed", success: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-teal p-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="logo" width={40} />
          <h1 className="text-2xl font-bold font-poppins">
            <span className="text-emerald-500">Medi</span>
            <span className="text-cyan-500">Track</span>
          </h1>
        </div>

        <hr className="mt-3 mb-4 border-t-4 border-gray-300" />

        {/* Role Switcher */}
        <div className="flex justify-center mb-6 space-x-2">
          <button
            className={`px-4 py-1 rounded ${role === "patient" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setRole("patient")}
          >
            Patient
          </button>
          <button
            className={`px-4 py-1 rounded ${role === "doctor" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setRole("doctor")}
          >
            Doctor
          </button>
        </div>

        <h3 className="text-xl font-semibold mb-4 text-center">Login as {role}</h3>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full mb-4 p-2 border rounded"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full mb-2 p-2 border rounded"
            value={form.password}
            onChange={handleChange}
            required
          />
          <div className="text-right mb-4">
            <button type="button" className="text-sm text-blue-500 hover:underline">
              Forgot Password?
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            to={`/register?role=${role}`}
            className="text-blue-500 font-medium hover:underline"
          >
            Register here
          </Link>
        </p>
      </div>

      <Modal
        show={modal.show}
        onClose={() => setModal({ show: false, message: "", success: false })}
        message={modal.message}
        success={modal.success}
      />
    </div>
  );
}
