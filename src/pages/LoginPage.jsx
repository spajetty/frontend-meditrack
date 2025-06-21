import { useState } from "react";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [role, setRole] = useState("patient"); // default patient

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Welcome to MediTrack</h2>

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
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-500 font-medium hover:underline"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
