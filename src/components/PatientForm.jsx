import { useState } from "react";
import axios from "axios";

export default function PatientForm({ onSuccess }) {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://localhost:PORT/api/patients", { name });
      setName("");
      onSuccess();
    } catch (error) {
      console.error("Error adding patient", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Patient name"
        className="border px-2 py-1 rounded"
      />
      <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
        Add Patient
      </button>
    </form>
  );
}
