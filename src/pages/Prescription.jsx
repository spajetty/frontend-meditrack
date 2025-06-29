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
  const [viewingHistoryId, setViewingHistoryId] = useState(null);

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
    fetchPrescriptions();
  }, [user]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this prescription?")) return;
    await axios.delete(`https://localhost:7015/api/prescriptions/${id}`);
    fetchPrescriptions();
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4 md:flex-row flex-col">
        <div className="flex-center">
          <h2 className="text-xl font-semibold">All Prescriptions</h2>
        </div>
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
            <tr className="bg-emerald-100 text-center">
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
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  Nothing to display yet.
                </td>
              </tr>
            ) : (
              prescriptions.map((p) => (
                <tr key={p.prescriptionId} className="border-t text-center">
                  <td className="px-4 py-2">{p.medicineName}</td>
                  <td className="px-4 py-2 w-50">{p.instruction}</td>
                  <td className="px-4 py-2">
                    {new Date(p.startDate).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })} - <br />
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
                        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                        return <li key={i}>{days[d.dayOfWeek]}</li>;
                      }) || "-"}
                    </ul>
                  </td>
                  <td className="px-4 py-2">
                    {new Date(p.endDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)
                      ? "Finished"
                      : "Ongoing"}
                  </td>
                  <td className="px-4 py-2 flex gap-2 flex-wrap flex-center">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                      onClick={() => setEditing(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                      onClick={() => handleDelete(p.prescriptionId)}
                    >
                      Delete
                    </button>
                    <button
                      className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition"
                      onClick={() => setViewingHistoryId(p.prescriptionId)}
                    >
                      History
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showAdd && <FormModal onSaved={fetchPrescriptions} onClose={() => setShowAdd(false)} />}
      {editing && <EditModal prescription={editing} onSaved={fetchPrescriptions} onClose={() => setEditing(null)} />}

      {viewingHistoryId && (
        <HistoryModal
          prescriptionId={viewingHistoryId}
          onClose={() => setViewingHistoryId(null)}
        />
      )}
    </div>
  );
}

// 🔽 Modal Component (inside same file for simplicity)
function HistoryModal({ prescriptionId, onClose }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get(`https://localhost:7015/api/doselog/history/${prescriptionId}`);
        setLogs(res.data);
      } catch (err) {
        console.error("History fetch error:", err);
      }
    };
    fetchLogs();
  }, [prescriptionId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%]] max-w-lg max-h-[80vh] overflow-auto">
        <h2 className="text-xl font-semibold mb-4">Dose History</h2>
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Time</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center text-gray-500 py-4">No history to show.</td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.doseLogId}>
                  <td className="px-4 py-2">{new Date(log.scheduledDateTime).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{new Date(log.scheduledDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td className="px-4 py-2">{log.status === 1 ? "Taken" : "Missed"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}