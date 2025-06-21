import { useState } from "react";
import { Link } from "react-router-dom";
import logo from '../assets/meditrack-logo.png';

export default function LoginPage() {
  const [role, setRole] = useState("patient"); // default patient

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-teal p-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
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
              role === "patient" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setRole("patient")}
          >
            Patient
          </button>
          <button
            className={`px-4 py-1 rounded ${
              role === "doctor" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setRole("doctor")}
          >
            Doctor
          </button>
        </div>

        <h3 className="text-xl font-semibold mb-4 text-center">Login as {role}</h3>

        <form>
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-2 p-2 border rounded"
          />
          <div className="text-right mb-4">
            <button type="button" className="text-sm text-blue-500 hover:underline">
              Forgot Password?
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to={`/register?role=${role}`}
            className="text-blue-500 font-medium hover:underline"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
