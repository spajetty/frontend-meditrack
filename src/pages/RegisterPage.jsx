import { useState } from "react";
import { Link } from "react-router-dom";
import logo from '../assets/meditrack-logo.png';

export default function RegisterPage() {
  const [role, setRole] = useState("patient"); // default patient
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    specialty: "",
    dateOfBirth: "",
    doctorSearch: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-teal p-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <div className="flex items-center space-x-2 flex-center">
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
            className={`px-4 py-1 rounded ${
              role === "patient" ? "bg-green-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setRole("patient")}
          >
            Patient
          </button>
          <button
            className={`px-4 py-1 rounded ${
              role === "doctor" ? "bg-green-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setRole("doctor")}
          >
            Doctor
          </button>
        </div>

        <h3 className="text-xl font-semibold mb-4 text-center">Register as {role}</h3>

        <form>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            className="w-full mb-4 p-2 border rounded"
            value={form.fullName}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full mb-4 p-2 border rounded"
            value={form.email}
            onChange={handleChange}
          />

          {role === "doctor" && (
            <input
              type="text"
              name="specialty"
              placeholder="Specialty"
              className="w-full mb-4 p-2 border rounded"
              value={form.specialty}
              onChange={handleChange}
            />
          )}

          {role === "patient" && (
            <>
              <input
                type="date"
                name="dateOfBirth"
                className="w-full mb-4 p-2 border rounded"
                value={form.dateOfBirth}
                onChange={handleChange}
              />
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  name="doctorSearch"
                  placeholder="Search Doctor"
                  className="w-full p-2 border rounded"
                  value={form.doctorSearch}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
                >
                  Search
                </button>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-500 font-medium hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
