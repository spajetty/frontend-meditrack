import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import logo from "../assets/meditrack-logo.png";
import { registerDoctor, searchDoctors, registerPatient } from "../api/auth";
import Modal from "../components/Modal"; // ← Import Modal component

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get("role") || "patient";
  const [role, setRole] = useState(defaultRole);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    specialty: "",
    password: "",
    dateOfBirth: "",
    doctorSearch: "",
    selectedDoctorId: null,
  });
  const [doctorResults, setDoctorResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ show: false, message: "", success: false });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (role === "patient" && form.doctorSearch.trim() !== "") {
        searchDoctors(form.doctorSearch)
          .then((data) => setDoctorResults(data))
          .catch(() => setDoctorResults([])); // Clear if no matches
      } else {
        setDoctorResults([]);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [form.doctorSearch, role]);

  const checkEmailExists = async (email) => {
    const response = await fetch(`https://localhost:7015/api/auth/check-email?email=${encodeURIComponent(email)}`);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Unable to verify email.");
    }
    return await response.json(); // expects `true` or `false`
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const exists = await checkEmailExists(form.email);
      if (exists) throw new Error("Email already exists.");

      if (role === "doctor") {
        await registerDoctor({
          fullName: form.fullName,
          email: form.email,
          specialty: form.specialty,
          password: form.password,
        });
        setModal({ show: true, message: "Doctor registered successfully!", success: true });
      } else {
        if (!form.selectedDoctorId) {
          throw new Error("Please select a doctor.");
        }
        await registerPatient({
          fullName: form.fullName,
          email: form.email,
          dateOfBirth: form.dateOfBirth,
          doctorId: form.selectedDoctorId,
          password: form.password,
        });
        setModal({ show: true, message: "Patient registered successfully!", success: true });
      }
    } catch (err) {
      setModal({ show: true, message: err.message, success: false });
    }
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

        <div className="flex justify-center mb-6 space-x-2">
          <button
            className={`px-4 py-1 rounded ${role === "patient" ? "bg-green-500 text-white" : "bg-gray-200"}`}
            onClick={() => setRole("patient")}
          >
            Patient
          </button>
          <button
            className={`px-4 py-1 rounded ${role === "doctor" ? "bg-green-500 text-white" : "bg-gray-200"}`}
            onClick={() => setRole("doctor")}
          >
            Doctor
          </button>
        </div>

        <h3 className="text-xl font-semibold mb-4 text-center">Register as {role}</h3>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            className="w-full mb-4 p-2 border rounded"
            value={form.fullName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full mb-4 p-2 border rounded"
            value={form.email}
            onChange={handleChange}
            required
          />

          {role === "doctor" && (
            <>
              <input
                type="text"
                name="specialty"
                placeholder="Specialty"
                className="w-full mb-4 p-2 border rounded"
                value={form.specialty}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full mb-4 p-2 border rounded"
                value={form.password}
                onChange={handleChange}
                required
              />
            </>
          )}

          {role === "patient" && (
            <>
              <input
                type="date"
                name="dateOfBirth"
                className="w-full mb-4 p-2 border rounded"
                value={form.dateOfBirth}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full mb-4 p-2 border rounded"
                value={form.password}
                onChange={handleChange}
                required
              />

              {!form.selectedDoctorId ? (
                <>
                  <input
                    type="text"
                    name="doctorSearch"
                    placeholder="Search Doctor"
                    className="w-full mb-2 p-2 border rounded"
                    value={form.doctorSearch}
                    onChange={(e) => {
                      setForm({
                        ...form,
                        doctorSearch: e.target.value,
                        selectedDoctorId: null,
                      });
                    }}
                  />
                  {form.doctorSearch.trim() !== "" && (
                    <div className="border rounded mb-4 shadow max-h-40 overflow-y-auto bg-white z-10 relative">
                      {doctorResults.length > 0 ? (
                        doctorResults.map((doc) => (
                          <div
                            key={doc.doctorId}
                            onClick={() => {
                              setForm((prev) => ({
                                ...prev,
                                doctorSearch: doc.fullName,
                                selectedDoctorId: doc.doctorId,
                              }));
                              setDoctorResults([]);
                            }}
                            className="p-2 cursor-pointer hover:bg-gray-100"
                          >
                            {doc.fullName}
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm p-2">No matches found.</p>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="mb-4 flex items-center justify-between border rounded p-2 bg-gray-50">
                  <span className="text-gray-700">{form.doctorSearch}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        doctorSearch: "",
                        selectedDoctorId: null,
                      }))
                    }
                    className="text-sm text-red-500 hover:underline"
                  >
                    Change
                  </button>
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to={`/login?role=${role}`} className="text-blue-500 font-medium hover:underline">
            Login here
          </Link>
        </p>
      </div>

      {/* ✅ Modal here */}
      <Modal
        show={modal.show}
        onClose={() => {
          setModal({ ...modal, show: false });
          setLoading(false);
          if (modal.success) navigate(`/login?role=${role}`);
        }}
        message={modal.message}
        success={modal.success}
      />
    </div>
  );
}
