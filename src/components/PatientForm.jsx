import { useState } from "react";
import axios from "axios";

export default function PatientForm({ onSuccess }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [doctorId, setDoctorId] = useState(""); // This should match existing DoctorId

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await axios.post("https://localhost:7015/api/patients", {
      fullName,
      email,
      dateOfBirth,
      doctorId: parseInt(doctorId, 10),
    });
    setFullName("");
    setEmail("");
    setDateOfBirth("");
    setDoctorId("");
    onSuccess();
  } catch (error) {
    if (error.response) {
      console.error("Validation errors:", error.response.data);
      alert(JSON.stringify(error.response.data, null, 2)); // optional, display in popup
    } else {
      console.error("Error adding patient", error);
    }
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="text"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="Full name"
        className="border px-2 py-1 rounded w-full"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="border px-2 py-1 rounded w-full"
        required
      />
      <input
        type="date"
        value={dateOfBirth}
        onChange={(e) => setDateOfBirth(e.target.value)}
        className="border px-2 py-1 rounded w-full"
        required
      />
      <input
        type="number"
        value={doctorId}
        onChange={(e) => setDoctorId(e.target.value)}
        placeholder="Doctor ID"
        className="border px-2 py-1 rounded w-full"
        required
      />
      <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
        Add Patient
      </button>
    </form>
  );
}
