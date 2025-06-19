import { useEffect, useState } from "react";
import axios from "axios";

export default function PatientList() {
  const [patients, setPatients] = useState([]);

  const fetchPatients = async () => {
    try {
      const response = await axios.get("https://localhost:PORT/api/patients");
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients", error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div className="mt-4">
      <h2 className="font-bold mb-2">Patients:</h2>
      <ul className="list-disc pl-4">
        {patients.map((patient) => (
          <li key={patient.id}>{patient.name}</li>
        ))}
      </ul>
      <button
        onClick={fetchPatients}
        className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
      >
        Refresh
      </button>
    </div>
  );
}
