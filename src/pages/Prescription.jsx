import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import FormModal from "../components/FormModal";
import EditModal from "../components/EditModal";
import { useNavigate } from "react-router-dom";

export default function Prescription() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [prescriptions, setPrescriptions] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchPrescriptions = async () => {
    if (!user?.patientId) return;
    try {
      const res = await axios.get(`https://localhost:7015/api/prescriptions/${user.patientId}`);
      setPrescriptions(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchPrescriptions();
    };
    load();
  }, [user]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this prescription?")) return;
    await axios.delete(`https://localhost:7015/api/prescriptions/${id}`);
    fetchPrescriptions();
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">All Prescriptions</h2>
        <div className="flex gap-2">
          <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => navigate("/today-prescriptions")}>
            See Today
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setShowAdd(true)}>
            Add Prescription
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto bg-white rounded shadow">
          <thead>
            <tr className="bg-emerald-100 text-left">
              <th className="px-4 py-2">Medicine</th>
              <th className="px-4 py-2">Instruction</th>
              <th className="px-4 py-2">Duration</th>
              <th className="px-4 py-2">Dosage</th>
              <th className="px-4 py-2">Times</th>
              <th className="px-4 py-2">Days</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  Nothing to display yet.
                </td>
              </tr>
            ) : (
              prescriptions.map((p) => (
              <tr key={p.prescriptionId} className="border-t">
                <td className="px-4 py-2">{p.medicineName}</td>
                <td className="px-4 py-2 w-50">{p.instruction}</td>
                <td className="px-4 py-2">
                  {new Date(p.startDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })} -{" "} <br />
                  {new Date(p.endDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-2">{p.dosage || "-"}</td>
                <td className="px-4 py-2">
                  <ul className="list-disc pl-4">
                    {p.prescriptionTimes?.map((t, i) => <li key={i}>{t.timeOfDay}</li>) || "-"}
                  </ul>
                </td>
                <td className="px-4 py-2">
                  <ul className="list-disc pl-4">
                    {p.prescriptionDays?.map((d, i) => {
                      const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
                      return <li key={i}>{days[d.dayOfWeek]}</li>;
                    }) || "-"}
                  </ul>
                </td>
                <td className="px-4 py-2">
                  {new Date(p.endDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)
                    ? "Finished"
                    : "Ongoing"}
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <button className="text-blue-600 hover:underline" onClick={() => setEditing(p)}>Edit</button>
                  <button className="text-red-600 hover:underline" onClick={() => handleDelete(p.prescriptionId)}>Delete</button>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>

      {showAdd && <FormModal onSaved={fetchPrescriptions} onClose={() => setShowAdd(false)} />}
      {editing && <EditModal prescription={editing} onSaved={fetchPrescriptions} onClose={() => setEditing(null)} />}
    </div>
  );
}
